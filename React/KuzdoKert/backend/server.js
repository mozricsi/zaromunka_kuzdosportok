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
  port: "3306",
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

//bejelentkezés
  app.post('/login', (req, res) => {
    const felhasznalonev = req.body.username;
    const jelszo = req.body.password;
  
    db.query(
      "SELECT * FROM latogatok WHERE felhasznalonev = ?",
      [felhasznalonev],
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

              db.query(
                "INSERT INTO latogatobejelentkezesek (user_id, bejelentkezes_ido) VALUES (?, NOW())",
                [req.session.user[0].user_id],
                (err,) => {
                  if (err) {
                    console.log("Hibák:" + err);
                    return res.status(500).send("Hiba a beszúrás során");
                  }
                  console.log("Az insert sikeresen lefutott.");
                }
              );

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

app.get('/ertekelesek/:sportklub_id', (req, res) => {
  const sportklub_id = req.params.sportklub_id;
  const query = `
    SELECT e.*, l.felhasznalonev 
    FROM ertekelesek e 
    JOIN latogatok l ON e.user_id = l.user_id 
    WHERE e.sportklub_id = ?
  `;
  
  db.query(query, [sportklub_id], (err, results) => {
    if (err) {
      console.error('Hiba az értékelések lekérésekor:', err);
      return res.status(500).json({ message: 'Hiba történt az értékelések lekérésekor.' });
    }
    res.json(results);
  });
});

// Új értékelés hozzáadása
app.post('/ertekelesek', (req, res) => {
  const { user_id, sportklub_id, szoveges_ertekeles, csillagos_ertekeles } = req.body;

  // Ellenőrizzük, hogy a felhasználó létezik-e és visitor szerepköre van-e
  const checkUserQuery = `SELECT role FROM latogatok WHERE user_id = ?`;
  db.query(checkUserQuery, [user_id], (err, results) => {
    if (err) {
      console.error('Hiba a felhasználó ellenőrzésekor:', err);
      return res.status(500).json({ message: 'Hiba történt a felhasználó ellenőrzésekor.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Felhasználó nem található.' });
    }

    const userRole = results[0].role;
    if (userRole !== 'visitor') {
      return res.status(403).json({ message: 'Csak látogatók adhatnak értékelést!' });
    }

    // Értékelés beszúrása
    const insertQuery = `
      INSERT INTO ertekelesek (user_id, sportklub_id, szoveges_ertekeles, csillagos_ertekeles)
      VALUES (?, ?, ?, ?)
    `;
    db.query(insertQuery, [user_id, sportklub_id, szoveges_ertekeles, csillagos_ertekeles], (err, result) => {
      if (err) {
        console.error('Hiba az értékelés hozzáadásakor:', err);
        return res.status(500).json({ message: 'Hiba történt az értékelés hozzáadása során.' });
      }
      res.json({ message: 'Értékelés sikeresen hozzáadva!' });
    });
  });
});



// Jelentkezés hozzáadása (ha még nincs ilyen endpoint)
app.post('/apply-workout', (req, res) => {
  const { user_id, sportklub_id } = req.body;

  const query = `
    INSERT INTO jelentkezes (user_id, sportkulb_id, jelentkezes_ido, elfogadasi_ido, elfogadva)
    VALUES (?, ?, NOW(), NOW(), 1)
  `;

  db.query(query, [user_id, sportklub_id], (err, result) => {
    if (err) {
      console.error('Hiba a jelentkezés hozzáadásakor:', err);
      return res.status(500).json({ message: 'Hiba történt a jelentkezés során.' });
    }
    res.json({ message: 'Sikeres jelentkezés!' });
  });
});

// Edzők értesítései a jelentkezésekről
app.get('/coach-notifications/:user_id', (req, res) => {
  const user_id = req.params.user_id;

  const query = `
    SELECT 
      j.jelentkezes_id,
      l.felhasznalonev AS visitor_username,
      k.klubbnev,
      k.hely,
      k.idonap,
      k.ido,
      j.jelentkezes_ido
    FROM jelentkezes j
    JOIN latogatok l ON j.user_id = l.user_id
    JOIN klubbok k ON j.sportkulb_id = k.sprotklub_id
    WHERE k.user_id = ?
      AND j.elfogadva = 1
    ORDER BY j.jelentkezes_ido DESC
    LIMIT 10
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('Hiba az edzői értesítések lekérdezésekor:', err);
      return res.status(500).json({ message: 'Hiba történt az értesítések lekérdezésekor.' });
    }
    res.json(results);
  });
});

// Értesítések lekérdezése a látogató számára
app.get('/notifications/:user_id', (req, res) => {
  const user_id = req.params.user_id;

  const query = `
    SELECT 
      j.jelentkezes_id,
      k.klubbnev,
      k.hely,
      k.idonap,
      k.ido,
      l.vnev AS coach_vnev,
      l.knev AS coach_knev
    FROM jelentkezes j
    JOIN klubbok k ON j.sportkulb_id = k.sprotklub_id
    JOIN latogatok l ON k.user_id = l.user_id
    WHERE j.user_id = ?
      AND k.idonap = DAYNAME(CURDATE())
      AND j.elfogadva = 1
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('Hiba az értesítések lekérdezésekor:', err);
      return res.status(500).json({ message: 'Hiba történt az értesítések lekérdezésekor.' });
    }
    res.json(results);
  });
});

