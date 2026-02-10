import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import ProductOnlyCustomizationForm from '../components/CustomFrame/ProductOnlyCustomizationForm';
import { ArrowLeft } from 'lucide-react';

const ProductCustomizationPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();

    // Find the product
    const product = products.find(p => p.id === parseInt(productId));

    // Helper: Map Product Category to Customization Logic Type
    const getCustomizationCategory = (prod) => {
        if (!prod) return null;
        const cat = prod.category;

        if (cat === 'T-Shirts') return 'tshirts';
        if (cat === 'Mugs') return 'mugs';
        if (cat === 'Business Cards') return 'cards';

        // Specific check for Hologram Fan
        if (prod.name.toLowerCase().includes('hologram') || prod.name.toLowerCase().includes('fan')) return 'fans';

        if (cat === 'LED Frames' || cat === 'Photo Frames') return 'frames';

        // Keychains and Wall Hangings are not explicitly in products.js sample but if added:
        if (cat === 'Keychains') return 'keychains';
        if (cat === 'Wall Hangings' || cat === 'Decor') return 'wall-hangings';

        return 'custom'; // Fallback
    };

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Home
                </button>
            </div>
        );
    }

    const customizationCategory = getCustomizationCategory(product);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="container mx-auto px-4">
                {/* Header / Breadcrumb substitute */}
                <div className="mb-8 flex items-center gap-3 text-sm text-gray-500">
                    <span onClick={() => navigate('/')} className="cursor-pointer hover:text-purple-600">Home</span>
                    <span>/</span>
                    <span onClick={() => navigate(-1)} className="cursor-pointer hover:text-purple-600">Product</span>
                    <span>/</span>
                    <span className="font-semibold text-gray-900">Customize</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* Left: Product Info Summary (Optional, acts as context) */}
                    <div className="w-full lg:w-1/3 space-y-6 sticky top-24">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-6 relative group">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                                <p className="text-2xl font-bold text-purple-600 mb-4">₹{product.price}</p>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    {product.shortDescription}
                                </p>

                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">Product Features:</h4>
                                    <ul className="text-sm text-gray-500 space-y-2">
                                        {Object.entries(product.specifications || {}).slice(0, 4).map(([key, value]) => (
                                            <li key={key} className="flex justify-between">
                                                <span>{key}</span>
                                                <span className="font-medium text-gray-900">{value}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Customization Form */}
                    <div className="w-full lg:w-2/3">
                        <ProductOnlyCustomizationForm
                            selectedProduct={product}
                            customizationCategory={customizationCategory}
                            onBack={() => navigate(-1)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCustomizationPage;
