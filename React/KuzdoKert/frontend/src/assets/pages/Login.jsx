import { useEffect, useState } from "react";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import "../Styles/login.css";

const Login = () => {
  const [felhasznalonev, setFelhasznalonev] = useState(null);
  const [jelszo, setJelszo] = useState(null);
  const [info, setInfo] = useState(null);
  const navigate = useNavigate();

  const [loginStatus, setLoginStatus] = useState(false);
  const [userRole, setUserRole] = useState(null); // Szerepkör tárolása
  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get("http://localhost:5000/login").then((response) => {
      if (response.data.loggedIn === true) {
        setLoginStatus(response.data.user[0].felhasznalonev);
        setUserRole(response.data.user[0].role); // Szerepkör lekérdezése
        setTimeout(() => {
          navigate("/profil");
        }, 1000);
      }
    });
  }, []);

  const login = () => {
    if (!felhasznalonev) {
      setInfo("Írj be felhasználónevet!");
    } else {
      if (!jelszo) {
        setInfo("Írj be jelszót!");
      } else {
        Axios.post("http://localhost:5000/login", {
          username: felhasznalonev,
          password: jelszo,
        }).then((response) => {
          if (response.data.message) {
            setInfo(response.data.message);
          } else {
            setLoginStatus(response.data[0].felhasznalonev);
            setUserRole(response.data[0].role); // Szerepkör beállítása
            setTimeout(() => {
              navigate("/profil");
            }, 1000);
          }
        });
      }
    }
  };

  return (
    <div className="login-container">
      {loginStatus ? (
        <div className="logged-in">
          <h1>Be vagy jelentkezve</h1>
          <p>Nemsokára átirányítunk...</p>
        </div>
      ) : (
        <div className="login-form">
          <h2>Bejelentkezés!</h2>
          <p>{info}</p>
          <input
            type="text"
            placeholder="Felhasználónév"
            onChange={(e) => setFelhasznalonev(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Jelszó"
            onChange={(e) => setJelszo(e.target.value)}
            required
          />
          <button onClick={login}>Bejelentkezés</button>
        </div>
      )}
    </div>
  );
};

export default Login;