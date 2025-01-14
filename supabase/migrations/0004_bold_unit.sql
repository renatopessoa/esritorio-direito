/*
  # Create admin user

  1. Changes
    - Create admin user through auth schema
    - Add proper unique constraint check
    - Set up authentication details
*/

-- First ensure the auth schema exists
CREATE SCHEMA IF NOT EXISTS auth;

-- Create the admin user with proper constraints
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
)
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Admin User"}',
  false,
  'authenticated'
)
ON CONFLICT (id) DO NOTHING;

-- Add identities for the admin user
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  created_at,
  updated_at
)
SELECT 
  id,
  id,
  jsonb_build_object('sub', id::text),
  'email',
  now(),
  now()
FROM auth.users
WHERE email = 'admin@example.com'
ON CONFLICT (provider, provider_id) DO NOTHING;