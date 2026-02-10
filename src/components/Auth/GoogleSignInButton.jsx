import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { signInWithGoogle } from '../../services/authService';
import { setGapiToken } from '../../services/driveService';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';

const GoogleSignInButton = ({ redirectToDashboard = true, onSuccess, buttonText }) => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            setError(null);
            try {
                // 1. Set token in GAPI for Drive and Sheets access
                setGapiToken(tokenResponse);

                // 2. Store token for persistence with expiry
                const tokenData = {
                    access_token: tokenResponse.access_token,
                    scope: tokenResponse.scope,
                    expires_in: tokenResponse.expires_in,
                    token_type: tokenResponse.token_type,
                    first_issued_at: Date.now(),
                    expires_at: Date.now() + (tokenResponse.expires_in * 1000),
                };
                localStorage.setItem('google_auth_token', JSON.stringify(tokenData));

                // 3. Get user info from Google using the access token
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });

                if (!userInfoRes.ok) {
                    throw new Error('Failed to fetch user information');
                }

                const userInfo = await userInfoRes.json();

                // 4. Call authService to handle backend/Drive logic
                const user = await signInWithGoogle({
                    email: userInfo.email,
                    name: userInfo.name,
                    googleId: userInfo.sub,
                    picture: userInfo.picture
                }, tokenResponse);

                // 5. Login context
                login(user);

                // 6. Call custom onSuccess callback if provided
                if (onSuccess) {
                    onSuccess(tokenResponse, userInfo);
                }

                // 7. Redirect to dashboard if enabled
                if (redirectToDashboard) {
                    navigate('/dashboard');
                }

            } catch (error) {
                console.error("Google Sign In Error:", error);
                setError(error.message || "Failed to sign in with Google");
                alert(error.message || "Failed to sign in with Google. Please try again.");
            } finally {
                setLoading(false);
            }
        },
        onError: (error) => {
            console.error("Google Login Failed:", error);
            setError(error.error_description || "Authentication failed");
            alert("Google Sign In Failed. Please try again.");
            setLoading(false);
        },
        // Include both Drive and Sheets scopes
        scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets',
    });

    return (
        <div className="w-full">
            <button
                type="button"
                onClick={() => handleGoogleLogin()}
                disabled={loading}
                className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
                {loading ? (
                    <LoadingSpinner size="sm" color="text-purple-600" className="mr-2" />
                ) : (
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                )}
                {loading ? "Signing in..." : (buttonText || "Sign in with Google")}
            </button>
            {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default GoogleSignInButton;
