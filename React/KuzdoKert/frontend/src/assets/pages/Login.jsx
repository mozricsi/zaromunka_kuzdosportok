import { useEffect, useState } from "react";
import Axios from 'axios'
import {useNavigate} from "react-router-dom";

  //Axios.defaults.withCredentials = true; Kötelező!!

const Login = () => {

 
  const [felhasznalonev, setFelhasznalonev] = useState(null);
  const [jelszo, setJelszo] = useState(null);
  const navigate = useNavigate();


    // be vagy e jelentkezve lekérdezés
    const [loginStatus, setLoginStatus] = useState(false);
     Axios.defaults.withCredentials = true;
     useEffect(() => {
      Axios.get("http://localhost:5000/login").then((response) => {
        console.log(response);
        if (response.data.loggedIn === true) {
          setLoginStatus(response.data.user[0].felhasznalonev);
          setTimeout(() => {
            navigate("/profil");
          }, 1000); // 2 másodperc múlva átirányítás
        } else {
          console.log({ loginStatus }, "Nem vagy bejelentkezve");
        }
      });
    }, []);

  //--------------------------------------------------------------------
  const login = () => {
    if(!felhasznalonev){
      console.log("Nincs felhasználónév")
    }
    else{
      if(!jelszo){
        console.log("nincs jelszó")
      }
      else{
        Axios.post("http://localhost:5000/login", {

          username: felhasznalonev,
          password: jelszo,
          
        }).then((response) => {
          if (response.data.message) {
            setLoginStatus(response.data.message)
            console.log(response.data.message)
          }
          else {
            setLoginStatus(response.data[0].felhasznalonev);
            setTimeout(() => {
              navigate("/profil");
            }, 1000);
          }
        });
      }
    }
    
    
  };
  

  return (
    
    <div>
      {loginStatus ? (
        
  <div>
      <h1>Be vagy jelentkezve</h1>
      <p>Nemsokára átirányítunk...</p>
      
  </div>
) : (
  <div>
    <h2>Bejelentkezés!</h2>
    <input
      type="text"
      placeholder="Felhasználónév"
      onChange={(e) => {
        setFelhasznalonev(e.target.value);
      }}
      required
    />
    <input
      type="password"
      placeholder="Jelszó"
      onChange={(e) => {
        setJelszo(e.target.value);
      }}
      required
    />
    <button onClick={login}>
      Bejelentkezés
    </button>
  </div>
)}

        
    </div>
  );
};

export default Login;
