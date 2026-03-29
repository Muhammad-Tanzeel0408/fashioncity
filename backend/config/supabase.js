const { createClient } = require('@supabase/supabase-js');

// ============================================
// SUPABASE CONFIGURATION
// ============================================
// To set up:
// 1. Go to https://supabase.com and create a project
// 2. Go to Settings → API
// 3. Copy the "Project URL" → paste as SUPABASE_URL in .env
// 4. Copy the "anon public" key → paste as SUPABASE_ANON_KEY in .env
// 5. Copy the "service_role" key → paste as SUPABASE_SERVICE_ROLE_KEY in .env
// ============================================

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        '⚠️  Supabase URL or Anon Key not found in environment variables.\n' +
        '   The app will run but database operations will fail.\n' +
        '   Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file.\n'
    );
}

// Public client (respects Row Level Security)
const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder_key'
);

// Admin client (bypasses Row Level Security — use for admin operations only)
const supabaseAdmin = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseServiceKey || supabaseAnonKey || 'placeholder_key'
);

module.exports = { supabase, supabaseAdmin };
