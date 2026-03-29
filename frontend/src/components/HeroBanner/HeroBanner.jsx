import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { settingsService } from '../../services/api';
import './HeroBanner.css';

// Fallback slides if API is unavailable
const defaultSlides = [
    {
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80',
        title: 'WINTER COLLECTION',
        subtitle: 'Stay cozy and stylish this season',
        link: '/collections/winter',
        buttonText: 'SHOP NOW'
    },
    {
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1600&q=80',
        title: 'SUMMER VIBES',
        subtitle: 'New arrivals for the sunny days',
        link: '/collections/summer',
        buttonText: 'DISCOVER'
    },
    {
        image: 'https://images.unsplash.com/photo-1490481651871-ab2507294d21?w=1600&q=80',
        title: 'ELEGANT ESSENTIALS',
        subtitle: 'Timeless pieces for your wardrobe',
        link: '/collections/women',
        buttonText: 'SHOP WOMEN'
    }
];

const HeroBanner = () => {
    const [slides, setSlides] = useState(defaultSlides);
    const [current, setCurrent] = useState(0);

    // Fetch slides from API
    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const { data } = await settingsService.getHeroSlides();
                if (data && data.length > 0) {
                    setSlides(data);
                }
            } catch (err) {
                // Silently fall back to default slides
                console.error('Could not load hero slides:', err.message);
            }
        };
        fetchSlides();
    }, []);

    const nextSlide = () => {
        setCurrent(current === slides.length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? slides.length - 1 : current - 1);
    };

    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [current, slides.length]);

    return (
        <div className="hero-banner">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`hero-slide ${index === current ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${slide.image})` }}
                >
                    <div className="hero-overlay">
                        <div className="hero-content container">
                            <h2 className="hero-subtitle fade-up">{slide.subtitle}</h2>
                            <h1 className="hero-title fade-up delay-1">{slide.title}</h1>
                            <Link to={slide.link || '/'} className="hero-btn btn btn-primary fade-up delay-2">
                                {slide.buttonText || 'SHOP NOW'}
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            <button className="slider-arrow left" onClick={prevSlide}>
                <FiChevronLeft size={24} />
            </button>
            <button className="slider-arrow right" onClick={nextSlide}>
                <FiChevronRight size={24} />
            </button>

            <div className="slider-dots">
                {slides.map((_, index) => (
                    <div
                        key={index}
                        className={`slider-dot ${index === current ? 'active' : ''}`}
                        onClick={() => setCurrent(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroBanner;
