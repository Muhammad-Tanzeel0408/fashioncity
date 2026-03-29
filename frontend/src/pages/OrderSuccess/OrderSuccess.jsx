import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

const OrderSuccess = () => {
    const location = useLocation();
    const order = location.state?.order;

    return (
        <div className="container text-center py-20">
            <div className="flex flex-col items-center justify-center">
                <FiCheckCircle size={64} className="text-green-500 mb-6" style={{ color: '#10b981' }} />
                <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
                <p className="mb-8 text-gray-600">
                    Your order {order ? ` #${order.order_number}` : ''} has been placed successfully.
                </p>

                <div className="bg-gray-50 p-6 rounded-lg max-w-md mx-auto mb-8" style={{ backgroundColor: '#f9f9f9', padding: '30px', borderRadius: '8px' }}>
                    <p className="mb-2">We will contact you shortly to confirm your order.</p>
                    <p className="text-sm">Please keep your phone active.</p>
                </div>

                <Link to="/" className="btn btn-primary">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccess;
