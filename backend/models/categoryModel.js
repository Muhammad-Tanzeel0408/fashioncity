const { supabaseAdmin } = require('../config/supabase');

const CategoryModel = {
    // Get all active categories
    async getAll() {
        const { data, error } = await supabaseAdmin
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });
        if (error) throw error;
        return data;
    },

    // Get category by slug
    async getBySlug(slug) {
        const { data, error } = await supabaseAdmin
            .from('categories')
            .select('*')
            .eq('slug', slug)
            .eq('is_active', true)
            .single();
        if (error) throw error;
        return data;
    },

    // Get category by ID
    async getById(id) {
        const { data, error } = await supabaseAdmin
            .from('categories')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    // Create category (admin)
    async create(categoryData) {
        const slug = categoryData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const { data, error } = await supabaseAdmin
            .from('categories')
            .insert({ ...categoryData, slug })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // Update category (admin)
    async update(id, categoryData) {
        if (categoryData.name) {
            categoryData.slug = categoryData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        const { data, error } = await supabaseAdmin
            .from('categories')
            .update(categoryData)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // Delete category (soft delete)
    async delete(id) {
        const { data, error } = await supabaseAdmin
            .from('categories')
            .update({ is_active: false })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    }
};

module.exports = CategoryModel;
