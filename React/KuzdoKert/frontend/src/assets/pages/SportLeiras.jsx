import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import '../Styles/sportleiras.css';

const SportLeiras = () => {
  const { id } = useParams();
  const [sport, setSport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clubs, setClubs] = useState([]); // Klubok állapot
  const [error, setError] = useState(null);


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

 // Box egyesületek lekérése az adatbázisból
 useEffect(() => {
  if (id) { // Csak akkor fut le, ha van sport ID
    Axios.get(`http://localhost:5000/klubbok/${id}`) // Sport ID szerinti lekérés
      .then((response) => {
        setClubs(response.data);
      })
      .catch((error) => {
        console.error("Hiba történt a klubok lekérésekor:", error);
      });
  }
}, [id]);


 //------------------------------------
  useEffect(() => {
    Axios.get(`http://localhost:5000/sports/${id}`)
      .then((response) => {
        setSport(response.data);
        console.log(response.data);
        setLoading(false);
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
              <p>{sport.leiras}</p>
              <div dangerouslySetInnerHTML={{ __html: sport.szabalyok }}></div>
          </section>


        {/* Közelgő versenyek */}
      <section className="events-section">
        <h2>Közelgő versenyek</h2>


      </section>    

       {/* Magyarországi egyesületek */}
       <section className="clubs-section">
            <h2>Magyarországi box egyesületek</h2>
            <div className="clubs-grid">
              {clubs.map((club) => (
                <div key={club.sprotklub_id} className="club-card">
                  <h3>{club.klubbnev}</h3>
                  <p><strong>Helyszín:</strong> {club.hely}</p>
                  <p><strong>Edző:</strong> {club.vnev} {club.knev}</p> {/* Ha van edzőnév, akkor ezt módosítani kell */}
                  <p><strong>Szabályok:</strong> {club.szabalyok || "Nincs megadva"}</p>
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
