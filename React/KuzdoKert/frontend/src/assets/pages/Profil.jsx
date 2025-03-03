import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/profil.css";
import Axios from "axios";

const Profil = () => {





      // be vagy e jelentkezve lekérdezés-------------------------------
      const [loginStatus, setLoginStatus] = useState(false);
      Axios.defaults.withCredentials = true;
      
      const navigate = useNavigate();

      useEffect(() => {
        Axios.get("http://localhost:5000/login").then((response) => {
          if (response.data.loggedIn === true) {
            setLoginStatus(response.data.user[0].felhasznalonev);
            setUserData({
              vnev: response.data.user[0].vnev,
              knev: response.data.user[0].knev,
              knev2: response.data.user[0].knev2,
              email: response.data.user[0].email,
              szul: response.data.user[0].szul_ido,
              lakhely: response.data.user[0].lakhelyvaros,
              tel: response.data.user[0].telefonszam,
              username: response.data.user[0].felhasznalonev,
              password: response.data.user[0].jelszo,
            });
          } else {
            console.log("Nem vagy bejelentkezve");
            navigate("/login");
          }
        });
      }, [loginStatus]);
 
   //--------------------------------------------------------------------


  // konstansok a felhasználó adataival
  const [userData, setUserData] = useState({
    vnev: undefined,
    knev: undefined,
    knev2: undefined,
    email: undefined,
    szul: undefined,
    lakhely: undefined,
    tel: undefined,
    username: undefined,
    password: undefined,
    profilePicture: undefined,
  });
  


  const [editMode, setEditMode] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  //input change
//--------------------------------------------------------------
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setUserData((prevState) => ({
    ...prevState,
    [name]: value,
  }));
};
  //profilkép?
//--------------------------------------------------------------
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({ ...userData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
//--------------------------------------------------------------
const handlePasswordChange = () => {
  if (!oldPassword || !newPassword || !confirmPassword) {
    alert("Minden mezőt ki kell tölteni!");
    return;
  }

  if (newPassword.length < 6) {
    alert("Az új jelszónak legalább 6 karakter hosszúnak kell lennie!");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("A megadott jelszavak nem egyeznek!");
    return;
  }



  Axios.post("http://localhost:5000/changePassword", {
    username: userData.username,
    oldPassword: oldPassword,
    newPassword: newPassword,
  })
    .then((response) => {
      alert(response.data.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    })
    .catch((error) => {
      if (error.response) {
        // Ha a szerver válasza tartalmaz üzenetet, akkor azt jelenítsük meg
        alert(error.response.data.message || "Hiba történt a jelszóváltoztatás során.");
      } else {
        // Ha nincs válasz a szervertől, akkor általános hibaüzenet
        alert("Nem sikerült csatlakozni a szerverhez. Próbáld újra később.");
      }
      console.error("Hiba:", error);
    });
};


//--------------------------------------------------------------
const handleSaveChanges = () => {

  const requiredFields = ["vnev", "knev", "email", "szul", "lakhely", "username"];

  // Ellenőrizzük, hogy van-e üres mező
  const emptyFields = requiredFields.filter((field) => !userData[field] || userData[field].trim() === "");

  if (emptyFields.length > 0) {
    alert("A *-al jelölt mezőket ki kell tölteni!");
    return;
  }

  Axios.post("http://localhost:5000/updateUser", userData)
    .then((response) => {
      console.log("Sikeresen frissítve:", response.data);
      alert("Profil frissítve!");
      setEditMode(false);
    })
    .catch((error) => {
      console.error("Hiba az adatok mentésekor:", error);
      alert("Hiba történt a mentés közben.");
    });
    
};

  //---------------------------------------------------

  
//---------------------------------------------------

  return (
    <div className="profile-page">
      <h1>{loginStatus}</h1>
      <h1>Profil</h1>
      {editMode ? (
        <table className="profile-table">
          <tbody>
            <tr>
              <th>*Vezetéknév:</th>
              <td>
                <input
                  type="text"
                  name="vnev"
                  
                  value={userData.vnev || ""}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <th>*Keresztnév:</th>
              <td>
                <input
                  type="text"
                  name="knev"
                  value={userData.knev || ""}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <th>Harmadik név (ha van):</th>
              <td>
                <input
                  type="text"
                  name="knev2"
                  value={userData.knev2 || ""}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <th>*Email cím:</th>
              <td>
                <input
                  type="email"
                  name="email"
                  value={userData.email || ""}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <th>*Születési dátum:</th>
              <td>
                <input
                  type="date"
                  name="szul"
                  value={userData.szul || ""}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <th>*Lakhely:</th>
              <td>
                <input
                  type="text"
                  name="lakhely"
                  value={userData.lakhely || ""}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <th>Telefonszám:</th>
              <td>
                <input
                  type="tel"
                  name="tel"
                  value={userData.tel || ""}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <th>*Felhasználónév:</th>
              <td>
                <input
                  type="text"
                  name="username"
                  value={userData.username || ""}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <th>Profilkép:</th>
              <td>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                />
              </td>
            </tr>
          </tbody>
        </table>

      ) : (
      <>
        <table className="profile-table">
          <tbody>
            <tr>
              <th>Vezetéknév:</th>
              <td>{userData.vnev}</td>
            </tr>
            <tr>
              <th>Keresztnév:</th>
              <td>{userData.knev}</td>
            </tr>
            
              {userData.knev2 && (
                <tr>
                  <th>Harmadik név:</th>
                  <td>{userData.knev2}</td>
                </tr>
              )}
            <tr>
              <th>Email cím:</th>
              <td>{userData.email}</td>
            </tr>
            <tr>
              <th>Születési dátum:</th>
              <td>{userData.szul}</td>
            </tr>
            <tr>
              <th>Lakhely:</th>
              <td>{userData.lakhely}</td>
            </tr>
            <tr>
              <th>Telefonszám:</th>
              <td>{userData.tel}</td>
            </tr>
            <tr>
              <th>Felhasználónév:</th>
              <td>{userData.username}</td>
            </tr>
            <tr>
              <th>Profilkép:</th>
              <td>
                {userData.profilePicture && (
                  <div className="profile-picture">
                    <img src={userData.profilePicture} alt="Profilkép" />
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        
        <div className="password-change">
        <h2>Jelszó változtatása</h2>
        <label>Régi jelszó:</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <label>Új jelszó:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label>Jelszó megerősítése:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={handlePasswordChange}>Jelszó változtatása</button>
      </div>

        </>
      )}

      

      <button onClick={editMode ? handleSaveChanges : () => setEditMode(true)}>
        {editMode ? 'Mentés' : 'Szerkesztés'}
      </button>
    </div>
    
  );
  
};
  
  export default Profil;