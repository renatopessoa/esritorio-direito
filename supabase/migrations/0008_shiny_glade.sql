/*
  # Fix User Registration Policies

  1. Changes
    - Remove restrictive admin-only policy for user creation
    - Add policy to allow authenticated users to create profiles
    - Adjust RLS policies to be more permissive during registration
*/

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Only admins can create users" ON users;

-- Create new permissive policy for user creation
CREATE POLICY "Allow users to create their own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Update view policy to be more specific
DROP POLICY IF EXISTS "Users can view all users" ON users;
CREATE POLICY "Users can view active users"
  ON users FOR SELECT
  TO authenticated
  USING (active = true);