import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import './Category.css';

const Category = () => {
    const { category } = useParams();
    const [searchParams] = useSearchParams();
    const typeFilter = searchParams.get('type');

    const { products, fetchProducts, loading } = useProducts();

    // Format category name for display
    const isAll = category === 'all';
    const title = isAll ? 'All Products' : category.charAt(0).toUpperCase() + category.slice(1);

    useEffect(() => {
        // Fetch all products or filtered by category
        if (isAll) {
            fetchProducts({ limit: 100 });
        } else {
            fetchProducts({ category });
        }
    }, [category]);

    return (
        <div className="category-page container">
            <div className="category-header text-center">
                <h1 className="category-title">{title}{!isAll && ' Collection'}</h1>
                <p className="category-desc">{isAll ? 'Browse our complete collection' : `Explore our latest arrivals in ${title}`}</p>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading collections...</div>
            ) : products.length === 0 ? (
                <div className="text-center py-20">
                    <h3 className="text-xl font-bold text-gray-400 mb-2">Coming Soon</h3>
                    <p className="text-gray-500">We are updating our {title} collection. Check back later!</p>
                </div>
            ) : (
                <div className="products-grid grid-cols-4">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Category;
