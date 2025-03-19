import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/sportleiras.css';

const SportLeiras = () => {
  const { id } = useParams();
  const [sport, setSport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]); // Új állapot az eseményeknek
  const [error, setError] = useState(null);
  const [loginStatus, setLoginStatus] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [ratings, setRatings] = useState({});
  const [newRating, setNewRating] = useState({});

  const navigate = useNavigate();

  // Bejelentkezés ellenőrzése
  useEffect(() => {
    Axios.defaults.withCredentials = true;
    const checkLoginStatus = () => {
      Axios.get('http://localhost:5000/login')
        .then((response) => {
          if (response.data.loggedIn) {
            setLoginStatus(response.data.user[0].felhasznalonev);
            setUserId(response.data.user[0].user_id);
            setUserRole(response.data.user[0].role);
          } else {
            setLoginStatus(false);
            setUserId(null);
            setUserRole(null);
            setTimeout(() => {
              navigate('/login');
            }, 1000);
          }
        })
        .catch((error) => {
          console.error('Hiba történt:', error);
        });
    };

    checkLoginStatus();
    const interval = setInterval(checkLoginStatus, 100);
    return () => clearInterval(interval);
  }, [navigate]);

  // Sport adatainak lekérése
  useEffect(() => {
    Axios.get(`http://localhost:5000/sports/${id}`)
      .then((response) => {
        setSport(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Hiba történt a sport adatainak lekérésekor.');
        setLoading(false);
      });
  }, [id]);

  // Klubok lekérése
  useEffect(() => {
    if (id) {
      Axios.get(`http://localhost:5000/klubbok/${id}`)
        .then((response) => {
          setClubs(response.data);
        })
        .catch((error) => {
          console.error('Hiba történt a klubok lekérésekor:', error);
        });
    }
  }, [id]);

  // Események lekérése
  useEffect(() => {
    if (sport) {
      Axios.get(`http://localhost:5000/esemenyek/sport/${sport.sportnev}`)
        .then((response) => {
          setEvents(response.data);
        })
        .catch((error) => {
          console.error('Hiba történt az események lekérésekor:', error);
        });
    }
  }, [sport]);

  // Értékelések lekérése az egyes klubokhoz
  useEffect(() => {
    if (clubs.length > 0) {
      clubs.forEach((club) => {
        Axios.get(`http://localhost:5000/ertekelesek/${club.sprotklub_id}`)
          .then((response) => {
            setRatings((prevRatings) => ({
              ...prevRatings,
              [club.sprotklub_id]: response.data,
            }));
          })
          .catch((error) => {
            console.error(`Hiba az értékelések lekérésekor a klubhoz (${club.sprotklub_id}):`, error);
          });
      });
    }
  }, [clubs]);

  // Új értékelés űrlap kezelése
  const handleRatingChange = (sportklub_id, field, value) => {
    setNewRating((prev) => ({
      ...prev,
      [sportklub_id]: {
        ...prev[sportklub_id],
        [field]: value,
      },
    }));
  };

  // Értékelés elküldése
  const submitRating = (sportklub_id) => {
    const ratingData = newRating[sportklub_id] || {};
    const szoveges_ertekeles = ratingData.szoveges_ertekeles || '';
    const csillagos_ertekeles = ratingData.csillagos_ertekeles || 0;

    if (!szoveges_ertekeles || csillagos_ertekeles < 1 || csillagos_ertekeles > 5) {
      alert('Kérlek, adj meg egy szöveges értékelést és egy csillagos értékelést (1-5 között)!');
      return;
    }

    Axios.post('http://localhost:5000/ertekelesek', {
      user_id: userId,
      sportklub_id,
      szoveges_ertekeles,
      csillagos_ertekeles,
    })
      .then((response) => {
        alert(response.data.message);
        // Frissítjük az értékeléseket
        Axios.get(`http://localhost:5000/ertekelesek/${sportklub_id}`)
          .then((response) => {
            setRatings((prevRatings) => ({
              ...prevRatings,
              [sportklub_id]: response.data,
            }));
          });
        // Űrlap ürítése
        setNewRating((prev) => ({
          ...prev,
          [sportklub_id]: { szoveges_ertekeles: '', csillagos_ertekeles: 0 },
        }));
      })
      .catch((error) => {
        alert(error.response?.data?.message || 'Hiba történt az értékelés beküldésekor.');
      });
  };

  // Csillagok renderelése és kezelése
  const StarRating = ({ sportklub_id, value, onChange }) => {
    const stars = [1, 2, 3, 4, 5];

    return (
      <div className="star-rating">
        {stars.map((star) => (
          <span
            key={star}
            className={`star ${star <= value ? 'filled' : ''}`}
            onClick={() => onChange(sportklub_id, 'csillagos_ertekeles', star)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={star <= value ? '#ff4500' : 'none'}
              stroke="#ccc"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </span>
        ))}
      </div>
    );
  };

  // Csillagok megjelenítése az értékeléseknél
  const StarDisplay = ({ rating }) => {
    const stars = [1, 2, 3, 4, 5];
    return (
      <span className="star-display">
        {stars.map((star) => (
          <span key={star}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={star <= rating ? '#ff4500' : 'none'}
              stroke="#ccc"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </span>
        ))}
      </span>
    );
  };

  if (loading) {
    return <div>Betöltés...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!sport) {
    return <div>Nem található sport.</div>;
  }

  const handleClubClick = (id) => {
    navigate(`/Klub/${id}`);
  };

  return (
    <div>
      {loginStatus ? (
        <>
          <div className="sport-leiras">
            <h1>{sport.sportnev}</h1>
            <section className="rules-section">
              <h2>A {sport.sportnev} szabályai</h2>
              <p>{sport.leiras}</p>
              <div dangerouslySetInnerHTML={{ __html: sport.szabalyok }}></div>
            </section>

            {/* Közelgő versenyek */}
            <section className="events-section">
              <h2>Közelgő versenyek</h2>
              {events.length > 0 ? (
                <div className="events-grid">
                  {events.map((event) => (
                    <div key={event.esemeny_id} className="event-card">
                      <h3>{event.leiras}</h3>
                      <p><strong>Helyszín:</strong> {event.pontos_cim}</p>
                      <p><strong>Időpont:</strong> {new Date(event.ido).toLocaleString()}</p>
                      <p><strong>Szervező:</strong> {event.szervezo_neve}</p>
                      <p><strong>Kapcsolat:</strong> {event.szervezo_email} | {event.szervezo_tel}</p>
                      {event.esemeny_weboldal && (
                        <p>
                          <strong>Weboldal:</strong>{' '}
                          <a href={event.esemeny_weboldal} target="_blank" rel="noopener noreferrer">
                            {event.esemeny_weboldal}
                          </a>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>Jelenleg nincs közelgő {sport.sportnev} verseny.</p>
              )}
            </section>

            {/* Magyarországi egyesületek */}
            <section className="clubs-section">
              <h2>Magyarországi {sport.sportnev} egyesületek</h2>
              <div className="clubs-grid">
                {clubs.map((club) => (
                  <div key={club.sprotklub_id} className="club-card">
                    <h3>{club.klubbnev}</h3>
                    <p>
                      <strong>Helyszín:</strong> {club.hely}
                    </p>
                    <p>
                      <strong>Edző:</strong> {club.vnev} {club.knev}
                    </p>
                    <p>
                      <strong>Leírás:</strong> {club.leiras || 'Nincs megadva'}
                    </p>
                    <p>
                      <strong>Szabályok:</strong> {club.szabalyok || 'Nincs megadva'}
                    </p>
                    <button onClick={() => handleClubClick(club.sprotklub_id)}>További információk...</button>

                    {/* Értékelések megjelenítése */}
                    <div className="ratings-section">
                      <h4>Értékelések:</h4>
                      {ratings[club.sprotklub_id] && ratings[club.sprotklub_id].length > 0 ? (
                        <ul>
                          {ratings[club.sprotklub_id].map((rating) => (
                            <li key={rating.ertekeles_id}>
                              <strong>{rating.felhasznalonev}</strong> <StarDisplay rating={rating.csillagos_ertekeles} />: {rating.szoveges_ertekeles}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>Még nincs értékelés ehhez a klubhoz.</p>
                      )}
                    </div>

                    {/* Értékelés űrlap (csak visitor szerepkörűeknek) */}
                    {userRole === 'visitor' && (
                      <div className="rating-form">
                        <h4>Add meg az értékelésed:</h4>
                        <div>
                          <label>Csillagos értékelés (1-5):</label>
                          <StarRating
                            sportklub_id={club.sprotklub_id}
                            value={newRating[club.sprotklub_id]?.csillagos_ertekeles || 0}
                            onChange={handleRatingChange}
                          />
                        </div>
                        <div>
                          <label>Szöveges értékelés:</label>
                          <textarea
                            value={newRating[club.sprotklub_id]?.szoveges_ertekeles || ''}
                            onChange={(e) =>
                              handleRatingChange(club.sprotklub_id, 'szoveges_ertekeles', e.target.value)
                            }
                          />
                        </div>
                        <button onClick={() => submitRating(club.sprotklub_id)}>Értékelés beküldése</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </>
      ) : (
        <>
          <p>Jelentkezz be kérlek</p>
        </>
      )}
    </div>
  );
};

export default SportLeiras;