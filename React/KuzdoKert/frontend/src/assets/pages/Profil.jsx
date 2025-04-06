import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../Styles/profil.css";
import Axios from "axios";

const Profil = () => {
  const [loginStatus, setLoginStatus] = useState(false);
  const [userRole, setUserRole] = useState(null);
  Axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  useEffect(() => {
    Axios.get("http://localhost:5000/login").then((response) => {
      if (response.data.loggedIn === true) {
        setLoginStatus(response.data.user[0].felhasznalonev);
        setUserRole(response.data.user[0].role);
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
          role: response.data.user[0].role,
        });
      } else {
        navigate("/login");
      }
    });
  }, [navigate]);

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
    role: undefined,
  });

  const [editMode, setEditMode] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const customSwal = (title, text, icon) => {
    Swal.fire({
      title,
      text,
      icon,
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        content: 'custom-swal-content'
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePasswordChange = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      customSwal("Hiba", "Minden mezőt ki kell tölteni!", "warning");
      return;
    }

    if (newPassword.length < 6) {
      customSwal("Hiba", "Az új jelszónak legalább 6 karakter hosszúnak kell lennie!", "warning");
      return;
    }

    if (newPassword !== confirmPassword) {
      customSwal("Hiba", "A megadott jelszavak nem egyeznek!", "warning");
      return;
    }

    Axios.post("http://localhost:5000/changePassword", {
      username: userData.username,
      oldPassword: oldPassword,
      newPassword: newPassword,
    })
      .then((response) => {
        customSwal("Siker", response.data.message, "success");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((error) => {
        if (error.response) {
          customSwal("Hiba", error.response.data.message || "Hiba történt a jelszóváltoztatás során.", "error");
        } else {
          customSwal("Hiba", "Nem sikerült csatlakozni a szerverhez. Próbáld újra később.", "error");
        }
        console.error("Hiba:", error);
      });
  };

  const handleSaveChanges = () => {
    const requiredFields = ["vnev", "knev", "email", "szul", "lakhely", "username"];
    const emptyFields = requiredFields.filter((field) => !userData[field] || userData[field].trim() === "");

    if (emptyFields.length > 0) {
      customSwal("Hiba", "A *-al jelölt mezőket ki kell tölteni!", "warning");
      return;
    }

    Axios.post("http://localhost:5000/updateUser", userData)
      .then((response) => {
        console.log("Sikeresen frissítve:", response.data);
        customSwal("Siker", "Profil frissítve!", "success");
        setEditMode(false);
      })
      .catch((error) => {
        console.error("Hiba az adatok mentésekor:", error);
        customSwal("Hiba", "Hiba történt a mentés közben.", "error");
      });
  };

  return (
    <div className="profile-page">
      <h1>Saját Profil</h1>
      {editMode ? (
        <>
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
                    value={new Date(userData.szul).toISOString().split("T")[0] || ""}
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
                <th>Szerepkör:</th>
                <td>{userData.role === "visitor" ? "Látogató" : "Edző"}</td>
              </tr>
            </tbody>
          </table>
          <button onClick={handleSaveChanges}>Mentés</button>
        </>
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
                <td>{new Date(userData.szul).toLocaleDateString("hu-HU")}</td>
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
                <th>Szerepkör:</th>
                <td>{userData.role === "visitor" ? "Látogató" : "Edző"}</td>
              </tr>
            </tbody>
          </table>

          <button className="edit-save-button" onClick={() => setEditMode(true)}>Szerkesztés</button>

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
    </div>
  );
};

export default Profil;
