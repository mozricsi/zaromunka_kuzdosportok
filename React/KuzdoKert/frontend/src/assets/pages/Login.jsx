import { useState } from "react";

const Login = () => {
  const [felhasznalonev, setFelhasznalonev] = useState("");
  const [jelszo, setJelszo] = useState("");

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
        <button type="submit">Bejelentkezés</button>
    </div>
  );
};

export default Login;
