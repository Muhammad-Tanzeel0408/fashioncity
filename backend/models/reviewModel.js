const { supabaseAdmin } = require('../config/supabase');

const ReviewModel = {
    // Get all reviews (admin)
    async getAll() {
        const { data, error } = await supabaseAdmin
            .from('reviews')
            .select('*, products:product_id(name, slug)')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    // Get all reviews for a product
    async getByProductId(productId) {
        const { data, error } = await supabaseAdmin
            .from('reviews')
            .select('*')
            .eq('product_id', productId)
            .eq('is_approved', true)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    // Get average rating and count for a product
    async getStats(productId) {
        const { data, error } = await supabaseAdmin
            .from('reviews')
            .select('rating')
            .eq('product_id', productId)
            .eq('is_approved', true);
        if (error) throw error;

        if (!data || data.length === 0) {
            return { average: 0, count: 0 };
        }

        const sum = data.reduce((acc, r) => acc + r.rating, 0);
        return {
            average: Math.round((sum / data.length) * 10) / 10,
            count: data.length
        };
    },

    // Create a new review
    async create({ product_id, reviewer_name, rating, comment, image_url }) {
        const { data, error } = await supabaseAdmin
            .from('reviews')
            .insert({
                product_id,
                reviewer_name,
                rating,
                comment,
                image_url: image_url || null,
                is_approved: true // auto-approve for now
            })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // Delete a review (admin)
    async delete(id) {
        const { error } = await supabaseAdmin
            .from('reviews')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    }
};

module.exports = ReviewModel;
