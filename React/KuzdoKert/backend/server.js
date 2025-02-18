const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

// **MySQL adatbázis kapcsolat**
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // MySQL felhasználónév
  password: "", // MySQL jelszó (ha van)
  port: "3307",
  database: "kuzdosportok",
});

db.connect((err) => {
  if (err) {
    console.error("🔴 MySQL hiba:", err);
  } else {
    console.log("✅ MySQL kapcsolódva!");
  }
});




// **Felhasználók lekérdezése**
// URL: "http://localhost:5000/users"
app.get("/users", (req, res) => {
    db.query("SELECT * FROM latogatok", (err, results) => {
      if (err) {
        console.error("🔴 Hiba:", err);
        return res.status(500).json({ error: "Adatbázis hiba" });
      }
      res.json(results);
    });
  });



  // Regisztráció
  app.post('/register', (req, res) =>{

    const felhasznalonev = req.body.username
    const jelszo = req.body.password

    db.query(
      "INSERT INTO latogatok (felhasznalonev, jelszo, regisztracio_datum) VALUES (?,?, NOW())",
      [felhasznalonev, jelszo],
      (err, result) => {
        console.log("Hibák:" + err);
      }
    );
  });




// **Szerver indítása**
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Szerver fut az ${PORT}-es porton`);
});