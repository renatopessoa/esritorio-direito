/*
  # Create and Update Users Table

  1. Changes
    - Create users table if not exists
    - Add registration_number field
    - Add proper indexes
*/

-- Create users table if it doesn't exist (with all fields nullable except required ones)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('ADMIN', 'LAWYER', 'ASSISTANT')),
  cpf text NOT NULL UNIQUE,
  birth_date date,
  phone text NOT NULL,
  landline text,
  address jsonb,
  position text NOT NULL,
  registration_number text,
  avatar_url text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_cpf ON users(cpf);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_registration ON users(registration_number);