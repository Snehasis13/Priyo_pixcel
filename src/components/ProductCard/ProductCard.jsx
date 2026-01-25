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
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
            {/* Image Container */}
            <div className="relative aspect-w-4 aspect-h-3 overflow-hidden bg-gray-100 h-64 sm:h-72">
                <Image
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110 ${!product.inStock ? 'opacity-60' : ''}`}
                    loading="lazy"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {(product.isSale || product.price < product.originalPrice) && (
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                            SALE
                        </span>
                    )}
                    {!product.inStock && (
                        <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                            OUT OF STOCK
                        </span>
                    )}
                </div>

                {/* Hover Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                    <button className="bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-purple-600 hover:bg-gray-50 transition-colors" aria-label="Quick View">
                        <Eye className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleWishlistClick}
                        className={`bg-white p-2 rounded-full shadow-md transition-colors ${isWishlisted ? 'text-red-500 hover:text-red-600 hover:bg-red-50' : 'text-gray-600 hover:text-red-500 hover:bg-gray-50'}`}
                        aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-2 flex items-center">
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">({product.rating})</span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors line-clamp-1">
                    <a href="#">{product.name}</a>
                </h3>

                <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</span>
                    {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through">{formatCurrency(product.originalPrice)}</span>
                    )}
                    {product.inStock && product.originalPrice > product.price && (
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </span>
                    )}
                </div>

                <div className="mt-auto">
                    <button
                        onClick={() => addToCart && addToCart(product)}
                        disabled={!product.inStock}
                        className={`w-full py-3 px-4 rounded-xl flex items-center justify-center space-x-2 font-medium transition-all duration-200 ${product.inStock
                            ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm hover:shadow-md'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <ShoppingCart className="w-5 h-5" />
                        <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
