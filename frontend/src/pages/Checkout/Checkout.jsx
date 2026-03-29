import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { orderService } from '../../services/api';
import { toast } from 'react-hot-toast';
import './Checkout.css';

const DELIVERY_CHARGES = 250;

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const orderTotal = cartTotal + DELIVERY_CHARGES;

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        phone: ''
    });

    if (cartItems.length === 0) {
        return (
            <div className="container text-center py-20">
                <h2>Your cart is empty</h2>
                <button className="btn btn-primary mt-4" onClick={() => navigate('/')}>
                    Continue Shopping
                </button>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                guest_name: `${formData.firstName} ${formData.lastName}`,
                guest_email: formData.email,
                items: cartItems.map(item => ({
                    product_id: item.id,
                    product_name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.size,
                    color: item.color
                })),
                shipping_address: `${formData.address}, ${formData.postalCode}`,
                city: formData.city,
                phone: formData.phone,
                delivery_charges: DELIVERY_CHARGES
            };

            const { data } = await orderService.create(orderData);

            clearCart();
            toast.success('Order placed successfully!');
            navigate('/order-success', { state: { order: data.order } });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page container">
            <div className="checkout-grid">
                {/* Form Section */}
                <div className="checkout-form-section">
                    <h2 className="section-title">Contact Information</h2>
                    <form id="checkout-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <h2 className="section-title mt-8">Shipping Address</h2>
                        <div className="grid-cols-2">
                            <div className="form-group">
                                <label className="form-label">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    className="form-input"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    className="form-input"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Address</label>
                            <input
                                type="text"
                                name="address"
                                className="form-input"
                                required
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid-cols-2">
                            <div className="form-group">
                                <label className="form-label">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    className="form-input"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Postal Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    className="form-input"
                                    required
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                className="form-input"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="0300 1234567"
                            />
                        </div>

                        <div className="payment-method mt-8 p-4 bg-gray-100 rounded">
                            <h3 className="font-bold mb-2">Payment Method</h3>
                            <div className="flex items-center gap-2">
                                <input type="radio" checked readOnly />
                                <span>Cash on Delivery (COD)</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block mt-8"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : `Complete Order - Rs. ${orderTotal.toLocaleString()}`}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="checkout-summary">
                    <h3 className="summary-title">Order Summary</h3>
                    <div className="summary-items">
                        {cartItems.map(item => (
                            <div key={`${item.id}-${item.size}-${item.color}`} className="summary-item">
                                <div className="summary-img-wrapper">
                                    <img src={item.image} alt={item.name} />
                                    <span className="summary-qty">{item.quantity}</span>
                                </div>
                                <div className="summary-details">
                                    <h4>{item.name}</h4>
                                    <p>{item.size} / {item.color}</p>
                                </div>
                                <div className="summary-price">
                                    Rs. {(item.price * item.quantity).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="summary-totals">
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>Rs. {cartTotal.toLocaleString()}</span>
                        </div>
                        <div className="summary-row">
                            <span>Delivery Charges</span>
                            <span>Rs. {DELIVERY_CHARGES.toLocaleString()}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>Rs. {orderTotal.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
