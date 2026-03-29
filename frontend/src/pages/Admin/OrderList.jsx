import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { FiEye, FiTrash2, FiPrinter } from 'react-icons/fi';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [slipData, setSlipData] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [timeFilter, setTimeFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [seenOrderIds, setSeenOrderIds] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('seenOrderIds') || '[]');
        } catch { return []; }
    });

    const fetchOrders = async () => {
        try {
            const { data } = await adminService.getOrders();
            setOrders(data.orders || data || []);
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    // Mark all current orders as seen when leaving the page
    useEffect(() => {
        fetchOrders();
    }, []);

    // Save seen order IDs and mark all as seen on unmount
    useEffect(() => {
        return () => {
            if (orders.length > 0) {
                const allIds = orders.map(o => o.id);
                const merged = [...new Set([...seenOrderIds, ...allIds])];
                localStorage.setItem('seenOrderIds', JSON.stringify(merged));
            }
        };
    }, [orders, seenOrderIds]);

    const isNewOrder = (orderId) => !seenOrderIds.includes(orderId);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await adminService.updateOrderStatus(id, newStatus);
            toast.success('Order status updated');
            fetchOrders();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDeleteOrder = async (id, orderNumber) => {
        if (window.confirm(`Are you sure you want to delete order #${orderNumber}? This action cannot be undone.`)) {
            try {
                await adminService.deleteOrder(id);
                toast.success('Order deleted successfully');
                setSelectedOrder(null);
                fetchOrders();
            } catch (error) {
                toast.error('Failed to delete order');
            }
        }
    };

    const handlePrintSlip = (order) => {
        const customerName = order.guest_name || order.user?.name || 'N/A';
        const totalQty = order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        const codAmount = order.total_amount || order.total || 0;
        const description = order.order_items?.map(item => {
            const parts = [`${item.quantity} x ${item.product_name}`];
            if (item.color) parts.push(item.color);
            if (item.size) parts.push(item.size);
            return parts.join(' ');
        }).join(', ') || '';

        setSlipData({
            orderNumber: order.order_number,
            customerName,
            address: order.shipping_address || '',
            phone: order.phone || '',
            city: order.city || '',
            country: 'Pakistan',
            weight: '1KG',
            service: 'COD',
            packs: '1',
            qty: String(totalQty),
            codAmount: String(codAmount),
            description,
            shipperAddress: 'Near hamdard chowk sector A 2 Township, Lahore',
            shipperPhone: '03295877778',
            brandName: 'FASHION CITY',
            brandTagline: 'CLOTHING BRAND',
        });
    };

    const handleSlipChange = (field, value) => {
        setSlipData(prev => ({ ...prev, [field]: value }));
    };

    const handleConfirmPrint = () => {
        if (!slipData) return;
        const d = slipData;
        const printWindow = window.open('', '_blank', 'width=900,height=600');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Shipping Slip - ${d.orderNumber}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .shipping-slip { border: 2px solid #1a365d; max-width: 750px; margin: 0 auto; background: #fff; }
                    .slip-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 2px solid #1a365d; }
                    .slip-brand h1 { font-size: 28px; font-weight: 900; color: #1a365d; letter-spacing: 3px; margin: 0; }
                    .slip-brand span { font-size: 11px; color: #1a365d; letter-spacing: 2px; display: block; margin-top: -2px; }
                    .slip-order-barcode { text-align: right; }
                    .slip-order-label { font-size: 12px; color: #444; }
                    .slip-order-number { font-size: 16px; font-weight: 700; color: #1a365d; margin-top: 2px; letter-spacing: 1px; }
                    .slip-body { display: flex; border-bottom: 2px solid #1a365d; }
                    .slip-left { flex: 1; border-right: 2px solid #1a365d; }
                    .slip-right { flex: 1; }
                    .slip-address-table { width: 100%; border-collapse: collapse; }
                    .slip-address-table th { background: #e2e8f0; color: #1a365d; font-size: 14px; font-weight: 700; padding: 8px 12px; text-align: center; border-bottom: 1px solid #1a365d; }
                    .slip-address-table td { padding: 6px 12px; font-size: 13px; border-bottom: 1px solid #cbd5e0; color: #222; }
                    .slip-address-table td.slip-name { font-weight: 700; font-size: 14px; }
                    .slip-info-table { width: 100%; border-collapse: collapse; }
                    .slip-info-table td { padding: 6px 12px; font-size: 13px; border-bottom: 1px solid #cbd5e0; }
                    .slip-info-table .lbl { font-weight: 600; color: #555; font-size: 12px; background: #f7fafc; }
                    .slip-info-table .val { font-weight: 700; color: #1a365d; font-size: 14px; }
                    .slip-cod { font-size: 18px !important; }
                    .slip-footer { display: flex; justify-content: space-between; padding: 10px 16px; border-bottom: 1px solid #cbd5e0; font-size: 12px; color: #333; }
                    .slip-description { padding: 10px 16px; font-size: 12px; color: #333; }
                    @media print { body { padding: 0; } .shipping-slip { border: 2px solid #000; max-width: 100%; } }
                </style>
            </head>
            <body>
                <div class="shipping-slip">
                    <div class="slip-header">
                        <div class="slip-brand"><h1>${d.brandName}</h1><span>${d.brandTagline}</span></div>
                        <div class="slip-order-barcode"><div class="slip-order-label">Order Number:</div><div class="slip-order-number">${d.orderNumber}</div></div>
                    </div>
                    <div class="slip-body">
                        <div class="slip-left">
                            <table class="slip-address-table">
                                <thead><tr><th colspan="2">Shipping Address</th></tr></thead>
                                <tbody>
                                    <tr><td colspan="2" class="slip-name">${d.customerName}</td></tr>
                                    <tr><td colspan="2">${d.address}</td></tr>
                                    <tr><td colspan="2">${d.phone}</td></tr>
                                    <tr><td colspan="2">${d.country}</td></tr>
                                    <tr><td colspan="2">${d.city}</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="slip-right">
                            <table class="slip-info-table">
                                <tbody>
                                    <tr><td class="lbl">Order</td><td class="lbl">Weight</td></tr>
                                    <tr><td class="val">${d.orderNumber}</td><td class="val">${d.weight}</td></tr>
                                    <tr><td class="lbl">Service</td><td class="lbl">Date</td></tr>
                                    <tr><td class="val">${d.service}</td><td class="val">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</td></tr>
                                    <tr><td class="lbl">Packs / Qty</td><td class="lbl">COD Amount</td></tr>
                                    <tr><td class="val">${d.packs} / ${d.qty}</td><td class="val slip-cod">Rs${Number(d.codAmount).toLocaleString()}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="slip-footer">
                        <div><strong>Shipper Address:</strong> ${d.shipperAddress}</div>
                        <div><strong>Contact Us at</strong> (${d.shipperPhone})</div>
                    </div>
                    <div class="slip-description"><strong>Description:</strong> ${d.description}</div>
                </div>
                <script>window.onload = function() { window.print(); window.onafterprint = function() { window.close(); }; }<\/script>
            </body>
            </html>
        `);
        printWindow.document.close();
        setSlipData(null);
    };

    const StatusBadge = ({ status }) => {
        let className = 'status-badge ';
        switch (status.toLowerCase()) {
            case 'pending': className += 'status-pending'; break;
            case 'delivered': className += 'status-delivered'; break;
            case 'cancelled': className += 'status-cancelled'; break;
            default: className += 'bg-gray-100 text-gray-800';
        }
        return <span className={className}>{status}</span>;
    };

    // Filtering logic
    const filteredOrders = orders.filter(order => {
        // Status filter
        if (statusFilter !== 'all' && order.status !== statusFilter) return false;

        // Time filter
        if (timeFilter !== 'all') {
            const orderDate = new Date(order.created_at);
            const now = new Date();
            if (timeFilter === 'today') {
                const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                if (orderDate < startOfDay) return false;
            } else if (timeFilter === 'week') {
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                startOfWeek.setHours(0, 0, 0, 0);
                if (orderDate < startOfWeek) return false;
            } else if (timeFilter === 'month') {
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                if (orderDate < startOfMonth) return false;
            }
        }

        // Search query (order number, customer name, phone, city)
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const name = (order.guest_name || order.user?.name || '').toLowerCase();
            const orderNum = (order.order_number || '').toLowerCase();
            const phone = (order.phone || '').toLowerCase();
            const city = (order.city || '').toLowerCase();
            if (!name.includes(q) && !orderNum.includes(q) && !phone.includes(q) && !city.includes(q)) return false;
        }

        return true;
    });

    return (
        <div>
            <h2 className="font-bold text-xl mb-6">Order Management</h2>

            {/* Filter Bar */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="Search by order #, name, phone, city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ flex: '1 1 240px', padding: '9px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '13px', outline: 'none', minWidth: '200px' }}
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ padding: '9px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '13px', background: '#fff', cursor: 'pointer', minWidth: '140px' }}
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    style={{ padding: '9px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '13px', background: '#fff', cursor: 'pointer', minWidth: '140px' }}
                >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                </select>
                <span style={{ fontSize: '13px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                    {filteredOrders.length} of {orders.length} orders
                </span>
            </div>

            <div className="admin-card">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'center' }}>View</th>
                                <th style={{ textAlign: 'center' }}>Print</th>
                                <th style={{ textAlign: 'center' }}>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order.id} style={isNewOrder(order.id) ? { backgroundColor: '#fef3c7' } : {}}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {order.order_number}
                                            {isNewOrder(order.id) && (
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
                                    <td>
                                        <div className="font-bold">{order.guest_name || order.user?.name}</div>
                                        <div className="text-xs text-gray-400">{order.guest_email || order.user?.email}</div>
                                    </td>
                                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td>Rs. {(order.total_amount || order.total || 0).toLocaleString()}</td>
                                    <td>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className="text-sm border rounded p-1"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                                            style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                                            title="View details"
                                        >
                                            <FiEye size={15} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                                            View
                                        </button>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            onClick={() => handlePrintSlip(order)}
                                            style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                                            title="Print shipping slip"
                                        >
                                            <FiPrinter size={15} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                                            Print
                                        </button>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleDeleteOrder(order.id, order.order_number)}
                                            style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                                            title="Delete order"
                                        >
                                            <FiTrash2 size={15} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Order Details Pane */}
            {selectedOrder && (
                <div className="admin-card" style={{ marginTop: '24px', borderTop: '4px solid #3b82f6' }}>
                    {/* Header row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontWeight: 700, fontSize: '18px', margin: 0 }}>
                            Order Details: <span style={{ color: '#2563eb' }}>#{selectedOrder.order_number}</span>
                        </h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => handlePrintSlip(selectedOrder)}
                                style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '6px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}
                            >
                                <FiPrinter size={15} /> Print Slip
                            </button>
                            <button
                                onClick={() => handleDeleteOrder(selectedOrder.id, selectedOrder.order_number)}
                                style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', padding: '6px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}
                            >
                                <FiTrash2 size={15} /> Delete
                            </button>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                style={{ background: '#f3f4f6', color: '#6b7280', border: '1px solid #d1d5db', borderRadius: '6px', padding: '6px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                            >
                                Close
                            </button>
                        </div>
                    </div>

                    {/* Order info table */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc' }}>
                                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Customer</th>
                                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Phone</th>
                                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Shipping Address</th>
                                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>City</th>
                                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Date</th>
                                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                                <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 600, borderBottom: '1px solid #f3f4f6' }}>
                                    {selectedOrder.guest_name || selectedOrder.user?.name || 'N/A'}
                                    {(selectedOrder.guest_email || selectedOrder.user?.email) && (
                                        <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 400, marginTop: '2px' }}>{selectedOrder.guest_email || selectedOrder.user?.email}</div>
                                    )}
                                </td>
                                <td style={{ padding: '12px 16px', fontSize: '14px', borderBottom: '1px solid #f3f4f6' }}>{selectedOrder.phone}</td>
                                <td style={{ padding: '12px 16px', fontSize: '14px', borderBottom: '1px solid #f3f4f6', maxWidth: '200px' }}>{selectedOrder.shipping_address}</td>
                                <td style={{ padding: '12px 16px', fontSize: '14px', borderBottom: '1px solid #f3f4f6' }}>{selectedOrder.city}</td>
                                <td style={{ padding: '12px 16px', fontSize: '14px', borderBottom: '1px solid #f3f4f6', whiteSpace: 'nowrap' }}>{new Date(selectedOrder.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}<br /><span style={{ fontSize: '12px', color: '#9ca3af' }}>{new Date(selectedOrder.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span></td>
                                <td style={{ padding: '12px 16px', fontSize: '14px', borderBottom: '1px solid #f3f4f6' }}><StatusBadge status={selectedOrder.status} /></td>
                                <td style={{ padding: '12px 16px', fontSize: '16px', fontWeight: 700, color: '#1a365d', borderBottom: '1px solid #f3f4f6', textAlign: 'right', whiteSpace: 'nowrap' }}>Rs. {(selectedOrder.total_amount || selectedOrder.total || 0).toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Order items table */}
                    <h4 style={{ fontWeight: 600, fontSize: '15px', marginBottom: '12px', color: '#374151' }}>Order Items</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc' }}>
                                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>#</th>
                                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Product</th>
                                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Size</th>
                                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Color</th>
                                <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Price</th>
                                <th style={{ padding: '10px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Qty</th>
                                <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedOrder.order_items?.map((item, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '10px 16px', fontSize: '13px', color: '#9ca3af' }}>{idx + 1}</td>
                                    <td style={{ padding: '10px 16px', fontSize: '14px', fontWeight: 500 }}>{item.product_name}</td>
                                    <td style={{ padding: '10px 16px', fontSize: '14px' }}>{item.size || '—'}</td>
                                    <td style={{ padding: '10px 16px', fontSize: '14px' }}>{item.color || '—'}</td>
                                    <td style={{ padding: '10px 16px', fontSize: '14px', textAlign: 'right' }}>Rs. {item.price.toLocaleString()}</td>
                                    <td style={{ padding: '10px 16px', fontSize: '14px', textAlign: 'center', fontWeight: 600 }}>{item.quantity}</td>
                                    <td style={{ padding: '10px 16px', fontSize: '14px', textAlign: 'right', fontWeight: 600 }}>Rs. {(item.price * item.quantity).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr style={{ backgroundColor: '#f8fafc' }}>
                                <td colSpan="5"></td>
                                <td style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 700, textAlign: 'center', borderTop: '2px solid #e5e7eb' }}>Total:</td>
                                <td style={{ padding: '10px 16px', fontSize: '16px', fontWeight: 700, textAlign: 'right', color: '#1a365d', borderTop: '2px solid #e5e7eb' }}>Rs. {(selectedOrder.total_amount || selectedOrder.total || 0).toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>

                    {/* Notes */}
                    {selectedOrder.notes && (
                        <div style={{ marginTop: '16px', padding: '12px 16px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', fontSize: '13px', color: '#92400e' }}>
                            <strong>Notes:</strong> {selectedOrder.notes}
                        </div>
                    )}
                </div>
            )}

            {/* Editable Slip Modal */}
            {slipData && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setSlipData(null)}>
                    <div style={{ background: '#fff', borderRadius: '12px', width: '720px', maxHeight: '90vh', overflowY: 'auto', padding: '28px 32px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1a365d' }}>Edit Shipping Slip</h3>
                            <button onClick={() => setSlipData(null)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#6b7280', lineHeight: 1 }}>&times;</button>
                        </div>

                        {/* Brand & Order Info */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                            <SlipField label="Brand Name" field="brandName" value={slipData.brandName} onChange={handleSlipChange} />
                            <SlipField label="Brand Tagline" field="brandTagline" value={slipData.brandTagline} onChange={handleSlipChange} />
                            <SlipField label="Order Number" field="orderNumber" value={slipData.orderNumber} onChange={handleSlipChange} />
                        </div>

                        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', marginBottom: '16px' }}>
                            <p style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: '10px' }}>Customer Details</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <SlipField label="Customer Name" field="customerName" value={slipData.customerName} onChange={handleSlipChange} />
                                <SlipField label="Phone" field="phone" value={slipData.phone} onChange={handleSlipChange} />
                                <SlipField label="Address" field="address" value={slipData.address} onChange={handleSlipChange} fullWidth />
                                <SlipField label="City" field="city" value={slipData.city} onChange={handleSlipChange} />
                                <SlipField label="Country" field="country" value={slipData.country} onChange={handleSlipChange} />
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', marginBottom: '16px' }}>
                            <p style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: '10px' }}>Shipment Details</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                                <SlipField label="Weight" field="weight" value={slipData.weight} onChange={handleSlipChange} />
                                <SlipField label="Service" field="service" value={slipData.service} onChange={handleSlipChange} />
                                <SlipField label="Packs" field="packs" value={slipData.packs} onChange={handleSlipChange} />
                                <SlipField label="Qty" field="qty" value={slipData.qty} onChange={handleSlipChange} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                                <SlipField label="COD Amount (Rs)" field="codAmount" value={slipData.codAmount} onChange={handleSlipChange} />
                                <SlipField label="Description" field="description" value={slipData.description} onChange={handleSlipChange} />
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', marginBottom: '20px' }}>
                            <p style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: '10px' }}>Shipper Details</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                                <SlipField label="Shipper Address" field="shipperAddress" value={slipData.shipperAddress} onChange={handleSlipChange} />
                                <SlipField label="Shipper Phone" field="shipperPhone" value={slipData.shipperPhone} onChange={handleSlipChange} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button onClick={() => setSlipData(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', color: '#374151', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleConfirmPrint} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: '#1a365d', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><FiPrinter size={16} /> Print Slip</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* Small reusable input field for the slip editor */
const SlipField = ({ label, field, value, onChange, fullWidth }) => (
    <div style={fullWidth ? { gridColumn: '1 / -1' } : {}}>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase' }}>{label}</label>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px', color: '#1a365d', fontWeight: 500, outline: 'none', transition: 'border 0.2s' }}
            onFocus={(e) => e.target.style.borderColor = '#1a365d'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
        />
    </div>
);

export default OrderList;
