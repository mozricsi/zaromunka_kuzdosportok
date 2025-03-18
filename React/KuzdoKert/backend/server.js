const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
require("dotenv").config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "DELETE"],
  credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  key: "userId",
  secret: "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 1000000
  },
}));

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
  const role = req.body.role || "visitor";

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

// Felhasználónév ellenőrzés
app.post("/checkUsername", (req, res) => {
  const felhasznalonev = req.body.username;

  db.query(
    "SELECT felhasznalonev FROM kuzdosportok.latogatok WHERE felhasznalonev = ?",
    [felhasznalonev],
    (err, result) => {
      if (err) {
        res.status(500).send({ error: "Database error" });
      } else {
        console.log("SQL result:", result);
        res.send({ exists: result.length > 0 });
      }
    }
  );
});

// Bejelentkezés ellenőrzés
app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false, user: null });
  }
});

// Bejelentkezés
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
            res.send(result);

            db.query(
              "INSERT INTO latogatobejelentkezesek (user_id, bejelentkezes_ido) VALUES (?, NOW())",
              [req.session.user[0].user_id],
              (err) => {
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

// Kijelentkezés
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

// Felhasználói adatok frissítése
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
      return res.status(500).send("Hiba történt az adatok frissítése közben.");
    }

    console.log("✅ Profil sikeresen frissítve!");

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

// Jelszóváltoztatás
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

    bcrypt.compare(oldPassword, hashedPassword, (err, match) => {
      if (err) {
        return res.status(500).json({ message: "Hiba történt az ellenőrzés során." });
      }
      if (!match) {
        return res.status(400).json({ message: "A régi jelszó helytelen!" });
      }

      bcrypt.compare(newPassword, hashedPassword, (err, same) => {
        if (err) {
          return res.status(500).json({ message: "Hiba történt az ellenőrzés során." });
        }
        if (same) {
          return res.status(400).json({ message: "Az új jelszó nem lehet ugyanaz, mint a régi!" });
        }

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

// Sportok lekérése
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

// Klubok lekérése sport ID alapján
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

// Edzés hozzáadása az edző által (klub)
app.post("/coach/add-club", (req, res) => {
  const { user_id, sport_id, hely, szabalyok, leiras, vnev, knev, klubbnev } = req.body;

  console.log("Küldött adatok:", { user_id, sport_id, hely, szabalyok, leiras, vnev, knev, klubbnev });

  if (!user_id || !sport_id || !hely) {
    return res.status(400).json({ error: "Minden kötelező mezőt ki kell tölteni!" });
  }

  if (isNaN(user_id) || isNaN(sport_id)) {
    return res.status(400).json({ error: "A user_id és sport_id számnak kell lennie!" });
  }

  db.query("SELECT user_id FROM latogatok WHERE user_id = ?", [user_id], (err, userResult) => {
    if (err) {
      console.error("Hiba a felhasználó ellenőrzésekor:", err.message);
      return res.status(500).json({ error: "Adatbázis hiba", details: err.message });
    }
    if (userResult.length === 0) {
      return res.status(400).json({ error: "A felhasználó nem létezik!" });
    }

    db.query("SELECT sport_id FROM sport WHERE sport_id = ?", [sport_id], (err, sportResult) => {
      if (err) {
        console.error("Hiba a sport ellenőrzésekor:", err.message);
        return res.status(500).json({ error: "Adatbázis hiba", details: err.message });
      }
      if (sportResult.length === 0) {
        return res.status(400).json({ error: "A sport nem létezik!" });
      }

      const sql = `
        INSERT INTO klubbok (sport_id, user_id, vnev, knev, klubbnev, hely, leiras, szabalyok)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(sql, [sport_id, user_id, vnev, knev, klubbnev, hely, leiras, szabalyok], (err, result) => {
        if (err) {
          console.error("Hiba az edzés hozzáadásakor:", err.message);
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(500).json({ error: "Duplikált bejegyzés", details: err.message });
          }
          return res.status(500).json({ error: "Adatbázis hiba", details: err.message });
        }

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

// Értékelések lekérdezése
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
      console.error('Hiba az értékelések lekérdezésekor:', err);
      return res.status(500).json({ message: 'Hiba történt az értékelések lekérdezésekor.' });
    }
    res.json(results);
  });
});

// Új értékelés hozzáadása
app.post('/ertekelesek', (req, res) => {
  const { user_id, sportklub_id, szoveges_ertekeles, csillagos_ertekeles } = req.body;

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

// Jelentkezés hozzáadása
app.post('/apply-workout', (req, res) => {
  const { user_id, edzes_id } = req.body;

  const query = `
    INSERT INTO jelentkezes (user_id, edzes_id, jelentkezes_ido)
    VALUES (?, ?, NOW())
  `;

  db.query(query, [user_id, edzes_id], (err, result) => {
    if (err) {
      console.error('Hiba a jelentkezés hozzáadásakor:', err);
      return res.status(500).json({ message: 'Hiba történt a jelentkezés során.' });
    }
    res.json({ message: 'Sikeres jelentkezés az edzésre!' });
  });
});

// Ellenőrző végpont: már jelentkezett-e a felhasználó
app.get('/api/jelentkezes/check', (req, res) => {
  const { user_id, edzes_id } = req.query;

  const query = `
    SELECT * FROM jelentkezes 
    WHERE user_id = ? AND edzes_id = ?
  `;

  db.query(query, [user_id, edzes_id], (err, result) => {
    if (err) {
      console.error('Hiba a jelentkezés ellenőrzésekor:', err);
      return res.status(500).json({ message: 'Hiba történt az ellenőrzés során.' });
    }

    if (result.length > 0) {
      res.json({ alreadyApplied: true });
    } else {
      res.json({ alreadyApplied: false });
    }
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
      e.nap,
      e.ido,
      l.vnev AS coach_vnev,
      l.knev AS coach_knev
    FROM jelentkezes j
    JOIN klubbok k ON j.sportklub_id = k.sprotklub_id
    JOIN latogatok l ON k.user_id = l.user_id
    JOIN klub_edzesek e ON k.sprotklub_id = e.sportklub_id
    WHERE j.user_id = ?
      AND e.nap = DAYNAME(CURDATE())
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

// Edzők értesítései a jelentkezésekről
app.get('/coach-notifications/:user_id', (req, res) => {
  const user_id = req.params.user_id;

  const query = `
    SELECT 
      j.jelentkezes_id,
      l.felhasznalonev AS visitor_username,
      k.klubbnev,
      k.hely,
      e.nap,
      e.ido,
      j.jelentkezes_ido
    FROM jelentkezes j
    JOIN latogatok l ON j.user_id = l.user_id
    JOIN klubbok k ON j.sportklub_id = k.sprotklub_id
    JOIN klub_edzesek e ON k.sprotklub_id = e.sportklub_id
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

// Edzésnapló - edző által hozzáadott edzések lekérdezése
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

// Összes edzés lekérdezése sport_id alapján
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

// Edzés hozzáadása
app.post("/coach/add-workout", async (req, res) => {
  try {
    const { pontosCim, nap, ido, sportklub_id } = req.body;
    console.log({ pontosCim, nap, ido, sportklub_id });

    if (!pontosCim || !nap || !ido || !sportklub_id) {
      return res.status(400).json({ message: "Minden mező kitöltése kötelező!" });
    }

    const query = `
      INSERT INTO klub_edzesek (sportklub_id, pontosCim, nap, ido)
      VALUES (?, ?, ?, ?)
    `;
    db.query(query, [sportklub_id, pontosCim, nap, ido]);

    res.status(201).json({ message: "Edzés sikeresen hozzáadva!" });
  } catch (error) {
    console.error("Hiba az edzés hozzáadásakor:", error);
    res.status(500).json({ message: "Szerverhiba az edzés hozzáadása során." });
  }
});

// Klub és edzés lekérdezése
app.get('/api/klub/:id', (req, res) => {
  const klubId = req.params.id;

  const klubQuery = `
    SELECT * FROM klubbok WHERE sprotklub_id = ?;
  `;
  db.query(klubQuery, [klubId], (err, klubResult) => {
    if (err) {
      return res.status(500).json({ error: 'Hiba történt a klub adatainak lekérésekor.' });
    }

    const edzesQuery = `
      SELECT * FROM klub_edzesek WHERE sportklub_id = ?;
    `;
    db.query(edzesQuery, [klubId], (err, edzesResult) => {
      if (err) {
        return res.status(500).json({ error: 'Hiba történt az edzések lekérdezésekor.' });
      }

      res.json({ klub: klubResult[0], edzesek: edzesResult });
    });
  });
});

// Ranglista lekérdezése
app.get('/api/ranglista', (req, res) => {
  const query = `
    SELECT 
      l.felhasznalonev,
      COUNT(e.edzes_id) AS edzesek
    FROM latogatok l
    LEFT JOIN klubbok k 
      ON l.user_id = k.user_id
    LEFT JOIN klub_edzesek e 
      ON k.sprotklub_id = e.sportklub_id
    WHERE l.role = 'coach'
    GROUP BY l.user_id, l.felhasznalonev
    ORDER BY edzesek DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Hiba a ranglista lekérdezésekor:', err.message);
      return res.status(500).json({ error: 'Hiba történt: ' + err.message });
    }
    res.json(results);
  });
});
// Események lekérdezése
app.get('/api/esemenyek', (req, res) => {
  const query = `
    SELECT esemeny_id, user_id, latogato_resztvevo, pontos_cim, ido, sportneve, 
           leiras, szervezo_neve, szervezo_tel, szervezo_email, esemeny_weboldal
    FROM esemenyek
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Lekérdezési hiba:', err.message); // Részletes hibaüzenet
      return res.status(500).json({ error: 'Lekérdezési hiba: ' + err.message });
    }
    res.json(results);
  });
});


// Üzenetek lekérdezése
app.get('/api/uzenetek', (req, res) => {
  const query = `
    SELECT u.uzenet_id, u.user_id, u.felhasznalonev, u.uzenet, u.ido
    FROM uzenetek u
    ORDER BY u.ido DESC
    LIMIT 50
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Hiba az üzenetek lekérdezésekor:', err);
      return res.status(500).json({ message: 'Hiba történt az üzenetek lekérdezésekor.' });
    }
    res.json(results);
  });
});

// Aktív stream lekérdezése
app.get('/api/streams/active', (req, res) => {
  const query = `
    SELECT stream_url
    FROM streams
    WHERE status = 'online'
    ORDER BY stream_id DESC
    LIMIT 1
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Lekérdezési hiba:', err.message);
      return res.status(500).json({ error: 'Hiba történt' });
    }
    res.json(results.length > 0 ? results[0] : []);
  });
});

// Stream indítása
app.post('/api/streams/start', (req, res) => {
  const { userId, streamUrl } = req.body;
  if (!userId || !streamUrl) {
    return res.status(400).json({ error: 'Hiányzó paraméterek' });
  }
  const query = 'UPDATE streams SET status = ?, stream_url = ? WHERE user_id = ? AND status = ?';
  db.query(query, ['online', streamUrl, userId, 'offline'], (err, result) => {
    if (err) {
      console.error('Hiba a stream indításakor:', err.message);
      return res.status(500).json({ error: 'Hiba a stream indításakor' });
    }
    if (result.affectedRows === 0) {
      // Ha nincs offline stream, hozz létre újat
      const insertQuery = 'INSERT INTO streams (user_id, stream_url, status) VALUES (?, ?, ?)';
      db.query(insertQuery, [userId, streamUrl, 'online'], (err) => {
        if (err) {
          console.error('Hiba az új stream létrehozásakor:', err.message);
          return res.status(500).json({ error: 'Hiba az új stream létrehozásakor' });
        }
        res.json({ message: 'Stream elindítva' });
      });
    } else {
      res.json({ message: 'Stream elindítva' });
    }
  });
});

// Stream leállítása
app.post('/api/streams/stop', (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'Hiányzó paraméterek' });
  }
  const query = 'UPDATE streams SET status = ? WHERE user_id = ? AND status = ?';
  db.query(query, ['offline', userId, 'online'], (err, result) => {
    if (err) {
      console.error('Hiba a stream leállításakor:', err.message);
      return res.status(500).json({ error: 'Hiba a stream leállításakor' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Nincs aktív stream' });
    }
    res.json({ message: 'Stream leállítva' });
  });
});






// Klub törlése
app.delete("/clubs/:sprotklubId", (req, res) => {
  const { sprotklubId } = req.params;

  const query = "DELETE FROM klubbok WHERE sprotklub_id = ?";

  db.query(query, [sprotklubId], (error, result) => {
    if (error) {
      console.error("Hiba a klub törlésekor:", error);
      return res.status(500).json({ message: "Hiba történt a klub törlésekor." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "A klub nem található." });
    }
    res.json({ message: "Klub sikeresen törölve!" });
  });
});






// Edzések lekérdezése az edző számára
app.get("/workouts/:userId", (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT 
      ke.edzes_id, 
      ke.sportklub_id, 
      ke.pontoscim, 
      ke.nap, 
      ke.ido, 
      k.klubbnev, 
      k.hely, 
      k.sport_id,
      s.sportnev
    FROM klub_edzesek ke
    JOIN klubbok k ON ke.sportklub_id = k.sprotklub_id
    JOIN sport s ON k.sport_id = s.sport_id
    WHERE k.user_id = ?
  `;

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Hiba az edzések lekérdezésekor:", error);
      return res.status(500).json({ message: "Hiba történt az edzések lekérdezésekor." });
    }
    res.json(results);
  });
});



// Edzés törlése
app.delete("/workouts/:edzesId", (req, res) => {
  const { edzesId } = req.params;

  const query = "DELETE FROM klub_edzesek WHERE edzes_id = ?";

  db.query(query, [edzesId], (error, result) => {
    if (error) {
      console.error("Hiba az edzés törlésekor:", error);
      return res.status(500).json({ message: "Hiba történt az edzés törlésekor." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Az edzés nem található." });
    }
    res.json({ message: "Edzés sikeresen törölve!" });
  });
});




// **Szerver indítása**
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Szerver fut az ${PORT}-es porton`);
});