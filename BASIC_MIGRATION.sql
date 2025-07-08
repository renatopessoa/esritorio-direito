-- ============================================================================
-- MIGRATION BÁSICA - SISTEMA JURÍDICO
-- ============================================================================
-- Execute no SQL Editor: https://xacjplyvtiwafchynyiy.supabase.co/project/default/sql

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  document_id text NOT NULL UNIQUE,
  email text NOT NULL UNIQUE,
  phone text NOT NULL,
  address jsonb NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Create users profile table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('ADMIN', 'LAWYER', 'ASSISTANT')),
  cpf text NOT NULL UNIQUE,
  birth_date date NOT NULL,
  phone text NOT NULL,
  landline text,
  address jsonb,
  position text NOT NULL,
  avatar_url text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Create updated_at function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Create triggers
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 6. Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 7. Create basic policies
CREATE POLICY "authenticated_users_manage_clients" ON clients
FOR ALL TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "users_own_data" ON users
FOR ALL USING (
  auth.uid() = id OR 
  (SELECT role FROM users WHERE id = auth.uid()) = 'ADMIN'
)
WITH CHECK (
  auth.uid() = id OR 
  (SELECT role FROM users WHERE id = auth.uid()) = 'ADMIN'
);

-- 8. Create basic indexes
CREATE INDEX IF NOT EXISTS idx_clients_document_id ON clients(document_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Success message
SELECT 'Basic migration completed successfully! ✅' as result;
