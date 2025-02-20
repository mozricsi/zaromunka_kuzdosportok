import { useState } from "react";
import { useEffect } from "react";
import "../Styles/profil.css";

const Profil = () => {
 
  const [userData, setUserData] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    email: '',
    birthDate: '',
    location: '',
    phoneNumber: '',
    username: '',
    password: '',
    profilePicture: null,
  });

  const [editMode, setEditMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
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
    if (newPassword === confirmPassword) {
      setUserData({ ...userData, password: newPassword });
      setNewPassword('');
      setConfirmPassword('');
      alert('Jelszó sikeresen megváltoztatva!');
    } else {
      alert('A jelszavak nem egyeznek!');
    }
  };

  const handleSaveChanges = () => {
    setEditMode(false);
    alert('Adatok sikeresen frissítve!');
  };

  return (
    <div className="profile-page">
      <h1>Profil</h1>
      {editMode ? (
        <table className="profile-table">
          <tbody>
            <tr>
              <th>Vezetéknév:</th>
              <td>
                <input
                  type="text"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <th>Keresztnév:</th>
              <td>
                <input
                  type="text"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <th>Harmadik név (ha van):</th>
              <td>
                <input
                  type="text"
                  name="middleName"
                  value={userData.middleName}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <th>Email cím:</th>
              <td>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <th>Születési dátum:</th>
              <td>
                <input
                  type="date"
                  name="birthDate"
                  value={userData.birthDate}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <th>Lakhely:</th>
              <td>
                <input
                  type="text"
                  name="location"
                  value={userData.location}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <th>Telefonszám:</th>
              <td>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={userData.phoneNumber}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <th>Felhasználónév:</th>
              <td>
                <input
                  type="text"
                  name="username"
                  value={userData.username}
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
        <table className="profile-table">
          <tbody>
            <tr>
              <th>Vezetéknév:</th>
              <td>{userData.lastName}</td>
            </tr>
            <tr>
              <th>Keresztnév:</th>
              <td>{userData.firstName}</td>
            </tr>
            <tr>
              <th>Harmadik név (ha van):</th>
              <td>{userData.middleName}</td>
            </tr>
            <tr>
              <th>Email cím:</th>
              <td>{userData.email}</td>
            </tr>
            <tr>
              <th>Születési dátum:</th>
              <td>{userData.birthDate}</td>
            </tr>
            <tr>
              <th>Lakhely:</th>
              <td>{userData.location}</td>
            </tr>
            <tr>
              <th>Telefonszám:</th>
              <td>{userData.phoneNumber}</td>
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
      )}

      <div className="password-change">
        <h2>Jelszó változtatása</h2>
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

      <button onClick={editMode ? handleSaveChanges : () => setEditMode(true)}>
        {editMode ? 'Mentés' : 'Szerkesztés'}
      </button>
    </div>
  );
};
  
  export default Profil;