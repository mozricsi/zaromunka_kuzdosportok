import React, { useState, useEffect } from 'react';
import '../Styles/EdzesNaplo.css';
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const EdzesNaplo = () => {
  const [loginStatus, setLoginStatus] = useState("");
  const [userId, setUserId] = useState(null);
  const [trainings, setTrainings] = useState([]);
  const [message, setMessage] = useState("");
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
    });
  }, [navigate]);

  const loadTrainings = (userId) => {
    Axios.get(`http://localhost:5000/edzesnaplo/${userId}`)
      .then((response) => {
        console.log("API válasz:", response.data);
        setTrainings(response.data);
        if (response.data.length === 0) {
          setMessage("Még nem jelentkeztél egyetlen edzésre sem.");
        } else {
          setMessage("");
        }
      })
      .catch((error) => {
        console.error("Hiba az edzések betöltésekor:", error.response?.data || error.message);
        setMessage(`Hiba történt az edzések betöltésekor: ${error.response?.data?.message || error.message}`);
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
            // Frissítjük az edzéslistát a törlés után
            setTrainings(trainings.filter((t) => t.jelentkezes_id !== jelentkezesId));
            // Újratöltjük az adatokat az eredeti listából
            loadTrainings(userId);
          })
          .catch((error) => {
            console.error("Hiba a jelentkezés törlésekor:", error.response || error.message);
            setMessage(`Hiba történt a jelentkezés törlésekor: ${error.response?.data?.message || error.message}`);
          });
      } else {
        setMessage("A lemondás megszakítva.");
      }
    });
  };

  return (
    <div className="edzesnaplo-container">
      <h1>Edzésnapló</h1>
      <p>Üdv, {loginStatus || "Vendég"}! Itt láthatod, hogy mely edzésekre jelentkeztél.</p>

      {!loginStatus && <p className="warning">{message}</p>}

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
                  <strong>Nap:</strong> {training.nap} <br />
                  <strong>Idő:</strong> {training.ido} <br />
                  <button onClick={() => cancelTraining(training.jelentkezes_id)} className="cancel-button">
                    Lemondás
                  </button>
                </li>
              ))}
            </ul>
          )}
          {message && trainings.length === 0 && <p className="message">{message}</p>}
        </div>
      )}
    </div>
  );
};

export default EdzesNaplo;