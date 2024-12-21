const express = require('express');
const { Client } = require('pg');
const app = express();
const port = 3000;

// Configuration de la connexion à PostgreSQL
const client = new Client({
  user: 'test_t8yn_user',
  host: 'dpg-ctj9s43qf0us739aco30-a.oregon-postgres.render.com',
  database: 'test_t8yn',
  password: 'mteo0RoFnxiCcswKeslqrkQs54QcYb94',
  port: 5432,
});

// Connecter la base de données
client.connect();

// Requête pour créer les tables et insérer les données
const createTablesAndInsertData = async () => {
  const query = `
    -- Création des tables
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT current_timestamp
    );

    CREATE TABLE IF NOT EXISTS tools (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category INTEGER NOT NULL,
      description TEXT NOT NULL,
      quantity INTEGER,
      status VARCHAR(50),
      value DECIMAL(10, 2) NOT NULL,
      session INTEGER NOT NULL,
      barcode VARCHAR(255) NOT NULL,
      keyword VARCHAR(255) NOT NULL,
      observation TEXT,
      FOREIGN KEY (category) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL
    );

    -- Insertion des données
    INSERT INTO categories (name, description, created_at) VALUES
    ('pc', 'test', '2024-12-19 14:58:10'),
    ('souris', 'hh', '2024-12-19 15:22:00'),
    ('cabel hdmi', 'ttt', '2024-12-19 16:45:21')
    ON CONFLICT (name) DO NOTHING;

    INSERT INTO tools (name, category, description, quantity, status, value, session, barcode, keyword, observation) VALUES
    ('pc nour', 8, 'test', NULL, NULL, 120.00, 2024, '12547888888', 'testttttt', 'testtttt'),
    ('pc majdi', 8, 'test', NULL, NULL, 120.00, 2024, '12547888888', 'testttttt', 'testtttt'),
    ('testaaaa', 10, 'testaaa', NULL, NULL, 120.00, 2024, '12547888888', 'testtttttaaaa', 'testttttaaaa'),
    ('pc rim', 8, 'dfgde', NULL, NULL, 150.00, 2044, '154554', 'hichem', 'testttttaaaa'),
    ('pc rim1111', 8, 'dfgde11', NULL, NULL, 1501.00, 20441, '1545541', 'hichem1', 'testttttaaaa1'),
    ('pc rim1111', 10, 'dfgde11', NULL, NULL, 1501.00, 20441, '1545541', 'hichem1', 'testttttaaaa1'),
    ('pc rim1111', 8, 'dfgde11', NULL, NULL, 1501.00, 20441, '1545541', 'hichem1', 'testttttaaaa1'),
    ('hdmi', 11, '1.5m', NULL, NULL, 10.00, 2024, '12547888888', 'sabel', 'test')
    ON CONFLICT (barcode) DO NOTHING;

    INSERT INTO users (username, password, role, email) VALUES
    ('admin', '123456', 'admin', 'admin@admin.com')
    ON CONFLICT (username) DO NOTHING;
  `;

  try {
    await client.query(query);
    console.log("Tables created and data inserted successfully!");
  } catch (err) {
    console.error("Error creating tables or inserting data", err.stack);
  }
};

// Route pour exécuter la création des tables et insertion des données
app.get('/setup', async (req, res) => {
  await createTablesAndInsertData();
  res.send('Tables created and data inserted successfully!');
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
