import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eumrgbgyewqdvpvuhkpm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1bXJnYmd5ZXdxZHZwdnVoa3BtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NTU3NjksImV4cCI6MjA1MDEzMTc2OX0.QqsAhaznNxr2stbXcE5YwgtF8R4BvlGUn5zKZNyfS98';

export const supabase = createClient(supabaseUrl, supabaseKey);