import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import '../Styles/sportleiras.css';

const SportLeiras = () => {
  const { id } = useParams();
  const [sport, setSport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sportLeiras, setSportLeiras] = useState('');
  const sportEvents = (sport) => {
    if (sport.sport_id === 1) {
      return [
        { id: 1, name: 'Budapest Box Gála', date: '2023-11-15', location: 'Budapest, Papp László Aréna' },
        { id: 2, name: 'Debrecen Nemzetközi Box Torna', date: '2023-12-10', location: 'Debrecen, Főnix Csarnok' },
        { id: 3, name: 'Szegedi Box Bajnokság', date: '2024-01-20', location: 'Szeged, Városi Sportcsarnok' },
      ];
    } else if (sport.sport_id === 2) {
      return [
        { id: 4, name: 'Budapest Futófesztivál', date: '2024-03-10', location: 'Budapest, Hősök tere' },
        { id: 5, name: 'Debreceni Félmaraton', date: '2024-04-15', location: 'Debrecen, Nagyerdő' },
      ];
    } else {
      return [];
    }
  };


  // be vagy e jelentkezve lekérdezés-------------------------------
  const [loginStatus, setLoginStatus] = useState(false);
        
  Axios.defaults.withCredentials = true; 
  useEffect(() => {
    const checkLoginStatus = () => {
      Axios.get("http://localhost:5000/login")
        .then((response) => {
          if (response.data.loggedIn) {
            setLoginStatus(response.data.user[0].felhasznalonev);
          } else {
            setLoginStatus(false);
          }
        })
        .catch((error) => {
          console.error("Hiba történt:", error);
        });
    };
  

    checkLoginStatus();
    const interval = setInterval(checkLoginStatus, 100);
  
    return () => {

      clearInterval(interval);
    };
  }, []); 


//--------------------------------------------------------------------

  useEffect(() => {
    Axios.get(`http://localhost:5000/sports/${id}`)
      .then((response) => {
        setSport(response.data);
        console.log(response.data);
        setLoading(false);

        // Ha box, akkor állítsd be a sportLeiras értéket
        if (response.data.sport_id === 1) {
          setSportLeiras("A box egy öklözősport, ahol két versenyző próbálja meg legyőzni egymást ütésekkel. A mérkőzés egy ringben zajlik, és a cél az ellenfél kiütése vagy a pontozási győzelem elérése. Az alábbiakban bemutatjuk a legfontosabb szabályokat:");
        }
        else if (response.data.sport_id === 2) {
          setSportLeiras("");
        }
        else if (response.data.sport_id === 3) {
          setSportLeiras("");
        }
        else if (response.data.sport_id === 4) {
          setSportLeiras("");
        }
        else if (response.data.sport_id === 5) {
          setSportLeiras("");
        }
        else if (response.data.sport_id === 6) {
          setSportLeiras("");
        }
        else if (response.data.sport_id === 7) {
          setSportLeiras("");
        }
        else if (response.data.sport_id === 8) {
          setSportLeiras("");
        }
        else{
          setSportLeiras('Nincs kiválasztott sport.');
        }

        //-----------------------------------------------------------------------

      })
      .catch((error) => {
        setError("Hiba történt a sport adatainak lekérésekor.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Betöltés...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!sport) {
    return <div>Nem található sport.</div>;
  }

  return (
    <div>
      {loginStatus ? (
        <>
        <div className="sport-leiras">
          <h1>{sport.sportnev}</h1>
          <section className="rules-section">
              <h2>A {sport.sportnev} szabályai</h2>
              <p>{sportLeiras}</p>
              <p>{sport.leiras}</p>
              <p>ID: {sport.sport_id}</p>
          </section>


        {/* Közelgő versenyek */}
      <section className="events-section">
        <h2>Közelgő versenyek</h2>
        <div className="events-grid">
            <div className="event-card">
              {/*ide kellene beimplementálni az adatokat */}
              <h3>{sportEvents.name}</h3>
              <p><strong>Dátum:</strong> {}</p>
              <p><strong>Helyszín:</strong> {}</p>
            </div>     
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
