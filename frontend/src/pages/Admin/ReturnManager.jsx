import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { FiTrash2, FiEye, FiX } from 'react-icons/fi';

const statusColors = {
    pending: { bg: '#fef3c7', color: '#92400e' },
    approved: { bg: '#d1fae5', color: '#065f46' },
    rejected: { bg: '#fee2e2', color: '#991b1b' },
    picked_up: { bg: '#dbeafe', color: '#1e40af' },
    refunded: { bg: '#ede9fe', color: '#5b21b6' },
};

const reasonLabels = {
    defective: 'Defective Product',
    wrong_item: 'Wrong Item',
    not_as_described: 'Not as Described',
    size_issue: 'Size Issue',
    changed_mind: 'Changed Mind',
    other: 'Other',
};

const ReturnManager = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReturn, setSelectedReturn] = useState(null);
    const [seenReturnIds, setSeenReturnIds] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('seenReturnIds') || '[]');
        } catch { return []; }
    });

    const fetchReturns = async () => {
        try {
            const { data } = await adminService.getReturns();
            setReturns(data || []);
        } catch (error) {
            toast.error('Failed to load returns');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReturns();
    }, []);

    // Mark all as seen on unmount
    useEffect(() => {
        return () => {
            if (returns.length > 0) {
                const allIds = returns.map(r => r.id);
                const merged = [...new Set([...seenReturnIds, ...allIds])];
                localStorage.setItem('seenReturnIds', JSON.stringify(merged));
            }
        };
    }, [returns, seenReturnIds]);

    const isNewReturn = (id) => !seenReturnIds.includes(id);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await adminService.updateReturnStatus(id, newStatus);
            toast.success('Return status updated');
            fetchReturns();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this return request?')) {
            try {
                await adminService.deleteReturn(id);
                toast.success('Return request deleted');
                setSelectedReturn(null);
                fetchReturns();
            } catch (error) {
                toast.error('Failed to delete return');
            }
        }
    };

    const StatusBadge = ({ status }) => {
        const style = statusColors[status] || { bg: '#f3f4f6', color: '#374151' };
        return (
            <span style={{
                backgroundColor: style.bg,
                color: style.color,
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'capitalize'
            }}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    return (
        <div>
            <h2 className="font-bold text-xl mb-6">Returns & Exchange</h2>

            <div className="admin-card">
                {loading ? (
                    <p>Loading...</p>
                ) : returns.length === 0 ? (
                    <p style={{ padding: '20px', color: '#999', textAlign: 'center' }}>No return requests yet</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Product</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {returns.map(ret => (
                                <tr key={ret.id} style={isNewReturn(ret.id) ? { backgroundColor: '#fef3c7' } : {}}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div>
                                                <div className="font-bold">{ret.customer_name}</div>
                                                <div className="text-xs text-gray-400">{ret.customer_phone}</div>
                                            </div>
                                            {isNewReturn(ret.id) && (
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
                                        <div>{ret.product_name}</div>
                                        {(ret.size || ret.color) && (
                                            <div className="text-xs text-gray-400">
                                                {ret.size && `Size: ${ret.size}`}{ret.size && ret.color && ' | '}{ret.color && `Color: ${ret.color}`}
                                            </div>
                                        )}
                                    </td>
                                    <td>{reasonLabels[ret.reason] || ret.reason}</td>
                                    <td>
                                        <select
                                            value={ret.status}
                                            onChange={(e) => handleStatusChange(ret.id, e.target.value)}
                                            style={{
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                border: '1px solid #ddd',
                                                fontSize: '13px',
                                                backgroundColor: statusColors[ret.status]?.bg || '#f9f9f9',
                                                color: statusColors[ret.status]?.color || '#333',
                                                fontWeight: '600',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="picked_up">Picked Up</option>
                                            <option value="refunded">Refunded</option>
                                        </select>
                                    </td>
                                    <td style={{ whiteSpace: 'nowrap' }}>
                                        {new Date(ret.created_at).toLocaleDateString('en-PK', {
                                            day: '2-digit', month: 'short', year: 'numeric'
                                        })}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button
                                                onClick={() => setSelectedReturn(ret)}
                                                className="admin-btn"
                                                title="View details"
                                            >
                                                <FiEye size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(ret.id)}
                                                className="admin-btn admin-btn-danger"
                                                title="Delete"
                                            >
                                                <FiTrash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Detail Modal */}
            {selectedReturn && (
                <div className="order-modal-overlay" onClick={() => setSelectedReturn(null)}>
                    <div className="order-modal" onClick={e => e.stopPropagation()}>
                        <div className="order-modal-header">
                            <h3>Return Request Details</h3>
                            <button onClick={() => setSelectedReturn(null)} className="order-modal-close">
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="order-modal-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <p style={{ fontSize: '12px', color: '#999', fontWeight: '600' }}>Customer Name</p>
                                    <p style={{ fontWeight: '600' }}>{selectedReturn.customer_name}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '12px', color: '#999', fontWeight: '600' }}>Phone</p>
                                    <p>{selectedReturn.customer_phone}</p>
                                </div>
                                {selectedReturn.customer_email && (
                                    <div>
                                        <p style={{ fontSize: '12px', color: '#999', fontWeight: '600' }}>Email</p>
                                        <p>{selectedReturn.customer_email}</p>
                                    </div>
                                )}
                                <div>
                                    <p style={{ fontSize: '12px', color: '#999', fontWeight: '600' }}>Status</p>
                                    <StatusBadge status={selectedReturn.status} />
                                </div>
                            </div>
                            <hr style={{ margin: '16px 0', borderColor: '#eee' }} />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <p style={{ fontSize: '12px', color: '#999', fontWeight: '600' }}>Product</p>
                                    <p>{selectedReturn.product_name}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '12px', color: '#999', fontWeight: '600' }}>Quantity</p>
                                    <p>{selectedReturn.quantity}</p>
                                </div>
                                {selectedReturn.size && (
                                    <div>
                                        <p style={{ fontSize: '12px', color: '#999', fontWeight: '600' }}>Size</p>
                                        <p>{selectedReturn.size}</p>
                                    </div>
                                )}
                                {selectedReturn.color && (
                                    <div>
                                        <p style={{ fontSize: '12px', color: '#999', fontWeight: '600' }}>Color</p>
                                        <p>{selectedReturn.color}</p>
                                    </div>
                                )}
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <p style={{ fontSize: '12px', color: '#999', fontWeight: '600' }}>Reason</p>
                                <p>{reasonLabels[selectedReturn.reason] || selectedReturn.reason}</p>
                            </div>
                            {selectedReturn.description && (
                                <div>
                                    <p style={{ fontSize: '12px', color: '#999', fontWeight: '600' }}>Description</p>
                                    <p style={{ color: '#555', lineHeight: '1.6' }}>{selectedReturn.description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReturnManager;
