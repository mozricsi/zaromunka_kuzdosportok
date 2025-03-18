import React, { useState, useEffect } from "react";
import Axios from 'axios';
import Swal from 'sweetalert2'; // Importáljuk a SweetAlert2-t
import '../Styles/EdzoiOldal.css';
import { useNavigate } from "react-router-dom";

const EdzoiOldal = () => {
  const [loginStatus, setLoginStatus] = useState("");
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userVnev, setUserVnev] = useState("");
  const [userKnev, setUserKnev] = useState("");
  const [workouts, setWorkouts] = useState([]); // Klubbok tárolása
  const [trainings, setTrainings] = useState([]); // Edzések tárolása
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

  const [streamStatus, setStreamStatus] = useState('offline');
  const [streamUrl, setStreamUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ');

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
          loadTrainings(user.user_id);
          checkStreamStatus(user.user_id);
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
    return () => clearInterval(intervalId);
  };

  const loadTrainings = (userId) => {
    const intervalId = setInterval(() => {
      Axios.get(`http://localhost:5000/workouts/${userId}`)
        .then((response) => {
          setTrainings(response.data);
        })
        .catch((error) => {
          console.error("Hiba az edzések betöltésekor:", error);
          setMessage("Hiba történt az edzések betöltésekor.");
        });
    }, 1000);
    return () => clearInterval(intervalId);
  };

  const deleteClub = (sprotklubId) => {
    Swal.fire({
      title: 'Biztosan törölni szeretnéd ezt a klubbot?',
      text: 'Ez a művelet nem vonható vissza, és a kapcsolódó edzések is törlődnek!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Igen, töröld!',
      cancelButtonText: 'Mégse',
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:5000/clubs/${sprotklubId}`, { withCredentials: true })
          .then((response) => {
            setMessage(response.data.message);
            setWorkouts(workouts.filter((workout) => workout.sprotklub_id !== sprotklubId));
            // Opcionálisan frissíthetjük az edzéseket is, ha kaszkád törlés van
            loadTrainings(userId);
          })
          .catch((error) => {
            console.error("Hiba a klub törlésekor:", error.message, error.response);
            setMessage(`Hiba történt a klub törlésekor: ${error.message}`);
          });
      } else {
        setMessage("A törlés megszakítva.");
      }
    });
  };

  const deleteTraining = (edzesId) => {
    Swal.fire({
      title: 'Biztosan törölni szeretnéd ezt az edzést?',
      text: 'Ez a művelet nem vonható vissza!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Igen, töröld!',
      cancelButtonText: 'Mégse',
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:5000/workouts/${edzesId}`, { withCredentials: true })
          .then((response) => {
            setMessage(response.data.message);
            setTrainings(trainings.filter((training) => training.edzes_id !== edzesId));
          })
          .catch((error) => {
            console.error("Hiba az edzés törlésekor:", error.message, error.response);
            setMessage(`Hiba történt az edzés törlésekor: ${error.message}`);
          });
      } else {
        setMessage("A törlés megszakítva.");
      }
    });
  };

  const checkStreamStatus = (userId) => {
    Axios.get('http://localhost:5000/api/streams/active')
      .then(response => {
        if (response.data.stream_url) {
          setStreamStatus('online');
          setStreamUrl(response.data.stream_url);
        }
      })
      .catch(error => {
        console.error('Hiba a stream státusz lekérdezésekor:', error);
      });
  };

  const startStream = () => {
    Axios.post('http://localhost:5000/api/streams/start', { userId, streamUrl })
      .then(response => {
        setStreamStatus('online');
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Hiba a stream indításakor:', error);
        setMessage('Hiba a stream indításakor');
      });
  };

  const stopStream = () => {
    Axios.post('http://localhost:5000/api/streams/stop', { userId })
      .then(response => {
        setStreamStatus('offline');
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Hiba a stream leállításakor:', error);
        setMessage('Hiba a stream leállításakor');
      });
  };

  const addClub = async (e) => {
    e.preventDefault();

    if (!sportId || !hely) {
      setMessage("Minden kötelező mezőt ki kell tölteni!");
      return;
    }

    try {
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
      loadWorkouts(userId);
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

  const addWorkout = async (e) => {
    e.preventDefault();

    if (!sprotklub_id || !pontosCim || !nap || !ido) {
      setMessage("Minden kötelező mezőt ki kell tölteni!");
      return;
    }

    try {
      const response = await Axios.post("http://localhost:5000/coach/add-workout", {
        pontosCim,
        nap: nap,
        ido: ido,
        sportklub_id: parseInt(sprotklub_id, 10),
      });

      setMessage(response.data.message);
      loadTrainings(userId);
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

  return (
    <div className="coach-container">
      <h1>Edzői oldal</h1>
      <p>Üdv, {loginStatus || "Vendég"}! Itt adhatsz fel edzéseket, amelyekre a látogatók jelentkezhetnek.</p>

      {!loginStatus && <p className="warning">{message}</p>}

      {loginStatus && userRole === "coach" && (
        <>
          {/* Klubb hozzáadása */}
          <form onSubmit={addClub} className="workout-form">
            <div className="form-group">
              <label>Sport: <span className="required">*</span></label>
              <select value={sportId} onChange={(e) => setSportId(e.target.value)} required>
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
              <input type="text" placeholder="Pl. Szolonki boxklub" value={klubbNev} onChange={(e) => setKlubbNev(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Város: <span className="required">*</span></label>
              <input type="text" placeholder="Pl. Szolnok" value={hely} onChange={(e) => setHely(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Szabályok:</label>
              <textarea placeholder="Klubb szabályzat, Pl. sportcipő..." value={szabalyok} onChange={(e) => setSzabalyok(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Leírás (opcionális):</label>
              <textarea placeholder="Pl. Kezdőknek szóló edzés..." value={leiras} onChange={(e) => setLeiras(e.target.value)} />
            </div>
            <button type="submit" className="add-button">Klubb hozzáadása</button>
          </form>

          {/* Edzés hozzáadása */}
          <form onSubmit={addWorkout} className="workout-form">
            <div className="form-group">
              <label>Klubb: <span className="required">*</span></label>
              <select value={sprotklub_id} onChange={(e) => setSportKlubId(e.target.value)} required>
                <option value="">Válassz klubot</option>
                {workouts.map((workout) => (
                  <option key={workout.sprotklub_id} value={workout.sprotklub_id}>
                    {workout.klubbnev}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Pontos cím: <span className="required">*</span></label>
              <input type="text" placeholder="Pl. Szolnok, Sportcsarnok" value={pontosCim} onChange={(e) => setPontosCim(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Nap: <span className="required">*</span></label>
              <select value={nap} onChange={(e) => setNap(e.target.value)} required>
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
              <input type="time" value={ido} onChange={(e) => setIdo(e.target.value)} required />
            </div>
            <button type="submit" className="add-button">Edzés hozzáadása</button>
          </form>

          {/* Stream kezelés szekció */}
          <div className="stream-section">
            <h2>Élő Stream Kezelése</h2>
            <p>Stream státusz: {streamStatus === 'online' ? 'Fut' : 'Leállítva'}</p>
            <div className="form-group">
              <label>Stream URL (pl. YouTube embed link): <span className="required">*</span></label>
              <input type="text" value={streamUrl} onChange={(e) => setStreamUrl(e.target.value)} placeholder="https://www.youtube.com/embed/..." required />
            </div>
            <button onClick={startStream} disabled={streamStatus === 'online'} className="stream-button">Stream indítása</button>
            <button onClick={stopStream} disabled={streamStatus === 'offline'} className="stream-button">Stream leállítása</button>
          </div>

          {/* Klubbok listája */}
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
                    Leírás: {workout.leiras} <br />
                    <button onClick={() => deleteClub(workout.sprotklub_id)}>Törlés</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Edzések listája */}
          <div className="workout-list">
            <h2>Feltöltött edzéseid</h2>
            {trainings.length === 0 ? (
              <p>Még nem adtál hozzá edzést.</p>
            ) : (
              <ul>
                {trainings.map((training) => (
                  <li key={training.edzes_id} className="workout-item">
                    <strong>{training.klubbnev}</strong> <br />
                    <strong>{training.sportnev}</strong> - {training.hely}<br />
                    Pontos cím: {training.pontoscim} <br />
                    Nap: {training.nap} <br />
                    Idő: {training.ido} <br />
                    <button onClick={() => deleteTraining(training.edzes_id)}>Törlés</button>
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