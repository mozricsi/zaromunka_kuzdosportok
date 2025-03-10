import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Klub = () => {
  const { id } = useParams();  // Az id paraméter lekérése a URL-ből
  const [klub, setKlub] = useState(null);
  const [edzesek, setEdzesek] = useState([]);

  useEffect(() => {
    // API hívás az adatbázisból való lekérdezéshez
    axios
      .get(`http://localhost:5000/api/klub/${id}`)
      .then((response) => {
        setKlub(response.data.klub);
        setEdzesek(response.data.edzesek);
      })
      .catch((error) => {
        console.error('Hiba történt a klub adatok lekérésekor:', error);
      });
  }, [id]);  // Az id változásakor újra lefut

  if (!klub) {
    return <div>Betöltés...</div>;
  }

  return (
    <div>
      <h1>{klub.klubbnev}</h1>
      <p>{klub.leiras}</p>
      <h3>Edzések:</h3>
      <ul>
        {edzesek.map((edzes) => (
          <li key={edzes.edzes_id}>
            <strong>{edzes.nap}</strong>: {edzes.pontoscim}, {edzes.ido}
            <button>Jelentkezés</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Klub;
