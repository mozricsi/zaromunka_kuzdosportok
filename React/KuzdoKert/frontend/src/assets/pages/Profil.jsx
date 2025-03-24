import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/profil.css";
import Axios from "axios";

const Profil = () => {
  const [loginStatus, setLoginStatus] = useState(false);
  const [userRole, setUserRole] = useState(null);
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
    profilePicture: undefined,
    interestedSports: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [recommendedTrainings, setRecommendedTrainings] = useState([]);
  const [sports, setSports] = useState([]); // Sportágak listája

  const navigate = useNavigate();
  Axios.defaults.withCredentials = true;

  useEffect(() => {
    // Felhasználói adatok betöltése
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
          interestedSports: response.data.user[0].interestedSports || [],
        });
      } else {
        navigate("/login");
      }
    });

    // Sportágak betöltése az adatbázisból
    Axios.get("http://localhost:5000/api/sportok").then((response) => {
      setSports(response.data);
    }).catch((error) => {
      console.error("Hiba a sportágak lekérdezésekor:", error);
    });
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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
          alert(error.response.data.message || "Hiba történt a jelszóváltoztatás során.");
        } else {
          alert("Nem sikerült csatlakozni a szerverhez. Próbáld újra később.");
        }
        console.error("Hiba:", error);
      });
  };

  const handleSaveChanges = () => {
    const requiredFields = ["vnev", "knev", "email", "szul", "lakhely", "username"];
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

  const handleSportSelection = (e) => {
    const sport = e.target.value;
    setSelectedSport(sport);
    if (sport && !userData.interestedSports.includes(sport)) {
      const updatedSports = [...userData.interestedSports, sport];
      setUserData({ ...userData, interestedSports: updatedSports });

      Axios.post("http://localhost:5000/updateUser", {
        ...userData,
        interestedSports: updatedSports,
      })
        .then((response) => {
          console.log("Érdeklődési körök frissítve:", response.data);
        })
        .catch((error) => {
          console.error("Hiba az érdeklődési körök mentésekor:", error);
        });

      fetchRecommendedTrainings(sport);
    }
  };

  const fetchRecommendedTrainings = (sport) => {
    Axios.get(`http://localhost:5000/api/edzesek/sport/${sport}`)
      .then((response) => {
        setRecommendedTrainings(response.data);
      })
      .catch((error) => {
        console.error(`Hiba a(z) ${sport} edzések lekérdezésekor:`, error);
        setRecommendedTrainings([]);
      });
  };

  const removeSport = (sport) => {
    const updatedSports = userData.interestedSports.filter((s) => s !== sport);
    setUserData({ ...userData, interestedSports: updatedSports });

    Axios.post("http://localhost:5000/updateUser", {
      ...userData,
      interestedSports: updatedSports,
    })
      .then((response) => {
        console.log("Érdeklődési körök frissítve:", response.data);
      })
      .catch((error) => {
        console.error("Hiba az érdeklődési körök mentésekor:", error);
      });

    if (selectedSport === sport) {
      setSelectedSport("");
      setRecommendedTrainings([]);
    }
  };

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
                  value={userData.szul ? userData.szul.split('T')[0] : ""}
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
                <td>{userData.szul ? new Date(userData.szul).toLocaleDateString("hu-HU") : ""}</td>
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

          {userRole === "visitor" && (
            <div className="interests-section">
              <h2>Milyen típusú edzések érdekelnek téged?</h2>
              <p>Így személyre szabott ajánlatokat kaphatsz.</p>
              <select value={selectedSport} onChange={handleSportSelection}>
                <option value="">Válassz egy sportágat...</option>
                {sports.map((sport) => (
                  <option key={sport.sport_id} value={sport.sportnev}>
                    {sport.sportnev}
                  </option>
                ))}
              </select>

              {userData.interestedSports.length > 0 && (
                <div className="selected-sports">
                  <h3>Kiválasztott sportágak:</h3>
                  <ul>
                    {userData.interestedSports.map((sport, index) => (
                      <li key={index}>
                        {sport}
                        <button
                          className="remove-sport-button"
                          onClick={() => removeSport(sport)}
                        >
                          Törlés
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {recommendedTrainings.length > 0 && (
                <div className="recommended-trainings">
                  <h3>Ajánlott edzések ({selectedSport}):</h3>
                  <ul>
                    {recommendedTrainings.map((training) => (
                      <li key={training.edzes_id} className="training-item">
                        <strong>{training.klubbnev}</strong> <br />
                        <strong>Helyszín:</strong> {training.hely} <br />
                        <strong>Pontos cím:</strong> {training.pontoscim} <br />
                        <strong>Nap:</strong> {training.nap} <br />
                        <strong>Idő:</strong> {training.ido}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <button onClick={editMode ? handleSaveChanges : () => setEditMode(true)}>
        {editMode ? 'Mentés' : 'Szerkesztés'}
      </button>
    </div>
  );
};

export default Profil;