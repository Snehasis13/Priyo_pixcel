import { useState, useEffect, useCallback } from 'react';
import { gapi } from 'gapi-script';
import { initializeGapi, setGapiToken } from '../services/driveService';

const TOKEN_STORAGE_KEY = 'google_auth_token';
const SCOPES = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets';

/**
 * Custom hook for managing Google OAuth authentication
 * Handles authentication state, token management, and token refresh
 */
export const useGoogleAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    /**
     * Check if token is expired or about to expire
     */
    const isTokenExpired = useCallback((tokenData) => {
        if (!tokenData || !tokenData.expires_at) return true;

        // Consider token expired if it expires in less than 5 minutes
        const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
        return Date.now() >= (tokenData.expires_at - bufferTime);
    }, []);

    /**
     * Save token to localStorage
     */
    const saveToken = useCallback((tokenResponse) => {
        const tokenData = {
            access_token: tokenResponse.access_token,
            scope: tokenResponse.scope,
            expires_in: tokenResponse.expires_in,
            token_type: tokenResponse.token_type,
            first_issued_at: Date.now(),
            expires_at: Date.now() + (tokenResponse.expires_in * 1000),
        };
        localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenData));
        return tokenData;
    }, []);

    /**
     * Load token from localStorage
     */
    const loadToken = useCallback(() => {
        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (storedToken) {
            try {
                return JSON.parse(storedToken);
            } catch (error) {
                console.error('Error parsing stored token:', error);
                localStorage.removeItem(TOKEN_STORAGE_KEY);
            }
        }
        return null;
    }, []);

    /**
     * Clear authentication state
     */
    const clearAuth = useCallback(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
        setError(null);

        // Clear GAPI token
        try {
            if (gapi.client && gapi.client.getToken()) {
                gapi.client.setToken(null);
            }
        } catch (e) {
            // GAPI not initialized yet, ignore
        }
    }, []);

    /**
     * Initialize GAPI and check existing authentication
     */
    useEffect(() => {
        const initAuth = async () => {
            try {
                setIsLoading(true);

                // Initialize GAPI
                await initializeGapi();

                // Check for stored token
                const storedToken = loadToken();

                if (storedToken && !isTokenExpired(storedToken)) {
                    // Restore token to GAPI
                    setGapiToken(storedToken);
                    setIsAuthenticated(true);

                    // Load user data if exists
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    }
                } else if (storedToken) {
                    // Token exists but expired
                    clearAuth();
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                setError('Failed to initialize authentication');
                clearAuth();
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, [loadToken, isTokenExpired, clearAuth]);

    /**
     * Handle successful authentication
     */
    const handleAuthSuccess = useCallback((tokenResponse, userInfo = null) => {
        try {
            // Save token
            const tokenData = saveToken(tokenResponse);

            // Set token in GAPI
            setGapiToken(tokenResponse);

            // Update state
            setIsAuthenticated(true);
            setError(null);

            if (userInfo) {
                setUser(userInfo);
                localStorage.setItem('user', JSON.stringify(userInfo));
            }

            return true;
        } catch (error) {
            console.error('Error handling auth success:', error);
            setError('Failed to save authentication');
            return false;
        }
    }, [saveToken]);

    /**
     * Handle authentication error
     */
    const handleAuthError = useCallback((errorMessage) => {
        console.error('Authentication error:', errorMessage);
        setError(errorMessage);
        setIsAuthenticated(false);
    }, []);

    /**
     * Sign out user
     */
    const signOut = useCallback(() => {
        clearAuth();
    }, [clearAuth]);

    /**
     * Check if token needs refresh
     */
    const needsRefresh = useCallback(() => {
        const storedToken = loadToken();
        return storedToken && isTokenExpired(storedToken);
    }, [loadToken, isTokenExpired]);

    /**
     * Get current access token
     */
    const getAccessToken = useCallback(() => {
        const storedToken = loadToken();
        if (storedToken && !isTokenExpired(storedToken)) {
            return storedToken.access_token;
        }
        return null;
    }, [loadToken, isTokenExpired]);

    /**
     * Validate scopes
     */
    const hasRequiredScopes = useCallback(() => {
        const storedToken = loadToken();
        if (!storedToken || !storedToken.scope) return false;

        const requiredScopes = SCOPES.split(' ');
        const grantedScopes = storedToken.scope.split(' ');

        return requiredScopes.every(scope => grantedScopes.includes(scope));
    }, [loadToken]);

    return {
        // State
        isAuthenticated,
        isLoading,
        error,
        user,

        // Methods
        handleAuthSuccess,
        handleAuthError,
        signOut,
        needsRefresh,
        getAccessToken,
        hasRequiredScopes,
        clearAuth,
    };
};

export default useGoogleAuth;
