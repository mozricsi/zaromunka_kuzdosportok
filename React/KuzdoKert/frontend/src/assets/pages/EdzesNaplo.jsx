import React, { useState, useEffect } from 'react';
import '../Styles/EdzesNaplo.css';
import Axios from 'axios';
import { useNavigate } from "react-router-dom";

const EdzesNaplo = () => {
  const [coachWorkouts, setCoachWorkouts] = useState([]); // Csak az edzők edzései
  const [selectedDate, setSelectedDate] = useState(''); // Kiválasztott dátum
  const [selectedSport, setSelectedSport] = useState(''); // Kiválasztott küzdősport
  const [loginStatus, setLoginStatus] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [viewedWorkoutsCount, setViewedWorkoutsCount] = useState(0); // Megtekintett edzések száma
  const [showMotivation, setShowMotivation] = useState(false); // Motiváló üzenet megjelenítése
  const navigate = useNavigate();

  const sports = [
    'Box', 'MMA', 'Muay Thai', 'K1', 'Kickbox', 'Judo', 'Jiujitsu', 'Birkózás'
  ];

  useEffect(() => {
    Axios.defaults.withCredentials = true;
    Axios.get("http://localhost:5000/login").then((response) => {
      if (response.data.loggedIn === true) {
        setLoginStatus(response.data.user[0].felhasznalonev);
        setUserRole(response.data.user[0].role);
        if (response.data.user[0].role !== "visitor") {
          navigate("/profil");
        } else {
          // Edzők edzéseinek lekérése
          Axios.get("http://localhost:5000/klubbok/all").then((res) => {
            setCoachWorkouts(res.data);
          }).catch((err) => {
            console.error("Hiba az edzések lekérésekor:", err);
          });
        }
      } else {
        navigate("/login");
      }
    });
  }, [navigate]);

  // Küzdősport kiválasztása a listáról
  const handleSportClick = (sport) => {
    setSelectedSport(sport === selectedSport ? '' : sport); // Kattintás toggle-álja a szűrést
    setSelectedDate(''); // Dátum alaphelyzetbe
  };

  // Dátum kiválasztása
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    setSelectedSport(''); // Sport szűrés alaphelyzetbe
  };

  // Edzés megtekintésének követése (kattintás vagy megjelenítés)
  const handleWorkoutView = () => {
    const newCount = viewedWorkoutsCount + 1;
    setViewedWorkoutsCount(newCount);
    // Például 5 edzés megtekintése után jelenjen meg a motiváló üzenet
    if (newCount >= 5 && !showMotivation) {
      setShowMotivation(true);
    }
  };

  // Szűrt edzések lekérése
  const getFilteredCoachWorkouts = () => {
    let filteredWorkouts = [...coachWorkouts];

    // Szűrjük a kiválasztott küzdősport szerint
    if (selectedSport) {
      const sportId = sports.indexOf(selectedSport) + 1; // 1-től indexelve, mert a sport_id 1-től kezdődik
      filteredWorkouts = filteredWorkouts.filter(workout => workout.sport_id === sportId);
    }

    // Szűrjük a kiválasztott dátum szerint (ha van)
    if (selectedDate) {
      filteredWorkouts = filteredWorkouts.filter(workout => workout.idonap === selectedDate);
    }

    return filteredWorkouts;
  };

  return (
    <div className="container">
      {loginStatus && userRole === "visitor" && (
        <>
          <h1>Edzésnapló</h1>
          <p>Nézd meg az edzők által kínált edzéseket, és válassz egy küzdősportot a szűréshez!</p>

          <div className="sports-list">
            <h2>Választható Küzdősportok</h2>
            <ul>
              {sports.map((sport) => (
                <li 
                  key={sport} 
                  className={`sport-item ${selectedSport === sport ? 'selected' : ''}`}
                  onClick={() => handleSportClick(sport)}
                  style={{ cursor: 'pointer', backgroundColor: selectedSport === sport ? '#ff4500' : '#333', color: selectedSport === sport ? '#fff' : '#ccc' }}
                >
                  {sport}
                </li>
              ))}
            </ul>
          </div>

          <div className="calendar-section">
            <h2>Naptár és edzések</h2>
            <div className="calendar">
              <input
                type="date"
                onChange={handleDateChange}
                value={selectedDate}
                className="calendar-input"
              />
              <div className="daily-workouts">
                {getFilteredCoachWorkouts().length > 0 ? (
                  <ul>
                    {getFilteredCoachWorkouts().map((workout) => (
                      <li 
                        key={workout.sprotklub_id} 
                        className="workout-item"
                        onClick={handleWorkoutView} // Edzés megtekintésekor növeli a számlálót
                      >
                        <strong>{sports[workout.sport_id - 1]}</strong> - {workout.hely}, {workout.idonap} {workout.ido} <br />
                        Klub: {workout.klubbnev} <br />
                        Leírás: {workout.leiras}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{selectedDate || selectedSport ? 'Ezen a napon vagy ehhez a sporthez nincsenek edzések.' : 'Válassz egy dátumot vagy küzdősportot!'}</p>
                )}
              </div>
            </div>
          </div>

          {showMotivation && (
            <div className="motivation-message">
              <h2>Gratulálunk!</h2>
              <p>Öt edzést már megtekintettél – remekül haladsz! Tartsd meg a lendületedet, és folytasd a küzdősportok felfedezését!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EdzesNaplo;