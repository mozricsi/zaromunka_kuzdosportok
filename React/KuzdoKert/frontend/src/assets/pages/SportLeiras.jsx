import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../Styles/sportleiras.css';
import Axios from 'axios';

const SportLeiras = () => {
  const { id } = useParams(); // Az URL-ből lekérjük az id-t
  const [sport, setSport] = useState(null);

  useEffect(() => {
    // Az id alapján lekérjük a sport adatokat
    Axios.get(`http://localhost:5000/sports/${id}`)
      .then((response) => {
        setSport(response.data);
      })
      .catch((error) => {
        console.error("Hiba történt a sport adat lekérésekor:", error);
      });
  }, [id]); // Amint az id változik, újra lekérjük az adatokat

  if (!sport) {
    return <div>Betöltés...</div>;
  }

  return (
    <div>
      <h1>{sport.title}</h1>
      <p>{sport.description}</p> {/* Feltételezve, hogy a sport objektumban van 'description' */}
      <img src={sport.image} alt={sport.title} />
    </div>
  );
};

export default SportLeiras;