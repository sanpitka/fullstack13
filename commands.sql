CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

insert into blogs (author, url, title, likes) values ('Tove Jansson', 'http://hattivatti.blogspot.com', 'Taikatalvi', 12345); 

insert into blogs (author, url, title, likes) values ('Julia Capulet', 'http://oiromeo.lily.fi', 'Veronan yöt', 4152);