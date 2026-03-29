import React, { useState, useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import { productService } from '../../services/api';

const RecommendedProducts = ({ productSlug }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (productSlug) fetchRecommended();
    }, [productSlug]);

    const fetchRecommended = async () => {
        try {
            setLoading(true);
            const { data } = await productService.getRecommended(productSlug, 4);
            setProducts(data || []);
        } catch (err) {
            console.error('Failed to load recommendations', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return null;
    if (products.length === 0) return null;

    return (
        <div className="recommended-section">
            <h2 className="recommended-title">You May Also Like</h2>
            <div className="recommended-grid">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default RecommendedProducts;
