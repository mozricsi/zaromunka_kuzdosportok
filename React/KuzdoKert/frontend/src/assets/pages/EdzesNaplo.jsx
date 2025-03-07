import React, { useState, useEffect } from 'react';
import '../Styles/EdzesNaplo.css';
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EdzesNaplo = () => {
  const [coachWorkouts, setCoachWorkouts] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [loginStatus, setLoginStatus] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [viewedWorkoutsCount, setViewedWorkoutsCount] = useState(0);
  const [showMotivation, setShowMotivation] = useState(false);
  const [appliedWorkouts, setAppliedWorkouts] = useState([]);
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
        setUserId(response.data.user[0].user_id);
        if (response.data.user[0].role !== "visitor") {
          navigate("/profil");
        } else {
          // Összes edzés lekérése induláskor
          Axios.get("http://localhost:5000/klubbok/all").then((res) => {
            setCoachWorkouts(res.data);
          }).catch((err) => {
            console.error("Hiba az edzések lekérésekor:", err);
          });
          // Jelentkezett edzések lekérése
          Axios.get(`http://localhost:5000/applied-workouts/${response.data.user[0].user_id}`).then((res) => {
            setAppliedWorkouts(res.data);
          }).catch((err) => {
            console.error("Hiba a jelentkezett edzések lekérésekor:", err);
          });
        }
      } else {
        navigate("/login");
      }
    });
  }, [navigate]);

  // Sport kiválasztása és edzések lekérése
  const handleSportClick = (sport) => {
    const newSelectedSport = sport === selectedSport ? '' : sport;
    setSelectedSport(newSelectedSport);
    setSelectedDate(''); // Dátum visszaállítása

    if (newSelectedSport) {
      const sportId = sports.indexOf(newSelectedSport) + 1; // sport_id 1-től indul
      Axios.get(`http://localhost:5000/klubbok/sport/${sportId}`).then((res) => {
        setCoachWorkouts(res.data); // Csak az adott sport edzései
      }).catch((err) => {
        console.error("Hiba az adott sport edzéseinek lekérésekor:", err);
      });
    } else {
      // Ha nincs sport kiválasztva, visszaállítjuk az összes edzést
      Axios.get("http://localhost:5000/klubbok/all").then((res) => {
        setCoachWorkouts(res.data);
      }).catch((err) => {
        console.error("Hiba az összes edzés lekérésekor:", err);
      });
    }
  };

  // Dátum kiválasztása
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
  };

  // Edzés megtekintése
  const handleWorkoutView = () => {
    const newCount = viewedWorkoutsCount + 1;
    setViewedWorkoutsCount(newCount);
    if (newCount >= 5 && !showMotivation) {
      setShowMotivation(true);
    }
  };

  // Jelentkezés az edzésre
  const handleApply = async (sportklub_id) => {
    try {
      const response = await Axios.post("http://localhost:5000/apply-workout", {
        user_id: userId,
        sportklub_id,
      });
      alert(response.data.message);
      const updatedApplied = await Axios.get(`http://localhost:5000/applied-workouts/${userId}`);
      setAppliedWorkouts(updatedApplied.data);
    } catch (error) {
      console.error("Hiba a jelentkezés során:", error);
      alert("Hiba történt a jelentkezés során.");
    }
  };

  // Szűrt edzések lekérése
  const getFilteredCoachWorkouts = () => {
    let filteredWorkouts = [...coachWorkouts];
    if (selectedDate) {
      filteredWorkouts = filteredWorkouts.filter(workout => workout.idonap === selectedDate);
    }
    return filteredWorkouts;
  };

  // Grafikon adatok
  const chartData = {
    labels: sports,
    datasets: [
      {
        label: "Jelentkezett edzések",
        data: sports.map(sport => {
          const sportId = sports.indexOf(sport) + 1;
          return appliedWorkouts.filter(workout => workout.sport_id === sportId).length;
        }),
        backgroundColor: "#ff4500",
        borderColor: "#cc3700",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "#fff" } },
      title: { display: true, text: "Jelentkezett edzések sportok szerint", color: "#fff" },
    },
    scales: {
      x: { ticks: { color: "#ccc" } },
      y: { ticks: { color: "#ccc" }, beginAtZero: true },
    },
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
                        onClick={handleWorkoutView}
                      >
                        <strong>{sports[workout.sport_id - 1]}</strong> - {workout.hely}, {workout.idonap} {workout.ido} <br />
                        Klub: {workout.klubbnev} <br />
                        Leírás: {workout.leiras}
                        <button
                          onClick={() => handleApply(workout.sprotklub_id)}
                          className="apply-button"
                        >
                          Jelentkezem
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{selectedDate || selectedSport ? 'Ezen a napon vagy ehhez a sporthoz nincsenek edzések.' : 'Válassz egy dátumot vagy küzdősportot!'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="stats-section">
            <h2>Statisztikák</h2>
            <div className="chart-container">
              <Bar data={chartData} options={chartOptions} />
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