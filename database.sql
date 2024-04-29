DROP database if exists appdb;
create database appdb;
use appdb;

create table users(
	id int primary key auto_increment,
    name varchar(250),
    contact varchar(250),
    email varchar(250),
    password varchar(250),
    status boolean,
    role varchar(20),
    UNIQUE (email)
);

insert into users (name, contact, email, password, status, role)
values('the Academy DVR', '920153123', 'alvaroneira98@gmail.com', 'admin123', true, 'admin' );

select * from users;

select * from usuarios;

create table usuarios(
	id int primary key auto_increment,
	name varchar(255),
	user varchar(255),
	pass varchar(255)
 );


