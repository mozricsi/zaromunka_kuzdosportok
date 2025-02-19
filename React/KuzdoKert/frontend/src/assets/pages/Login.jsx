import { useState } from "react";
import Axios from 'axios'

const Login = () => {
  const [felhasznalonev, setFelhasznalonev] = useState("");
  const [jelszo, setJelszo] = useState("");

  const [loginStatus, setLoginStatus] = useState("");

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
        <button onClick={login}>Bejelentkezés</button>

        <h1>{loginStatus}</h1>
    </div>
  );
};

export default Login;
