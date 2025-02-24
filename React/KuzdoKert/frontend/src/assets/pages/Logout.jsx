import Axios from "axios";
import { useNavigate } from "react-router-dom";


const Logout = () => {
  const navigate = useNavigate();
    Axios.post("http://localhost:5000/logout")
      .then(() => {
        console.log("Sikeres kijelentkezés!");
        setTimeout(() => {
          navigate("/login"); 
        }, 1000); 
      })
      .catch((error) => {
        console.error("Hiba kijelentkezés közben:", error);
      });

  return (
    <>
    <h1>Kijelentkezés...</h1>
    <p>Hamarosán átirányítunk a bejelentkezéshez...</p>
    </>
  );
};

export default Logout;