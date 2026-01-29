import React, { useState } from 'react';
import { products } from '../data/products';
import { Search } from 'lucide-react';
import ProductCard from '../components/ProductCard/ProductCard';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AllProducts = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState(5000);

    const categories = ['All', ...new Set(products.map(product => product.category))];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesPrice = product.price <= priceRange;
        return matchesSearch && matchesCategory && matchesPrice;
    });

    return (
        <div className="pt-24 pb-16 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">All Products</h1>
                    <p className="text-lg text-gray-600">Explore our premium collection of customized gifts</p>
                </motion.div>

                {/* Filters and Search */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-lg shadow-sm p-6 mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-4 items-center">
                            <select
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Max Price: ₹{priceRange}</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="5000"
                                    step="100"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(Number(e.target.value))}
                                    className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Product Grid */}
                {filteredProducts.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    >
                        <AnimatePresence>
                            {filteredProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="text-gray-400 mb-4">
                            <Search className="w-16 h-16 mx-auto opacity-50" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AllProducts;
