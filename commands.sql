-- RESET DATABASE
DROP TABLE IF EXISTS reading_lists CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- USERS
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username text UNIQUE NOT NULL,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

-- BLOGS
CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT NULL,
  title text NOT NULL,
  likes integer NOT NULL DEFAULT 0,
  year integer NOT NULL DEFAULT EXTRACT(YEAR FROM NOW())::int,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- READING LISTS (join table)
CREATE TABLE reading_lists (
  id SERIAL PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  blog_id integer NOT NULL REFERENCES blogs(id) ON DELETE CASCADE ON UPDATE CASCADE,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, blog_id)
);

-- SEED USERS
INSERT INTO users (name, username) VALUES
  ('Tove Jansson', 'tofslan@email.com'),
  ('Julia Capulet', 'julle@email.com');

-- SEED BLOGS
INSERT INTO blogs (author, url, title, likes, year, user_id) VALUES
  ('Tove Jansson', 'http://hattivatti.blogspot.com', 'Taikatalvi', 12345, 1995, 1),
  ('Julia Capulet', 'http://oiromeo.lily.fi', 'Veronan yöt', 4152, 2001, 2);

-- LIST BLOGS WITH AUTHORS
SELECT
  b.id,
  b.author,
  b.title,
  b.likes,
  b.year,
  u.username
FROM blogs b
JOIN users u ON u.id = b.user_id
ORDER BY b.likes DESC;

-- ADD TO READING LIST (user 1 adds blog 1)
INSERT INTO reading_lists (user_id, blog_id, read)
VALUES (1, 1, false);

-- SHOW READING LIST FOR USER 1
SELECT
  b.id,
  b.author,
  b.title,
  b.year,
  rl.read
FROM reading_lists rl
JOIN blogs b ON b.id = rl.blog_id
WHERE rl.user_id = 1
ORDER BY b.id;

-- MARK AS READ
UPDATE reading_lists
SET read = true, updated_at = NOW()
WHERE user_id = 1 AND blog_id = 1;

-- UPDATE LIKES
UPDATE blogs
SET likes = 999, updated_at = NOW()
WHERE id = 1;
