import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
    Shirt,
    Image as ImageIcon,
    Coffee,
    CreditCard,
    Fan,
    Key,
    Images,
    ArrowLeft,
    Sparkles,
    ShoppingBag
} from 'lucide-react';
import { products as allProducts } from '../data/products';
import ProductOnlyCustomizationForm from '../components/CustomFrame/ProductOnlyCustomizationForm';
import Reveal from '../components/Reveal/Reveal';

const products = [
    {
        id: 'tshirts',
        name: 'Custom Printed T-shirts',
        description: 'Premium cotton customized with your unique designs and photos.',
        icon: Shirt,
        color: 'from-pink-500 to-rose-500',
        bgGlow: 'bg-pink-500/20'
    },
    {
        id: 'frames',
        name: 'Photo Frames',
        description: 'LED wooden cutout, rotating, crystal, acrylic & more variants.',
        icon: ImageIcon,
        color: 'from-purple-500 to-indigo-500',
        bgGlow: 'bg-purple-500/20'
    },
    {
        id: 'mugs',
        name: 'Coffee Mugs',
        description: 'Magic mugs, travel mugs & ceramic personalization.',
        icon: Coffee,
        color: 'from-amber-700 to-orange-600',
        bgGlow: 'bg-orange-500/20'
    },
    {
        id: 'cards',
        name: 'Business Cards',
        description: 'Smart NFC cards and premium PVC ID cards.',
        icon: CreditCard,
        color: 'from-blue-600 to-cyan-500',
        bgGlow: 'bg-blue-500/20'
    },
    {
        id: 'fans',
        name: '3D Hologram Fans',
        description: 'Next-gen advertising with floating 3D visuals.',
        icon: Fan,
        color: 'from-emerald-500 to-teal-500',
        bgGlow: 'bg-emerald-500/20'
    },
    {
        id: 'keychains',
        name: 'Keychains',
        description: 'Acrylic, metal, and wooden custom shape keychains.',
        icon: Key,
        color: 'from-yellow-500 to-amber-500',
        bgGlow: 'bg-yellow-500/20'
    },
    {
        id: 'wall-hangings',
        name: 'Wall Hangings',
        description: 'Personalized wall decor with collage photos.',
        icon: Images,
        color: 'from-fuchsia-600 to-purple-600',
        bgGlow: 'bg-fuchsia-500/20'
    }
];

