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
  const [sprotklub_id, setSportKlubId] = useState("");
  const [klubbNev, setKlubbNev] = useState("");
  const [szabalyok, setSzabalyok] = useState("");
  const [hely, setHely] = useState("");
  const [pontosCim, setPontosCim] = useState("");
  const [nap, setNap] = useState("");
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
    const intervalId = setInterval(() => {
      Axios.get(`http://localhost:5000/klubbok/all/${userId}`)
        .then((response) => {
          setWorkouts(response.data);
        })
        .catch((error) => {
          console.error("Hiba az edzések betöltésekor:", error);
          setMessage("Hiba történt az edzések betöltésekor.");
        });
    }, 1000);
};



//klubb hozzáadása


  const addClub = async (e) => {
    e.preventDefault();

    if (!sportId || !hely) {
      setMessage("Minden kötelező mezőt ki kell tölteni!");
      return;
    }

    try {
      console.log("Küldött adatok:", {
        user_id: userId,
        sport_id: parseInt(sportId, 10),
        hely,
        leiras: leiras || "Nincs leírás megadva",
        szabalyok: szabalyok,
        vnev: userVnev,
        knev: userKnev,
        klubbnev: klubbNev,
      });

      const response = await Axios.post("http://localhost:5000/coach/add-club", {
        user_id: userId,
        sport_id: parseInt(sportId, 10),
        hely,
        leiras: leiras || "Nincs leírás megadva",
        szabalyok: szabalyok || "Nincs szabály megadva",
        vnev: userVnev,
        knev: userKnev,
        klubbnev: klubbNev,
      });

      setMessage(response.data.message);
      loadWorkouts(userId); // Frissítjük az edzéseket az adatbázisból
      setSportId("");
      setKlubbNev("");
      setHely("");
      setNap("");
      setIdo("");
      setSzabalyok("");
      setLeiras("");
    } catch (error) {
      console.error("Hiba az edzés hozzáadásakor:", error.response ? error.response.data : error.message);
      setMessage(`Hiba történt az edzés hozzáadása során: ${error.message}`);
    }
  };

  //-------------------------------------------------------------------------------------


  //edzés hozzáadása

  const addWorkout = async (e) => {
    e.preventDefault();

    if (klubbNev || !pontosCim || !nap || !ido) {
      setMessage("Minden kötelező mezőt ki kell tölteni!");
      return;
    }

    try {
      console.log("Küldött adatok:", {
        pontosCim,
        nap: nap,
        ido: ido,
        sprotklub_id,
      });

      const response = await Axios.post("http://localhost:5000/coach/add-workout", {
        pontosCim,
        nap: nap,
        ido: ido,
        sprotklub_id: sprotklub_id,
      });

      setMessage(response.data.message);
      loadWorkouts(userId); // Frissítjük az edzéseket az adatbázisból
      setKlubbNev("");
      setPontosCim("");
      setNap("");
      setIdo("");
      setSportKlubId("");
    } catch (error) {
      console.error("Hiba az edzés hozzáadásakor:", error.response ? error.response.data : error.message);
      setMessage(`Hiba történt az edzés hozzáadása során: ${error.message}`);
    }
  };
  
  //-----------------------------------------------------------------------------------------



  return (
    <div className="coach-container">
      <h1>Edzői oldal</h1>
      <p>Üdv, {loginStatus || "Vendég"}! Itt adhatsz fel edzéseket, amelyekre a látogatók jelentkezhetnek.</p>

      {!loginStatus && <p className="warning">{message}</p>}

      {loginStatus && userRole === "coach" && (
        <>

        {/**klubb hozzáadása */}

        <form onSubmit={addClub} className="workout-form">
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
              <label>Klubb név <span className="required">*</span></label>
              <input
                type="text"
                placeholder="Pl. Szolonki boxklub"
                value={klubbNev}
                onChange={(e) => setKlubbNev(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Város: <span className="required">*</span></label>
              <input
                type="text"
                placeholder="Pl. Szolnok"
                value={hely}
                onChange={(e) => setHely(e.target.value)}
                required
              />
            </div>

                
            <div className="form-group">
              <label>Szabályok:</label>
              <textarea
                placeholder="Klubb szabályzat, Pl. sportcipő..."
                value={szabalyok}
                onChange={(e) => setSzabalyok(e.target.value)}
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

            <button type="submit" className="add-button">Klubb hozzáadása</button>
          </form>


      {/*edzés hozzáadása--------------------------------------------------------------------------------------------------------*/}
        

          <form onSubmit={addWorkout} className="workout-form">
          <div className="form-group">
          <label>Klubb: <span className="required">*</span></label>
          <select
            value={sprotklub_id}
            onChange={(e) => setSportKlubId(e.target.value)} // Az ID-t tároljuk
            required
          >
            <option value="">Válassz klubot</option>
            {workouts.map((workout) => (
              <option key={workout.sportklub_id} value={workout.sportklub_id}>
                {workout.klubbnev}
              </option>
            ))}
          </select>
        </div>


            <div className="form-group">
              <label>Pontos cím: <span className="required">*</span></label>
              <input
                type="text"
                placeholder="Pl. Szolnok, Sportcsarnok"
                value={pontosCim}
                onChange={(e) => setPontosCim(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Nap: <span className="required">*</span></label>
              <select
                value={nap}
                onChange={(e) => setNap(e.target.value)}
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

            <button type="submit" className="add-button">Edzés hozzáadása</button>
          </form>

          <div className="workout-list">
            <h2>Feltöltött klubbjaid</h2>
            {workouts.length === 0 ? (
              <p>Még nem adtál hozzá klubbot.</p>
            ) : (
              <ul>
                {workouts.map((workout) => (
                  <li key={workout.sprotklub_id} className="workout-item">
                    <strong>{workout.klubbnev}</strong> <br />
                    <strong>{sports.find(s => s.id === workout.sport_id)?.name}</strong> - {workout.hely}<br />
                    Szabályok: {workout.szabalyok} <br />
                    Leírás: {workout.leiras}
                  </li>
                ))}
              </ul>
            )}
          </div>

            <br />

          <div className="workout-list">
            <h2>Feltöltött edzéseid</h2>
            {workouts.length === 0 ? (
              <p>Még nem adtál hozzá egy klubbhoz sem edzést.</p>
            ) : (
              <ul>
                {workouts.map((workout) => (
                  <li key={workout.sprotklub_id} className="workout-item">
                    <strong>{workout.klubbnev}</strong> <br />
                    <strong>{sports.find(s => s.id === workout.sport_id)?.name}</strong> - {workout.hely}<br />
                    Szabályok: {workout.szabalyok} <br />
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