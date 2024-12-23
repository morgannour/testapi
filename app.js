// Import des modules nécessaires
const express = require('express');
const { Client } = require('pg'); // Importation de PostgreSQL
require('dotenv').config();

// Création de l'application Express
const app = express();
const cors = require('cors');
app.use(cors({}));
app.use(express.json());  // Permet de parser les requêtes JSON

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

// Lancer le serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});

// Routes pour la gestion des utilisateurs
// Ajouter un utilisateur
app.post('/api/users', (req, res) => {
  const { username, email, password, role } = req.body;
  const query = 'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)';
  db.query(query, [username, email, password, role], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de l'ajout de l'utilisateur." });
    }
    res.status(201).json({ message: "Utilisateur ajouté avec succès." });
  });
});

// Lister tous les utilisateurs
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs." });
    }
    res.json(results.rows);  // Correction pour utiliser `rows` pour PostgreSQL
  });
});

// Mettre à jour un utilisateur
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;

  const query = 'UPDATE users SET username = $1, email = $2, password = $3, role = $4 WHERE id = $5';
  db.query(query, [username, email, password, role, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur." });
    }
    res.json({ message: "Utilisateur mis à jour avec succès." });
  });
});

// Supprimer un utilisateur
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM users WHERE id = $1', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur." });
    }

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.json({ message: "Utilisateur supprimé avec succès." });
  });
});

// Route pour vérifier la connexion
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe sont requis." });
  }

  const query = 'SELECT * FROM users WHERE email = $1';
  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Erreur serveur." });
    }

    if (results.rowCount === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const user = results.rows[0];

    if (user.password !== password) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    res.status(200).json({
      message: "Connexion réussie.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  });
});

// Routes pour la gestion des catégories
// Ajouter une catégorie
app.post('/api/categories', (req, res) => {
  const { name, description } = req.body;
  const query = 'INSERT INTO categories (name, description) VALUES ($1, $2)';
  db.query(query, [name, description], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de l'ajout de la catégorie." });
    }
    res.status(201).json({ message: "Catégorie ajoutée avec succès." });
  });
});

// Lister toutes les catégories
app.get('/api/categories', (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la récupération des catégories." });
    }
    res.json(results.rows);
  });
});

// Mettre à jour une catégorie
app.put('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const query = 'UPDATE categories SET name = $1, description = $2 WHERE id = $3';
  db.query(query, [name, description, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la mise à jour de la catégorie." });
    }
    res.json({ message: "Catégorie mise à jour avec succès." });
  });
});

// Supprimer une catégorie
app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM categories WHERE id = $1', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la suppression de la catégorie." });
    }

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Catégorie non trouvée." });
    }

    res.json({ message: "Catégorie supprimée avec succès." });
  });
});

// Routes pour la gestion des outils
// Ajouter un outil
app.post('/api/tools', (req, res) => {
  const { name, category, description, value, session, barcode, keyword, observation } = req.body;
  const query = 'INSERT INTO tools (name, category, description, value, session, barcode, keyword, observation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
  db.query(query, [name, category, description, value, session, barcode, keyword, observation], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de l'ajout de l'outil." });
    }
    res.status(201).json({ message: "Outil ajouté avec succès." });
  });
});

// Mettre à jour un outil
app.put('/api/tools/:id', (req, res) => {
  const { id } = req.params;
  const { name, category, description, quantity, status, value, session, barcode, keyword, observation } = req.body;

  const query = 'UPDATE tools SET name = $1, category = $2, description = $3, quantity = $4, status = $5, value = $6, session = $7, barcode = $8, keyword = $9, observation = $10 WHERE id = $11';
  db.query(query, [name, category, description, quantity, status, value, session, barcode, keyword, observation, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la mise à jour de l'outil." });
    }
    res.json({ message: "Outil mis à jour avec succès." });
  });
});

// Supprimer un outil
app.delete('/api/tools/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM tools WHERE id = $1', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la suppression de l'outil." });
    }

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Outil non trouvé." });
    }

    res.json({ message: "Outil supprimé avec succès." });
  });
});

// Lister tous les outils
app.get('/api/tools', (req, res) => {
  const toolsResults = 'SELECT tools.*, categories.name AS category_name FROM tools JOIN categories ON tools.category = categories.id';
  const categoriesResults = 'SELECT * FROM categories';

  db.query(toolsResults, (err, toolsResults) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la récupération des outils." });
    }

    db.query(categoriesResults, (err, categoriesResults) => {
      if (err) {
        return res.status(500).json({ message: "Erreur lors de la récupération des catégories." });
      }
      res.json({
        tools: toolsResults.rows,
        categories: categoriesResults.rows
      });
    });
  });
});

