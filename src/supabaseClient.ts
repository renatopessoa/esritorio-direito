import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uutnlnhpzgprhhxdzhjm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1dG5sbmhwemdwcmhoeGR6aGptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MzMwMjMsImV4cCI6MjA1MDEwOTAyM30.5uzOQzzTO2qjJqagxNFoZ7rHhAMCo1WCPowN0dWo-T0';

export const supabase = createClient(supabaseUrl, supabaseKey);