import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiCheck } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image_url: '',
        display_order: 0
    });

    const fetchCategories = async () => {
        try {
            const { data } = await adminService.getCategories();
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const resetForm = () => {
        setFormData({ name: '', description: '', image_url: '', display_order: 0 });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (cat) => {
        setFormData({
            name: cat.name || '',
            description: cat.description || '',
            image_url: cat.image_url || '',
            display_order: cat.display_order || 0
        });
        setEditingId(cat.id);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await adminService.updateCategory(editingId, formData);
                toast.success('Category updated');
            } else {
                await adminService.createCategory(formData);
                toast.success('Category created');
            }
            resetForm();
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save category');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await adminService.deleteCategory(id);
                toast.success('Category deleted');
                fetchCategories();
            } catch (error) {
                toast.error('Failed to delete category');
            }
        }
    };

    const handleChange = (e) => {
        const value = e.target.name === 'display_order' ? parseInt(e.target.value) || 0 : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="font-bold" style={{ fontSize: '20px' }}>Categories Management</h2>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <FiPlus /> Add Category
                </button>
            </div>

            {/* Add / Edit Form */}
            {showForm && (
                <div className="admin-card" style={{ marginBottom: '24px', borderLeft: '4px solid var(--accent, #c9a227)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 className="font-bold" style={{ fontSize: '16px' }}>
                            {editingId ? 'Edit Category' : 'New Category'}
                        </h3>
                        <button onClick={resetForm} style={{ color: '#6b7280', cursor: 'pointer', border: 'none', background: 'none' }}>
                            <FiX size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="form-group">
                                <label className="form-label">Name *</label>
                                <input
                                    className="form-input"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Men, Women, Kids"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Display Order</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    name="display_order"
                                    value={formData.display_order}
                                    onChange={handleChange}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-input"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="2"
                                placeholder="Brief description of the category"
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Image URL (optional)</label>
                            <input
                                className="form-input"
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <FiCheck /> {editingId ? 'Update' : 'Create'}
                            </button>
                            <button type="button" onClick={resetForm} className="btn btn-outline">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Categories Table */}
            <div className="admin-card">
                {loading ? (
                    <p>Loading...</p>
                ) : categories.length === 0 ? (
                    <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px 0' }}>
                        No categories found. Click "Add Category" to create one.
                    </p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Name</th>
                                <th>Slug</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(cat => (
                                <tr key={cat.id}>
                                    <td>{cat.display_order ?? '-'}</td>
                                    <td style={{ fontWeight: 600 }}>{cat.name}</td>
                                    <td>
                                        <span style={{
                                            backgroundColor: '#f3f4f6',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            fontSize: '13px',
                                            color: '#6b7280'
                                        }}>
                                            {cat.slug}
                                        </span>
                                    </td>
                                    <td style={{ color: '#6b7280', fontSize: '14px', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {cat.description || '—'}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={() => handleEdit(cat)}
                                                style={{ color: '#3b82f6', cursor: 'pointer', border: 'none', background: 'none' }}
                                                title="Edit"
                                            >
                                                <FiEdit2 />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                style={{ color: '#ef4444', cursor: 'pointer', border: 'none', background: 'none' }}
                                                title="Delete"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
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

export default CategoryList;
