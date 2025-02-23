import { useEffect, useState } from "react";
import Axios from 'axios'
import {Link} from "react-router-dom";

  //Axios.defaults.withCredentials = true; Kötelező!!

const Login = () => {

 
  const [felhasznalonev, setFelhasznalonev] = useState(null);
  const [jelszo, setJelszo] = useState(null);




    // be vagy e jelentkezve lekérdezés
    const [loginStatus, setLoginStatus] = useState("");
     Axios.defaults.withCredentials = true;
     useEffect(() => {  
      Axios.get("http://localhost:5000/login").then((response) => {
        console.log(response);
        if (response.data.loggedIn === true) {
          setLoginStatus(response.data.user[0].felhasznalonev);
        } else {
          console.log({ loginStatus }, "Nem vagy bejelentkezve");
        }
      });
    }, []);

  //--------------------------------------------------------------------

  const login = () => {
    Axios.post("http://localhost:5000/login", {

      username: felhasznalonev,
      password: jelszo,
      
    }).then((response) => {
      if (response.data.message) {
        setLoginStatus(response.data.message)
      }
      else {
        setLoginStatus(response.data[0].felhasznalonev)
      }
    });

    
  };
  

  return (
    
    <div>
      <h2>Bejelentkezés!</h2>
        <input
          type="text"
          placeholder="Felhasználónév"
          onChange={(e) => {
            setFelhasznalonev(e.target.value)
          }}
          required
        />
        <input
          type="password"
          placeholder="Jelszó"
          onChange={(e) => {
            setJelszo(e.target.value)
          }}
          required
        />
        
        <Link onClick={login} className="navbar-brand" to='/Profil'>Bejelentkezés</Link>

        <h1>{loginStatus}</h1>
        
    </div>
  );
};

export default Login;
