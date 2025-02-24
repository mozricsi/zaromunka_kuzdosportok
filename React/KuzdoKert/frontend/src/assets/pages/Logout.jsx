import Axios from "axios";
import { useNavigate } from "react-router-dom"; // Ha használod a React Routert

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Axios.post("http://localhost:5000/logout")
      .then(() => {
        console.log("Sikeres kijelentkezés!");
        navigate("/login"); // Átirányítás a bejelentkező oldalra
      })
      .catch((error) => {
        console.error("Hiba kijelentkezés közben:", error);
      });
  };

  return (
    <button onClick={handleLogout}>Kijelentkezés</button>
  );
};

export default Logout;