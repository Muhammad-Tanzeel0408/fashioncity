import React from 'react';
import './StaticPages.css';

const ShippingAndDelivery = () => {
    return (
        <div className="static-page container">
            <h1 className="static-page-title">Shipping & Delivery</h1>

            <div className="static-page-content">
                <section className="static-section">
                    <p>
                        We deliver nationwide across Pakistan through our logistics partner <strong>PostEx</strong>.
                        Orders are processed within 24–48 hours and delivered in 5–7 business days.
                    </p>
                    <ul>
                        <li>Delivery partner: <strong>PostEx</strong> with end-to-end tracking.</li>
                        <li>Standard delivery: <strong>5–7 business days</strong> (major cities may receive faster).</li>
                        <li>Payment method: <strong>Cash on Delivery (COD)</strong> available nationwide.</li>
                        <li>Shipping charges are calculated at checkout based on your location.</li>
                        <li>A tracking number is sent via SMS once your order is dispatched. You can also use our <a href="/orders/track">Track Your Order</a> page.</li>
                        <li>Deliveries are made Monday–Saturday, 9 AM – 6 PM. Remote areas may take 1–2 extra days.</li>
                        <li>For shipping queries, email <a href="mailto:ask@fashioncity.com">ask@fashioncity.com</a> or call <strong>+92 333 1234567</strong>.</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default ShippingAndDelivery;
