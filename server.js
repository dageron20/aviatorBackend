// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 5000;

app.use(bodyParser.json());

const db = new sqlite3.Database('./aviator.db', (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to the SQLite database');
    }
});

app.post('/api/login', (req, res) => {
  const { login, password } = req.body;
  db.get("SELECT * FROM Accounts WHERE login = ? AND password = ?", [login, password], (err, row) => {
    if (row) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

app.get('/api/fields', (req, res) => {
  db.get("SELECT field_1, field_2 FROM MainInfo", (err, row) => {
    res.json(row);
  });
});

app.post('/api/update-fields', (req, res) => {
  const { field_1, field_2 } = req.body;
  db.run("UPDATE MainInfo SET field_1 = ?, field_2 = ? WHERE id = 1", [field_1, field_2], (err) => {
      if (err) {
          res.status(500).json({ message: "Failed to update fields" });
          return;
      }
      res.json({ message: "Fields updated successfully" });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
