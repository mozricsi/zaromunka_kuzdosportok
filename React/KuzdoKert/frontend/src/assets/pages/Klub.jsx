// Klub.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt } from 'react-icons/fa'; // Ikonok importálása
import "../Styles/klub.css";

const Klub = () => {
  const { id } = useParams();
  const [klub, setKlub] = useState(null);
  const [edzesek, setEdzesek] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loginStatus, setLoginStatus] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/login', { withCredentials: true })
      .then((response) => {
        if (response.data.loggedIn === true) {
          setUserId(response.data.user[0].user_id);
          setLoginStatus(true);
        } else {
          setLoginStatus(false);
        }
      })
      .catch((error) => {
        console.error('Hiba történt a bejelentkezés ellenőrzésekor:', error);
        setLoginStatus(false);
      });

    axios.get(`http://localhost:5000/api/klub/${id}`)
      .then((response) => {
        setKlub(response.data.klub);
        setEdzesek(response.data.edzesek);
      })
      .catch((error) => {
        console.error('Hiba történt a klub adatok lekérésekor:', error);
      });
  }, [id]);

  const handleJelentkezes = (edzesId) => {
    if (!loginStatus) {
      alert('Kérlek, jelentkezz be a jelentkezéshez!');
      return;
    }

    if (!userId) {
      alert('Hiba történt a felhasználói adatok betöltésekor. Kérlek, próbáld újra!');
      return;
    }

    axios.get(`http://localhost:5000/api/jelentkezes/check`, {
      params: { user_id: userId, edzes_id: edzesId },
    })
      .then((response) => {
        if (response.data.alreadyApplied) {
          alert('Már jelentkeztél erre az edzésre!');
        } else {
          axios.post('http://localhost:5000/apply-workout', {
            user_id: userId,
            edzes_id: edzesId,
          })
            .then((response) => {
              alert(response.data.message);
            })
            .catch((error) => {
              if (error.response) {
                alert(error.response.data.message || 'Hiba történt a jelentkezés során.');
              } else {
                alert('Nem sikerült csatlakozni a szerverhez. Próbáld újra később.');
              }
            });
        }
      })
      .catch((error) => {
        console.error('Hiba történt a jelentkezés ellenőrzésekor:', error);
        alert('Hiba történt a jelentkezés ellenőrzésekor.');
      });
  };

  if (!klub) {
    return <div className="klub-container">Betöltés...</div>;
  }

  return (
    <div className="klub-container">
      <h1>{klub.klubbnev}</h1>
      <p>{klub.leiras}</p>
      <h3>Edzések:</h3>
      <ul className="edzes-list">
        {edzesek.map((edzes) => (
          <li key={edzes.edzes_id} className="edzes-item">
            <div className="edzes-icon">
              <FaCalendarAlt />
            </div>
            <div className="edzes-info">
              <strong>{edzes.nap}</strong>
              <p>{edzes.pontoscim}, {edzes.ido}</p>
            </div>
            <button
              className="jelentkezes-btn"
              onClick={() => handleJelentkezes(edzes.edzes_id)}
            >
              Jelentkezés
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Klub;
