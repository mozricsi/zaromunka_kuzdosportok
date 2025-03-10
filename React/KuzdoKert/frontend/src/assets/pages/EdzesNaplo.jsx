import React, { useState, useEffect } from 'react';
import '../Styles/EdzesNaplo.css';
import Axios from 'axios';
import { useNavigate } from "react-router-dom";

const EdzesNaplo = () => {
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Axios.get("http://localhost:5000/clubs").then((res) => {
      setClubs(res.data);
    }).catch((err) => {
      console.error("Hiba a klubok lekérésekor:", err);
    });
  }, []);

  const handleClubSelect = (clubId) => {
    setSelectedClub(clubId);
    Axios.get(`http://localhost:5000/workouts?club_id=${clubId}`).then((res) => {
      setWorkouts(res.data);
    }).catch((err) => {
      console.error("Hiba az edzések lekérésekor:", err);
    });
  };

  return (
    <div className="container">
      <h1>Edzésnapló</h1>
      <h2>Válassz egy klubbot</h2>
      <ul>
        {clubs.map((club) => (
          <li key={club.id} onClick={() => handleClubSelect(club.id)}>
            {club.name}
          </li>
        ))}
      </ul>

      {selectedClub && (
        <div>
          <h2>Edzések a kiválasztott klubban</h2>
          <ul>
            {workouts.map((workout) => (
              <li key={workout.id}>
                {workout.sport} - {workout.date} - {workout.time}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EdzesNaplo;
