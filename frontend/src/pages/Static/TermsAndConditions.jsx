import React from 'react';
import './StaticPages.css';

const TermsAndConditions = () => {
    return (
        <div className="static-page container">
            <h1 className="static-page-title">Terms & Conditions</h1>
            <p className="static-page-updated">Last updated: February 2026</p>

            <div className="static-page-content">
                <section className="static-section">
                    <p>
                        By using the FashionCity website and placing an order, you agree to the following terms.
                        FashionCity reserves the right to update these terms at any time.
                    </p>
                    <ul>
                        <li>All prices are in PKR and may change without prior notice. Product colors may vary slightly due to screen settings.</li>
                        <li>Orders are confirmed subject to stock availability. We accept Cash on Delivery (COD) across Pakistan.</li>
                        <li>Standard delivery takes 5–7 business days. Shipping charges are shown at checkout.</li>
                        <li>We offer a 7-day exchange policy. Items must be unused, unwashed, and in original packaging with tags intact. Sale items are non-returnable.</li>
                        <li>Your personal data is used only for order processing and is never shared with third parties.</li>
                        <li>All website content, designs, and logos are the intellectual property of FashionCity.</li>
                        <li>These terms are governed by the laws of Pakistan. For questions, email <a href="mailto:ask@fashioncity.com">ask@fashioncity.com</a>.</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default TermsAndConditions;
