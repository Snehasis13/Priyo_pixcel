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
    Sparkles
} from 'lucide-react';
import ProductCustomizationForm from '../components/CustomFrame/ProductCustomizationForm';
import Reveal from '../components/Reveal/Reveal';

const CustomPhotoFrame = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addToCart, updateCartItem, setDirectCheckoutItem } = useCart();

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editItem, setEditItem] = useState(null);

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

    // Check for edit mode
    useEffect(() => {
        if (location.state?.editItem) {
            const item = location.state.editItem;
            setEditItem(item);
            // Find the matching product category to open the form immediately
            const matchingProduct = products.find(p => p.id === item.id);
            if (matchingProduct) {
                setSelectedProduct(matchingProduct);
            }
        }
    }, [location.state]);

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
            image: formData.uploads.preview || (selectedProduct?.icon ? null : null), // Use uploaded image or fallback logic
            // Note: Icon is component, can't save to JSON potentially if not serializable

            customization: {
                ...formData.productCustomization,
                uploads: formData.uploads
            },
            personalDetails: formData.personalDetails,
            addressDetails: formData.addressDetails
        };

        if (editItem) {
            // Update existing cart item
            updateCartItem(editItem.cartId, {
                customization: finalProduct.customization,
                personalDetails: finalProduct.personalDetails,
                addressDetails: finalProduct.addressDetails,
                image: finalProduct.image,
                price: finalProduct.price
            });
            navigate('/cart');
        } else {
            // DIRECT BUYOUT: Skip cart, go straight to checkout with formData
            const checkoutItem = {
                ...finalProduct,
                id: selectedProduct.id,
                name: selectedProduct.name,
                // price logic: finalProduct.price includes total for qty? 
                // calculatePrice returns total base * qty.
                // Checkout expects unit price usually, but let's see logic.
                // If calculatePrice returns TOTAL, and we set quantity, total will be price * quantity.
                // Let's ensure consistency.
                // calculatePrice: "if (qty > 1) base *= qty". returns total.
                // So unit price = finalProduct.price / qty. 
                price: finalProduct.price / (formData.productCustomization.quantity || 1),
                quantity: formData.productCustomization.quantity || 1
            };

            // Use context for heavy data (image) to avoid state size limits
            setDirectCheckoutItem(checkoutItem);

            // Generate CSRF token for checkout validation
            const csrfToken = Math.random().toString(36).substring(7);

            navigate('/checkout', {
                state: {
                    fromCustomFrame: true,
                    // items: [checkoutItem], // REMOVED: Passed via context
                    total: finalProduct.price, // Total amount can still be passed or derived
                    csrfToken: csrfToken,
                    formData: { // Pass pre-filled form data
                        personalDetails: formData.personalDetails,
                        addressDetails: formData.addressDetails
                    }
                }
            });
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
                            <ProductCustomizationForm
                                selectedProduct={selectedProduct}
                                onBack={() => {
                                    setSelectedProduct(null);
                                    setEditItem(null);
                                    navigate('.', { state: {} });
                                }}
                                onSubmit={handleFormSubmit}
                                initialValues={editItem ? {
                                    productCustomization: editItem.customization,
                                    personalDetails: editItem.personalDetails,
                                    addressDetails: editItem.addressDetails,
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

