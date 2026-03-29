import React, { useState } from 'react';
import { orderService } from '../../services/api';
import { FiSearch, FiPackage, FiClock, FiCheckCircle, FiTruck, FiXCircle } from 'react-icons/fi';
import './TrackOrder.css';

const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: FiClock },
    { key: 'confirmed', label: 'Confirmed', icon: FiCheckCircle },
    { key: 'shipped', label: 'Shipped', icon: FiTruck },
    { key: 'delivered', label: 'Delivered', icon: FiPackage },
];

const getStepIndex = (status) => {
    if (status === 'cancelled') return -1;
    return statusSteps.findIndex(s => s.key === status);
};

const TrackOrder = () => {
    const [orderNumber, setOrderNumber] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!orderNumber.trim()) return;

        setLoading(true);
        setError('');
        setOrder(null);

        try {
            const { data } = await orderService.track(orderNumber.trim());
            setOrder(data);
        } catch (err) {
            setError('Order not found. Please check your order number and try again.');
        } finally {
            setLoading(false);
        }
    };

    const currentStep = order ? getStepIndex(order.status) : 0;
    const isCancelled = order?.status === 'cancelled';

    return (
        <div className="track-order-page">
            {/* Hero Section */}
            <div className="track-hero">
                <div className="track-hero-content">
                    <FiPackage className="track-hero-icon" />
                    <h1>Track Your Order</h1>
                    <p>Enter your order number to see the latest status of your delivery</p>
                </div>
            </div>

            {/* Search Section */}
            <div className="container">
                <div className="track-search-wrapper">
                    <form onSubmit={handleTrack} className="track-search-form">
                        <div className="track-input-group">
                            <FiSearch className="track-input-icon" />
                            <input
                                type="text"
                                placeholder="Enter your order number (e.g., FC-A3F2-9BC1-E7D4)"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                className="track-input"
                            />
                        </div>
                        <button type="submit" className="track-btn" disabled={loading}>
                            {loading ? 'Searching...' : 'Track Order'}
                        </button>
                    </form>
                </div>

                {/* Error */}
                {error && (
                    <div className="track-error">
                        <FiXCircle />
                        <span>{error}</span>
                    </div>
                )}

                {/* Result */}
                {order && (
                    <div className="track-result">
                        <div className="track-result-header">
                            <div>
                                <h2>Order #{order.order_number}</h2>
                                <p className="track-date">
                                    Placed on {new Date(order.created_at).toLocaleDateString('en-PK', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="track-summary">
                                <div className="track-summary-item">
                                    <span className="track-label">Items</span>
                                    <span className="track-value">{order.items_count}</span>
                                </div>
                                <div className="track-summary-item">
                                    <span className="track-label">Total</span>
                                    <span className="track-value">Rs. {order.total?.toLocaleString()}</span>
                                </div>
                                <div className="track-summary-item">
                                    <span className="track-label">Payment</span>
                                    <span className="track-value">{order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}</span>
                                </div>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className={`track-status-badge status-${order.status}`}>
                            {isCancelled ? <FiXCircle /> : <FiCheckCircle />}
                            <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                        </div>

                        {/* Progress Stepper */}
                        {!isCancelled ? (
                            <div className="track-stepper">
                                {statusSteps.map((step, index) => {
                                    const StepIcon = step.icon;
                                    const isActive = index <= currentStep;
                                    const isCurrent = index === currentStep;
                                    return (
                                        <div key={step.key} className={`track-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}>
                                            <div className="track-step-line" />
                                            <div className="track-step-circle">
                                                <StepIcon />
                                            </div>
                                            <span className="track-step-label">{step.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="track-cancelled">
                                <FiXCircle className="track-cancelled-icon" />
                                <p>This order has been cancelled.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Help Section */}
                {!order && !error && !loading && (
                    <div className="track-help">
                        <h3>How to find your order number?</h3>
                        <div className="track-help-cards">
                            <div className="track-help-card">
                                <span className="track-help-num">1</span>
                                <p>Check the confirmation SMS or email you received after placing your order</p>
                            </div>
                            <div className="track-help-card">
                                <span className="track-help-num">2</span>
                                <p>Your order number starts with <strong>FC-</strong> followed by three groups of characters (e.g., <strong>FC-A3F2-9BC1-E7D4</strong>)</p>
                            </div>
                            <div className="track-help-card">
                                <span className="track-help-num">3</span>
                                <p>If you can't find it, contact us at <strong>+92 333 1234567</strong></p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;
