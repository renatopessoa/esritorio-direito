/*
  # Fix User Registration Table

  1. Changes
    - Add registration_number field
    - Make birth_date nullable
    - Add indexes for better performance
*/

ALTER TABLE users
  ALTER COLUMN birth_date DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS registration_number text;

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_cpf ON users(cpf);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);