const { supabaseAdmin } = require('../config/supabase');

const ProductModel = {
    // Get all active products with optional filters
    async getAll({ category, featured, search, limit = 20, offset = 0, sort = 'created_at', order = 'desc' }) {
        let query = supabaseAdmin
            .from('products')
            .select('*, categories!left(name, slug)', { count: 'exact' })
            .eq('is_active', true);

        if (category) {
            const { data: cat } = await supabaseAdmin
                .from('categories')
                .select('id')
                .eq('slug', category)
                .maybeSingle();

            if (cat) {
                // Use contains operator to match products where category_ids array includes this category
                query = query.contains('category_ids', [cat.id]);
            } else {
                return { products: [], total: 0 };
            }
        }

        if (featured) query = query.eq('is_featured', true);
        if (search) {
            // Search by name or description using Supabase 'or' filter
            // PostgREST uses * as wildcard in .or() strings (not %)
            query = query.or(`name.ilike.*${search}*,description.ilike.*${search}*`);
        }

        query = query.order(sort, { ascending: order === 'asc' })
            .range(offset, offset + limit - 1);

        const { data, error, count } = await query;
        if (error) throw error;
        return { products: data, total: count };
    },

    // Search suggestions — returns matching products + categories
    async searchSuggestions(search, limit = 6) {
        const term = search.trim();
        if (!term) return { products: [], categories: [] };

        // Build search variants for fuzzy-ish matching
        const variants = [term];
        // common Pakistani / fashion typo tricks: remove double letters, swap similar chars
        const cleaned = term.replace(/(.)\1+/g, '$1'); // "dreess"->"dres"
        if (cleaned !== term) variants.push(cleaned);

        // Build OR filter for all variants across name + description
        // PostgREST uses * as wildcard in .or() strings (not %)
        const orParts = variants.flatMap(v => [
            `name.ilike.*${v}*`,
            `description.ilike.*${v}*`
        ]);

        const { data: products, error: pErr } = await supabaseAdmin
            .from('products')
            .select('id, name, slug, price, sale_price, images, categories!left(name, slug)')
            .eq('is_active', true)
            .or(orParts.join(','))
            .range(0, limit - 1);
        if (pErr) throw pErr;

        // Search categories by name (fuzzy)
        const catOrParts = variants.map(v => `name.ilike.*${v}*`);
        const { data: categories, error: cErr } = await supabaseAdmin
            .from('categories')
            .select('id, name, slug, image_url')
            .eq('is_active', true)
            .or(catOrParts.join(','))
            .range(0, 4);
        if (cErr) throw cErr;

        return { products: products || [], categories: categories || [] };
    },

    // Full search — products matching name, description, or belonging to matching categories
    async searchFull({ search, limit = 20, offset = 0, sort = 'created_at', order = 'desc' }) {
        const term = search.trim();
        if (!term) return { products: [], total: 0 };

        const variants = [term];
        const cleaned = term.replace(/(.)\1+/g, '$1');
        if (cleaned !== term) variants.push(cleaned);

        // Find categories matching the search term
        // PostgREST uses * as wildcard in .or() strings (not %)
        const catOrParts = variants.map(v => `name.ilike.*${v}*`);
        const { data: matchingCats } = await supabaseAdmin
            .from('categories')
            .select('id')
            .eq('is_active', true)
            .or(catOrParts.join(','));
        const matchingCatIds = (matchingCats || []).map(c => c.id);

        // Build product query — match name OR description
        let query = supabaseAdmin
            .from('products')
            .select('*, categories!left(name, slug)', { count: 'exact' })
            .eq('is_active', true);

        // Build OR filter: name, description, and if we found matching categories, include category_ids overlap
        const orParts = variants.flatMap(v => [
            `name.ilike.*${v}*`,
            `description.ilike.*${v}*`
        ]);
        if (matchingCatIds.length > 0) {
            // Also match products in matching categories
            orParts.push(...matchingCatIds.map(id => `category_ids.cs.{${id}}`));
        }
        query = query.or(orParts.join(','));

        query = query.order(sort, { ascending: order === 'asc' })
            .range(offset, offset + limit - 1);

        const { data, error, count } = await query;
        if (error) throw error;
        return { products: data || [], total: count };
    },

    // Get a single product by slug
    async getBySlug(slug) {
        const { data, error } = await supabaseAdmin
            .from('products')
            .select('*, categories!left(name, slug)')
            .eq('slug', slug)
            .eq('is_active', true)
            .single();
        if (error) throw error;
        return data;
    },

    // Get a single product by ID
    async getById(id) {
        const { data, error } = await supabaseAdmin
            .from('products')
            .select('*, categories!left(name, slug)')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    // Create a new product (admin)
    async create(productData) {
        const slug = productData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        // Set category_id to first element for FK relation (used for primary category display)
        const category_id = productData.category_ids && productData.category_ids.length > 0
            ? productData.category_ids[0]
            : productData.category_id || null;

        const { data, error } = await supabaseAdmin
            .from('products')
            .insert({
                ...productData,
                slug,
                category_id,
                category_ids: productData.category_ids || (category_id ? [category_id] : [])
            })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // Update a product (admin)
    async update(id, productData) {
        if (productData.name) {
            productData.slug = productData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        // If category_ids is provided, also update category_id FK
        if (productData.category_ids && productData.category_ids.length > 0) {
            productData.category_id = productData.category_ids[0];
        }

        const { data, error } = await supabaseAdmin
            .from('products')
            .update(productData)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // Direct stock update (used for order stock sync)
    async updateStock(id, newStock) {
        const { data, error } = await supabaseAdmin
            .from('products')
            .update({ stock: Math.max(0, newStock) })
            .eq('id', id)
            .select('id, stock')
            .single();
        if (error) throw error;
        return data;
    },

    // Delete a product (soft delete)
    async delete(id) {
        const { data, error } = await supabaseAdmin
            .from('products')
            .update({ is_active: false })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // Hard delete (admin)
    async hardDelete(id) {
        const { error } = await supabaseAdmin
            .from('products')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    },

    // Get featured products
    async getFeatured(limit = 8) {
        const { data, error } = await supabaseAdmin
            .from('products')
            .select('*, categories!left(name, slug)')
            .eq('is_featured', true)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(limit);
        if (error) throw error;
        return data;
    },

    // Get recommended products (same category, excluding current product)
    async getRecommended(productId, categoryIds, limit = 8) {
        let query = supabaseAdmin
            .from('products')
            .select('*, categories!left(name, slug)')
            .eq('is_active', true)
            .neq('id', productId)
            .order('created_at', { ascending: false })
            .limit(limit);

        // Filter by same categories if available
        if (categoryIds && categoryIds.length > 0) {
            query = query.overlaps('category_ids', categoryIds);
        }

        const { data, error } = await query;
        if (error) throw error;

        // If not enough results from same category, fill with other products
        if (data.length < limit) {
            const excludeIds = [productId, ...data.map(p => p.id)];
            const { data: moreProducts, error: moreErr } = await supabaseAdmin
                .from('products')
                .select('*, categories!left(name, slug)')
                .eq('is_active', true)
                .not('id', 'in', `(${excludeIds.join(',')})`)
                .order('created_at', { ascending: false })
                .limit(limit - data.length);
            if (!moreErr && moreProducts) {
                data.push(...moreProducts);
            }
        }

        return data;
    }
};

module.exports = ProductModel;
