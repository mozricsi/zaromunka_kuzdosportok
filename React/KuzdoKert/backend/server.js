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
  app.post('/register', (req, res) => {
    const vnev = req.body.vnev;
    const knev = req.body.knev;
    const knev2 = req.body.knev2;
    const email = req.body.email;
    const szul = req.body.szul;
    const lakhely = req.body.lakhely;
    const tel = req.body.tel;
    const felhasznalonev = req.body.username;
    const jelszo = req.body.password;
    const role = req.body.role || "visitor"; // Alapértelmezett: látogató
  
    bcrypt.hash(jelszo, saltRounds, (err, hash) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Hiba a jelszó hash-elése közben.");
      }
  
      db.query(
        "INSERT INTO latogatok (vnev, knev, knev2, lakhelyvaros, email, telefonszam, szul_ido, felhasznalonev, jelszo, role, regisztracio_datum) VALUES (?,?,?,?,?,?,?,?,?,?, NOW())",
        [vnev, knev, knev2, lakhely, email, tel, szul, felhasznalonev, hash, role],
        (err, result) => {
          if (err) {
            console.log("Hibák:" + err);
            return res.status(500).send("Hiba a regisztráció során.");
          }
          console.log("Az insert (regisztráció) sikeresen lefutott.");
          res.send({ message: "Sikeres regisztráció!" });
        }
      );
    });
  });
//----------------------------------------------------------------

//felhasználónév check

app.post("/checkUsername", (req, res) => {
  const felhasznalonev = req.body.username;

  db.query(
    "SELECT felhasznalonev FROM kuzdosportok.latogatok WHERE felhasznalonev = ?",
    [felhasznalonev],
    (err, result) => {
      if (err) {
        res.status(500).send({ error: "Database error" });
      } else {
        console.log("SQL result:", result); // Ellenőrizd a szerveren
        res.send({ exists: result.length > 0 });
      }
    }
  );
});


//-----------------------------------------------------------------------------------


  //login check (be vagy e jelentkezve)

  app.get("/login", (req, res) => {
    if (req.session.user) {
      res.send({loggedIn: true, user: req.session.user})
    }
    else{
      res.send({loggedIn: false, user: null})
    }
  })


  app.post('/login', (req, res) => {
    const felhasznalonev = req.body.username;
    const jelszo = req.body.password;
  
    db.query(
      "SELECT * FROM latogatok WHERE felhasznalonev = ?",
      felhasznalonev,
      (err, result) => {
        if (err) {
          res.send({ err: err });
        }
  
        if (result.length > 0) {
          bcrypt.compare(jelszo, result[0].jelszo, (error, response) => {
            if (response) {
              req.session.user = result;
              console.log(req.session.user);
              res.send(result); // A result tartalmazza a vnev, knev, role stb. értékeket
            } else {
              res.send({ message: "Rossz felhasználó/jelszó kombináció!" });
            }
          });
        } else {
          res.send({ message: "Nem létező felhasználó!" });
        }
      }
    );
  });

//-----------------------------------------------------------------------------


//kijelentkezés
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Hiba a kijelentkezés során:", err);
      return res.status(500).json({ error: "Nem sikerült kijelentkezni" });
    }
    
    res.clearCookie("userId");
    res.json({ loggedIn: false, user: null, message: "Sikeres kijelentkezés!" });
    
  });
});

//-------------------------------------------------------


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
  const sportId = req.params.id;

  const sql = "SELECT sport_id, sportnev, leiras, szabalyok FROM kuzdosportok.sport WHERE sport_id = ?";

  db.query(sql, [sportId], (err, results) => {
    if (err) {
      console.error("Hiba az adatlekérdezés során:", err);
      return res.status(500).json({ error: "Adatbázis hiba" });
    }

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: "Nincs ilyen sport" });
    }
  });
});


//----------------------------------------------------------------------------------------

//klubbok lekérése
app.get("/klubbok/:sportId", (req, res) => {
  const sportId = req.params.sportId;
  const query = `SELECT * FROM klubbok WHERE sport_id = ?`;

  db.query(query, [sportId], (err, results) => {
    if (err) {
      console.error("Hiba történt:", err);
      res.status(500).json({ error: "Adatbázis hiba" });
    } else {
      res.json(results);
    }
  });
});
//-----------------------------------------------------------------------------------------------


