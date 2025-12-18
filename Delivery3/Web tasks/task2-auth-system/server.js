const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

function initializeDatabase() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            surname TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;

    db.run(createTableQuery, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Users table is ready');
            insertSampleUsers();
        }
    });
}

function insertSampleUsers() {
    const checkQuery = 'SELECT COUNT(*) as count FROM users';
    
    db.get(checkQuery, [], (err, row) => {
        if (err) {
            console.error('Error checking users:', err.message);
            return;
        }

        if (row.count === 0) {
            const sampleUsers = [
                { name: 'John', surname: 'Doe', email: 'john@example.com', password: 'password123' },
                { name: 'Jane', surname: 'Smith', email: 'jane@example.com', password: 'password123' },
                { name: 'Mike', surname: 'Johnson', email: 'mike@example.com', password: 'password123' }
            ];

            const insertQuery = 'INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)';

            sampleUsers.forEach(user => {
                db.run(insertQuery, [user.name, user.surname, user.email, user.password], (err) => {
                    if (err) {
                        console.error('Error inserting sample user:', err.message);
                    }
                });
            });

            console.log('Sample users inserted');
        }
    });
}

app.post('/api/signup', (req, res) => {
    const { name, surname, email, password } = req.body;

    if (!name || !surname || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name) || name.length < 2) {
        return res.status(400).json({
            success: false,
            message: 'Invalid first name. Must be at least 2 characters and contain only letters'
        });
    }

    if (!nameRegex.test(surname) || surname.length < 2) {
        return res.status(400).json({
            success: false,
            message: 'Invalid last name. Must be at least 2 characters and contain only letters'
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters long'
        });
    }

    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    
    db.get(checkEmailQuery, [email], (err, row) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Database error occurred'
            });
        }

        if (row) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered. Please use a different email or log in.'
            });
        }

        const insertQuery = 'INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)';
        
        db.run(insertQuery, [name, surname, email, password], function(err) {
            if (err) {
                console.error('Error inserting user:', err.message);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to create account. Please try again.'
                });
            }

            console.log(`New user registered: ${email}`);

            res.status(201).json({
                success: true,
                message: 'Account created successfully',
                user: {
                    id: this.lastID,
                    name: name,
                    surname: surname,
                    email: email
                }
            });
        });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    
    db.get(query, [email], (err, row) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Database error occurred'
            });
        }

        if (!row) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password. Please check your credentials.'
            });
        }

        if (row.password !== password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password. Please check your credentials.'
            });
        }

        console.log(`User logged in: ${email}`);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: row.id,
                name: row.name,
                surname: row.surname,
                email: row.email
            }
        });
    });
});

app.get('/api/users', (req, res) => {
    const query = 'SELECT id, name, surname, email, created_at FROM users';
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Database error occurred'
            });
        }

        res.status(200).json({
            success: true,
            users: rows
        });
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong on the server'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('\nDatabase connection closed');
        }
        process.exit(0);
    });
});
