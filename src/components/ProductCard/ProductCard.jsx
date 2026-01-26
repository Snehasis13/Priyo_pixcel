import React from 'react';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Image from '../common/Image';
import { formatCurrency } from '../../utils/currency';

const ProductCard = ({ product }) => {
    const { addToCart, addToWishlist, removeFromWishlist, wishlistItems } = useCart();

    // Check if item is already in wishlist
    const isWishlisted = wishlistItems && wishlistItems.some(item => item.id === product.id);

    const handleWishlistClick = (e) => {
        e.preventDefault(); // Prevent link navigation if inside a link
        e.stopPropagation();

        if (isWishlisted) {
            removeFromWishlist(product.id, product.name);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full relative">
            {/* Image Container */}
            <div className="relative aspect-w-4 aspect-h-3 overflow-hidden bg-gray-100 h-64 sm:h-72">
                <Image
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 ${!product.inStock ? 'opacity-60 grayscale' : ''}`}
                    loading="lazy"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    {(product.isSale || (product.originalPrice > product.price)) && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm tracking-wider uppercase">
                            Sale
                        </span>
                    )}
                    {!product.inStock && (
                        <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm tracking-wider uppercase">
                            Out of Stock
                        </span>
                    )}
                </div>

                {/* Hover Actions - Right Side (Quick View & Wishlist) */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-10">
                    <button
                        className="bg-white p-2.5 rounded-full shadow-lg text-gray-700 hover:text-white hover:bg-purple-600 transition-colors transform hover:scale-110"
                        aria-label="Quick View"
                        title="Quick View"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleWishlistClick}
                        className={`bg-white p-2.5 rounded-full shadow-lg transition-colors transform hover:scale-110 ${isWishlisted ? 'text-red-500 hover:bg-red-50' : 'text-gray-700 hover:text-white hover:bg-red-500'}`}
                        aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                </div>

                {/* Add to Cart - Slide Up from Bottom */}
                <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                    <button
                        onClick={() => addToCart && addToCart(product)}
                        disabled={!product.inStock}
                        className={`w-full py-3 px-4 rounded-xl flex items-center justify-center space-x-2 font-bold text-sm shadow-lg transform transition-transform active:scale-95 ${product.inStock
                            ? 'bg-white text-gray-900 hover:bg-purple-600 hover:text-white'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed hidden' // Hide if out of stock
                            }`}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                    </button>
                </div>

                {/* Out of Stock Overlay */}
                {!product.inStock && (
                    <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] flex items-center justify-center">
                        <div className="bg-white/90 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-gray-900 shadow-sm border border-gray-100">
                            Sold Out
                        </div>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-4 flex flex-col flex-grow bg-white z-0 relative">
                <div className="flex justify-between items-start mb-2">
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{product.category}</div>
                    <div className="flex items-center gap-1 text-yellow-400 bg-yellow-50 px-1.5 py-0.5 rounded">
                        <span className="text-xs font-bold text-gray-700">{product.rating}</span>
                        <Star className="w-3 h-3 fill-current" />
                    </div>
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-1" title={product.name}>
                    <a href={`/product/${product.id}`}>{product.name}</a>
                </h3>

                <div className="mt-auto flex items-end gap-2">
                    <span className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</span>
                    {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through decoration-gray-300">{formatCurrency(product.originalPrice)}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
