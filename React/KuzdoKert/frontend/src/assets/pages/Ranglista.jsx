import { useState, useEffect } from 'react';
import axios from 'axios';
import "../Styles/ranglista.css";

function Ranglista() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/ranglista').then(res => setLeaderboard(res.data));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Ranglista</h1>
      <ol>
        {leaderboard.map((user, index) => (
          <li key={index}>{index + 1}. {user.felhasznalonev} - {user.edzesek} edzés</li>
        ))}
      </ol>
    </div>
  );
}

export default Ranglista;