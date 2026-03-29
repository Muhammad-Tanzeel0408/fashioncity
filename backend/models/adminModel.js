const { supabaseAdmin } = require('../config/supabase');

const AdminModel = {
    // Find admin by email
    async findByEmail(email) {
        const { data, error } = await supabaseAdmin
            .from('admins')
            .select('*')
            .eq('email', email.toLowerCase())
            .single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    // Find admin by ID
    async findById(id) {
        const { data, error } = await supabaseAdmin
            .from('admins')
            .select('id, name, email, role, created_at')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    // Create admin (for setup)
    async create(adminData) {
        const { data, error } = await supabaseAdmin
            .from('admins')
            .insert({
                name: adminData.name,
                email: adminData.email.toLowerCase(),
                password_hash: adminData.password_hash,
                role: adminData.role || 'admin'
            })
            .select('id, name, email, role, created_at')
            .single();
        if (error) throw error;
        return data;
    }
};

module.exports = AdminModel;
