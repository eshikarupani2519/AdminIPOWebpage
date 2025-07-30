create table users(id serial primary key,name not null,email not null unique,password not null);
insert into users(name,email,password) values('Eshika Rupani','eshika@gmail.com','eshika123');