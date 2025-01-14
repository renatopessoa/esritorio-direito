/*
  # Update RLS policies for clients table

  1. Changes
    - Drop existing policies
    - Create new policies with proper authentication checks
    - Add policies for all CRUD operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON clients;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON clients;

-- Create new policies
CREATE POLICY "Enable all access for authenticated users"
  ON clients
  FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Update client_documents policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON client_documents;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON client_documents;

CREATE POLICY "Enable all access for authenticated users"
  ON client_documents
  FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);