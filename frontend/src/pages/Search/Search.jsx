import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import { productService } from '../../services/api';
import '../Category/Category.css'; // Reuse Category styles

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (query && query.trim()) {
            setLoading(true);
            productService.searchFull({ q: query.trim() })
                .then(({ data }) => {
                    setProducts(data.products || []);
                    setTotal(data.total || 0);
                })
                .catch(() => {
                    setProducts([]);
                    setTotal(0);
                })
                .finally(() => setLoading(false));
        } else {
            setProducts([]);
            setTotal(0);
        }
    }, [query]);

    return (
        <div className="category-page container">
            <div className="category-header text-center">
                <h1 className="category-title">Search Results</h1>
                <p className="category-desc">
                    {query
                        ? loading
                            ? 'Searching...'
                            : `${total} result${total !== 1 ? 's' : ''} for "${query}"`
                        : 'Enter a search term'}
                </p>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Searching...</div>
            ) : products.length === 0 && query ? (
                <div className="text-center py-20">
                    <h3 className="text-xl font-bold text-gray-400 mb-2">No Results Found</h3>
                    <p className="text-gray-500">
                        We couldn't find any products matching "{query}". Try a different keyword or check the spelling.
                    </p>
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

export default Search;
