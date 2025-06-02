
-- Set the first user as admin
UPDATE user_profiles 
SET role = 'ADMIN' 
WHERE id = (
  SELECT id 
  FROM user_profiles 
  ORDER BY created_at ASC 
  LIMIT 1
);
