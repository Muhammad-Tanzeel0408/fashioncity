import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/api';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    const fetchProducts = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                adminService.getProducts(),
                adminService.getCategories()
            ]);
            setProducts(productsRes.data.products || productsRes.data || []);
            setCategories(categoriesRes.data || []);
        } catch (error) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await adminService.deleteProduct(id);
                toast.success('Product deleted');
                fetchProducts();
            } catch (error) {
                toast.error('Failed to delete product');
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 className="font-bold text-xl">Products Management</h2>
                <Link to="/admin/products/new" className="btn btn-primary" style={{ gap: '10px' }}>
                    <FiPlus /> Add Product
                </Link>
            </div>

            <div className="admin-card">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td>
                                        <img
                                            src={product.images?.[0] || 'https://placehold.co/40'}
                                            alt={product.name}
                                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>
                                        {product.category_ids && product.category_ids.length > 0
                                            ? product.category_ids.map(id => {
                                                const cat = categories.find(c => c.id === id);
                                                return cat ? cat.name : '';
                                            }).filter(Boolean).join(', ')
                                            : product.categories?.name || 'Uncategorized'}
                                    </td>
                                    <td>Rs. {(product.price || 0).toLocaleString()}</td>
                                    <td>{product.stock}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <Link to={`/admin/products/edit/${product.id}`} className="text-blue-500">
                                                <FiEdit2 />
                                            </Link>
                                            <button onClick={() => handleDelete(product.id)} className="text-red-500" style={{ color: '#ef4444' }}>
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

export default ProductList;