// Jelentkezés hozzáadása (ha még nincs ilyen endpoint)
app.post('/apply-workout', (req, res) => {
  const { user_id, sportklub_id } = req.body;

  const query = `
    INSERT INTO jelentkezes (user_id, sportkulb_id, jelentkezes_ido, elfogadasi_ido, elfogadva)
    VALUES (?, ?, NOW(), NOW(), 1)
  `;

  db.query(query, [user_id, sportklub_id], (err, result) => {
    if (err) {
      console.error('Hiba a jelentkezés hozzáadásakor:', err);
      return res.status(500).json({ message: 'Hiba történt a jelentkezés során.' });
    }
    res.json({ message: 'Sikeres jelentkezés!' });
  });
});

//------------------------------------------------------------------------------

//edzésnapló hozzáadott edzések
app.get("/klubbok/all/:userId", (req, res) => {
  const { userId } = req.params;
 
  db.query("SELECT * FROM klubbok WHERE user_id = ?", [userId], (error, results) => {
      if (error) {
          console.error("Hiba az edzések lekérdezésekor:", error);
          return res.status(500).json({ message: "Hiba történt az edzések lekérdezésekor." });
      }
      res.json(results);
  });
});
//---------------------------------------------------------------------------------------

app.get('/applied-workouts/:userId', (req, res) => {
  const userId = req.params.userId;
  db.query(`
    SELECT k.sport_id 
    FROM applied_workouts a 
    JOIN sportklubbok k ON a.sportklub_id = k.sprotklub_id 
    WHERE a.user_id = ?
  `, [userId], (err, result) => {
    if (err) {
      res.status(500).json({ message: "Hiba a lekérdezés során" });
    } else {
      res.json(result); // [{ sport_id: 1 }, { sport_id: 2 }, ...]
    }
  });
});

//-------------------------------------------------------------------------------------------------------

// Összes edzés lekérdezése sport_id alapján (minden edzőtől)
app.get("/klubbok/sport/:sportId", (req, res) => {
  const sportId = req.params.sportId;
  const query = "SELECT * FROM klubbok WHERE sport_id = ?";

  db.query(query, [sportId], (err, results) => {
    if (err) {
      console.error("Hiba az edzések lekérdezésekor:", err);
      return res.status(500).json({ message: "Hiba történt az edzések lekérdezésekor." });
    }
    res.json(results);
  });
});


// **Szerver indítása**
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Szerver fut az ${PORT}-es porton`);
});