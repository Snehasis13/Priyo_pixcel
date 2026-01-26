import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { signOut } from '../../services/authService';
import { User, LogOut, Settings, CreditCard, Heart, ShoppingBag } from 'lucide-react';

const Dashboard = () => {
    const { currentUser, logout } = useAuth();
    const { wishlistItems, orders } = useCart();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(); // Call service to sign out from Google/Drive
            logout(); // Clear context state
            navigate('/'); // Redirect to home
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    if (!currentUser) {
        return <div>Loading...</div>; // Should be handled by ProtectedRoute usually
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                            Welcome back, {currentUser.name || 'User'}!
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Here's what's happening with your account today.
                        </p>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4">
                        <button
                            onClick={handleLogout}
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <LogOut className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                            Sign Out
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Profile Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                                        <User className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">User Profile</dt>
                                        <dd>
                                            <div className="text-lg font-medium text-gray-900">{currentUser.name || 'N/A'}</div>
                                            <div className="text-sm text-gray-500">{currentUser.email}</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm">
                                <div className="font-medium text-gray-500">
                                    Joined: {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats / Placeholder Cards */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <ShoppingBag className="h-6 w-6 text-blue-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                                        <dd>
                                            <div className="text-lg font-medium text-gray-900">{orders ? orders.length : 0}</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Heart className="h-6 w-6 text-pink-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Wishlist Items</dt>
                                        <dd>
                                            <div className="text-lg font-medium text-gray-900">{wishlistItems ? wishlistItems.length : 0}</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm">
                                <Link to="/wishlist" className="font-medium text-purple-700 hover:text-purple-900">View wishlist</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings / Additional Nav */}
                <div className="mt-8">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Account Settings</h3>
                    <div className="mt-4 bg-white shadow rounded-lg divide-y divide-gray-200">
                        <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition">
                            <div className="flex items-center">
                                <Settings className="h-5 w-5 text-gray-400 mr-3" />
                                <span className="text-sm font-medium text-gray-900">General Settings</span>
                            </div>
                            <span className="text-gray-400 text-sm">&gt;</span>
                        </div>
                        <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition">
                            <div className="flex items-center">
                                <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                                <span className="text-sm font-medium text-gray-900">Payment Methods</span>
                            </div>
                            <span className="text-gray-400 text-sm">&gt;</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
