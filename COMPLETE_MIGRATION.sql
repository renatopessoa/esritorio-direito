/*
  # MIGRATION COMPLETA - SISTEMA JURÍDICO
  
  Execute este script no SQL Editor do Supabase Dashboard
  URL: https://xacjplyvtiwafchynyiy.supabase.co/project/default/sql
  
  Este script contém todas as migrations principais consolidadas
*/

-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 2. CLIENTS TABLE
-- ============================================================================

-- Create clients table
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

-- ============================================================================
-- 3. CLIENT DOCUMENTS TABLE
-- ============================================================================

-- Create client_documents table
CREATE TABLE IF NOT EXISTS client_documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  name text NOT NULL,
  url text NOT NULL,
  size integer NOT NULL,
  type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 4. USERS TABLE (Extended Profile)
-- ============================================================================

-- Create users table for extended profile information
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

-- ============================================================================
-- 5. PROCESSES TABLE
-- ============================================================================

-- Create processes table
CREATE TABLE IF NOT EXISTS processes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  number text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  lawyer_id uuid REFERENCES users(id),
  court text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'completed', 'archived')),
  process_type text NOT NULL,
  start_date date NOT NULL,
  due_date date,
  amount numeric(15,2),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 6. CALENDAR EVENTS TABLE
-- ============================================================================

-- Create calendar_events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  location text,
  event_type text NOT NULL DEFAULT 'meeting' CHECK (event_type IN ('meeting', 'hearing', 'deadline', 'appointment')),
  process_id uuid REFERENCES processes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 7. FINANCIAL RECORDS TABLE
-- ============================================================================

-- Create financial_records table
CREATE TABLE IF NOT EXISTS financial_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  amount numeric(15,2) NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  category text NOT NULL,
  process_id uuid REFERENCES processes(id) ON DELETE SET NULL,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  due_date date,
  paid_date date,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 8. AUDIT LOG TABLE
-- ============================================================================

-- Create audit_log table
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data jsonb,
  new_data jsonb,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 9. TRIGGERS AND FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_processes_updated_at
  BEFORE UPDATE ON processes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_calendar_events_updated_at
  BEFORE UPDATE ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_financial_records_updated_at
  BEFORE UPDATE ON financial_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 10. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 11. RLS POLICIES
-- ============================================================================

-- Clients policies
CREATE POLICY "authenticated_users_manage_clients" ON clients
FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Client documents policies
CREATE POLICY "authenticated_users_manage_client_documents" ON client_documents
FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Users policies (users can see/edit their own data, admins can see all)
CREATE POLICY "users_own_data" ON users
FOR ALL
USING (
  auth.uid() = id OR 
  (SELECT role FROM users WHERE id = auth.uid()) = 'ADMIN'
)
WITH CHECK (
  auth.uid() = id OR 
  (SELECT role FROM users WHERE id = auth.uid()) = 'ADMIN'
);

-- Processes policies
CREATE POLICY "authenticated_users_manage_processes" ON processes
FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Calendar events policies
CREATE POLICY "users_manage_calendar_events" ON calendar_events
FOR ALL
TO authenticated
USING (
  user_id = auth.uid() OR 
  (SELECT role FROM users WHERE id = auth.uid()) = 'ADMIN'
)
WITH CHECK (
  user_id = auth.uid() OR 
  (SELECT role FROM users WHERE id = auth.uid()) = 'ADMIN'
);

-- Financial records policies
CREATE POLICY "authenticated_users_manage_financial_records" ON financial_records
FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Audit log policies (read-only for authenticated users)
CREATE POLICY "authenticated_users_read_audit_log" ON audit_log
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

-- ============================================================================
-- 12. INDEXES FOR PERFORMANCE
-- ============================================================================

-- Clients indexes
CREATE INDEX IF NOT EXISTS idx_clients_document_id ON clients(document_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at DESC);

-- Processes indexes
CREATE INDEX IF NOT EXISTS idx_processes_number ON processes(number);
CREATE INDEX IF NOT EXISTS idx_processes_client_id ON processes(client_id);
CREATE INDEX IF NOT EXISTS idx_processes_lawyer_id ON processes(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_processes_status ON processes(status);
CREATE INDEX IF NOT EXISTS idx_processes_due_date ON processes(due_date);

-- Calendar events indexes
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_date ON calendar_events(start_date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_process_id ON calendar_events(process_id);

-- Financial records indexes
CREATE INDEX IF NOT EXISTS idx_financial_records_type ON financial_records(type);
CREATE INDEX IF NOT EXISTS idx_financial_records_status ON financial_records(status);
CREATE INDEX IF NOT EXISTS idx_financial_records_due_date ON financial_records(due_date);
CREATE INDEX IF NOT EXISTS idx_financial_records_client_id ON financial_records(client_id);

-- ============================================================================
-- 13. VIEWS FOR DASHBOARD
-- ============================================================================

-- Dashboard statistics view
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM clients WHERE created_at > now() - interval '30 days') as new_clients_month,
  (SELECT COUNT(*) FROM processes WHERE status = 'active') as active_processes,
  (SELECT COUNT(*) FROM calendar_events WHERE start_date BETWEEN now() AND now() + interval '7 days') as upcoming_events,
  (SELECT COALESCE(SUM(amount), 0) FROM financial_records WHERE type = 'income' AND created_at > now() - interval '30 days') as monthly_income,
  (SELECT COUNT(*) FROM financial_records WHERE status = 'overdue') as overdue_payments;

-- Client summary view
CREATE OR REPLACE VIEW client_summary AS
SELECT 
  c.*,
  COUNT(p.id) as processes_count,
  COUNT(cd.id) as documents_count,
  COALESCE(SUM(fr.amount), 0) as total_billed
FROM clients c
LEFT JOIN processes p ON c.id = p.client_id
LEFT JOIN client_documents cd ON c.id = cd.client_id  
LEFT JOIN financial_records fr ON c.id = fr.client_id AND fr.type = 'income'
GROUP BY c.id;

-- ============================================================================
-- 14. SAMPLE DATA (OPTIONAL)
-- ============================================================================

-- Insert sample admin user (will be created when first user registers as admin)
-- This is handled by the application logic

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Log completion
INSERT INTO audit_log (table_name, record_id, action, new_data, user_id)
VALUES (
  'migration', 
  gen_random_uuid(), 
  'INSERT', 
  jsonb_build_object(
    'message', 'Database migration completed successfully',
    'version', '1.0.0',
    'timestamp', now()
  ),
  auth.uid()
);

-- Success message
SELECT 'Database migration completed successfully! 🎉' as message;
