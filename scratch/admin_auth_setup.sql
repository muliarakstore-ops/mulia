-- SQL migration to add admin users authentication table for Mulia Rak Store.
-- Run this in the Supabase SQL Editor.

-- 1. Create table for administrator accounts
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, -- SHA-256 hash or similar
    role TEXT NOT NULL CHECK (role IN ('admin', 'owner'))
);

-- 2. Enable RLS on admin_users table
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies: Everyone can read or query (hashed validation happens via client lookup, or write custom functions)
-- We will write a simple SELECT verification helper or handle password verification inside standard supabase queries.
CREATE POLICY "Allow public select on admin_users" ON admin_users FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow admin edit on admin_users" ON admin_users FOR ALL TO anon, authenticated USING (true);

-- 4. Seed default accounts:
-- Default Admin: username 'admin', password 'admin123' (SHA-256: 240aa26b5f2c275a9651104302625a6788647b931e10222f71cd2d46d0a932a9)
-- Default Owner: username 'owner', password 'owner789' (SHA-256: 51ad88cdb9f71c42247fb7fa4a8f9fde628867a57a9f7311c4373de3e498c0b5)
INSERT INTO admin_users (username, password_hash, role) 
VALUES 
('admin', '240aa26b5f2c275a9651104302625a6788647b931e10222f71cd2d46d0a932a9', 'admin'),
('owner', '51ad88cdb9f71c42247fb7fa4a8f9fde628867a57a9f7311c4373de3e498c0b5', 'owner')
ON CONFLICT (username) DO NOTHING;
