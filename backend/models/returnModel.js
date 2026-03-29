const { supabaseAdmin } = require('../config/supabase');

const ReturnModel = {
    // Get all returns (admin)
    async getAll() {
        const { data, error } = await supabaseAdmin
            .from('returns')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    // Get return by ID
    async getById(id) {
        const { data, error } = await supabaseAdmin
            .from('returns')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    // Create a return request
    async create(returnData) {
        const { data, error } = await supabaseAdmin
            .from('returns')
            .insert(returnData)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // Update return status (admin)
    async updateStatus(id, status) {
        const { data, error } = await supabaseAdmin
            .from('returns')
            .update({ status })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // Delete a return (admin)
    async delete(id) {
        const { error } = await supabaseAdmin
            .from('returns')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    }
};

module.exports = ReturnModel;
