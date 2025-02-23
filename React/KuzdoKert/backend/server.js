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
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["GET","POST"],
  credentials: true
}));

app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))

app.use(session({
  key: "userId",
  secret: "secret",
  resave: false,
  saveUninitialized: false,
  cookie:{
    expires: 1000000
  },
}))

//--------------------------------------------------------

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

//----------------------------------------------------

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
            console.log("Az insert (regisztráció) sikeresen lefutott.")
          }
          else{
             console.log("Hibák:" + err);
          }
        }
      );

    });

    
  });
//----------------------------------------------------------------


  //login check (be vagy e jelentkezve)

  app.get("/login", (req, res) => {
    if (req.session.user) {
      res.send({loggedIn: true, user: req.session.user})
    }
    else{
      res.send({loggedIn: false})
    }
  })


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
              req.session.user = result
              console.log(req.session.user)
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

//-----------------------------------------------------------------------------


//felhasználói adat frissítés
app.post("/updateUser", (req, res) => {
  const { vnev, knev, knev2, email, szul, lakhely, tel, username, password } = req.body;
  
  const sql = `
    UPDATE latogatok 
    SET vnev = ?, knev = ?, knev2 = ?, email = ?, szul_ido = ?, lakhelyvaros = ?, telefonszam = ?, jelszo = ?
    WHERE felhasznalonev = ?;
  `;

  db.query(sql, [vnev, knev, knev2, email, szul, lakhely, tel, password, username], (err, result) => {
    if (err) {
      console.error("Hiba az adatbázis frissítésekor:", err);
      return res.status(500).send("Hiba történt az adatok frissítése közben."); // 🔹 FONTOS: return, hogy ne fusson tovább!
    }

    console.log("✅ Profil sikeresen frissítve!");

    // **Süti törlése és újra létrehozása**
    res.clearCookie("userId");
    res.cookie("userId", username, {
      maxAge: 1000000
    });


    req.session.user = [{
      vnev, knev, knev2, email, szul_ido: szul, lakhelyvaros: lakhely, telefonszam: tel, felhasznalonev: username, jelszo: password
    }];


    res.send({ message: "Profil sikeresen frissítve!", user: req.session.user });
  });
});

//jelszó még nem fix h működik
//--------------------------------------------------------------------------------------



//sportok lekérése
app.get("/sports/:id", (req, res) => {
  const sportId = req.params.id; // Az id paramétert lekérjük az URL-ből

  const sql = "SELECT * FROM kuzdosportok.sport WHERE sport_id = ?";

  db.query(sql, [sportId], (err, results) => {
    if (err) {
      console.error("Hiba az adatlekérdezés során:", err);
      return res.status(500).json({ error: "Adatbázis hiba" });
    }

    if (results.length > 0) {
      res.json(results[0]); // Az első találatot visszaküldjük
    } else {
      res.status(404).json({ error: "Nincs ilyen sport" });
    }
  });
});

//----------------------------------------------------------------------------------------




// **Szerver indítása**
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Szerver fut az ${PORT}-es porton`);
});