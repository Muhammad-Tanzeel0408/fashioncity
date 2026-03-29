import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import HeroBanner from '../../components/HeroBanner/HeroBanner';
import ProductCard from '../../components/ProductCard/ProductCard';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import FeatureStrip from '../../components/FeatureStrip/FeatureStrip';
import { useProducts } from '../../hooks/useProducts';
import { categoryService } from '../../services/api';
import './Home.css';

const Home = () => {
    const { products, featuredProducts, fetchProducts, fetchFeatured, loading } = useProducts();
    const [categories, setCategories] = useState([]);
    const sliderRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    useEffect(() => {
        fetchFeatured();
        fetchProducts({ limit: 8 });

        const fetchCategories = async () => {
            try {
                const { data } = await categoryService.getAll();
                setCategories(data);
            } catch (error) {
                console.error('Failed to load categories', error);
            }
        };
        fetchCategories();
    }, []);

    const checkScrollButtons = useCallback(() => {
        const el = sliderRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 1);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }, []);

    useEffect(() => {
        checkScrollButtons();
        const el = sliderRef.current;
        if (el) {
            el.addEventListener('scroll', checkScrollButtons, { passive: true });
            window.addEventListener('resize', checkScrollButtons);
        }
        return () => {
            if (el) el.removeEventListener('scroll', checkScrollButtons);
            window.removeEventListener('resize', checkScrollButtons);
        };
    }, [categories, checkScrollButtons]);

    const scroll = (direction) => {
        const el = sliderRef.current;
        if (!el) return;
        const cardWidth = el.querySelector('.category-card')?.offsetWidth || 280;
        const gap = 20;
        const scrollAmount = (cardWidth + gap) * 2;
        el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    };

    const displayProducts = featuredProducts.length > 0 ? featuredProducts : products;

    return (
        <div className="home-page">
            <HeroBanner />

            {/* Categories Slider Section */}
            <section className="section container category-slider-section">
                <h2 className="section-title text-center text-3xl font-bold mb-8">SHOP BY CATEGORY</h2>
                <div className="category-slider-wrapper">
                    {canScrollLeft && (
                        <button className="slider-arrow slider-arrow-left" onClick={() => scroll('left')} aria-label="Scroll left">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                        </button>
                    )}
                    <div className="category-slider" ref={sliderRef}>
                        {categories.map(cat => (
                            <div className="category-slide" key={cat.id}>
                                <CategoryCard category={cat} />
                            </div>
                        ))}
                    </div>
                    {canScrollRight && (
                        <button className="slider-arrow slider-arrow-right" onClick={() => scroll('right')} aria-label="Scroll right">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                        </button>
                    )}
                </div>
            </section>

            {/* Best Sellers / Featured Section */}
            <section className="section container best-sellers-section">
                <h2 className="section-title text-center text-3xl font-bold mb-8">BEST SELLERS</h2>
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <div className="products-grid">
                        {displayProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
                <div className="text-center mt-8">
                    <Link to="/collections/all" className="btn btn-outline" style={{ marginTop: '30px' }}>
                        VIEW ALL PRODUCTS
                    </Link>
                </div>
            </section>

            {/* Feature Strip */}
            <FeatureStrip />

            {/* Blog/Instagram Section Placeholder */}
            <section className="section container text-center" style={{ marginBottom: '60px' }}>
                <h2 className="text-2xl font-bold mb-4">FOLLOW US @FASHIONCITY</h2>
                <p className="text-gray-500">Tag us in your photos to be featured!</p>
            </section>
        </div>
    );
};

export default Home;
