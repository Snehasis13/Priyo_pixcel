import bcrypt from 'bcryptjs';

const USERS_STORAGE_KEY = 'priyopixcel_users';

// Helper to get users from LocalStorage
const getLocalUsers = () => {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
};

// Helper to save users to LocalStorage
const saveLocalUsers = (users) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

// Helper to hash password
export const hashPassword = async (password) => {
    const saltRounds = 10;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error("Error hashing password:", error);
        throw new Error("Failed to process password");
    }
};

// Helper to compare password
export const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        console.error("Error comparing passwords:", error);
        throw new Error("Password verification failed");
    }
};

// Sign Up with Email/Password
export const signUp = async (userData) => {
    const { name, email, password } = userData;

    if (!name || !email || !password) {
        throw new Error("Missing required fields");
    }

    try {
        const users = getLocalUsers();

        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            throw new Error("User with this email already exists");
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create new user
        const newUserData = {
            id: crypto.randomUUID(),
            name,
            email,
            password: hashedPassword,
            authType: 'email',
            createdAt: new Date().toISOString()
        };

        // Save to LocalStorage
        users.push(newUserData);
        saveLocalUsers(users);

        // Return user data sans password
        const { password: _, ...userWithoutPassword } = newUserData;
        return userWithoutPassword;

    } catch (error) {
        console.error("SignUp Error:", error);
        throw error;
    }
};

// Sign In with Email/Password
export const signIn = async (email, password) => {
    try {
        const users = getLocalUsers();
        const userStoredData = users.find(u => u.email === email);

        if (!userStoredData) {
            throw new Error("User not found");
        }

        if (userStoredData.authType === 'google') {
            throw new Error("Please sign in with Google");
        }

        // Compare passwords
        const isMatch = await comparePassword(password, userStoredData.password);
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        // Return user data sans password
        const { password: _, ...userWithoutPassword } = userStoredData;
        return userWithoutPassword;

    } catch (error) {
        console.error("SignIn Error:", error);
        throw error;
    }
};

// Sign In / Sign Up with Google
// Note: We still accept tokenResponse to match signature, but we ignore it for persistence
export const signInWithGoogle = async (googleUser, tokenResponse) => {
    try {
        const { email, name, googleId, picture } = googleUser;
        const users = getLocalUsers();
        const existingUser = users.find(u => u.email === email);

        if (existingUser) {
            // Validate auth type (optional, but good practice)
            // if (existingUser.authType !== 'google') ... allow merge or error

            return existingUser;
        } else {
            // Create new Google User
            const newUserData = {
                id: googleId || crypto.randomUUID(),
                name,
                email,
                picture, // storing picture URL
                authType: 'google',
                createdAt: new Date().toISOString()
            };

            users.push(newUserData);
            saveLocalUsers(users);

            return newUserData;
        }

    } catch (error) {
        console.error("Google SignIn Error:", error);
        throw error;
    }
};

export const signOut = async () => {
    try {
        localStorage.removeItem('user'); // Clear session
        return true;
    } catch (error) {
        console.error("SignOut Error:", error);
        return false;
    }
};
