import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ category }) => {
    return (
        <Link to={`/collections/${category.slug}`} className="category-card">
            <div className="category-image-wrapper">
                <img src={category.image_url} alt={category.name} className="category-image" />
                <div className="category-overlay">
                    <h3 className="category-title">{category.name}</h3>
                    <span className="shop-link">SHOP NOW</span>
                </div>
            </div>
        </Link>
    );
};

export default CategoryCard;
