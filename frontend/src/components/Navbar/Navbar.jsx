import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingBag, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { productService } from '../../services/api';
import AnnouncementBar from '../AnnouncementBar/AnnouncementBar';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState(null); // null = not searched yet, { products:[], categories:[] } = searched
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const { cartCount, toggleCart } = useCart();
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const debounceRef = useRef(null);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        // Clear previous timer
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (!value || value.trim().length < 2) {
            setSuggestions(null);
            setLoadingSuggestions(false);
            return;
        }

        setLoadingSuggestions(true);

        debounceRef.current = setTimeout(async () => {
            try {
                const response = await productService.searchSuggestions(value.trim());
                setSuggestions(response.data || { products: [], categories: [] });
            } catch (err) {
                console.error('Search suggestions error:', err);
                setSuggestions({ products: [], categories: [] });
            } finally {
                setLoadingSuggestions(false);
            }
        }, 300);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            closeSearch();
        }
    };

    const closeSearch = () => {
        setShowSearch(false);
        setSearchQuery('');
        setSuggestions(null);
        setLoadingSuggestions(false);
        if (debounceRef.current) clearTimeout(debounceRef.current);
    };

    const handleSuggestionClick = (path) => {
        navigate(path);
        closeSearch();
    };

    const clearInput = () => {
        setSearchQuery('');
        setSuggestions(null);
        setLoadingSuggestions(false);
        if (debounceRef.current) clearTimeout(debounceRef.current);
    };

    // Close on outside click
    useEffect(() => {
        const onMouseDown = (e) => {
            if (showSearch && searchRef.current && !searchRef.current.contains(e.target)) {
                closeSearch();
            }
        };
        document.addEventListener('mousedown', onMouseDown);
        return () => document.removeEventListener('mousedown', onMouseDown);
    });

    // Cleanup
    useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

    const formatPrice = (price) => `Rs. ${Number(price).toLocaleString()}`;

    const hasProducts = suggestions?.products?.length > 0;
    const hasCategories = suggestions?.categories?.length > 0;
    const hasResults = hasProducts || hasCategories;
    const searched = suggestions !== null;
    const showDropdownContent = searchQuery.trim().length >= 2;

    const categories = [
        { name: 'Men', slug: 'men' },
        { name: 'Women', slug: 'women' },
        { name: 'Kids', slug: 'kids' },
        {
            name: 'Collections',
            slug: 'collections',
            subs: [
                { name: 'Summer', slug: 'summer' },
                { name: 'Winter', slug: 'winter' },
                { name: 'Stitched', slug: 'stitched' },
                { name: 'Unstitched', slug: 'unstitched' }
            ]
        }
    ];

    return (
        <>
            <AnnouncementBar />
            <header className="navbar">
                <div className="container navbar-container">
                    {/* Mobile Menu Button */}
                    <button className="mobile-menu-btn" onClick={toggleMenu}>
                        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>

                    {/* Logo */}
                    <div className="logo">
                        <Link to="/">FASHIONCITY</Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                        <div className="nav-item">
                            <Link
                                to="/"
                                className="nav-link"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>
                        </div>
                        {categories.map((cat) => (
                            <div key={cat.slug} className="nav-item">
                                {cat.subs ? (
                                    <>
                                        <span className="nav-link">{cat.name}</span>
                                        <div className="dropdown">
                                            {cat.subs.map(sub => (
                                                <Link
                                                    key={sub.slug}
                                                    to={`/collections/${sub.slug}`}
                                                    className="dropdown-item"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <Link
                                        to={`/collections/${cat.slug}`}
                                        className="nav-link"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {cat.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>

                    <div className="nav-icons">
                        <div className="search-bar-container" ref={searchRef}>
                            <button className="icon-btn search-btn" onClick={() => setShowSearch(!showSearch)}>
                                <FiSearch size={20} />
                            </button>
                            {showSearch && (
                                <div className="search-dropdown">
                                    <form onSubmit={handleSearch} className="search-form">
                                        <FiSearch size={16} className="search-icon" />
                                        <input
                                            type="text"
                                            placeholder="Search products, categories..."
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                            className="search-input"
                                            autoFocus
                                        />
                                        {searchQuery && (
                                            <button type="button" className="search-clear" onClick={clearInput}>
                                                <FiX size={14} />
                                            </button>
                                        )}
                                    </form>

                                    {showDropdownContent && (
                                        <div className="suggestions-panel">
                                            {loadingSuggestions && (
                                                <div className="suggestions-loading">Searching...</div>
                                            )}

                                            {!loadingSuggestions && searched && hasCategories && (
                                                <div className="suggestions-section">
                                                    <div className="suggestions-heading">Categories</div>
                                                    {suggestions.categories.map(cat => (
                                                        <button
                                                            key={cat.id}
                                                            className="suggestion-item suggestion-category"
                                                            onClick={() => handleSuggestionClick(`/collections/${cat.slug}`)}
                                                        >
                                                            <FiSearch size={14} className="suggestion-icon" />
                                                            <span>{cat.name}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {!loadingSuggestions && searched && hasProducts && (
                                                <div className="suggestions-section">
                                                    <div className="suggestions-heading">Products</div>
                                                    {suggestions.products.map(product => (
                                                        <button
                                                            key={product.id}
                                                            className="suggestion-item suggestion-product"
                                                            onClick={() => handleSuggestionClick(`/product/${product.slug}`)}
                                                        >
                                                            {product.images && product.images[0] && (
                                                                <img src={product.images[0]} alt="" className="suggestion-thumb" />
                                                            )}
                                                            <div className="suggestion-info">
                                                                <span className="suggestion-name">{product.name}</span>
                                                                <span className="suggestion-price">
                                                                    {product.sale_price ? (
                                                                        <>
                                                                            <span className="suggestion-sale">{formatPrice(product.sale_price)}</span>
                                                                            <span className="suggestion-original">{formatPrice(product.price)}</span>
                                                                        </>
                                                                    ) : formatPrice(product.price)}
                                                                </span>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {!loadingSuggestions && searched && hasResults && (
                                                <button
                                                    className="suggestions-view-all"
                                                    onClick={() => handleSuggestionClick(`/search?q=${encodeURIComponent(searchQuery.trim())}`)}
                                                >
                                                    View all results for &ldquo;{searchQuery.trim()}&rdquo;
                                                </button>
                                            )}

                                            {!loadingSuggestions && searched && !hasResults && (
                                                <div className="suggestions-empty">No results found for &ldquo;{searchQuery}&rdquo;</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* User menu removed as per request */}

                        <button className="icon-btn cart-btn" onClick={toggleCart}>
                            <FiShoppingBag size={20} />
                            <span className="cart-count">{cartCount}</span>
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Navbar;
