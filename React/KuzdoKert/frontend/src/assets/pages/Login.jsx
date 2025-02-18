import { useState } from "react";

const Login = () => {
  const [felhasznalonev, setFelhasznalonev] = useState("");
  const [jelszo, setJelszo] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ felhasznalonev, jelszo }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sikertelen bejelentkezés");
      } else {
        setSuccess("Sikeres bejelentkezés!");
        localStorage.setItem("token", data.token); // JWT mentése
      }
    } catch (err) {
      setError("Hálózati hiba történt!");
    }
  };

  return (
    <div>
      <h2>Bejelentkezés!</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Felhasználónév"
          value={felhasznalonev}
          onChange={(e) => setFelhasznalonev(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Jelszó"
          value={jelszo}
          onChange={(e) => setJelszo(e.target.value)}
          required
        />
        <button type="submit">Bejelentkezés</button>
      </form>
    </div>
  );
};

export default Login;
