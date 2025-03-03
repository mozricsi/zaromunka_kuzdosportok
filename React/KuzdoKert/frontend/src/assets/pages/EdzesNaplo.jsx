import React, { useState, useEffect } from 'react';
import '../Styles/EdzesNaplo.css';
import Axios from 'axios';
import { useNavigate } from "react-router-dom";

const EdzesNaplo = () => {
  const [workouts, setWorkouts] = useState([]);
  const [date, setDate] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [description, setDescription] = useState('');
  const [loginStatus, setLoginStatus] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  const sports = [
    'Box',
    'MMA',
    'Muay Thai',
    'K1',
    'Kickbox',
    'Judo',
    'Jiujitsu',
    'Birkózás'
  ];

  useEffect(() => {
    Axios.defaults.withCredentials = true;
    Axios.get("http://localhost:5000/login").then((response) => {
      if (response.data.loggedIn === true) {
        setLoginStatus(response.data.user[0].felhasznalonev);
        setUserRole(response.data.user[0].role);
        if (response.data.user[0].role !== "visitor") {
          navigate("/profil");
        }
      } else {
        navigate("/login");
      }
    });
  }, [navigate]);

  const handleAddWorkout = (e) => {
    e.preventDefault();
    if (date && selectedSport) {
      const newWorkout = {
        id: Date.now(),
        date,
        sport: selectedSport,
        description: description || 'Nincs részlet megadva'
      };
      setWorkouts([...workouts, newWorkout]);
      setDate('');
      setSelectedSport('');
      setDescription('');
    }
  };

  const getWorkoutsByDate = (selectedDate) => {
    return workouts.filter((workout) => workout.date === selectedDate);
  };

  return (
    <div className="container">
      {loginStatus && userRole === "visitor" && (
        <>
          <h1>Edzésnapló</h1>
          <p>Válassz egy küzdősportot, és vezesd az edzéseidet a naptárban!</p>

          <div className="sports-list">
            <h2>Választható Küzdősportok</h2>
            <ul>
              {sports.map((sport) => (
                <li key={sport} className="sport-item">
                  {sport}
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleAddWorkout} className="workout-form">
            <div className="form-group">
              <label>
                Dátum:
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="date-input"
                  required
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Küzdősport:
                <select
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="sport-select"
                  required
                >
                  <option value="">Válassz egy sportot</option>
                  {sports.map((sport) => (
                    <option key={sport} value={sport}>
                      {sport}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="form-group">
              <label>
                Részletek (opcionális):
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Pl. 1 óra sparring..."
                  className="description-input"
                />
              </label>
            </div>
            <button type="submit" className="add-button">
              Edzés hozzáadása
            </button>
          </form>

          <div className="calendar-section">
            <h2>Naptár és edzéseid</h2>
            <div className="calendar">
              <input
                type="date"
                onChange={(e) => setDate(e.target.value)}
                value={date}
                className="calendar-input"
              />
              <div className="daily-workouts">
                {date && getWorkoutsByDate(date).length > 0 ? (
                  <ul>
                    {getWorkoutsByDate(date).map((workout) => (
                      <li key={workout.id} className="workout-item">
                        <strong>{workout.sport}</strong>: {workout.description}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{date ? 'Ezen a napon nincs edzés.' : 'Válassz egy dátumot!'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="workout-list">
            <h2>Összes edzésed ({workouts.length})</h2>
            {workouts.length === 0 ? (
              <p>Még nem adtál hozzá edzést. Kezdd el most!</p>
            ) : (
              <ul>
                {workouts.map((workout) => (
                  <li key={workout.id} className="workout-item">
                    <strong>{workout.date}</strong> - {workout.sport}: {workout.description}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EdzesNaplo;