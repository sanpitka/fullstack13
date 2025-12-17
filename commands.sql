DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    username text UNIQUE NOT NULL
);

CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0,
    userId integer REFERENCES users(id) NOT NULL
);

insert into users (name, username) values ('Tove Jansson', 'tofslan');
insert into blogs (author, url, title, likes, userId) values ('Tove Jansson', 'http://hattivatti.blogspot.com', 'Taikatalvi', 12345, 1);
insert into blogs (author, url, title, likes, userId) values ('Julia Capulet', 'http://oiromeo.lily.fi', 'Veronan yöt', 4152, 1);