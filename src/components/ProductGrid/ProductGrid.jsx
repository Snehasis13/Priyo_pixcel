import React from 'react';
import { products } from '../../data/products';
import { content } from '../../data/content';
import ProductCard from '../ProductCard/ProductCard';

const ProductGrid = () => {
    return (
        <section className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{content.productGrid.title}</h2>
                        <p className="text-gray-500">{content.productGrid.subtitle}</p>
                    </div>
                    <a href="#" className="mt-4 md:mt-0 text-purple-600 hover:text-purple-700 font-medium flex items-center">
                        {content.productGrid.viewAll} <span className="ml-2">→</span>
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <div key={product.id}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductGrid;

