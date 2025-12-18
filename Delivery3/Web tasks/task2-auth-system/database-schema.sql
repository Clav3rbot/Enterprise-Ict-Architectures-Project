CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, surname, email, password) VALUES 
    ('John', 'Doe', 'john@example.com', 'password123'),
    ('Jane', 'Smith', 'jane@example.com', 'password123'),
    ('Mike', 'Johnson', 'mike@example.com', 'password123'),
    ('Sarah', 'Williams', 'sarah@example.com', 'password123'),
    ('David', 'Brown', 'david@example.com', 'password123');
