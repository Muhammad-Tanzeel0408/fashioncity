import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { FiGrid, FiBox, FiShoppingBag, FiLayers, FiLogOut, FiImage, FiStar, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/api';
import './Admin.css';

const AdminLayout = () => {
    const { logout, isAdmin, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Wait for auth state to load before deciding
    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Loading...</p>
            </div>
        );
    }

    // Redirect to login if not admin
    if (!isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    const menuItems = [
        { icon: <FiGrid />, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: <FiBox />, label: 'Products', path: '/admin/products' },
        { icon: <FiShoppingBag />, label: 'Orders', path: '/admin/orders', badgeKey: 'seenOrderIds', countKey: 'orders' },
        { icon: <FiLayers />, label: 'Categories', path: '/admin/categories' },
        { icon: <FiImage />, label: 'Hero Banner', path: '/admin/hero' },
        { icon: <FiStar />, label: 'Reviews', path: '/admin/reviews', badgeKey: 'seenReviewIds', countKey: 'reviews' },
        { icon: <FiRefreshCw />, label: 'Returns', path: '/admin/returns', badgeKey: 'seenReturnIds', countKey: 'returns' },
    ];

    const [newCounts, setNewCounts] = useState({});

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const counts = {};

                // Count new orders
                const seenOrders = JSON.parse(localStorage.getItem('seenOrderIds') || '[]');
                const { data: ordersData } = await adminService.getOrders();
                const orders = ordersData.orders || ordersData || [];
                counts.orders = orders.filter(o => !seenOrders.includes(o.id)).length;

                // Count new reviews
                const seenReviews = JSON.parse(localStorage.getItem('seenReviewIds') || '[]');
                const { data: reviewsData } = await adminService.getReviews();
                const reviews = reviewsData || [];
                counts.reviews = reviews.filter(r => !seenReviews.includes(r.id)).length;

                // Count new returns
                const seenReturns = JSON.parse(localStorage.getItem('seenReturnIds') || '[]');
                const { data: returnsData } = await adminService.getReturns();
                const returns = returnsData || [];
                counts.returns = returns.filter(r => !seenReturns.includes(r.id)).length;

                setNewCounts(counts);
            } catch (e) {
                // Silently fail - badges are non-critical
            }
        };
        if (isAdmin) fetchCounts();
    }, [isAdmin, location.pathname]);

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <h2>FASHIONCITY</h2>
                    <span>Admin Panel</span>
                </div>

                <nav className="admin-nav">
                    {menuItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                            {item.countKey && newCounts[item.countKey] > 0 && (
                                <span className="admin-nav-badge">{newCounts[item.countKey]}</span>
                            )}
                        </Link>
                    ))}
                </nav>

                <button onClick={() => { logout(); navigate('/admin/login'); }} className="admin-logout">
                    <FiLogOut />
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="admin-content">
                <header className="admin-header">
                    <h3>{menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}</h3>
                    <div className="admin-user">
                        <span>Admin User</span>
                    </div>
                </header>
                <div className="admin-page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
