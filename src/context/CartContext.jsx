import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { products as serverProducts } from '../data/products'; // Mock Server DB

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Load from local storage if available
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // New state for direct checkout (Buy Now)
    const [directCheckoutItem, setDirectCheckoutItem] = useState(null);

    const [savedItems, setSavedItems] = useState(() => {
        // Migration: check for 'wishlistItems' first, then 'savedItems'
        const wishlist = localStorage.getItem('wishlistItems');
        if (wishlist) return JSON.parse(wishlist);

        const saved = localStorage.getItem('savedItems');
        return saved ? JSON.parse(saved) : [];
    });

    const [orders, setOrders] = useState(() => {
        const savedOrders = localStorage.getItem('orders');
        return savedOrders ? JSON.parse(savedOrders) : [];
    });

    // Security State
    const [lastActivity, setLastActivity] = useState(Date.now());
    const [showSessionWarning, setShowSessionWarning] = useState(false);
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 mins
    const WARNING_THRESHOLD = 5 * 60 * 1000; // 5 mins before timeout

    // Alias for code clarity locally, though we stick with 'savedItems' variable name to minimize refactor noise for now,
    // effectively 'savedItems' IS the wishlist.
    const wishlistItems = savedItems;
    const setWishlistItems = setSavedItems;

    const [isLoading, setIsLoading] = useState(true);

    const { addToast } = useToast();

    // Simulate initial data loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200); // 1.2s delay to show off the skeleton
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem('savedItems', JSON.stringify(savedItems));
        localStorage.setItem('wishlistItems', JSON.stringify(savedItems)); // Keep new key sync
    }, [savedItems]);

    useEffect(() => {
        localStorage.setItem('orders', JSON.stringify(orders));
    }, [orders]);

    // Session Management Effect
    useEffect(() => {
        const checkSession = () => {
            if (cartItems.length === 0) return; // No timeout if empty

            const now = Date.now();
            const timeSinceLastActivity = now - lastActivity;
            const timeRemaining = SESSION_TIMEOUT - timeSinceLastActivity;

            if (timeRemaining <= 0) {
                clearCart();
                setShowSessionWarning(false);
                addToast("Session expired due to inactivity. Cart cleared.", { type: 'error' });
            } else if (timeRemaining <= WARNING_THRESHOLD) {
                setShowSessionWarning(true);
            }
        };

        const interval = setInterval(checkSession, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [cartItems, lastActivity]);

    // Update activity on any action
    const refreshSession = () => {
        setLastActivity(Date.now());
    };

    const extendSession = () => {
        setLastActivity(Date.now());
        setShowSessionWarning(false);
        addToast("Session extended", { type: 'success' });
    };

    // Sync across tabs
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'cartItems') {
                setCartItems(e.newValue ? JSON.parse(e.newValue) : []);
            } else if (e.key === 'savedItems' || e.key === 'wishlistItems') {
                setSavedItems(e.newValue ? JSON.parse(e.newValue) : []);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const addToCart = (product) => {
        refreshSession();
        // Determine quantity to add: if product has 'quantity' prop use it, else 1
        const quantityToAdd = product.quantity && product.quantity > 0 ? product.quantity : 1;

        setCartItems((prevItems) => {
            // Check if product has customization or special attributes that require uniqueness
            // If it has 'customization', always treat as new item (or check deep equality, but unique is safer/easier)
            const isCustomized = product.customization && Object.keys(product.customization).length > 0;

            // Generate a unique ID for the cart entry if not present
            // We use a simple random string or UUID logic for local unique ID
            const cartId = product.cartId || `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const itemWithId = { ...product, cartId };

            if (!isCustomized) {
                // Only merge non-customized generic items
                const existingItemIndex = prevItems.findIndex((item) => item.id === product.id && !item.customization);

                if (existingItemIndex > -1) {
                    const newItems = [...prevItems];
                    const updatedItem = {
                        ...newItems[existingItemIndex],
                        quantity: newItems[existingItemIndex].quantity + quantityToAdd
                    };
                    newItems[existingItemIndex] = updatedItem;
                    return newItems;
                }
            }

            // Add as new item
            return [...prevItems, { ...itemWithId, quantity: quantityToAdd }];
        });

        // Side effects outside updater
        // We can't know for sure if it was "added" or "increased" without checking state, 
        // but for toast purposes generic message or 'updated' is fine.
        // Or we can check distinct state, but since setState is async, we assume success.
        addToast(`${product.name} added to cart`, { type: 'success', position: 'bottom-right' });
    };

    const toggleWishlist = (product) => {
        setSavedItems(prev => {
            const exists = prev.find(i => i.id === product.id);
            if (exists) {
                addToast(`${product.name} removed from wishlist`, { type: 'error', position: 'bottom-right' });
                return prev.filter(i => i.id !== product.id);
            } else {
                addToast(`${product.name} added to wishlist`, { type: 'success', position: 'bottom-right' });
                return [...prev, product];
            }
        });
    };

    const updateCartItem = (cartId, updatedData) => {
        setCartItems((prevItems) => {
            return prevItems.map((item) => {
                // strict check on cartId first
                if (item.cartId === cartId) {
                    return { ...item, ...updatedData };
                }
                return item;
            });
        });
        addToast("Cart updated successfully", { type: 'success' });
    };

    const removeFromCart = (itemId, name) => {
        setCartItems((prevItems) => prevItems.filter((item) => (item.cartId || item.id) !== itemId));
        addToast(`${name} removed from cart`, { type: 'error', position: 'top-center' });
    };

    const saveForLater = (itemId) => {
        const itemToSave = cartItems.find(item => (item.cartId || item.id) === itemId);

        if (itemToSave) {
            setSavedItems(prev => {
                // For valid duplicate check, we check cartId if present, else id
                const exists = prev.find(i => (i.cartId || i.id) === (itemToSave.cartId || itemToSave.id));
                if (exists) return prev;
                return [...prev, itemToSave];
            });
            setCartItems(prev => prev.filter(item => (item.cartId || item.id) !== itemId));
            addToast(`${itemToSave.name} saved for later`, { type: 'success', position: 'bottom-right' });
        }
    };

    const moveToCart = (itemId) => {
        const itemToMove = savedItems.find(item => (item.cartId || item.id) === itemId);
        if (itemToMove) {
            addToCart(itemToMove);
            setSavedItems(prev => prev.filter(item => (item.cartId || item.id) !== itemId));
        }
    };

    const removeFromSaved = (itemId, name) => {
        setSavedItems(prev => prev.filter(item => (item.cartId || item.id) !== itemId));
        addToast(`${name} removed from saved items`, { type: 'error', position: 'bottom-right' });
    };

    const updateQuantity = (itemId, amount) => {
        // Rate Limiting: Prevent rapid updates
        const now = Date.now();
        const lastUpdate = lastActivity;
        if (now - lastUpdate < 300) {
            return;
        }
        refreshSession();

        setCartItems((prevItems) => {
            return prevItems.map((item) => {
                if ((item.cartId || item.id) === itemId) {
                    const newQuantity = item.quantity + amount;
                    if (newQuantity < 1) return item;
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });
        });
    };

    const updateItemQuantity = (itemId, newQuantity) => {
        setCartItems((prevItems) => {
            return prevItems.map((item) => {
                if ((item.cartId || item.id) === itemId) {
                    // Ensure basic validation
                    const validQuantity = Math.max(1, newQuantity);
                    return { ...item, quantity: validQuantity };
                }
                return item;
            });
        });
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
        setShowSessionWarning(false); // Reset warning
    };

    const validateCartWithServer = async () => {
        // Simulating server-side validation
        // In a real app, this would be an API call: POST /api/cart/validate
        await new Promise(resolve => setTimeout(resolve, 800)); // Network simulation

        let hasError = false;
        const newCartItems = [...cartItems];
        const errors = [];

        newCartItems.forEach((cartItem, index) => {
            const serverItem = serverProducts.find(p => p.id === cartItem.id);

            if (!serverItem) {
                // Item no longer exists
                errors.push(`${cartItem.name} is no longer available.`);
                newCartItems.splice(index, 1);
                hasError = true;
            } else {
                // Check Price Change
                if (serverItem.price !== cartItem.price) {
                    errors.push(`Price for ${cartItem.name} changed from ₹${cartItem.price} to ₹${serverItem.price}.`);
                    cartItem.price = serverItem.price; // Update to correct price
                    hasError = true;
                }

                // Check Stock
                if (!serverItem.inStock) {
                    errors.push(`${cartItem.name} is out of stock.`);
                    newCartItems.splice(index, 1);
                    hasError = true;
                }
            }
        });

        if (hasError) {
            setCartItems(newCartItems);
            errors.forEach(err => addToast(err, { type: 'error', duration: 4000 }));
            return false;
        }

        return true;
    };

    const addToWishlist = (product) => {
        const exists = savedItems.find(i => i.id === product.id);
        if (exists) {
            addToast(`${product.name} is already in wishlist`, { type: 'info', position: 'bottom-right' });
            return;
        }
        setSavedItems(prev => [...prev, product]);
        addToast(`${product.name} added to wishlist`, { type: 'success', position: 'bottom-right' });
    };

    const removeFromWishlist = (id, name) => {
        setSavedItems(prev => prev.filter(item => item.id !== id));
        addToast(`${name} removed from wishlist`, { type: 'error', position: 'bottom-right' });
    };

    const moveAllToCart = () => {
        if (savedItems.length === 0) return;

        setCartItems(prev => {
            const newCart = [...prev];
            savedItems.forEach(wishItem => {
                const existingIndex = newCart.findIndex(c => c.id === wishItem.id);
                if (existingIndex > -1) {
                    newCart[existingIndex].quantity += 1;
                } else {
                    newCart.push({ ...wishItem, quantity: 1 });
                }
            });
            return newCart;
        });

        setSavedItems([]);
        addToast("All wishlist items moved to cart", { type: 'success' });
    };

    // Derived State
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const cartSavings = cartItems.reduce((acc, item) => {
        if (item.originalPrice && item.originalPrice > item.price) {
            return acc + (item.originalPrice - item.price) * item.quantity;
        }
        return acc;
    }, 0);

    const addOrder = (orderData) => {
        const newOrder = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            status: 'Processing',
            ...orderData
        };
        setOrders(prev => [newOrder, ...prev]);
        clearCart(); // Clear cart after order
        addToast("Order placed successfully!", { type: 'success' });
        return newOrder;
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            savedItems,
            directCheckoutItem,
            setDirectCheckoutItem,
            addToCart,
            removeFromCart,
            saveForLater,
            moveToCart,
            removeFromSaved,
            updateQuantity,
            updateItemQuantity,
            clearCart,
            addToWishlist,
            removeFromWishlist,
            toggleWishlist,
            moveAllToCart,
            wishlistItems,
            cartCount,
            cartTotal,
            cartSavings,
            validateCartWithServer, // Security
            showSessionWarning, // Security
            extendSession, // Security
            SESSION_TIMEOUT,
            lastActivity,
            isLoading,
            orders,
            addOrder,
            updateCartItem
        }}>
            {children}
        </CartContext.Provider>
    );
};
