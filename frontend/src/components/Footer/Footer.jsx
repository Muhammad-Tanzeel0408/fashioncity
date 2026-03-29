import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Column 1: Contact */}
                    <div className="footer-col">
                        <h4 className="footer-title">NEED HELP?</h4>
                        <p className="footer-text">
                            Phone: +92 333 1234567<br />
                            Email: <a href="mailto:ask@fashioncity.com">ask@fashioncity.com</a>
                        </p>
                        <div className="social-icons">
                            <a href="#" className="social-icon"><FaFacebookF /></a>
                            <a href="#" className="social-icon"><FaInstagram /></a>
                            <a href="#" className="social-icon"><FaWhatsapp /></a>
                        </div>
                    </div>

                    {/* Column 2: Information */}
                    <div className="footer-col">
                        <h4 className="footer-title">INFORMATION</h4>
                        <ul className="footer-links">
                            <li><Link to="/pages/about-us">About Us</Link></li>
                            <li><Link to="/pages/contact">Contact Us</Link></li>
                            <li><Link to="/pages/faqs">FAQs</Link></li>
                            <li><Link to="/pages/privacy-policy">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Quick Shop */}
                    <div className="footer-col">
                        <h4 className="footer-title">QUICK SHOP</h4>
                        <ul className="footer-links">
                            <li><Link to="/collections/men">Men</Link></li>
                            <li><Link to="/collections/women">Women</Link></li>
                            <li><Link to="/collections/kids">Kids</Link></li>
                            <li><Link to="/collections/summer">Summer Collection</Link></li>
                            <li><Link to="/collections/winter">Winter Collection</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Customer Services */}
                    <div className="footer-col">
                        <h4 className="footer-title">CUSTOMER SERVICES</h4>
                        <ul className="footer-links">
                            <li><Link to="/pages/terms-and-conditions">Terms & Conditions</Link></li>
                            <li><Link to="/pages/shipping-and-delivery">Shipping & Delivery</Link></li>
                            <li><Link to="/orders/track">Track your Order</Link></li>
                            <li><Link to="/pages/return-and-exchange">Returns & Exchange</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} FashionCity. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
