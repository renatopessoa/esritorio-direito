/*
  # Add client documents storage

  1. New Tables
    - `client_documents`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key)
      - `name` (text)
      - `url` (text)
      - `size` (integer)
      - `type` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `client_documents` table
    - Add policy for authenticated users
*/

-- Create client_documents table
CREATE TABLE IF NOT EXISTS client_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  name text NOT NULL,
  url text NOT NULL,
  size integer NOT NULL,
  type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE client_documents ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Enable full access for authenticated users"
  ON client_documents FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Create index for faster lookups
CREATE INDEX idx_client_documents_client_id ON client_documents(client_id);