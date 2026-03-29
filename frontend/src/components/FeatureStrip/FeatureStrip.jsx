import React from 'react';
import { FiTruck, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';
import './FeatureStrip.css';

const FeatureStrip = () => {
    return (
        <div className="feature-strip">
            <div className="container">
                <div className="features-grid">
                    <div className="feature-item">
                        <FiTruck size={24} className="feature-icon" />
                        <div className="feature-text">
                            <h4>FREE SHIPPING</h4>
                            <p>On orders above Rs. 3000</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <FiCheckCircle size={24} className="feature-icon" />
                        <div className="feature-text">
                            <h4>CASH ON DELIVERY</h4>
                            <p>Pay when you receive</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <FiRefreshCw size={24} className="feature-icon" />
                        <div className="feature-text">
                            <h4>EASY RETURNS</h4>
                            <p>14 days return policy</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureStrip;
