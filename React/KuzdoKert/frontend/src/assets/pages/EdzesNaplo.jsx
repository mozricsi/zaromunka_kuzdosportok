import React, { useState, useEffect } from 'react';
import '../Styles/EdzesNaplo.css';
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { FaSpinner } from 'react-icons/fa'; // Ikon a betöltéshez

const EdzesNaplo = () => {
  const [loginStatus, setLoginStatus] = useState("");
  const [userId, setUserId] = useState(null);
  const [trainings, setTrainings] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true); // Betöltési állapot
  const [participatedTrainings, setParticipatedTrainings] = useState(0); // Fejlődéskövetéshez
  const navigate = useNavigate();

  useEffect(() => {
    Axios.defaults.withCredentials = true;
    Axios.get("http://localhost:5000/login").then((response) => {
      if (response.data.loggedIn === true) {
        const user = response.data.user[0];
        setLoginStatus(user.felhasznalonev);
        setUserId(user.user_id);
        loadTrainings(user.user_id);
      } else {
        setMessage("Kérlek, jelentkezz be az edzésnapló megtekintéséhez!");
        navigate("/login");
      }
    }).catch((error) => {
      console.error("Hiba a bejelentkezés ellenőrzésekor:", error.response || error.message);
      setMessage("Hiba történt a bejelentkezés ellenőrzésekor.");
      navigate("/login");
    }).finally(() => {
      setLoading(false);
    });
  }, [navigate]);

  const loadTrainings = (userId) => {
    setLoading(true);
    Axios.get(`http://localhost:5000/edzesnaplo/${userId}`)
      .then((response) => {
        console.log("API válasz:", response.data);
        setTrainings(response.data);
        if (response.data.length === 0) {
          setMessage("Még nem jelentkeztél egyetlen edzésre sem.");
        } else {
          setMessage("");
        }
        // Fejlődéskövetés: Számoljuk meg az edzéseket (példa: az összes edzés)
        setParticipatedTrainings(response.data.length);
      })
      .catch((error) => {
        console.error("Hiba az edzések betöltésekor:", error.response?.data || error.message);
        setMessage(`Hiba történt az edzések betöltésekor: ${error.response?.data?.message || error.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const cancelTraining = (jelentkezesId) => {
    Swal.fire({
      title: 'Biztosan lemondod az edzést?',
      text: 'Ez a művelet nem vonható vissza!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Igen, lemondom!',
      cancelButtonText: 'Mégse',
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:5000/jelentkezes/${jelentkezesId}`, { withCredentials: true })
          .then((response) => {
            setMessage(response.data.message);
            setTrainings(trainings.filter((t) => t.jelentkezes_id !== jelentkezesId));
            loadTrainings(userId);
            Swal.fire('Lemondva!', 'Az edzés lemondása sikeres.', 'success');
          })
          .catch((error) => {
            console.error("Hiba a jelentkezés törlésekor:", error.response || error.message);
            setMessage(`Hiba történt a jelentkezés törlésekor: ${error.response?.data?.message || error.message}`);
            Swal.fire('Hiba!', 'Nem sikerült lemondani az edzést.', 'error');
          });
      } else {
        setMessage("A lemondás megszakítva.");
      }
    });
  };

  const formatDate = (day) => {
    const days = {
      Monday: 'Hétfő',
      Tuesday: 'Kedd',
      Wednesday: 'Szerda',
      Thursday: 'Csütörtök',
      Friday: 'Péntek',
      Saturday: 'Szombat',
      Sunday: 'Vasárnap',
    };
    return days[day] || day;
  };

  return (
    <div className="edzesnaplo-container">
      <h1>Edzésnapló</h1>
      <p>Üdv, {loginStatus || "Vendég"}! Itt láthatod, hogy mely edzésekre jelentkeztél.</p>

      {loading ? (
        <div className="loading-spinner">
          <FaSpinner size={40} />
        </div>
      ) : (
        <>
          {!loginStatus && (
            <p className="warning">{message}</p>
          )}

          {loginStatus && (
            <div className="training-list">
              <h2>Jelentkezett edzéseid</h2>
              {trainings.length === 0 ? (
                <p>{message || "Még nem jelentkeztél egyetlen edzésre sem."}</p>
              ) : (
                <ul>
                  {trainings.map((training) => (
                    <li key={training.jelentkezes_id} className="training-item">
                      <strong>{training.klubbnev}</strong> <br />
                      <strong>Sport:</strong> {training.sportnev} <br />
                      <strong>Helyszín:</strong> {training.hely} <br />
                      <strong>Pontos cím:</strong> {training.pontoscim} <br />
                      <strong>Nap:</strong> {formatDate(training.nap)} <br />
                      <strong>Idő:</strong> {training.ido} <br />
                      <button
                        className="cancel-button"
                        onClick={() => cancelTraining(training.jelentkezes_id)}
                      >
                        Lemondás
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {message && trainings.length === 0 && (
                <p className="message">{message}</p>
              )}
            </div>
          )}

          {/* Fejlődéskövetés */}
          {loginStatus && (
            <div className="progress-section">
              <h2>Fejlődésed nyomon követése</h2>
              <p>Jelenleg <strong>{participatedTrainings}</strong> edzésre jelentkeztél!</p>
              {participatedTrainings > 0 ? (
                <p>Gratulálunk! Folytasd így, és hamarosan elérheted céljaidat!</p>
              ) : (
                <p>Ne csüggedj! Nézd meg a közelgő edzéseket, és jelentkezz fel egyre!</p>
              )}
            </div>
          )}

          {/* Motivációs szöveg */}
          {loginStatus && (
            <div className="motivation-section">
              <h2>Motiváció a folytatáshoz</h2>
              <p>
                "Minden egyes edzés egy lépés közelebb visz a céljaidhoz. Ne add fel, a kitartásod meghozza a gyümölcsét!"
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EdzesNaplo;