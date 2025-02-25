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
          <h2>A {sport.sportnev} szabályai</h2>
          <p>{sportLeiras}</p>
          <p>{sport.leiras}</p>
          <p>ID: {sport.sport_id}</p>
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