//Jelszóváltoztatás
app.post("/changePassword", (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Az új jelszónak legalább 6 karakter hosszúnak kell lennie!" });
  }

  const query = "SELECT jelszo FROM latogatok WHERE felhasznalonev = ?";
  db.query(query, [username], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Hiba történt az adatbázisban." });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Felhasználó nem található." });
    }

    const hashedPassword = result[0].jelszo;

    // Ellenőrizzük a régi jelszót
    bcrypt.compare(oldPassword, hashedPassword, (err, match) => {
      if (err) {
        return res.status(500).json({ message: "Hiba történt az ellenőrzés során." });
      }
      if (!match) {
        return res.status(400).json({ message: "A régi jelszó helytelen!" });
      }

      // Ellenőrizzük, hogy az új jelszó nem egyezik-e a jelenlegi hash-elt jelszóval
      bcrypt.compare(newPassword, hashedPassword, (err, same) => {
        if (err) {
          return res.status(500).json({ message: "Hiba történt az ellenőrzés során." });
        }
        if (same) {
          return res.status(400).json({ message: "Az új jelszó nem lehet ugyanaz, mint a régi!" });
        }

        // Ha minden rendben van, akkor hash-eljük az új jelszót
        bcrypt.hash(newPassword, 10, (err, newHashedPassword) => {
          if (err) {
            return res.status(500).json({ message: "Hiba történt a jelszó hash-elésekor." });
          }

          const updateQuery = "UPDATE latogatok SET jelszo = ? WHERE felhasznalonev = ?";
          db.query(updateQuery, [newHashedPassword, username], (err, result) => {
            if (err) {
              return res.status(500).json({ message: "Hiba történt a jelszó frissítésekor." });
            }
            res.json({ message: "Jelszó sikeresen megváltoztatva!" });
          });
        });
      });
    });
  });
});



//----------------------------------------------------------------------------------------------

// Edzés hozzáadása az edző által
app.post("/coach/add-workout", (req, res) => {
  const { user_id, sport_id, hely, idonap, ido, leiras, vnev, knev, klubbnev } = req.body;

  console.log("Küldött adatok:", { user_id, sport_id, hely, idonap, ido, leiras, vnev, knev, klubbnev });

  // Ellenőrizzük, hogy minden szükséges mező meg van adva
  if (!user_id || !sport_id || !hely || !idonap || !ido) {
    return res.status(400).json({ error: "Minden kötelező mezőt ki kell tölteni!" });
  }

  // Ellenőrizzük, hogy sport_id és user_id számok
  if (isNaN(user_id) || isNaN(sport_id)) {
    return res.status(400).json({ error: "A user_id és sport_id számnak kell lennie!" });
  }

  // Ellenőrizzük, hogy a user_id létezik-e a latogatok táblában
  db.query("SELECT user_id FROM latogatok WHERE user_id = ?", [user_id], (err, userResult) => {
    if (err) {
      console.error("Hiba a felhasználó ellenőrzésekor:", err.message);
      return res.status(500).json({ error: "Adatbázis hiba", details: err.message });
    }
    if (userResult.length === 0) {
      return res.status(400).json({ error: "A felhasználó nem létezik!" });
    }

    // Ellenőrizzük, hogy a sport_id létezik-e a sport táblában
    db.query("SELECT sport_id FROM sport WHERE sport_id = ?", [sport_id], (err, sportResult) => {
      if (err) {
        console.error("Hiba a sport ellenőrzésekor:", err.message);
        return res.status(500).json({ error: "Adatbázis hiba", details: err.message });
      }
      if (sportResult.length === 0) {
        return res.status(400).json({ error: "A sport nem létezik!" });
      }

      const sql = `
        INSERT INTO klubbok (sport_id, user_id, vnev, knev, klubbnev, hely, idonap, ido, leiras, szabalyok)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)
      `;

      db.query(sql, [sport_id, user_id, vnev, knev, klubbnev, hely, idonap, ido, leiras], (err, result) => {
        if (err) {
          console.error("Hiba az edzés hozzáadásakor:", err.message);
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(500).json({ error: "Duplikált bejegyzés", details: err.message });
          }
          return res.status(500).json({ error: "Adatbázis hiba", details: err.message });
        }

        // Az újonnan hozzáadott edzés lekérdezése (visszaküldéshez)
        db.query(
          "SELECT * FROM klubbok WHERE sprotklub_id = LAST_INSERT_ID()",
          (err, newWorkout) => {
            if (err) {
              console.error("Hiba az új edzés lekérdezésekor:", err.message);
              return res.status(500).json({ error: "Adatbázis hiba", details: err.message });
            }
            res.json({ message: "Edzés sikeresen hozzáadva!", workout: newWorkout[0] });
          }
        );
      });
    });
  });
});

// Összes klub lekérdezése látogatóknak
app.get("/klubbok/all", (req, res) => {
  const query = `
    SELECT k.*, s.sportnev 
    FROM klubbok k 
    JOIN sport s ON k.sport_id = s.sport_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Hiba történt:", err);
      res.status(500).json({ error: "Adatbázis hiba" });
    } else {
      res.json(results);
    }
  });
});



// **Szerver indítása**
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Szerver fut az ${PORT}-es porton`);
});