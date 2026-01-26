import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { signUp } from '../../services/authService';
import { validateEmail, validatePassword, validateUsername, validateConfirmPassword } from '../../utils/validators';
import LoadingSpinner from '../common/LoadingSpinner';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const SignUp = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    // Form State
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // UI State
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear specific error on change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        const usernameCheck = validateUsername(formData.username);
        if (!usernameCheck.valid) newErrors.username = usernameCheck.message;

        const emailCheck = validateEmail(formData.email);
        if (!emailCheck.valid) newErrors.email = emailCheck.message;

        const passwordCheck = validatePassword(formData.password);
        if (!passwordCheck.valid) newErrors.password = passwordCheck.message;

        const confirmCheck = validateConfirmPassword(formData.password, formData.confirmPassword);
        if (!confirmCheck.valid) newErrors.confirmPassword = confirmCheck.message;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError('');

        if (!validateForm()) return;

        setLoading(true);

        try {
            // 1. Call Auth Service (LocalStorage based now)
            const userData = {
                name: formData.username,
                email: formData.email,
                password: formData.password
            };
            const user = await signUp(userData);

            // 2. Login via Context (auto-login after signup)
            login(user);

            // 3. Redirect
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            setGeneralError(error.message || "Failed to sign up. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Password strength visual (simple)
    const getPasswordStrength = () => {
        if (!formData.password) return 0;
        let strength = 0;
        if (formData.password.length >= 8) strength++;
        if (/[A-Z]/.test(formData.password)) strength++;
        if (/[0-9]/.test(formData.password)) strength++;
        return strength;
    };

    const strength = getPasswordStrength();

    return (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                {generalError && (
                    <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{generalError}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Username */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <div className="mt-1">
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                className={`appearance-none block w-full px-3 py-2 border ${errors.username ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                            />
                            {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username}</p>}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className={`appearance-none block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                            />
                            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="mt-1 relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className={`appearance-none block w-full px-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm pr-10`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {formData.password && !errors.password && (
                            <div className="mt-2 flex gap-1">
                                <span className={`h-1 w-1/3 rounded-full ${strength >= 1 ? 'bg-red-500' : 'bg-gray-200'}`}></span>
                                <span className={`h-1 w-1/3 rounded-full ${strength >= 2 ? 'bg-yellow-500' : 'bg-gray-200'}`}></span>
                                <span className={`h-1 w-1/3 rounded-full ${strength >= 3 ? 'bg-green-500' : 'bg-gray-200'}`}></span>
                            </div>
                        )}
                        {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <div className="mt-1 relative">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`appearance-none block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm pr-10`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Creating Account...
                                </>
                            ) : (
                                "Sign up"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
