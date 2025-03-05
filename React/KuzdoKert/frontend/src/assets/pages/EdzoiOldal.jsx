import React, { useState, useEffect } from "react";
import Axios from 'axios';
import '../Styles/EdzoiOldal.css';
import { useNavigate } from "react-router-dom";

const EdzoiOldal = () => {
  const [loginStatus, setLoginStatus] = useState("");
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userVnev, setUserVnev] = useState(""); // Vezetéknév tárolása
  const [userKnev, setUserKnev] = useState(""); // Keresztnév tárolása
  const [workouts, setWorkouts] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [sportId, setSportId] = useState("");
  const [hely, setHely] = useState("");
  const [idonap, setIdonap] = useState("");
  const [ido, setIdo] = useState("");
  const [leiras, setLeiras] = useState("");

  const sports = [
    { id: 1, name: "Box" },
    { id: 2, name: "Judo" },
    { id: 3, name: "Jiu Jitsu" },
    { id: 4, name: "Muay Thai" },
    { id: 5, name: "K1" },
    { id: 6, name: "Birkózás" },
    { id: 7, name: "Kickbox" },
    { id: 8, name: "MMA" },
  ];

  useEffect(() => {
    Axios.defaults.withCredentials = true;
    Axios.get("http://localhost:5000/login").then((response) => {
      if (response.data.loggedIn === true) {
        const user = response.data.user[0];
        setLoginStatus(user.felhasznalonev);
        setUserId(user.user_id);
        setUserRole(user.role);
        setUserVnev(user.vnev || "Edző");
        setUserKnev(user.knev || "Edző");
        if (user.role !== "coach") {
          setMessage("Ez az oldal csak edzők számára elérhető!");
          navigate("/profil");
        } else {
          loadWorkouts(user.user_id);
        }
      } else {
        setMessage("Kérlek, jelentkezz be edzőként!");
        navigate("/login");
      }
    });
  }, [navigate]);

  const loadWorkouts = (userId) => {
    Axios.get(`http://localhost:5000/klubbok/all`).then((response) => {
      const userWorkouts = response.data.filter(workout => workout.user_id === userId);
      setWorkouts(userWorkouts);
    }).catch((error) => {
      console.error("Hiba az edzések betöltésekor:", error);
      setMessage("Hiba történt az edzések betöltésekor.");
    });
  };

  const addWorkout = async (e) => {
    e.preventDefault();

    if (!sportId || !hely || !idonap || !ido) {
      setMessage("Minden kötelező mezőt ki kell tölteni!");
      return;
    }

    try {
      console.log("Küldött adatok:", {
        user_id: userId,
        sport_id: parseInt(sportId, 10),
        hely,
        idonap,
        ido,
        leiras: leiras || "Nincs leírás megadva",
        vnev: userVnev,
        knev: userKnev,
        klubbnev: `${loginStatus} Klubja` || "Edző Klubbja",
      });

      const response = await Axios.post("http://localhost:5000/coach/add-workout", {
        user_id: userId,
        sport_id: parseInt(sportId, 10),
        hely,
        idonap,
        ido,
        leiras: leiras || "Nincs leírás megadva",
        vnev: userVnev,
        knev: userKnev,
        klubbnev: `${loginStatus} Klubja` || "Edző Klubbja",
      });

      setMessage(response.data.message);
      loadWorkouts(userId); // Frissítjük az edzéseket az adatbázisból
      setSportId("");
      setHely("");
      setIdonap("");
      setIdo("");
      setLeiras("");
    } catch (error) {
      console.error("Hiba az edzés hozzáadásakor:", error.response ? error.response.data : error.message);
      setMessage(`Hiba történt az edzés hozzáadása során: ${error.message}`);
    }
  };

  return (
    <div className="coach-container">
      <h1>Edzői oldal</h1>
      <p>Üdv, {loginStatus || "Vendég"}! Itt adhatsz fel edzéseket, amelyekre a látogatók jelentkezhetnek.</p>

      {!loginStatus && <p className="warning">{message}</p>}

      {loginStatus && userRole === "coach" && (
        <>
          <form onSubmit={addWorkout} className="workout-form">
            <div className="form-group">
              <label>Sport: <span className="required">*</span></label>
              <select
                value={sportId}
                onChange={(e) => setSportId(e.target.value)}
                required
              >
                <option value="">Válassz sportot</option>
                {sports.map((sport) => (
                  <option key={sport.id} value={sport.id}>
                    {sport.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Helyszín: <span className="required">*</span></label>
              <input
                type="text"
                placeholder="Pl. Szolnok, Sportcsarnok"
                value={hely}
                onChange={(e) => setHely(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Időnap: <span className="required">*</span></label>
              <select
                value={idonap}
                onChange={(e) => setIdonap(e.target.value)}
                required
              >
                <option value="">Válassz napot</option>
                <option value="Hétfő">Hétfő</option>
                <option value="Kedd">Kedd</option>
                <option value="Szerda">Szerda</option>
                <option value="Csütörtök">Csütörtök</option>
                <option value="Péntek">Péntek</option>
                <option value="Szombat">Szombat</option>
                <option value="Vasárnap">Vasárnap</option>
              </select>
            </div>

            <div className="form-group">
              <label>Időpont: <span className="required">*</span></label>
              <input
                type="time"
                value={ido}
                onChange={(e) => setIdo(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Leírás (opcionális):</label>
              <textarea
                placeholder="Pl. Kezdőknek szóló edzés..."
                value={leiras}
                onChange={(e) => setLeiras(e.target.value)}
              />
            </div>

            <button type="submit" className="add-button">Edzés hozzáadása</button>
          </form>

          <div className="workout-list">
            <h2>Feltöltött edzéseid</h2>
            {workouts.length === 0 ? (
              <p>Még nem adtál fel edzést.</p>
            ) : (
              <ul>
                {workouts.map((workout) => (
                  <li key={workout.sprotklub_id} className="workout-item">
                    <strong>{sports.find(s => s.id === workout.sport_id)?.name}</strong> - {workout.hely}, {workout.idonap} {workout.ido} <br />
                    Leírás: {workout.leiras}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {message && <p className="message">{message}</p>}
        </>
      )}
    </div>
  );
};

export default EdzoiOldal;