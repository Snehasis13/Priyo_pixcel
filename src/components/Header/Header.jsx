import React, { useState, useEffect } from 'react';
import { ShoppingBag, User, Menu, X, Phone, Mail, Instagram, Facebook, Twitter, Heart, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { content } from '../../data/content';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { cartCount, wishlistItems } = useCart();
    const { isAuthenticated, currentUser } = useAuth();
    const { contact, logo, nav } = content.header;

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md top-0' : 'bg-transparent top-0'}`}>
            {/* Top Bar - Hidden on mobile, visible on desktop */}
            <div className={`hidden md:block w-full bg-gray-900 text-white text-xs py-2 transition-all duration-300 ${isScrolled ? 'h-0 overflow-hidden py-0' : 'h-auto'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex space-x-6">
                        <span className="flex items-center hover:text-purple-400 cursor-pointer transition-colors"><Phone className="w-3 h-3 mr-1" /> {contact.phone}</span>
                        <span className="flex items-center hover:text-purple-400 cursor-pointer transition-colors"><Mail className="w-3 h-3 mr-1" /> {contact.email}</span>
                    </div>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-purple-400 transition-colors"><Instagram className="w-3 h-3" /></a>
                        <a href="#" className="hover:text-purple-400 transition-colors"><Facebook className="w-3 h-3" /></a>
                        <a href="#" className="hover:text-purple-400 transition-colors"><Twitter className="w-3 h-3" /></a>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'}`}>
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className={`text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent cursor-pointer`}>
                            {logo}
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex space-x-8">
                        {nav.map((item, index) => (
                            <Link
                                key={index}
                                to={item.href}
                                className={`font-medium transition-colors hover:text-purple-600 ${isScrolled ? 'text-gray-700' : 'text-gray-800'}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Icons */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Wishlist Icon */}
                        <Link to="/wishlist" className="relative group cursor-pointer">
                            <Heart className={`w-5 h-5 hover:text-purple-600 transition-colors ${isScrolled ? 'text-gray-700' : 'text-gray-800'}`} />
                            {wishlistItems && wishlistItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
                                    {wishlistItems.length}
                                </span>
                            )}
                        </Link>

                        <Link to="/cart" className="relative group cursor-pointer">
                            <ShoppingBag className={`w-5 h-5 hover:text-purple-600 transition-colors ${isScrolled ? 'text-gray-700' : 'text-gray-800'}`} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Auth Section */}
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="flex items-center space-x-2 group">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isScrolled ? 'border-gray-300 text-gray-700' : 'border-gray-400 text-gray-800'} group-hover:border-purple-600 group-hover:text-purple-600 transition-all`}>
                                    <User className="w-4 h-4" />
                                </div>
                            </Link>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login" className={`text-sm font-medium hover:text-purple-600 transition-colors ${isScrolled ? 'text-gray-700' : 'text-gray-800'}`}>
                                    Sign In
                                </Link>
                                <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-colors shadow-sm">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className={`p-2 rounded-md ${isScrolled ? 'text-gray-700' : 'text-gray-800'} hover:text-purple-600 focus:outline-none`}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-white shadow-lg transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 visible max-h-screen' : 'opacity-0 invisible max-h-0'}`}>
                <div className="px-4 pt-2 pb-6 space-y-2">
                    {nav.map((item, index) => (
                        <Link
                            key={index}
                            to={item.href}
                            className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-purple-600 hover:bg-gray-50 rounded-md"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <div className="border-t border-gray-100 pt-4 mt-4 space-y-4">
                        <div className="flex justify-around items-center">
                            <Link to="/wishlist" className="relative group" onClick={() => setIsMenuOpen(false)}>
                                <Heart className="w-6 h-6 text-gray-600 group-hover:text-purple-600" />
                                {wishlistItems && wishlistItems.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
                                        {wishlistItems.length}
                                    </span>
                                )}
                            </Link>

                            <Link to="/cart" className="relative group" onClick={() => setIsMenuOpen(false)}>
                                <ShoppingBag className="w-6 h-6 text-gray-600 group-hover:text-purple-600" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>

                        {/* Mobile Auth */}
                        <div className="px-3">
                            {isAuthenticated ? (
                                <Link to="/dashboard" className="flex items-center justify-center w-full px-4 py-2 text-base font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100" onClick={() => setIsMenuOpen(false)}>
                                    <User className="w-5 h-5 mr-2" />
                                    My Dashboard
                                </Link>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <Link to="/login" className="flex items-center justify-center px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
                                        Sign In
                                    </Link>
                                    <Link to="/signup" className="flex items-center justify-center px-4 py-2 text-base font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700" onClick={() => setIsMenuOpen(false)}>
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
