DO $$
DECLARE
  admin_id uuid := '00000000-0000-0000-0000-000000000001';
BEGIN
  -- Insert auth user with explicit ID
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    created_at,
    updated_at
  ) VALUES (
    admin_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@jursys.com',
    crypt('admin', gen_salt('bf')),
    now(),
    jsonb_build_object(
      'provider', 'email',
      'providers', array['email']
    ),
    jsonb_build_object(
      'name', 'Administrador',
      'role', 'ADMIN'
    ),
    'authenticated',
    'authenticated',
    now(),
    now()
  );

  -- Insert auth identity
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    admin_id,
    admin_id,
    jsonb_build_object(
      'sub', admin_id::text,
      'email', 'admin@jursys.com'
    ),
    'email',
    'admin@jursys.com',
    now(),
    now(),
    now()
  );

  -- Insert user profile with birth_date
  INSERT INTO public.users (
    id,
    name,
    email,
    role,
    cpf,
    phone,
    position,
    birth_date,
    created_at,
    updated_at,
    active
  ) VALUES (
    admin_id,
    'Administrador',
    'admin@jursys.com',
    'ADMIN',
    '00000000000',
    '00000000000',
    'Administrador do Sistema',
    '1970-01-01', -- Default birth date for admin
    now(),
    now(),
    true
  );
END $$;