import React, { useState, useEffect } from 'react';
import '../Styles/EdzesNaplo.css';
import Axios from 'axios';
import { useNavigate } from "react-router-dom";

const EdzesNaplo = () => {
  const [loginStatus, setLoginStatus] = useState("");
  const [userId, setUserId] = useState(null);
  const [trainings, setTrainings] = useState([]); // Jelentkezett edzések tárolása
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    Axios.defaults.withCredentials = true;
    Axios.get("http://localhost:5000/login").then((response) => {
      if (response.data.loggedIn === true) {
        const user = response.data.user[0];
        setLoginStatus(user.felhasznalonev);
        setUserId(user.user_id);
        loadTrainings(user.user_id); // Edzések betöltése
      } else {
        setMessage("Kérlek, jelentkezz be az edzésnapló megtekintéséhez!");
        navigate("/login");
      }
    });
  }, [navigate]);

  const loadTrainings = (userId) => {
    Axios.get(`http://localhost:5000/edzesnaplo/${userId}`)
      .then((response) => {
        setTrainings(response.data);
      })
      .catch((error) => {
        console.error("Hiba az edzések betöltésekor:", error);
        setMessage("Hiba történt az edzések betöltésekor.");
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
            <p>Még nem jelentkeztél egyetlen edzésre sem.</p>
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
                </li>
              ))}
            </ul>
          )}
          {message && <p className="message">{message}</p>}
        </div>
      )}
    </div>
  );
};

export default EdzesNaplo;