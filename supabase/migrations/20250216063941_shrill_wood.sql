/*
  # Extend profiles table with additional user information

  1. Changes
    - Add new columns to profiles table:
      - date_of_birth (date)
      - gender (text)
      - country_of_origin (text)
      - preferred_language (text)
      - travel_interests (text[])
      - frequent_destinations (text[])
      - subscription_status (text)
      - last_login (timestamptz)

  2. Security
    - Maintain existing RLS policies
    - Users can only view and update their own profile data
*/

-- Add new columns to profiles table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'date_of_birth') THEN
    ALTER TABLE profiles 
      ADD COLUMN date_of_birth DATE,
      ADD COLUMN gender TEXT,
      ADD COLUMN country_of_origin TEXT,
      ADD COLUMN preferred_language TEXT,
      ADD COLUMN travel_interests TEXT[],
      ADD COLUMN frequent_destinations TEXT[],
      ADD COLUMN subscription_status TEXT DEFAULT 'free',
      ADD COLUMN last_login TIMESTAMPTZ;
  END IF;
END $$;