CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE,
  phone text UNIQUE,
  password_hash text,
  display_name text NOT NULL,
  dob date,
  gender text,
  bio text,
  location geometry(Point,4326),
  is_verified boolean DEFAULT false,
  vip_until timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE photos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  s3_key text NOT NULL,
  is_profile boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE likes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user uuid NOT NULL,
  to_user uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(from_user, to_user)
);

CREATE TABLE matches (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_a uuid NOT NULL,
  user_b uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id uuid NOT NULL,
  sender uuid NOT NULL,
  content text NOT NULL,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);