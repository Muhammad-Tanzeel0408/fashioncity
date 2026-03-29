import React from 'react';

export const About = () => (
    <div className="container py-20" style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="text-3xl font-bold mb-6 text-center">About FashionCity</h1>
        <p className="mb-4 text-gray-600 leading-relaxed">
            FashionCity is your premier destination for contemporary clothing. We bring you the latest trends
            matching the style and quality of top brands. Our mission is to make high-fashion accessible to everyone.
        </p>
        <p className="mb-4 text-gray-600 leading-relaxed">
            Founded in 2024, we started with a simple idea: that fashion should be expressive, affordable, and high-quality.
            Whether you are looking for summer essentials, winter coziness, or formal wear, we have got you covered.
        </p>
    </div>
);

export const Contact = () => (
    <div className="container py-20" style={{ padding: '60px 20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
        <div className="bg-gray-50 p-8 rounded" style={{ backgroundColor: '#f9f9f9', padding: '30px', borderRadius: '8px' }}>
            <div className="mb-6">
                <h3 className="font-bold mb-2">Customer Support</h3>
                <p>Email: ask@fashioncity.com</p>
                <p>Phone: +92 333 1234567</p>
                <p>Hours: Mon-Fri, 9am - 6pm</p>
            </div>
            <div>
                <h3 className="font-bold mb-2">Head Office</h3>
                <p>123 Fashion Ave, Main Boulevard</p>
                <p>Lahore, Pakistan</p>
            </div>
        </div>
    </div>
);

export const FAQ = () => (
    <div className="container py-20" style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
        <div className="space-y-6">
            <div className="mb-6">
                <h3 className="font-bold mb-2">How do I place an order?</h3>
                <p className="text-gray-600">Simply browse our collection, select your size and color, adding items to your cart. Proceed to checkout and choose Cash on Delivery.</p>
            </div>
            <div className="mb-6">
                <h3 className="font-bold mb-2">What is your return policy?</h3>
                <p className="text-gray-600">We offer a 14-day return policy for unused items with original tags. Contact support to initiate a return.</p>
            </div>
            <div className="mb-6">
                <h3 className="font-bold mb-2">Do you offer international shipping?</h3>
                <p className="text-gray-600">Currently, we only ship nationwide within Pakistan.</p>
            </div>
        </div>
    </div>
);

export const PrivacyPolicy = () => (
    <div className="container py-20" style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
        <p className="text-gray-600">At FashionCity, we value your privacy. We collecting only necessary information to process your orders and improve your shopping experience. We do not sell your data to third parties.</p>
    </div>
);
