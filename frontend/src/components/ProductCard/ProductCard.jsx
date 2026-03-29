import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { id, name, price, sale_price, images, slug, category } = product;

    // Use first image or placeholder
    const image = images && images.length > 0 ? images[0] : 'https://placehold.co/400x600?text=No+Image';

    // Calculate discount percentage if sale price exists
    const discount = sale_price
        ? Math.round(((price - sale_price) / price) * 100)
        : 0;

    const handleAddToCart = (e) => {
        e.preventDefault();
        // Default add to cart without size/color for quick add
        // Ideally this opens a quick view modal, but for now we add directly
        addToCart(product);
    };

    return (
        <div className="product-card">
            <Link to={`/product/${slug}`} className="product-link">
                <div className="product-image-container">
                    <img src={image} alt={name} className="product-image" loading="lazy" />
                    {discount > 0 && (
                        <span className="sale-tag">-{discount}%</span>
                    )}
                    <button className="quick-add-btn" onClick={handleAddToCart}>
                        ADD TO CART
                    </button>
                </div>
                <div className="product-info">
                    {category && <span className="product-category">{category.name}</span>}
                    <h3 className="product-title">{name}</h3>
                    <div className="product-price">
                        {sale_price ? (
                            <>
                                <span className="price-sale">Rs. {sale_price.toLocaleString()}</span>
                                <span className="price-original">Rs. {price.toLocaleString()}</span>
                            </>
                        ) : (
                            <span className="price-regular">Rs. {price.toLocaleString()}</span>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
