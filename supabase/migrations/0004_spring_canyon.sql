/*
  # Create admin user and identities
  
  1. Changes
    - Create admin user with explicit UUID generation
    - Add identity with proper user reference
    - Set up proper constraints and relationships
*/

DO $$
DECLARE
  admin_id uuid := gen_random_uuid();
BEGIN
  -- Insert the admin user with explicit ID
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role,
    aud
  )
  VALUES (
    admin_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@example.com',
    crypt('admin123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Admin User"}',
    false,
    'authenticated',
    'authenticated'
  );

  -- Insert the identity with explicit reference to the admin user
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    created_at,
    updated_at,
    last_sign_in_at
  )
  VALUES (
    admin_id,
    admin_id,
    jsonb_build_object('sub', admin_id::text, 'email', 'admin@example.com'),
    'email',
    'admin@example.com',
    now(),
    now(),
    now()
  );
END $$;