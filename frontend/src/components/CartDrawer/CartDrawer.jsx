import React from 'react';
import { FiX, FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './CartDrawer.css';

const CartDrawer = () => {
    const {
        cartItems,
        cartTotal,
        removeFromCart,
        updateQuantity,
        isCartOpen,
        toggleCart
    } = useCart();

    const navigate = useNavigate();

    const handleCheckout = () => {
        toggleCart();
        navigate('/checkout');
    };

    if (!isCartOpen) return null;

    return (
        <div className="cart-overlay" onClick={toggleCart}>
            <div className="cart-drawer" onClick={e => e.stopPropagation()}>
                <div className="cart-header">
                    <h2>Shopping Cart</h2>
                    <button className="close-btn" onClick={toggleCart}>
                        <FiX size={24} />
                    </button>
                </div>

                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <p>Your cart is empty</p>
                            <button className="btn btn-outline" onClick={toggleCart}>
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={`${item.id}-${item.size}-${item.color}`} className="cart-item">
                                <img src={item.image} alt={item.name} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <h4>{item.name}</h4>
                                    <p className="variant-info">
                                        {item.size && <span>Size: {item.size}</span>}
                                        {item.color && <span>Color: {item.color}</span>}
                                    </p>
                                    <p className="item-price">Rs. {item.price.toLocaleString()}</p>

                                    <div className="quantity-controls">
                                        <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}>
                                            <FiMinus size={14} />
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}>
                                            <FiPlus size={14} />
                                        </button>
                                        <button
                                            className="remove-btn"
                                            onClick={() => removeFromCart(item.id, item.size, item.color)}
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total">
                            <span>Total:</span>
                            <span>Rs. {cartTotal.toLocaleString()}</span>
                        </div>
                        <p className="shipping-note">Tax included. Shipping calculated at checkout.</p>
                        <button className="btn btn-primary btn-block" onClick={handleCheckout}>
                            CHECKOUT - CASH ON DELIVERY
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
