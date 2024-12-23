// Import des modules nécessaires
const express = require('express');
const mysql = require('mysql');
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
  const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
  db.query(query, [ username, email, password, role], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de l'ajout de la user." });
    }
    res.status(201).json({ message: "user ajoutée avec succès." });
  });
});

// Lister toutes les catégories
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la récupération des catégories." });
    }
    res.json(results);
  });
});


app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;

  const query = 'UPDATE users SET username = ?, email = ?, password = ?, role = ? WHERE id = ?';
  db.query(query, [username, email, password, role, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la mise à jour de l'outil." });
    }
    res.json({ message: "Outil mis à jour avec succès." });
  });
});

// Supprimer un outil
// Supprimer un utilisateur
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;  // Récupérer l'ID de l'utilisateur à supprimer

  // Requête SQL pour supprimer l'utilisateur
  db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur." });  // Message d'erreur
    }

    // Vérifier si l'utilisateur a bien été supprimé
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });  // Si l'utilisateur n'existe pas
    }

    res.json({ message: "Utilisateur supprimé avec succès." });  // Message de succès
  });
});

// Route pour vérifier la connexion
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Vérification des champs obligatoires
  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe sont requis." });
  }

  // Requête SQL pour vérifier l'utilisateur
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Erreur serveur." });
    }

    // Vérification si l'utilisateur existe
    if (results.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const user = results[0];

    // Comparer le mot de passe (en supposant qu'il est stocké en texte clair)
    if (user.password !== password) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    // Si tout est correct, retourner une réponse avec succès
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
  const query = 'INSERT INTO categories (name, description) VALUES (?, ?)';
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
    res.json(results);
  });
});


app.put('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const query = 'UPDATE categories SET name = ?, description = ? WHERE id = ?';
  db.query(query, [name, description, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la mise à jour de l'outil." });
    }
    res.json({ message: "Outil mis à jour avec succès." });
  });
});

// Supprimer un outil
// Supprimer un utilisateur
app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;  // Récupérer l'ID de l'utilisateur à supprimer

  // Requête SQL pour supprimer l'utilisateur
  db.query('DELETE FROM categories WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur." });  // Message d'erreur
    }

    // Vérifier si l'utilisateur a bien été supprimé
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });  // Si l'utilisateur n'existe pas
    }

    res.json({ message: "Utilisateur supprimé avec succès." });  // Message de succès
  });
});

// Routes pour la gestion des outils
// Ajouter un outil


app.post('/api/tools', (req, res) => {
  const { name, category, description,	value,	session,	barcode,	keyword,	observation } = req.body;
  const query = 'INSERT INTO tools (name, category, description,	value, session,	barcode,	keyword,	observation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [ name, category, description,	value,	session,	barcode,	keyword,	observation ], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de l'ajout d'outil." });
    }
    res.status(201).json({ message: "outil ajouté avec succès." });
  });
});

app.put('/api/tools/:id', (req, res) => {
  const { id } = req.params;
  const { name, category, description, 	quantity,	status,	value,	session,	barcode,	keyword,	observation } = req.body;

  const query = 'UPDATE tools SET name=?, category=?, description=?, 	quantity=?,	status=?,	value=?,	session=?,	barcode=?,	keyword=?,	observation=? WHERE id = ?';
  db.query(query, [name, category, description, 	quantity,	status,	value,	session,	barcode,	keyword,	observation, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la mise à jour de l'outil." });
    }
    res.json({ message: "Outil mis à jour avec succès." });
  });
});

// Supprimer un outil
// Supprimer un utilisateur
app.delete('/api/tools/:id', (req, res) => {
  const { id } = req.params;  // Récupérer l'ID de l'utilisateur à supprimer

  // Requête SQL pour supprimer l'utilisateur
  db.query('DELETE FROM tools WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la suppression de l'outil." });  // Message d'erreur
    }

    // Vérifier si l'utilisateur a bien été supprimé
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "outil non trouvé." });  // Si l'utilisateur n'existe pas
    }

    res.json({ message: "outil supprimé avec succès." });  // Message de succès
  });
});



// Lister toutes les users
app.get('/api/tools', (req, res) => {
  const toolsQuery = `
    SELECT tools.*, categories.name AS category_name
    FROM tools
    JOIN categories ON tools.category = categories.id
  `;
  const categoriesQuery = 'SELECT * FROM categories';

  // Première requête : Récupération des outils
  db.query(toolsQuery, (err, toolsResults) => {
    if (err) {
      console.error("Erreur lors de la récupération des outils :", err.message);
      return res.status(500).json({ message: "Erreur lors de la récupération des outils." });
    }

    // Deuxième requête : Récupération des catégories
    db.query(categoriesQuery, (err, categoriesResults) => {
      if (err) {
        console.error("Erreur lors de la récupération des catégories :", err.message);
        return res.status(500).json({ message: "Erreur lors de la récupération des catégories." });
      }

      // Répondre avec les données
      res.status(200).json({
        tools: toolsResults.rows || toolsResults,
        categories: categoriesResults.rows || categoriesResults
      });
    });
  });
});




app.get('/api/dettools', (req, res) => {0..toExponential.apply
  const toolsQuery = 'SELECT * FROM tools';
  const categoriesQuery = `
    SELECT categories.name AS category_name , tools.category as name , COUNT(*) AS count
FROM tools
JOIN categories ON tools.category = categories.id
GROUP BY categories.name;

  `;

  db.query(toolsQuery, (err, toolsResults) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la récupération des outils." });
    }

    db.query(categoriesQuery, (err, categoriesResults) => {
      if (err) {
        return res.status(500).json({ message: "Erreur lors de la récupération des catégories." });
      }

      // Répondre avec les données organisées
      res.json({
        tools: toolsResults,
        categories: categoriesResults
      });
    });
  });
});


