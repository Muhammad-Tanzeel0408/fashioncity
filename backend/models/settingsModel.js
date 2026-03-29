const { supabaseAdmin } = require('../config/supabase');

const SettingsModel = {
    // Get a setting by key
    async get(key) {
        const { data, error } = await supabaseAdmin
            .from('site_settings')
            .select('*')
            .eq('key', key)
            .single();
        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
        return data;
    },

    // Upsert a setting
    async set(key, value) {
        // Try update first
        const { data: existing } = await supabaseAdmin
            .from('site_settings')
            .select('id')
            .eq('key', key)
            .single();

        if (existing) {
            const { data, error } = await supabaseAdmin
                .from('site_settings')
                .update({ value, updated_at: new Date().toISOString() })
                .eq('key', key)
                .select()
                .single();
            if (error) throw error;
            return data;
        } else {
            const { data, error } = await supabaseAdmin
                .from('site_settings')
                .insert({ key, value })
                .select()
                .single();
            if (error) throw error;
            return data;
        }
    }
};

module.exports = SettingsModel;
