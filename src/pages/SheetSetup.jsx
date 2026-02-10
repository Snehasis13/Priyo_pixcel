import React, { useState } from 'react';
import { initializeSheetsApi, createNewSpreadsheet } from '../services/googleSheetsService';
import { motion } from 'framer-motion';

const SheetSetup = () => {
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');
    const [sheetId, setSheetId] = useState('');
    const [sheetUrl, setSheetUrl] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initial check for existing token
    React.useEffect(() => {
        const checkAuth = async () => {
            try {
                await initializeSheetsApi();
                const token = gapi.client.getToken();
                if (token && token.access_token) {
                    setIsAuthenticated(true);
                }
            } catch (e) {
                console.error("GAPI init failed", e);
            }
        };
        checkAuth();
    }, []);

    const handleSignIn = async () => {
        try {
            await initializeSheetsApi();
            const tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file',
                callback: (tokenResponse) => {
                    if (tokenResponse && tokenResponse.access_token) {
                        setIsAuthenticated(true);
                        setMessage("Signed in successfully! Now create your sheet.");
                        setStatus('idle');
                    }
                },
            });
            tokenClient.requestAccessToken();
        } catch (error) {
            console.error('Sign in error:', error);
            setMessage(`Sign in failed: ${error.message}`);
            setStatus('error');
        }
    };

    const handleCreateSheet = async () => {
        if (!isAuthenticated) {
            handleSignIn();
            return;
        }

        setStatus('loading');
        setMessage('Initializing Google Sheets API...');

        try {
            await initializeSheetsApi();

            setMessage('Creating new spreadsheet...');
            const result = await createNewSpreadsheet('Priyo Pixcel - Order Management');

            setSheetId(result.spreadsheetId);
            setSheetUrl(result.spreadsheetUrl);
            setStatus('success');
            setMessage('Spreadsheet created successfully!');
        } catch (error) {
            console.error('Error creating sheet:', error);
            setStatus('error');
            setMessage(`Error: ${error.message || 'Unknown error occurred'}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Google Sheet Setup</h1>
                    <p className="mt-2 text-gray-600">
                        Automatically create and configure your order management sheet.
                    </p>
                    {!isAuthenticated && (
                        <div className="mt-4 bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm text-yellow-800">
                            Please sign in to allow us to create a sheet in your Drive.
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    {status === 'idle' || status === 'error' ? (
                        <div className="text-center space-y-4">
                            {!isAuthenticated ? (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSignIn}
                                    className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Sign in with Google
                                </motion.button>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleCreateSheet}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Create Google Sheet
                                </motion.button>
                            )}

                            <p className="mt-4 text-sm text-gray-500">
                                This will create a new sheet in your Google Drive with the correct columns for your order data.
                            </p>
                        </div>
                    ) : null}

                    {status === 'loading' && (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                            <p className="text-gray-700 font-medium">{message}</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-green-50 border border-green-200 rounded-lg p-6"
                        >
                            <div className="flex items-center mb-4">
                                <div className="flex-shrink-0 bg-green-100 rounded-full p-2 mr-3">
                                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-green-800">Setup Complete!</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Sheet ID</label>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            readOnly
                                            value={sheetId}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-white p-2"
                                        />
                                        <button
                                            onClick={() => navigator.clipboard.writeText(sheetId)}
                                            className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                    <p className="mt-1 text-xs text-blue-600 font-semibold">
                                        ⚠️ Action Required: Copy this ID and update VITE_GOOGLE_SHEET_ID in your .env file.
                                    </p>
                                </div>

                                <div>
                                    <a
                                        href={sheetUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-indigo-600 hover:text-indigo-500 font-medium"
                                    >
                                        Open Sheet in Google Drive
                                        <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {status === 'error' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                            <h3 className="text-lg font-medium text-red-800 mb-2">Setup Failed</h3>
                            <p className="text-red-700 mb-4">{message}</p>
                            <button
                                onClick={handleCreateSheet}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SheetSetup;
