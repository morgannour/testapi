// Import necessary modules
const express = require('express');
const { Client } = require('pg');
require('dotenv').config();

// Create the Express application
const app = express();
const cors = require('cors');
app.use(cors({}));
app.use(express.json());  // Parse JSON requests

// PostgreSQL connection
const db = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://test_t8yn_user:mteo0RoFnxiCcswKeslqrkQs54QcYb94@dpg-ctj9s43qf0us739aco30-a.oregon-postgres.render.com/test_t8yn',
  ssl: {
    rejectUnauthorized: false,
  }
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Connection error:', err.message);
    return;
  }
  console.log('Connected to PostgreSQL database.');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

// Routes for managing users
app.post('/api/users', (req, res) => {
  const { username, email, password, role } = req.body;
  const query = 'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)';
  db.query(query, [username, email, password, role], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error adding user." });
    }
    res.status(201).json({ message: "User added successfully." });
  });
});

app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error retrieving users." });
    }
    res.json(results.rows);
  });
});

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;
  const query = 'UPDATE users SET username = $1, email = $2, password = $3, role = $4 WHERE id = $5';
  db.query(query, [username, email, password, role, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error updating user." });
    }
    res.json({ message: "User updated successfully." });
  });
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id = $1', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting user." });
    }
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ message: "User deleted successfully." });
  });
});

// Route to handle login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const query = 'SELECT * FROM users WHERE email = $1';
  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error." });
    }

    if (results.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = results.rows[0];
    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    res.status(200).json({
      message: "Login successful.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  });
});

// Routes for categories management
app.post('/api/categories', (req, res) => {
  const { name, description } = req.body;
  const query = 'INSERT INTO categories (name, description) VALUES ($1, $2)';
  db.query(query, [name, description], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error adding category." });
    }
    res.status(201).json({ message: "Category added successfully." });
  });
});

app.get('/api/categories', (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error retrieving categories." });
    }
    res.json(results.rows);
  });
});
