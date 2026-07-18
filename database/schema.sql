

CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY ,
    age INT ,
    email VARCHAR NOT NULL UNIQUE,
    pass VARCHAR NOT NULL
)


CREATE TABLE IF NOT EXISTS employees(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    department VARCHAR(100),
    salary DECIMAL(10,2),
    joining_date DATE
);

CREATE TABLE IF NOT EXISTS students(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    age INT,
    course VARCHAR(100),
    semester INT,
    cgpa DECIMAL(3,2)
);

CREATE TABLE IF NOT EXISTS books(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    isbn VARCHAR(50) UNIQUE,
    price DECIMAL(10,2),
    quantity INT,
    publisher VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS movies(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    genre VARCHAR(100),
    rating DECIMAL(2,1),
    duration INT,
    language VARCHAR(50),
    release_year INT
);