const CustomPhotoFrame = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addToCart, updateCartItem, setDirectCheckoutItem } = useCart();

    const [editItem, setEditItem] = useState(() => location.state?.editItem || null);
    const [selectedProduct, setSelectedProduct] = useState(() => {
        if (location.state?.editItem) {
            return products.find(p => p.id === location.state.editItem.id) || null;
        }
        return null;
    });

    // Helper to match product from global catalog to customization category
    const matchProductToCategory = (product) => {
        const pName = product.name.toLowerCase();
        const pCat = product.category;

        if (pCat === 'T-Shirts') return products.find(p => p.id === 'tshirts');
        if (pCat === 'Mugs') return products.find(p => p.id === 'mugs');
        if (pCat === 'Business Cards') return products.find(p => p.id === 'cards');

        // Specific checks
        if (pName.includes('fan') || pCat.includes('Fan')) return products.find(p => p.id === 'fans');
        if (pCat === 'Photo Frames' || pCat === 'LED Frames') return products.find(p => p.id === 'frames');
        if (pCat === 'Keychains') return products.find(p => p.id === 'keychains');

        return null;
    };

    const handleOtherProductSelect = (product) => {
        const matchedCategory = matchProductToCategory(product);
        if (matchedCategory) {
            setSelectedProduct(matchedCategory);
            // Optionally, we could pass some pre-fill data based on the specific product
            // For now, we just open the correct form category
        }
    };

    // Mock price calculator
    const calculatePrice = (product, data) => {
        let base = 599;
        if (data.productCustomization.quantity > 1) base *= data.productCustomization.quantity;
        return base;
    };

    const handleFormSubmit = (formData) => {
        // Construct the final product object
        const finalProduct = {
            ...selectedProduct,
            price: calculatePrice(selectedProduct, formData),
            image: formData.uploads.preview || (selectedProduct?.icon ? null : null),
            customization: {
                ...formData.productCustomization,
                uploads: formData.uploads
            },
            isCustom: true
        };

        if (editItem) {
            // Update existing cart item
            updateCartItem(editItem.cartId, {
                customization: finalProduct.customization,
                image: finalProduct.image,
                price: finalProduct.price,
                quantity: formData.productCustomization.quantity
            });
            navigate('/cart');
        } else {
            // Add to Cart Logic
            addToCart({
                ...finalProduct,
                quantity: formData.productCustomization.quantity || 1
            });
            navigate('/cart');
        }
    };


    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">

            {/* Main Content Area */}
            <AnimatePresence mode="wait">
                {!selectedProduct ? (
                    // PRODUCT SELECTION GRID
                    <motion.div
                        key="grid"
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, y: -20 }}
                        variants={containerVariants}
                        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                    >
                        {/* Hero Section */}
                        <div className="text-center mb-16">
                            <Reveal>
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-bold mb-4 border border-purple-200">
                                    <Sparkles size={16} /> Premium Customization
                                </span>
                                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                                    Create Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Unique</span>
                                </h1>
                                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                                    Select a product category below to start customizing your personalized merchandise.
                                </p>
                            </Reveal>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {products.map((product) => (
                                <motion.div
                                    key={product.id}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.03, y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative cursor-pointer"
                                    onClick={() => setSelectedProduct(product)}
                                >
                                    {/* Glass Card */}
                                    <div className="relative h-full bg-white rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">

                                        {/* Background Glow Effect */}
                                        <div className={`absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${product.bgGlow}`} />

                                        <div className="flex items-start justify-between mb-6">
                                            <div className={`p-4 rounded-2xl bg-gradient-to-br ${product.color} text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                                                <product.icon size={28} />
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-4 group-hover:translate-x-0">
                                                <span className="text-gray-400">
                                                    <ArrowLeft className="rotate-180" />
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                                            {product.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* "Other Products" Section */}
                        <div className="mt-24">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">Explore More Products</h2>
                                    <p className="text-gray-500 mt-2">Discover our full range of customizable items</p>
                                </div>
                                <div className="hidden md:block h-px flex-1 bg-gray-200 ml-8"></div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {allProducts.map((product) => {
                                    const match = matchProductToCategory(product);
                                    if (!match) return null; // Don't show if we can't customizer it

                                    return (
                                        <motion.div
                                            key={product.id}
                                            whileHover={{ y: -5 }}
                                            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
                                            onClick={() => handleOtherProductSelect(product)}
                                        >
                                            <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-gray-100">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                    <span className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                        <Sparkles size={14} /> Customize
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-xs font-bold text-purple-600 mb-1 uppercase tracking-wider">{match.name}</p>
                                                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-gray-900 font-bold">₹{product.price}</span>
                                                    {product.originalPrice > product.price && (
                                                        <span className="text-gray-400 text-sm line-through">₹{product.originalPrice}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    // SELECTED PRODUCT VIEW
                    <motion.div
                        key="product-view"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="w-full"
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 md:mb-8">
                            <button
                                onClick={() => {
                                    setSelectedProduct(null);
                                    setEditItem(null);
                                    navigate('.', { state: {} });
                                }}
                                className="group flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors font-medium"
                            >
                                <div className="p-2 rounded-full bg-white border border-gray-200 group-hover:border-purple-200 transition-colors shadow-sm">
                                    <ArrowLeft size={20} />
                                </div>
                                <span>Back to Categories</span>
                            </button>
                        </div>

                        <div className="max-w-4xl mx-auto">
                            <ProductOnlyCustomizationForm
                                selectedProduct={selectedProduct}
                                onBack={() => {
                                    setSelectedProduct(null);
                                    setEditItem(null);
                                    navigate('.', { state: {} });
                                }}
                                onSubmit={handleFormSubmit}
                                initialValues={editItem ? {
                                    productCustomization: editItem.customization,
                                    uploads: editItem.customization?.uploads
                                } : null}
                                isEditing={!!editItem}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomPhotoFrame;

