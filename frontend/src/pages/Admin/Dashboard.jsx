import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import { Link } from 'react-router-dom';
import { FiLayers, FiShoppingBag, FiDollarSign, FiBox, FiTrendingUp, FiSun } from 'react-icons/fi';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        totalCategories: 0,
        todayEarnings: 0,
        todayOrders: 0,
        monthlyRevenue: []
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await adminService.getStats();
                setStats({
                    totalOrders: data.orders?.totalOrders || 0,
                    totalRevenue: data.orders?.totalRevenue || 0,
                    totalProducts: data.totalProducts || 0,
                    totalCategories: data.totalCategories || 0,
                    todayEarnings: data.orders?.todayEarnings || 0,
                    todayOrders: data.orders?.todayOrders || 0,
                    monthlyRevenue: data.orders?.monthlyRevenue || []
                });
            } catch (error) {
                console.error('Failed to load stats', error);
            } finally {
                setLoading(false);
            }
        };
        const fetchRecentOrders = async () => {
            try {
                const { data } = await adminService.getOrders();
                const orders = data.orders || data || [];
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const todayOrders = orders.filter(order => new Date(order.created_at) >= today);
                setRecentOrders(todayOrders);
            } catch (error) {
                console.error('Failed to load recent orders', error);
            }
        };
        fetchStats();
        fetchRecentOrders();
    }, []);

    const maxMonthlyRevenue = Math.max(...stats.monthlyRevenue.map(m => m.revenue), 1);

    const StatCard = ({ icon, title, value, color, subtitle }) => (
        <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: color + '20',
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                flexShrink: 0
            }}>
                {icon}
            </div>
            <div>
                <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '2px' }}>{title}</p>
                <h3 style={{ fontSize: '22px', fontWeight: 700, margin: 0, color: '#1a365d' }}>{value}</h3>
                {subtitle && <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{subtitle}</p>}
            </div>
        </div>
    );

    return (
        <div>
            <h2 className="mb-6 font-bold text-xl">Dashboard Overview</h2>

            {/* Top stat cards - 5 columns now */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <StatCard
                    icon={<FiSun />}
                    title="Today's Earnings"
                    value={`Rs. ${stats.todayEarnings.toLocaleString()}`}
                    color="#ef4444"
                    subtitle={`${stats.todayOrders} order${stats.todayOrders !== 1 ? 's' : ''} today`}
                />
                <StatCard
                    icon={<FiDollarSign />}
                    title="Total Revenue"
                    value={`Rs. ${stats.totalRevenue.toLocaleString()}`}
                    color="#10b981"
                />
                <StatCard
                    icon={<FiShoppingBag />}
                    title="Total Orders"
                    value={stats.totalOrders}
                    color="#3b82f6"
                />
                <StatCard
                    icon={<FiBox />}
                    title="Total Products"
                    value={stats.totalProducts}
                    color="#f59e0b"
                />
                <StatCard
                    icon={<FiLayers />}
                    title="Total Categories"
                    value={stats.totalCategories}
                    color="#8b5cf6"
                />
            </div>

            {/* Monthly Revenue Progress */}
            <div className="admin-card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#1a365d', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiTrendingUp /> Monthly Revenue ({new Date().getFullYear()})
                    </h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px', padding: '0 4px' }}>
                    {stats.monthlyRevenue.map((m, idx) => {
                        const heightPct = maxMonthlyRevenue > 0 ? (m.revenue / maxMonthlyRevenue) * 100 : 0;
                        const isCurrentMonth = idx === new Date().getMonth();
                        return (
                            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                                {m.revenue > 0 && (
                                    <span style={{ fontSize: '10px', fontWeight: 600, color: '#6b7280', marginBottom: '4px', whiteSpace: 'nowrap' }}>
                                        {m.revenue >= 1000 ? `${(m.revenue / 1000).toFixed(m.revenue >= 10000 ? 0 : 1)}k` : m.revenue}
                                    </span>
                                )}
                                <div
                                    style={{
                                        width: '100%',
                                        maxWidth: '48px',
                                        height: `${Math.max(heightPct, m.revenue > 0 ? 4 : 1)}%`,
                                        backgroundColor: isCurrentMonth ? '#1a365d' : '#3b82f6',
                                        borderRadius: '4px 4px 0 0',
                                        transition: 'height 0.5s ease',
                                        opacity: m.revenue > 0 ? 1 : 0.2,
                                        position: 'relative'
                                    }}
                                    title={`${m.month}: Rs. ${m.revenue.toLocaleString()} (${m.orders} orders)`}
                                />
                                <span style={{ fontSize: '11px', color: isCurrentMonth ? '#1a365d' : '#9ca3af', fontWeight: isCurrentMonth ? 700 : 400, marginTop: '6px' }}>{m.month}</span>
                            </div>
                        );
                    })}
                </div>
                {/* Monthly summary row */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
                    {stats.monthlyRevenue.filter(m => m.revenue > 0).length > 0 ? (
                        stats.monthlyRevenue.filter(m => m.revenue > 0).map((m, idx) => (
                            <div key={idx} style={{ flex: 1, textAlign: 'center', fontSize: '11px', color: '#6b7280' }}>
                                <strong>{m.month}:</strong> Rs. {m.revenue.toLocaleString()} ({m.orders})
                            </div>
                        ))
                    ) : (
                        <p style={{ color: '#9ca3af', fontSize: '13px', width: '100%', textAlign: 'center' }}>No revenue data yet</p>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                <div className="admin-card">
                    <h3 className="font-bold mb-4">Today's Orders</h3>
                    {recentOrders.length === 0 ? (
                        <p className="text-gray-500 text-sm">No orders yet.</p>
                    ) : (
                        <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                                    <th style={{ padding: '8px 4px' }}>Order #</th>
                                    <th style={{ padding: '8px 4px' }}>Customer</th>
                                    <th style={{ padding: '8px 4px' }}>Total</th>
                                    <th style={{ padding: '8px 4px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(order => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid #f3f3f3' }}>
                                        <td style={{ padding: '8px 4px', fontWeight: 500 }}>{order.order_number}</td>
                                        <td style={{ padding: '8px 4px' }}>{order.guest_name || order.user?.name || '—'}</td>
                                        <td style={{ padding: '8px 4px' }}>Rs. {(order.total_amount || order.total || 0).toLocaleString()}</td>
                                        <td style={{ padding: '8px 4px' }}>
                                            <span style={{
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                backgroundColor: order.status === 'delivered' ? '#d1fae5' :
                                                    order.status === 'cancelled' ? '#fee2e2' :
                                                    order.status === 'pending' ? '#fef3c7' : '#e0e7ff',
                                                color: order.status === 'delivered' ? '#065f46' :
                                                    order.status === 'cancelled' ? '#991b1b' :
                                                    order.status === 'pending' ? '#92400e' : '#3730a3'
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className="admin-card">
                    <h3 className="font-bold mb-4">Low Stock Alert</h3>
                    <p className="text-gray-500 text-sm">No products low on stock.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
