import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt } from 'react-icons/fa';
import Swal from 'sweetalert2'; // Importáljuk a SweetAlert2-t
import "../Styles/klub.css";

const Klub = () => {
  const { id } = useParams();
  const [klub, setKlub] = useState(null);
  const [edzesek, setEdzesek] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loginStatus, setLoginStatus] = useState(false);
  const [jelentkezesiStatus, setJelentkezesiStatus] = useState({});

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

  const handleJelentkezes = (edzesId) => {
    if (!loginStatus) {
      Swal.fire({
        title: 'Hiba!',
        text: 'Kérlek, jelentkezz be a jelentkezéshez!',
        icon: 'error',
        confirmButtonText: 'Rendben',
        customClass: {
          popup: 'club-alert',
          title: 'club-alert-title',
          content: 'club-alert-content',
          confirmButton: 'club-alert-button',
        },
      });
      return;
    }

    if (!userId) {
      Swal.fire({
        title: 'Hiba!',
        text: 'Hiba történt a felhasználói adatok betöltésekor. Kérlek, próbáld újra!',
        icon: 'error',
        confirmButtonText: 'Rendben',
        customClass: {
          popup: 'club-alert',
          title: 'club-alert-title',
          content: 'club-alert-content',
          confirmButton: 'club-alert-button',
        },
      });
      return;
    }

    axios.post('http://localhost:5000/apply-workout', {
      user_id: userId,
      edzes_id: edzesId,
    })
      .then((response) => {
        Swal.fire({
          title: 'Siker!',
          text: response.data.message,
          icon: 'success',
          confirmButtonText: 'Rendben',
          customClass: {
            popup: 'club-alert',
            title: 'club-alert-title',
            content: 'club-alert-content',
            confirmButton: 'club-alert-button',
          },
        });
        setJelentkezesiStatus((prev) => ({
          ...prev,
          [edzesId]: true,
        }));
      })
      .catch((error) => {
        let errorMessage = 'Hiba történt a jelentkezés során.';
        if (error.response) {
          errorMessage = error.response.data.message || errorMessage;
        } else {
          errorMessage = 'Nem sikerült csatlakozni a szerverhez. Próbáld újra később.';
        }
        Swal.fire({
          title: 'Hiba!',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'Rendben',
          customClass: {
            popup: 'club-alert',
            title: 'club-alert-title',
            content: 'club-alert-content',
            confirmButton: 'club-alert-button',
          },
        });
      });
  };

  const handleCancelRegistration = (edzesId) => {
    if (!loginStatus) {
      Swal.fire({
        title: 'Hiba!',
        text: 'Kérlek, jelentkezz be a művelethez!',
        icon: 'error',
        confirmButtonText: 'Rendben',
        customClass: {
          popup: 'club-alert',
          title: 'club-alert-title',
          content: 'club-alert-content',
          confirmButton: 'club-alert-button',
        },
      });
      return;
    }

    if (!userId) {
      Swal.fire({
        title: 'Hiba!',
        text: 'Hiba történt a felhasználói adatok betöltésekor. Kérlek, próbáld újra!',
        icon: 'error',
        confirmButtonText: 'Rendben',
        customClass: {
          popup: 'club-alert',
          title: 'club-alert-title',
          content: 'club-alert-content',
          confirmButton: 'club-alert-button',
        },
      });
      return;
    }

    axios.get(`http://localhost:5000/api/jelentkezes/getId`, {
      params: { user_id: userId, edzes_id: edzesId },
    })
      .then((response) => {
        const jelentkezesId = response.data.jelentkezesId;
        if (jelentkezesId) {
          axios.delete(`http://localhost:5000/jelentkezes/${jelentkezesId}`)
            .then((response) => {
              Swal.fire({
                title: 'Siker!',
                text: response.data.message,
                icon: 'success',
                confirmButtonText: 'Rendben',
                customClass: {
                  popup: 'club-alert',
                  title: 'club-alert-title',
                  content: 'club-alert-content',
                  confirmButton: 'club-alert-button',
                },
              });
              setJelentkezesiStatus((prev) => ({
                ...prev,
                [edzesId]: false,
              }));
            })
            .catch((error) => {
              console.error('Hiba történt a visszavonás során:', error);
              Swal.fire({
                title: 'Hiba!',
                text: 'Hiba történt a visszavonás során.',
                icon: 'error',
                confirmButtonText: 'Rendben',
                customClass: {
                  popup: 'club-alert',
                  title: 'club-alert-title',
                  content: 'club-alert-content',
                  confirmButton: 'club-alert-button',
                },
              });
            });
        } else {
          Swal.fire({
            title: 'Hiba!',
            text: 'A jelentkezés nem található.',
            icon: 'error',
            confirmButtonText: 'Rendben',
            customClass: {
              popup: 'club-alert',
              title: 'club-alert-title',
              content: 'club-alert-content',
              confirmButton: 'club-alert-button',
            },
          });
        }
      })
      .catch((error) => {
        console.error('Hiba történt a jelentkezés ID lekérdezésekor:', error);
        Swal.fire({
          title: 'Hiba!',
          text: 'Hiba történt a jelentkezés ID lekérdezésekor.',
          icon: 'error',
          confirmButtonText: 'Rendben',
          customClass: {
            popup: 'club-alert',
            title: 'club-alert-title',
            content: 'club-alert-content',
            confirmButton: 'club-alert-button',
          },
        });
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