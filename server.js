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

// db.serialize(() => {
//   db.run("CREATE TABLE users (login TEXT, password TEXT)");
//   db.run("CREATE TABLE data (field1 INTEGER, field2 INTEGER)");

//   const stmt = db.prepare("INSERT INTO users VALUES (?, ?)");
//   stmt.run("admin", "password");  // Логин и пароль для входа
//   stmt.finalize();

//   db.run("INSERT INTO data (field1, field2) VALUES (0, 0)"); // Начальные значения полей
// });

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
  db.get("SELECT field1, field2 FROM data", (err, row) => {
    res.json(row);
  });
});

app.post('/api/update-fields', (req, res) => {
  const { field1, field2 } = req.body;
  db.run("UPDATE data SET field1 = ?, field2 = ? WHERE rowid = 1", [field1, field2], (err) => {
    if (err) {
      res.json({ message: "Failed to update fields" });
    } else {
      res.json({ message: "Fields updated successfully" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
