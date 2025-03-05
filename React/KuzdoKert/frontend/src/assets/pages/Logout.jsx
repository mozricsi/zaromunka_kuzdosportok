import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../Styles/logout.css";

const Logout = () => {
  const [loginStatus, setLoginStatus] = useState(false);
  const navigate = useNavigate();

  localStorage.clear();
  sessionStorage.clear();
  Axios.defaults.withCredentials = true;
  Axios.post("http://localhost:5000/logout")
    .then(() => {
      console.log("Sikeres kijelentkezés!");
      setLoginStatus(false);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    })
    .catch((error) => {
      console.error("Hiba kijelentkezés közben:", error);
    });

  return (
    <div className="logout-container">
      <h1>Kijelentkezés...</h1>
      <p>Hamarosán átirányítunk a bejelentkezéshez...</p>
    </div>
  );
};

export default Logout;