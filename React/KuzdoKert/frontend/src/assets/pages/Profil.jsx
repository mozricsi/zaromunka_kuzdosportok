import { useState } from "react";
import { useEffect } from "react";
import { FaEdit } from 'react-icons/fa';
import "../Styles/profil.css";

const Profil = () => {
 
  const [userData, setUserData] = useState({
    lastName: 'Kovács',
    firstName: 'János',
    middleName: '',
    email: 'janos.kovacs@example.com',
    birthDate: '1990-01-01',
    location: 'Budapest',
    phoneNumber: '+36 30 123 4567',
    username: 'janos90',
    password: '********',
    profilePicture: null,
  });

  const [editingField, setEditingField] = useState(null); // Melyik mezőt szerkesztjük éppen
  const [tempValue, setTempValue] = useState(''); // Ideiglenes érték a szerkesztéshez
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

  const startEditing = (field, value) => {
    setEditingField(field);
    setTempValue(value);
  };

  const saveEditing = (field) => {
    setUserData({ ...userData, [field]: tempValue });
    setEditingField(null);
    setTempValue('');
    alert('Adatok sikeresen frissítve!');
  };

  return (
    <div className="profile-page">
      <h1>Profil</h1>
      <table className="profile-table">
        <tbody>
          {Object.entries(userData).map(([key, value]) => (
            key !== 'profilePicture' && (
              <tr key={key}>
                <th>{key === 'lastName' ? 'Vezetéknév' :
                     key === 'firstName' ? 'Keresztnév' :
                     key === 'middleName' ? 'Harmadik név (ha van)' :
                     key === 'email' ? 'Email cím' :
                     key === 'birthDate' ? 'Születési dátum' :
                     key === 'location' ? 'Lakhely' :
                     key === 'phoneNumber' ? 'Telefonszám' :
                     key === 'username' ? 'Felhasználónév' :
                     key === 'password' ? 'Jelszó' : key}:</th>
                <td>
                  {editingField === key ? (
                    <>
                      <input
                        type={key === 'birthDate' ? 'date' : key === 'password' ? 'password' : 'text'}
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                      />
                      <button onClick={() => saveEditing(key)}>Mentés</button>
                    </>
                  ) : (
                    <>
                      {key === 'password' ? '********' : value}
                      <FaEdit
                        className="edit-icon"
                        onClick={() => startEditing(key, value)}
                      />
                    </>
                  )}
                </td>
              </tr>
            )
          ))}
          <tr>
            <th>Profilkép:</th>
            <td>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
              />
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
    </div>
  );
};
  
  export default Profil;