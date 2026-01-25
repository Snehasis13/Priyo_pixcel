import React, { useRef } from 'react';
import { products } from '../../data/products';
import ProductCard from '../ProductCard/ProductCard';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const CategorySection = ({ title, category }) => {
    const scrollContainerRef = useRef(null);

    // Filter products by category
    const categoryProducts = products.filter(product => product.category === category);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = 300;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    if (categoryProducts.length === 0) return null;

    return (
        <section className="py-12 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-purple-600 pl-4">
                        {title}
                    </h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => scroll('left')}
                            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 hover:border-purple-300 transition-colors"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 hover:border-purple-300 transition-colors"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto space-x-6 pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {categoryProducts.map((product) => (
                        <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-center">
                            <ProductCard product={product} />
                        </div>
                    ))}

                    {/* View All Card */}
                    <div className="min-w-[200px] snap-center flex items-center justify-center">
                        <a href="#" className="flex flex-col items-center group">
                            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                                <ChevronRight className="w-8 h-8 text-purple-600" />
                            </div>
                            <span className="font-medium text-gray-900 group-hover:text-purple-600">View All</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategorySection;
