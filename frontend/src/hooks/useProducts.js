import { useState, useEffect } from 'react';
import { productService } from '../services/api';
import { toast } from 'react-hot-toast';

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async (params = {}) => {
        try {
            setLoading(true);
            const { data } = await productService.getAll(params);
            setProducts(data.products || []);
            return data;
        } catch (err) {
            setError(err.message);
            setProducts([]);
            // Silently handle errors - empty results are common for category/search filters
        } finally {
            setLoading(false);
        }
    };

    const fetchFeatured = async () => {
        try {
            setLoading(true);
            const { data } = await productService.getFeatured();
            setFeaturedProducts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        products,
        featuredProducts,
        loading,
        error,
        fetchProducts,
        fetchFeatured
    };
};

export const useProduct = (slug) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await productService.getBySlug(slug);
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchProduct();
    }, [slug]);

    return { product, loading, error };
};
