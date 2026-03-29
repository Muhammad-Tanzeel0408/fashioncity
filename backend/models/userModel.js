const { supabaseAdmin } = require('../config/supabase');

const UserModel = {
    // Find user by email
    async findByEmail(email) {
        const { data, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', email.toLowerCase())
            .single();
        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
        return data;
    },

    // Find user by ID
    async findById(id) {
        const { data, error } = await supabaseAdmin
            .from('users')
            .select('id, name, email, phone, address, city, created_at')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    // Create a new user
    async create(userData) {
        const { data, error } = await supabaseAdmin
            .from('users')
            .insert({
                name: userData.name,
                email: userData.email.toLowerCase(),
                password_hash: userData.password_hash,
                phone: userData.phone || null,
                address: userData.address || null,
                city: userData.city || null
            })
            .select('id, name, email, phone, address, city, created_at')
            .single();
        if (error) throw error;
        return data;
    },

    // Update user profile
    async update(id, userData) {
        const { data, error } = await supabaseAdmin
            .from('users')
            .update(userData)
            .eq('id', id)
            .select('id, name, email, phone, address, city, created_at')
            .single();
        if (error) throw error;
        return data;
    }
};

module.exports = UserModel;
