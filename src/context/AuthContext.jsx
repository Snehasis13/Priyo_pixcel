import { createContext, useContext, useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { gapi } from 'gapi-script';

const AuthContext = createContext();

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProviderInner = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('google_auth_token');

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setCurrentUser(parsedUser);
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Failed to parse user from local storage", error);
                localStorage.removeItem('user');
            }
        }

        // Restore GAPI token if available and strictly valid
        if (storedToken) {
            try {
                const tokenData = JSON.parse(storedToken);
                const now = Date.now();
                if (tokenData.expires_at && tokenData.expires_at > now) {
                    // We need to wait for gapi to load before setting token.
                    // Ideally this should be done after gapi init, but gapi might be loaded async.
                    // We'll attempt to set it if gapi.client exists, or wait a bit.
                    // Since App.jsx loads gapi, it might be ready or racing.
                    // A safer bet is to just set it if gapi is available, or rely on the component using it to check.
                    // BUT, to fix the user's issue globally:
                    if (typeof gapi !== 'undefined' && gapi.client) {
                        gapi.client.setToken({
                            access_token: tokenData.access_token,
                            expires_in: Math.floor((tokenData.expires_at - now) / 1000)
                        });
                    }
                } else {
                    // Token expired
                    localStorage.removeItem('google_auth_token');
                    // Optional: force logout if we strictly depend on this token?
                    // For now, let's just clear it.
                }
            } catch (e) {
                console.error("Failed to parse stored token", e);
            }
        }

        setLoading(false);
    };

    useEffect(() => {
        // Poll for gapi client to be ready if we have a token, or just run checkAuth once.
        // Since gapi loading is handled in App.jsx via script tag/loader, we might need a listener.
        // For now, simple check.
        checkAuth();
    }, []);

    const login = (userData) => {
        setCurrentUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setCurrentUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('google_auth_token');
        if (typeof gapi !== 'undefined' && gapi.client) {
            gapi.client.setToken(null);
        }
    };

    const value = {
        currentUser,
        isAuthenticated,
        loading,
        login,
        logout,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Wrapper that provides Google OAuth context
export const AuthProvider = ({ children }) => {
    if (!CLIENT_ID) {
        console.error('Google Client ID not found. Please set VITE_GOOGLE_CLIENT_ID in .env');
        return <AuthProviderInner>{children}</AuthProviderInner>;
    }

    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <AuthProviderInner>{children}</AuthProviderInner>
        </GoogleOAuthProvider>
    );
};
