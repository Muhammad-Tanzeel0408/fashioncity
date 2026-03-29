import React, { useState, useEffect, useRef } from 'react';
import { FiStar, FiChevronDown, FiCheck, FiCamera, FiX } from 'react-icons/fi';
import { reviewService } from '../../services/api';
import { toast } from 'react-hot-toast';

const StarRating = ({ rating, onRate, interactive = false, size = 16 }) => {
    const [hover, setHover] = useState(0);

    return (
        <div className="rv-stars" style={{ display: 'inline-flex', gap: '1px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                    key={star}
                    size={size}
                    style={{
                        cursor: interactive ? 'pointer' : 'default',
                        fill: star <= (hover || rating) ? '#c8922a' : 'none',
                        color: star <= (hover || rating) ? '#c8922a' : '#d1d5db',
                        transition: 'all 0.15s'
                    }}
                    onClick={() => interactive && onRate?.(star)}
                    onMouseEnter={() => interactive && setHover(star)}
                    onMouseLeave={() => interactive && setHover(0)}
                />
            ))}
        </div>
    );
};

const ReviewSection = ({ productId, onReviewSubmitted }) => {
    const [reviews, setReviews] = useState([]);
    const [average, setAverage] = useState(0);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (productId) fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const { data } = await reviewService.getByProduct(productId);
            setReviews(data.reviews || []);
            setAverage(data.average || 0);
            setCount(data.count || 0);
        } catch (err) {
            console.error('Failed to load reviews', err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image must be less than 5MB');
                return;
            }
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return toast.error('Please enter your name');
        if (rating === 0) return toast.error('Please select a rating');

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('product_id', productId);
            formData.append('reviewer_name', name);
            formData.append('rating', rating);
            formData.append('comment', comment);
            if (image) formData.append('image', image);

            await reviewService.create(formData);
            toast.success('Review submitted successfully!');
            setName('');
            setRating(0);
            setComment('');
            removeImage();
            setShowForm(false);
            fetchReviews();
            onReviewSubmitted?.();
        } catch (err) {
            toast.error('Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: '2-digit', day: '2-digit', year: 'numeric'
        });
    };

    // Calculate star breakdown
    const starBreakdown = [5, 4, 3, 2, 1].map((star) => {
        const starCount = reviews.filter((r) => r.rating === star).length;
        const percentage = count > 0 ? (starCount / count) * 100 : 0;
        return { star, count: starCount, percentage };
    });

    return (
        <div className="rv-section">
            <h2 className="rv-section-title">Customer Reviews</h2>

            {/* Summary Panel */}
            <div className="rv-summary">
                <div className="rv-summary-left">
                    <div className="rv-avg-score">{average.toFixed(2)}</div>
                    <div className="rv-avg-label">out of 5</div>
                    <StarRating rating={Math.round(average)} size={20} />
                    <div className="rv-total-count">Based on {count} {count === 1 ? 'review' : 'reviews'}</div>
                </div>
                <div className="rv-summary-right">
                    {starBreakdown.map(({ star, count: starCount, percentage }) => (
                        <div key={star} className="rv-bar-row">
                            <span className="rv-bar-label">{star} ★</span>
                            <div className="rv-bar-track">
                                <div
                                    className="rv-bar-fill"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <span className="rv-bar-count">{starCount}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Write Review Toggle */}
            <div className="rv-write-toggle">
                <button
                    className="rv-write-btn"
                    onClick={() => setShowForm(!showForm)}
                >
                    Write a Review
                    <FiChevronDown
                        size={16}
                        style={{
                            transform: showForm ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s'
                        }}
                    />
                </button>
            </div>

            {/* Review Form — 3 fields: Name, Review, Picture */}
            {showForm && (
                <div className="rv-form-container">
                    <form onSubmit={handleSubmit} className="rv-form">
                        <div className="rv-form-group">
                            <label className="rv-form-label">Rating</label>
                            <StarRating rating={rating} onRate={setRating} interactive size={28} />
                        </div>
                        <div className="rv-form-group">
                            <label className="rv-form-label">Your Name</label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="rv-form-input"
                                required
                            />
                        </div>
                        <div className="rv-form-group">
                            <label className="rv-form-label">Your Review</label>
                            <textarea
                                placeholder="Share your experience with this product..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="rv-form-textarea"
                                rows={4}
                            />
                        </div>
                        <div className="rv-form-group">
                            <label className="rv-form-label">Add Picture</label>
                            <div className="rv-image-upload">
                                {imagePreview ? (
                                    <div className="rv-image-preview">
                                        <img src={imagePreview} alt="Preview" />
                                        <button
                                            type="button"
                                            className="rv-image-remove"
                                            onClick={removeImage}
                                        >
                                            <FiX size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        className="rv-image-picker"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <FiCamera size={22} />
                                        <span>Upload Photo</span>
                                    </button>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>
                        <button type="submit" className="rv-submit-btn" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            )}

            {/* Reviews List */}
            {loading ? (
                <p className="rv-loading">Loading reviews...</p>
            ) : reviews.length === 0 ? (
                <p className="rv-empty">No reviews yet. Be the first to review this product!</p>
            ) : (
                <div className="rv-list">
                    {reviews.map((review) => (
                        <div key={review.id} className="rv-card">
                            <div className="rv-card-top">
                                <StarRating rating={review.rating} size={15} />
                                <span className="rv-card-date">{formatDate(review.created_at)}</span>
                            </div>
                            <div className="rv-card-author">
                                <span className="rv-card-name">{review.reviewer_name}</span>
                                <span className="rv-verified-badge">
                                    <FiCheck size={12} /> Verified
                                </span>
                            </div>
                            {review.comment && <p className="rv-card-body">{review.comment}</p>}
                            {review.image_url && (
                                <div className="rv-card-image">
                                    <img src={review.image_url} alt="Review" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewSection;
