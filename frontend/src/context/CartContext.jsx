import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from local storage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
    }, []);

    // Save cart to local storage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1, size = null, color = null) => {
        setCartItems(prev => {
            const existingItemIndex = prev.findIndex(item =>
                item.id === product.id && item.size === size && item.color === color
            );

            if (existingItemIndex > -1) {
                // Update quantity
                const newCart = [...prev];
                newCart[existingItemIndex].quantity += quantity;
                toast.success('Cart updated');
                return newCart;
            } else {
                // Add new item
                toast.success('Added to cart');
                return [...prev, {
                    id: product.id,
                    name: product.name,
                    price: product.sale_price || product.price,
                    image: product.images?.[0],
                    quantity,
                    size,
                    color,
                    slug: product.slug
                }];
            }
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id, size, color) => {
        setCartItems(prev => prev.filter(item => !(item.id === id && item.size === size && item.color === color)));
    };

    const updateQuantity = (id, size, color, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prev => prev.map(item =>
            (item.id === id && item.size === size && item.color === color)
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const toggleCart = () => setIsCartOpen(!isCartOpen);

    const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            isCartOpen,
            setIsCartOpen,
            toggleCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
