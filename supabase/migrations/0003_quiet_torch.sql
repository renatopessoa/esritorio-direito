/*
  # Fix RLS policies for clients and documents

  1. Changes
    - Drop existing policies
    - Create new policies with proper user authentication checks
    - Add policies for all CRUD operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON clients;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON client_documents;

-- Create new policies for clients
CREATE POLICY "Enable read for authenticated users"
  ON clients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
  ON clients FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete for authenticated users"
  ON clients FOR DELETE
  TO authenticated
  USING (true);

-- Create new policies for client_documents
CREATE POLICY "Enable read for authenticated users"
  ON client_documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON client_documents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
  ON client_documents FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete for authenticated users"
  ON client_documents FOR DELETE
  TO authenticated
  USING (true);