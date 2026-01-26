import { gapi } from 'gapi-script';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.REACT_APP_GOOGLE_CLIENT_ID;
// API Key is not required when using robust OAuth 2.0 flow with explicit scopes

// Scope for full file access (required for creating/editing app specific files)
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

export const initializeGapi = () => {
    return new Promise((resolve, reject) => {
        gapi.load('client', async () => {
            try {
                await gapi.client.init({
                    apiKey: null, // Explicitly null to prevent using any defaults or placeholders
                    discoveryDocs: DISCOVERY_DOCS,
                });

                // Explicitly load the Drive API - REMOVED, using disoveryDocs above
                // await gapi.client.load('drive', 'v3');

                console.log('GAPI and Drive API initialized');
                resolve(gapi);
            } catch (error) {
                console.error('Error initializing GAPI:', error);
                reject(error);
            }
        });
    });
};

export const setGapiToken = (tokenResponse) => {
    if (!tokenResponse || !tokenResponse.access_token) {
        console.error("Invalid token response provided to setGapiToken");
        return;
    }
    const tokenObj = {
        access_token: tokenResponse.access_token,
        scope: tokenResponse.scope,
        expires_in: tokenResponse.expires_in,
        first_issued_at: Date.now(),
        expires_at: Date.now() + (tokenResponse.expires_in * 1000)
    };
    gapi.client.setToken(tokenObj);
    console.log("GAPI token set manually from Google Login response");
};

export const authenticateUser = async () => {
    try {
        // Modern approach: Check if token was already set by useGoogleLogin (in GoogleSignInButton)
        const tokenObj = gapi.client.getToken();
        if (tokenObj && tokenObj.access_token) {
            console.log('User already authenticated via GSI');
            return tokenObj.access_token;
        }

        throw new Error("User not authenticated. Please use the Sign In button.");
    } catch (error) {
        console.error('Error checking authentication:', error);
        throw error;
    }
};

// Helper to ensure Drive API is loaded before usage
const ensureDriveApiLoaded = async () => {
    if (!gapi.client.drive) {
        console.log("Drive API not found, attempting to load...");
        await gapi.client.load('drive', 'v3');
    }
    if (!gapi.client.drive) {
        throw new Error("Failed to load Google Drive API");
    }
};

export const createAppFolder = async () => {
    const folderName = "MyApp_Users";
    try {
        await ensureDriveApiLoaded();

        // Check if folder exists
        const response = await gapi.client.drive.files.list({
            q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`,
            fields: 'files(id, name)',
        });

        if (response.result.files && response.result.files.length > 0) {
            console.log('App folder found:', response.result.files[0].id);
            return response.result.files[0].id; // Return existing folder ID
        }

        // Create folder if it doesn't exist
        const fileMetadata = {
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder',
        };

        const createResponse = await gapi.client.drive.files.create({
            resource: fileMetadata,
            fields: 'id',
        });

        console.log('App folder created:', createResponse.result.id);
        return createResponse.result.id;
    } catch (error) {
        console.error('Error creating app folder:', error);
        throw error;
    }
};

export const createUserFile = async (userData) => {
    try {
        const folderId = await createAppFolder();
        const fileName = `user_${userData.email}.json`;

        const fileMetadata = {
            name: fileName,
            parents: [folderId],
        };

        const fileContent = JSON.stringify(userData);
        const file = new Blob([fileContent], { type: 'application/json' });
        const metadataProp = new Blob([JSON.stringify(fileMetadata)], { type: 'application/json' });

        const form = new FormData();
        form.append('metadata', metadataProp);
        form.append('file', file);

        // Using fetch/xhr might be easier for multipart upload, but gapi supports it too. 
        // However, gapi.client.drive.files.create with 'media' body is tricky in pure JS gapi wrapper sometimes.
        // We will use the standard gapi multipart upload method if possible, or simple single request if content is small.
        // For simplicity with gapi client, we create empty file then update media, OR use the specific upload endpoint.

        // Simpler approach for text files:
        // This is a simplified approach. For robust uploads, consider using the resumable upload protocol.
        const tokenObj = gapi.client.getToken();
        const accessToken = tokenObj ? tokenObj.access_token : null;
        if (!accessToken) throw new Error("No GAPI access token found");

        const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
            body: form
        });

        const data = await res.json();
        console.log('User file created:', data.id);
        return data.id;

    } catch (error) {
        console.error('Error creating user file:', error);
        throw error;
    }
};

export const findUserFile = async (email) => {
    try {
        await ensureDriveApiLoaded();

        const fileName = `user_${email}.json`;
        const response = await gapi.client.drive.files.list({
            q: `name='${fileName}' and trashed=false`,
            fields: 'files(id, name)',
        });

        if (response.result.files && response.result.files.length > 0) {
            return response.result.files[0];
        }
        return null;
    } catch (error) {
        console.error('Error finding user file:', error);
        return null;
    }
};

export const getUserData = async (email) => {
    try {
        await ensureDriveApiLoaded();

        const file = await findUserFile(email);
        if (!file) {
            console.log('User file not found for:', email);
            return null;
        }

        const response = await gapi.client.drive.files.get({
            fileId: file.id,
            alt: 'media',
        });

        console.log('User data retrieved');
        return response.result; // gapi automatic parses JSON for alt=media if content-type is json
    } catch (error) {
        console.error('Error getting user data:', error);
        throw error;
    }
};

export const updateUserData = async (email, newData) => {
    try {
        const file = await findUserFile(email);
        if (!file) {
            throw new Error("File not found to update");
        }

        const tokenObj = gapi.client.getToken();
        const accessToken = tokenObj ? tokenObj.access_token : null;
        if (!accessToken) throw new Error("No GAPI access token found");

        // Prepare body for update
        const fileContent = JSON.stringify(newData);
        const blob = new Blob([fileContent], { type: 'application/json' });

        const res = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${file.id}?uploadType=media`, {
            method: 'PATCH',
            headers: new Headers({
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            }),
            body: blob // Uploading body directly for media update
        });

        if (!res.ok) {
            throw new Error("Failed to update file content");
        }

        const data = await res.json();
        console.log('User data updated:', data.id);
        return data;
    } catch (error) {
        console.error('Error updating user data:', error);
        throw error;
    }
};
