import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import CheckoutModal from '../components/Cart/CheckoutModal';
import {
    Truck, ShieldCheck, ArrowLeft, Minus, Plus, Heart,
    Share2, ChevronRight, Package, Info, ArrowRight, Check, X
} from 'lucide-react';
import SocialShare from '../components/ProductDetails/SocialShare';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '../components/Reveal/Reveal';

const generateId = () => Math.random().toString(36).substring(7);

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, wishlistItems, toggleWishlist } = useCart();
    const { addToast } = useToast();

    // State
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Checkout Modal State
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

    const product = products.find(p => p.id === parseInt(id));
    const isInWishlist = wishlistItems?.some(item => item.id === product?.id);

    // Initial check and scroll to top
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-20">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        The product you are looking for might have been removed or is temporarily unavailable.
                    </p>
                    <button
                        onClick={() => navigate('/products')}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    // Prepare images array (use 'images' array or fallback to single 'image')
    const images = product.images && product.images.length > 0
        ? product.images
        : [product.image, product.image, product.image]; // Fallback for products without gallery

    const handleQuantityChange = (type) => {
        if (type === 'decrease' && quantity > 1) {
            setQuantity(quantity - 1);
        } else if (type === 'increase') {
            const max = product.stockQuantity || 10;
            if (quantity < max) {
                setQuantity(quantity + 1);
            } else {
                addToast(`Only ${max} items available in stock`, 'error');
            }
        }
    };

    const handleAddToCart = () => {
        addToCart({ ...product, quantity });
        // Toast handled by context usually, but we can add specific feedback here if needed
    };

    const handleBuyNow = () => {
        if (!product.inStock) return;
        setShowCheckoutModal(true);
    };

    const handleConfirmCheckout = async (formData) => {
        setIsProcessingCheckout(true);
        // Simulate CSRF/Security check setup
        await new Promise(resolve => setTimeout(resolve, 800));

        const csrfToken = generateId();

        // Create a temporary cart item
        const tempItem = {
            ...product,
            quantity: quantity,
            selectedColor: product.colors?.[0], // Default if any
            selectedSize: product.sizes?.[0]    // Default if any
        };

        navigate('/checkout', {
            state: {
                items: [tempItem],
                total: product.price * quantity,
                csrfToken,
                formData // Pass captured form data
            }
        });
        setIsProcessingCheckout(false);
    };

    // Zoom Logic
    const handleMouseMove = (e) => {
        if (!isZoomed) return;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setMousePos({ x, y });
    };

    return (
        <div className="pt-28 pb-20 min-h-screen bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumbs */}
                <nav className="flex items-center text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
                    <button onClick={() => navigate('/')} className="hover:text-purple-600 transition-colors">Home</button>
                    <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
                    <button onClick={() => navigate('/products')} className="hover:text-purple-600 transition-colors">Products</button>
                    <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
                    {product.category && (
                        <>
                            <span className="hover:text-purple-600 cursor-pointer">{product.category}</span>
                            <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
                        </>
                    )}
                    <span className="text-gray-900 font-medium truncate">{product.name}</span>
                </nav>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

                        {/* LEFT: Image Gallery */}
                        <div className="p-6 lg:p-10 bg-gray-50/50">

                            {/* Main Image */}
                            <div
                                className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm mb-6 group cursor-zoom-in"
                                onMouseEnter={() => setIsZoomed(true)}
                                onMouseLeave={() => setIsZoomed(false)}
                                onMouseMove={handleMouseMove}
                            >
                                <img
                                    src={images[selectedImage]}
                                    alt={product.name}
                                    className={`w-full h-full object-cover object-center transition-transform duration-200 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                                    style={isZoomed ? {
                                        transformOrigin: `${mousePos.x}% ${mousePos.y}%`
                                    } : {}}
                                />

                                {/* Badges */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    {product.inStock && product.isSale && (
                                        <span className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-200">
                                            Sale
                                        </span>
                                    )}
                                    {!product.inStock && (
                                        <span className="bg-gray-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg">
                                            Out of Stock
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Thumbnails */}
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx
                                            ? 'border-purple-600 ring-4 ring-purple-50'
                                            : 'border-transparent hover:border-purple-200 bg-white'
                                            }`}
                                    >
                                        <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: Product Info */}
                        <div className="p-6 lg:p-10 flex flex-col">
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    {product.brand && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-xs font-medium">
                                            {product.brand}
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                                    {product.name}
                                </h1>

                                <div className="flex items-center gap-4 mb-6">
                                    {/* Rating removed as per request */}
                                    <div className={`flex items-center text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.inStock ? <Check className="w-4 h-4 mr-1" /> : <X className="w-4 h-4 mr-1" />}
                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                    </div>
                                </div>

                                {/* Price Block */}
                                <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                                    <div className="flex items-baseline gap-3 mb-2">
                                        <span className="text-4xl font-extrabold text-gray-900">₹{product.price}</span>
                                        {product.originalPrice > product.price && (
                                            <>
                                                <span className="text-lg text-gray-400 line-through decoration-2">₹{product.originalPrice}</span>
                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-sm font-bold">
                                                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500">Inclusive of all taxes</p>
                                </div>

                                {/* Short Description */}
                                <div className="prose prose-sm text-gray-600 mb-8 max-w-none">
                                    <p>{product.shortDescription || product.description?.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}</p>
                                </div>

                                {/* Actions */}
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-4">
                                        {/* Quantity */}
                                        <div className="flex items-center bg-white border border-gray-200 rounded-xl h-12 shadow-sm">
                                            <button
                                                onClick={() => handleQuantityChange('decrease')}
                                                className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-l-xl transition-colors disabled:opacity-50"
                                                disabled={quantity <= 1}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange('increase')}
                                                className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-r-xl transition-colors disabled:opacity-50"
                                                disabled={!product.inStock || quantity >= (product.stockQuantity || 10)}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Wishlist */}
                                        <button
                                            onClick={() => toggleWishlist(product)}
                                            className={`h-12 w-12 flex items-center justify-center rounded-xl border transition-all ${isInWishlist
                                                ? 'bg-red-50 border-red-200 text-red-500'
                                                : 'bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'
                                                }`}
                                        >
                                            <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                                        </button>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={!product.inStock}
                                            className="flex-1 bg-white border-2 border-purple-600 text-purple-600 font-bold h-12 rounded-xl hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Add to Cart
                                        </button>

                                        {/* Customization Button */}
                                        {['T-Shirts', 'Mugs', 'Business Cards', 'LED Frames', 'Photo Frames'].includes(product.category) && (
                                            <button
                                                onClick={() => navigate(`/customize/${product.id}`)}
                                                disabled={!product.inStock}
                                                className="flex-1 bg-purple-100 border-2 border-purple-200 text-purple-700 font-bold h-12 rounded-xl hover:bg-purple-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Customize
                                            </button>
                                        )}

                                        <button
                                            onClick={handleBuyNow}
                                            disabled={!product.inStock}
                                            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold h-12 rounded-xl shadow-lg hover:shadow-xl hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Buy Now <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Social Share */}
                                <div className="border-t border-gray-100 pt-6">
                                    <SocialShare product={product} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DESCRIPTION SECTION */}
                    <div className="border-t border-gray-100 bg-white p-6 lg:p-10">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Product Description</h3>
                        <div className="prose prose-purple max-w-none text-gray-600">
                            {/* Image removed as per request */}
                            <div dangerouslySetInnerHTML={{
                                __html: product.description || `<p>${product.shortDescription}</p><p>No full description available.</p>`
                            }} />
                        </div>
                    </div>

                </div>
            </div>
            {/* Checkout Modal for Buy Now */}
            {product && (
                <CheckoutModal
                    isOpen={showCheckoutModal}
                    onClose={() => setShowCheckoutModal(false)}
                    onConfirm={handleConfirmCheckout}
                    cartItems={[{ ...product, quantity }]}
                    total={product.price * quantity}
                    isLoading={isProcessingCheckout}
                />
            )}
        </div>
    );
};

export default ProductDetails;
