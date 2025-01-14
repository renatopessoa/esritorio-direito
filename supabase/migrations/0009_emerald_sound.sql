/*
  # Create Users Table with Registration Number

  1. Changes
    - Create users table with all necessary fields
    - Add registration_number column
    - Create indexes for performance optimization
  
  2. Security
    - Primary key constraint
    - Foreign key reference to auth.users
    - Unique constraints on email and CPF
    - Role validation check
*/

-- Create users table if it doesn't exist
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
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_cpf ON users(cpf);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Create index for registration_number only if the column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'registration_number'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_users_registration ON users(registration_number);
  END IF;
END $$;