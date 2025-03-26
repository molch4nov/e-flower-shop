-- Admin Migration Script

-- Add role field to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- Create index for role search
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Create admin user with the credentials (admin/abacaba)
DO $$
BEGIN
  -- Check if admin user already exists
  IF NOT EXISTS (SELECT 1 FROM users WHERE phone_number = 'admin') THEN
    -- Create admin user
    INSERT INTO users (name, phone_number, password_hash, role)
    VALUES (
      'Administrator',
      'admin',
      '$2b$10$xJ1rGDyCHodFvlkwpbSoXOOxAqNTt1HxyqgLkqvcXONBbQMtcGFAK', 
      'admin'
    );
  END IF;
END $$;

-- Update active sessions table to include user role
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS user_role VARCHAR(20);

-- Create an active users table to track user activity
CREATE TABLE IF NOT EXISTS active_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  session_id UUID NOT NULL,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

-- Create index for tracking active users
CREATE INDEX IF NOT EXISTS idx_active_users_session ON active_users(session_id);
CREATE INDEX IF NOT EXISTS idx_active_users_last_activity ON active_users(last_activity);