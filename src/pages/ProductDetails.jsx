import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { Star, Truck, ShieldCheck, ArrowLeft, Minus, Plus, Heart, Share2 } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, wishlistItems, toggleWishlist } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    const product = products.find(p => p.id === parseInt(id));
    const isInWishlist = wishlistItems?.some(item => item.id === product?.id);

    // Mock additional images for gallery
    const images = product ? [
        product.image,
        product.image, // In a real app, these would be different images
        product.image
    ] : [];

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
                <button
                    onClick={() => navigate('/products')}
                    className="flex items-center text-purple-600 hover:text-purple-700 font-medium"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Products
                </button>
            </div>
        );
    }

    const handleQuantityChange = (type) => {
        if (type === 'decrease' && quantity > 1) {
            setQuantity(quantity - 1);
        } else if (type === 'increase') {
            setQuantity(quantity + 1);
        }
    };

    return (
        <div className="pt-24 pb-16 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="flex mb-8 text-sm text-gray-500">
                    <button onClick={() => navigate('/')} className="hover:text-purple-600 transition-colors">Home</button>
                    <span className="mx-2">/</span>
                    <button onClick={() => navigate('/products')} className="hover:text-purple-600 transition-colors">Products</button>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
                </nav>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        {/* Image Gallery */}
                        <div className="p-6 lg:p-10 bg-gray-50">
                            <div className="relative aspect-square rounded-xl overflow-hidden bg-white shadow-sm mb-4 group">
                                <img
                                    src={images[selectedImage]}
                                    alt={product.name}
                                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                                />
                                {product.isSale && (
                                    <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                                        Sale
                                    </span>
                                )}
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-purple-600 ring-2 ring-purple-100' : 'border-transparent hover:border-purple-200'
                                            }`}
                                    >
                                        <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-6 lg:p-10 flex flex-col justify-center">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-purple-600 font-bold tracking-wide uppercase mb-2">{product.category}</p>
                                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => toggleWishlist(product)}
                                        className={`p-2 rounded-full transition-colors ${isInWishlist ? 'bg-red-50 text-red-500' : 'hover:bg-gray-100 text-gray-500'
                                            }`}
                                    >
                                        <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center mb-6">
                                <div className="flex text-yellow-400 mr-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                                <span className="text-gray-500 text-sm">({product.rating} Rating)</span>
                            </div>

                            <div className="flex items-baseline mb-8">
                                <span className="text-4xl font-bold text-gray-900 mr-4">₹{product.price}</span>
                                {product.originalPrice > product.price && (
                                    <>
                                        <span className="text-xl text-gray-400 line-through mr-4">₹{product.originalPrice}</span>
                                        <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md text-sm">
                                            Save ₹{product.originalPrice - product.price}
                                        </span>
                                    </>
                                )}
                            </div>

                            <div className="prose prose-sm text-gray-600 mb-8">
                                <p>
                                    Premium quality {product.name.toLowerCase()} designed for modern living.
                                    Perfect for gifts or personal use. Made with high-quality materials to ensure durability and style.
                                </p>
                            </div>

                            <div className="border-t border-b border-gray-100 py-6 mb-8 space-y-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Truck className="w-5 h-5 mr-3 text-purple-600" />
                                    <span>Free delivery on orders above ₹999</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <ShieldCheck className="w-5 h-5 mr-3 text-purple-600" />
                                    <span>1 year warranty included</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => handleQuantityChange('decrease')}
                                        className="p-3 text-gray-500 hover:text-purple-600 transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center font-medium text-gray-900">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange('increase')}
                                        className="p-3 text-gray-500 hover:text-purple-600 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => addToCart({ ...product, quantity })}
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
