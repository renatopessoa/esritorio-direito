/*
  # Fix RLS policies for clients table
  
  1. Changes
    - Drop existing RLS policies
    - Create new simplified policies for authenticated users
    - Ensure proper access control
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read for authenticated users" ON clients;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON clients;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON clients;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON clients;

-- Create new simplified policies
CREATE POLICY "Enable full access for authenticated users"
ON clients FOR ALL
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');