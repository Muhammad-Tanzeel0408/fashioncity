import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { FiTrash2, FiStar } from 'react-icons/fi';

const ReviewManager = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [seenReviewIds, setSeenReviewIds] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('seenReviewIds') || '[]');
        } catch { return []; }
    });

    const fetchReviews = async () => {
        try {
            const { data } = await adminService.getReviews();
            setReviews(data || []);
        } catch (error) {
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    // Mark all as seen on unmount
    useEffect(() => {
        return () => {
            if (reviews.length > 0) {
                const allIds = reviews.map(r => r.id);
                const merged = [...new Set([...seenReviewIds, ...allIds])];
                localStorage.setItem('seenReviewIds', JSON.stringify(merged));
            }
        };
    }, [reviews, seenReviewIds]);

    const isNewReview = (id) => !seenReviewIds.includes(id);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                await adminService.deleteReview(id);
                toast.success('Review deleted');
                fetchReviews();
            } catch (error) {
                toast.error('Failed to delete review');
            }
        }
    };

    const renderStars = (rating) => {
        return (
            <div style={{ display: 'flex', gap: '1px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                    <FiStar
                        key={star}
                        size={14}
                        style={{
                            fill: star <= rating ? '#c8922a' : 'none',
                            color: star <= rating ? '#c8922a' : '#d1d5db'
                        }}
                    />
                ))}
            </div>
        );
    };

    return (
        <div>
            <h2 className="font-bold text-xl mb-6">Review Management</h2>

            <div className="admin-card">
                {loading ? (
                    <p>Loading...</p>
                ) : reviews.length === 0 ? (
                    <p style={{ padding: '20px', color: '#999', textAlign: 'center' }}>No reviews yet</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Reviewer</th>
                                <th>Rating</th>
                                <th>Comment</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map(review => (
                                <tr key={review.id} style={isNewReview(review.id) ? { backgroundColor: '#fef3c7' } : {}}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {review.products?.name || 'Unknown Product'}
                                            {isNewReview(review.id) && (
                                                <span style={{
                                                    backgroundColor: '#ef4444',
                                                    color: 'white',
                                                    fontSize: '10px',
                                                    padding: '2px 6px',
                                                    borderRadius: '3px',
                                                    fontWeight: 'bold',
                                                    lineHeight: '1.2'
                                                }}>NEW</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>{review.reviewer_name}</td>
                                    <td>{renderStars(review.rating)}</td>
                                    <td>
                                        <div style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {review.comment || '—'}
                                        </div>
                                        {review.image_url && (
                                            <a href={review.image_url} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: '#3b82f6' }}>
                                                📷 View Image
                                            </a>
                                        )}
                                    </td>
                                    <td style={{ whiteSpace: 'nowrap' }}>
                                        {new Date(review.created_at).toLocaleDateString('en-PK', {
                                            day: '2-digit', month: 'short', year: 'numeric'
                                        })}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(review.id)}
                                            className="admin-btn admin-btn-danger"
                                            title="Delete review"
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ReviewManager;
