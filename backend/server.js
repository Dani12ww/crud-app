const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

// ✅ Connect to MySQL (without specifying database initially)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
});

// ✅ Create Database If Not Exists
db.query("CREATE DATABASE IF NOT EXISTS crud_app", (err) => {
  if (err) throw err;
  console.log("✅ Database 'crud_app' is ready!");

  // ✅ Connect to the newly created database
  db.changeUser({ database: "crud_app" }, (err) => {
    if (err) throw err;

    // ✅ Create Table If Not Exists
    const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE
            )
        `;

    db.query(createTableQuery, (err) => {
      if (err) throw err;
      console.log("✅ Table 'users' is ready!");
    });
  });
});

// ✅ Get All Users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users ORDER BY id ASC", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// ✅ Get a Single User by ID
app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  db.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0)
      return res.status(404).json({ message: "User not found" });
    res.json(results[0]); // Return only the first user
  });
});

// ✅ Create a New User
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  db.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ id: result.insertId, name, email });
    }
  );
});

// ✅ Update a User
app.put("/users/:id", (req, res) => {
  const { name, email } = req.body;
  db.query(
    "UPDATE users SET name=?, email=? WHERE id=?",
    [name, email, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: req.params.id, name, email });
    }
  );
});

// ✅ Delete a User
app.delete("/users/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id=?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "User deleted" });
  });
});

// ✅ Start Server
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
