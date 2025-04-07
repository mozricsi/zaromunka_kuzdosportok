import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt } from 'react-icons/fa';
import "../Styles/klub.css";

const Klub = () => {
  const { id } = useParams();
  const [klub, setKlub] = useState(null);
  const [edzesek, setEdzesek] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loginStatus, setLoginStatus] = useState(false);
  const [jelentkezesiStatus, setJelentkezesiStatus] = useState({}); // Edzések jelentkezési státusza

  useEffect(() => {
    // Bejelentkezés ellenőrzése
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

    // Klub és edzések lekérdezése
    axios.get(`http://localhost:5000/api/klub/${id}`)
      .then((response) => {
        setKlub(response.data.klub);
        setEdzesek(response.data.edzesek);

        // Ellenőrizzük az összes edzés jelentkezési státuszát
        if (userId) {
          response.data.edzesek.forEach((edzes) => {
            checkRegistrationStatus(userId, edzes.edzes_id);
          });
        }
      })
      .catch((error) => {
        console.error('Hiba történt a klub adatok lekérésekor:', error);
      });
  }, [id, userId]);

  // Jelentkezés státusz ellenőrzése
  const checkRegistrationStatus = (userId, edzesId) => {
    axios.get(`http://localhost:5000/api/jelentkezes/check`, {
      params: { user_id: userId, edzes_id: edzesId },
    })
      .then((response) => {
        setJelentkezesiStatus((prev) => ({
          ...prev,
          [edzesId]: response.data.alreadyApplied,
        }));
      })
      .catch((error) => {
        console.error('Hiba történt a jelentkezés ellenőrzésekor:', error);
      });
  };

  // Jelentkezés funkció
  const handleJelentkezes = (edzesId) => {
    if (!loginStatus) {
      alert('Kérlek, jelentkezz be a jelentkezéshez!');
      return;
    }

    if (!userId) {
      alert('Hiba történt a felhasználói adatok betöltésekor. Kérlek, próbáld újra!');
      return;
    }

    axios.post('http://localhost:5000/apply-workout', {
      user_id: userId,
      edzes_id: edzesId,
    })
      .then((response) => {
        alert(response.data.message);
        setJelentkezesiStatus((prev) => ({
          ...prev,
          [edzesId]: true,
        }));
      })
      .catch((error) => {
        if (error.response) {
          alert(error.response.data.message || 'Hiba történt a jelentkezés során.');
        } else {
          alert('Nem sikerült csatlakozni a szerverhez. Próbáld újra később.');
        }
      });
  };

  // Visszavonás funkció
  const handleCancelRegistration = (edzesId) => {
    if (!loginStatus) {
      alert('Kérlek, jelentkezz be a művelethez!');
      return;
    }

    if (!userId) {
      alert('Hiba történt a felhasználói adatok betöltésekor. Kérlek, próbáld újra!');
      return;
    }

    // Lekérdezzük a jelentkezés ID-t az edzés és felhasználó alapján
    axios.get(`http://localhost:5000/api/jelentkezes/getId`, {
      params: { user_id: userId, edzes_id: edzesId },
    })
      .then((response) => {
        const jelentkezesId = response.data.jelentkezesId;
        if (jelentkezesId) {
          // Jelentkezés törlése
          axios.delete(`http://localhost:5000/jelentkezes/${jelentkezesId}`)
            .then((response) => {
              alert(response.data.message);
              setJelentkezesiStatus((prev) => ({
                ...prev,
                [edzesId]: false,
              }));
            })
            .catch((error) => {
              console.error('Hiba történt a visszavonás során:', error);
              alert('Hiba történt a visszavonás során.');
            });
        } else {
          alert('A jelentkezés nem található.');
        }
      })
      .catch((error) => {
        console.error('Hiba történt a jelentkezés ID lekérdezésekor:', error);
        alert('Hiba történt a jelentkezés ID lekérdezésekor.');
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
      <div className="edzes-grid">
        {edzesek.map((edzes) => (
          <div key={edzes.edzes_id} className="edzes-item">
            <div className="edzes-icon">
              <FaCalendarAlt />
            </div>
            <div className="edzes-info">
              <strong>{edzes.nap}</strong>
              <p>{edzes.pontoscim}, {edzes.ido}</p>
            </div>
            {jelentkezesiStatus[edzes.edzes_id] ? (
              <button
                className="visszavonas-btn"
                onClick={() => handleCancelRegistration(edzes.edzes_id)}
              >
                Visszavonás
              </button>
            ) : (
              <button
                className="jelentkezes-btn"
                onClick={() => handleJelentkezes(edzes.edzes_id)}
              >
                Jelentkezés
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Klub;