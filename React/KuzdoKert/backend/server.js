const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10
require("dotenv").config();
const jwt = require("jsonwebtoken");

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')

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

    const vnev = req.body.vnev
    const knev = req.body.knev
    const knev2 = req.body.knev2
    const email = req.body.email
    const szul = req.body.szul
    const lakhely = req.body.lakhely
    const tel = req.body.tel
    const felhasznalonev = req.body.username
    const jelszo = req.body.password


    bcrypt.hash(jelszo,saltRounds, (err, hash) =>{

      if (err){
        console.log(err)
      }

      db.query(
        "INSERT INTO latogatok (vnev, knev, knev2, lakhelyvaros, email, telefonszam, szul_ido, felhasznalonev, jelszo, regisztracio_datum) VALUES (?,?,?,?,?,?,?,?,?, NOW())",
        [vnev, knev, knev2, lakhely, email, tel, szul, felhasznalonev, hash],
        (err, result) => {
          if (err == null){
            console.log("Az isnert (regisztráció) sikeresen lefutott.")
          }
          else{
             console.log("Hibák:" + err);
          }
        }
      );

    });

    
  });




  //login
  app.post('/login', (req, res) => {
    const felhasznalonev = req.body.username
    const jelszo = req.body.password

    db.query(
      "SELECT * FROM latogatok WHERE felhasznalonev = ?",
      felhasznalonev,
      (err, result) => {

        if (err){
          res.send({err: err});
        }

        if (result.length > 0) {
          bcrypt.compare(jelszo, result[0].jelszo, (error, response) =>{
            if (response) {
              res.send(result)
            }
            else{
              res.send({message: "Rossz felhasználó/jelszó kombináció"});
            }
          });
        }
        else{
          res.send({message: "Nem létező felhasználó"});
        }
        
      }
    );
  })




// **Szerver indítása**
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Szerver fut az ${PORT}-es porton`);
});