import React, {useState} from "react";
import Axios from 'axios'


const Register = () => {
  const [felhasznalonevReg, setFelhasznalonevReg] = useState("");
  const [jelszoReg, setJelszoReg] = useState("");
  const register = () => {
    Axios.post("http://localhost5000/register", {
      username: felhasznalonevReg,
      password: jelszoReg,
    }).then((response) => {
      console.log(response);
    });
  };

  return (
    <div>
      <h2>Bejelentkezés!</h2>
        <input
          type="text"
          placeholder="Felhasználónév"
          onChange={(e) => {
            setFelhasznalonevReg(e.target.value)
          }}
          required
        />
        <input
          type="password"
          placeholder="Jelszó"
          onChange={(e) => {
            setJelszoReg(e.target.value)
          }}
          required
        />
        <button type="submit" onClick={register}>Bejelentkezés</button>
    </div>
  );
};
  export default Register;