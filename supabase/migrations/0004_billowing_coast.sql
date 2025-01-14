/*
  # Create admin user and identities
  
  1. Changes
    - Create admin user with proper authentication details
    - Add identity with required provider_id field
    - Set up proper constraints and relationships
*/

-- First ensure the auth schema exists
CREATE SCHEMA IF NOT EXISTS auth;

-- Create the admin user with proper constraints
DO $$
DECLARE
  user_id uuid;
BEGIN
  -- Insert the user and get the ID
  INSERT INTO auth.users (
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
  RETURNING id INTO user_id;

  -- Insert the identity with the required provider_id
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    created_at,
    updated_at
  )
  VALUES (
    user_id,
    user_id,
    jsonb_build_object('sub', user_id::text, 'email', 'admin@example.com'),
    'email',
    'admin@example.com',
    now(),
    now()
  );
END $$;