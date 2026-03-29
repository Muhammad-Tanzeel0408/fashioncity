import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import './StaticPages.css';

const ReturnAndExchange = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        orderNumber: '',
        customerName: '',
        phone: '',
        email: '',
        reasonCategory: '',
        reason: '',
        itemDetails: '',
        preferredResolution: 'exchange',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.orderNumber || !formData.customerName || !formData.phone || !formData.reasonCategory) {
            toast.error('Please fill all required fields');
            return;
        }
        // Navigate to confirmation page with form data
        navigate('/pages/return-confirmation', { state: { returnData: formData } });
    };

    return (
        <div className="static-page container">
            {/* Hero Banner */}
            <div className="return-hero">
                <FiRefreshCw className="return-hero-icon" />
                <h1>7 Day Easy Exchange</h1>
                <p>We want you to love what you ordered. If something isn't right, we've made returns simple.</p>
            </div>

            {/* Policy Cards */}
            <div className="return-policy-grid">
                <div className="return-policy-card">
                    <div className="return-policy-num">1</div>
                    <h3>7 Day Window</h3>
                    <p>Request an exchange within 7 days of receiving your order. No questions asked.</p>
                </div>
                <div className="return-policy-card">
                    <div className="return-policy-num">2</div>
                    <h3>Original Condition</h3>
                    <p>Items must be unused, unwashed, with all original tags and packaging intact.</p>
                </div>
                <div className="return-policy-card">
                    <div className="return-policy-num">3</div>
                    <h3>Easy Process</h3>
                    <p>Fill the form below and our team will arrange pickup and send your replacement.</p>
                </div>
                <div className="return-policy-card">
                    <div className="return-policy-num">4</div>
                    <h3>Quick Resolution</h3>
                    <p>Exchange or refund processed within 7–10 business days after receiving the item.</p>
                </div>
            </div>

            {/* Return Form */}
            <div className="return-form-section">
                <h2 className="return-form-title">Submit Return / Exchange Request</h2>

                <form onSubmit={handleSubmit} className="return-form">
                    <div className="return-form-grid">
                        <div className="return-field">
                            <label>Order Number <span className="required">*</span></label>
                            <input
                                type="text"
                                name="orderNumber"
                                placeholder="e.g., ORD-1740123456789"
                                value={formData.orderNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="return-field">
                            <label>Full Name <span className="required">*</span></label>
                            <input
                                type="text"
                                name="customerName"
                                placeholder="Your full name"
                                value={formData.customerName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="return-field">
                            <label>Phone Number <span className="required">*</span></label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="03XX XXXXXXX"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="return-field">
                            <label>Email (Optional)</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="return-field">
                        <label>Preferred Resolution <span className="required">*</span></label>
                        <select name="preferredResolution" value={formData.preferredResolution} onChange={handleChange}>
                            <option value="exchange">Exchange for different size/color</option>
                            <option value="refund">Refund</option>
                            <option value="store_credit">Store Credit</option>
                        </select>
                    </div>

                    <div className="return-field">
                        <label>Item Details</label>
                        <input
                            type="text"
                            name="itemDetails"
                            placeholder="Product name, size, color"
                            value={formData.itemDetails}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="return-field">
                        <label>Reason Category <span className="required">*</span></label>
                        <select name="reasonCategory" value={formData.reasonCategory} onChange={handleChange} required>
                            <option value="">Select a reason</option>
                            <option value="defective">Defective Product</option>
                            <option value="wrong_item">Wrong Item Received</option>
                            <option value="not_as_described">Not as Described</option>
                            <option value="size_issue">Size Issue</option>
                            <option value="changed_mind">Changed Mind</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="return-field">
                        <label>Additional Details</label>
                        <textarea
                            name="reason"
                            placeholder="Please describe the issue in detail (optional)"
                            value={formData.reason}
                            onChange={handleChange}
                            rows={4}
                        />
                    </div>

                    <button type="submit" className="return-submit-btn">
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReturnAndExchange;
