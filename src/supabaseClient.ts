import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_DB_HOST; // Use environment variable for host
const supabaseKey = import.meta.env.VITE_DB_PASSWORD; // Use environment variable for key

export const supabase = createClient(supabaseUrl, supabaseKey);