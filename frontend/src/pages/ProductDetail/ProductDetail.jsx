import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiMinus, FiPlus, FiShoppingBag, FiStar } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useProduct } from '../../hooks/useProducts';
import { reviewService, categoryService } from '../../services/api';
import FeatureStrip from '../../components/FeatureStrip/FeatureStrip';
import ReviewSection from '../../components/ReviewSection/ReviewSection';
import RecommendedProducts from '../../components/RecommendedProducts/RecommendedProducts';
import '../../components/ReviewSection/ReviewSection.css';
import '../../components/RecommendedProducts/RecommendedProducts.css';
import './ProductDetail.css';

const ProductDetail = () => {
    const { slug } = useParams();
    const { product, loading, error } = useProduct(slug);
    const { addToCart } = useCart();

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [ratingAvg, setRatingAvg] = useState(0);
    const [ratingCount, setRatingCount] = useState(0);
    const [allCategories, setAllCategories] = useState([]);

    const fetchRating = async (productId) => {
        try {
            const { data } = await reviewService.getByProduct(productId);
            setRatingAvg(data.average || 0);
            setRatingCount(data.count || 0);
        } catch (err) {
            console.error('Failed to fetch rating:', err);
        }
    };

    useEffect(() => {
        if (product?.id) {
            fetchRating(product.id);
        }
    }, [product?.id]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await categoryService.getAll();
                setAllCategories(data);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };
        fetchCategories();
    }, []);

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (error || !product) return <div className="text-center py-20">Product not found</div>;

    // Check if product belongs to the "unstitched" category
    const isUnstitched = (() => {
        // Check via category_ids array (most reliable)
        if (product.category_ids && product.category_ids.length > 0 && allCategories.length > 0) {
            return allCategories.some(c => product.category_ids.includes(c.id) && c.slug === 'unstitched');
        }
        // Fallback: check the joined category
        return product.categories?.slug === 'unstitched' || product.category?.slug === 'unstitched';
    })();

    const handleAddToCart = () => {
        // Validate selection if sizes/colors exist (skip size check for unstitched)
        if (!isUnstitched && product.sizes?.length > 0 && !selectedSize) {
            alert('Please select a size');
            return;
        }
        if (product.colors?.length > 0 && !activeColorValid()) {
            // Optional: enforce color selection if you want
        }

        addToCart(product, quantity, selectedSize, selectedColor);
    };

    // Helper to check color validation
    const activeColorValid = () => !product.colors || product.colors.length === 0 || selectedColor;

    return (
        <div className="product-detail-page">
            <div className="container">
                <div className="product-layout">
                    {/* Images Section */}
                    <div className="product-gallery">
                        <div className="main-image">
                            <img
                                src={product.images?.[activeImage] || 'https://placehold.co/600x800'}
                                alt={product.name}
                            />
                        </div>
                        <div className="thumbnails">
                            {product.images?.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`thumbnail ${activeImage === idx ? 'active' : ''}`}
                                    onClick={() => setActiveImage(idx)}
                                >
                                    <img src={img} alt={`${product.name} view ${idx + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="product-info-detail">
                        {product.category && (
                            <span className="detail-category">{product.category.name}</span>
                        )}
                        <h1 className="detail-title">{product.name}</h1>

                        <div className="detail-price">
                            {product.sale_price ? (
                                <>
                                    <span className="price-sale">Rs. {product.sale_price.toLocaleString()}</span>
                                    <span className="price-original">Rs. {product.price.toLocaleString()}</span>
                                    <span className="save-badge">
                                        Save Rs. {(product.price - product.sale_price).toLocaleString()}
                                    </span>
                                </>
                            ) : (
                                <span className="price-regular">Rs. {product.price.toLocaleString()}</span>
                            )}
                        </div>

                        {/* Rating Stars */}
                        <div className="detail-rating">
                            <div className="detail-stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FiStar
                                        key={star}
                                        size={18}
                                        style={{
                                            fill: star <= Math.round(ratingAvg) ? '#c8922a' : 'none',
                                            color: star <= Math.round(ratingAvg) ? '#c8922a' : '#d1d5db'
                                        }}
                                    />
                                ))}
                            </div>
                            <span className="detail-rating-text">
                                {ratingAvg > 0 ? `${ratingAvg} (${ratingCount} ${ratingCount === 1 ? 'review' : 'reviews'})` : 'No reviews yet'}
                            </span>
                        </div>

                        {/* Sizes - hidden for unstitched products */}
                        {!isUnstitched && product.sizes && product.sizes.length > 0 && (
                            <div className="option-group">
                                <label>Size:</label>
                                <div className="sizes-grid">
                                    {product.sizes.map(size => (
                                        <button
                                            key={size}
                                            className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Colors */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="option-group">
                                <label>Color:</label>
                                <div className="colors-grid">
                                    {product.colors.map(color => (
                                        <button
                                            key={color}
                                            className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                                            onClick={() => setSelectedColor(color)}
                                            style={{
                                                backgroundColor: color.toLowerCase() === 'white' ? '#f0f0f0' : color.toLowerCase(),
                                                border: selectedColor === color ? '2px solid black' : '1px solid #ddd'
                                            }}
                                            title={color}
                                        />
                                    ))}
                                    <span className="selected-color-name">{selectedColor}</span>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="actions-group">
                            <div className="quantity-selector">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                    <FiMinus />
                                </button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)}>
                                    <FiPlus />
                                </button>
                            </div>

                            <button
                                className="btn btn-primary add-to-cart-btn"
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                            >
                                <FiShoppingBag className="mr-2" />
                                {product.stock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
                            </button>
                        </div>

                        {/* Description */}
                        <div className="description-box">
                            <h3>Description</h3>
                            <p>{product.description}</p>
                        </div>

                        {/* Additional Info */}
                        <div className="meta-info">
                            <p>SKU: {product.slug}</p>
                            <p>Category: {product.category?.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="container">
                <ReviewSection productId={product.id} onReviewSubmitted={() => fetchRating(product.id)} />
            </div>

            {/* Recommended Products */}
            <div className="container">
                <RecommendedProducts productSlug={slug} />
            </div>

            <FeatureStrip />
        </div>
    );
};

export default ProductDetail;
