import React, { useState, useEffect } from "react";
import Axios from 'axios';
import '../Styles/regisztracio.css';
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [loginStatus, setLoginStatus] = useState("");
  Axios.defaults.withCredentials = true;
  
  useEffect(() => {  
    Axios.get("http://localhost:5000/login").then((response) => {
      if (response.data.loggedIn === true) {
        setLoginStatus(response.data.user[0].felhasznalonev);
      }
    });
  }, []);

  const [vezeteknevReg, setVezeteknevReg] = useState(null);
  const [keresztnevReg, setKeresztnevReg] = useState(null);
  const [keresztnev2Reg, setKeresztnev2Reg] = useState(null);
  const [emailReg, setEmailReg] = useState(null);
  const [szulReg, setSzulReg] = useState(null);
  const [lakhelyReg, setLakhelyReg] = useState(null);
  const [telReg, setTelReg] = useState(null);
  const [felhasznalonevReg, setFelhasznalonevReg] = useState(null);
  const [jelszoReg, setJelszoReg] = useState(null);
  const [jelszoReg2, setJelszoReg2] = useState(null);
  const [role, setRole] = useState("visitor"); // Új állapot a szerepkörhöz

  const [reg, setReg] = useState(null);
  const navigate = useNavigate();

  const register = async () => {
    const usernameToCheck = felhasznalonevReg;

    if (!usernameToCheck) {
      setReg("A felhasználónév megadása kötelező!");
      return;
    } else {
      try {
        const response = await Axios.post("http://localhost:5000/checkUsername", {
          username: usernameToCheck,
        });

        setTimeout(() => {
          if (response.data.exists === true) {
            setReg("Létező felhasználónév!");
            return;
          } else {
            if (vezeteknevReg && keresztnevReg && emailReg && szulReg && lakhelyReg && usernameToCheck && jelszoReg) {
              if (jelszoReg === jelszoReg2) {
                Axios.post("http://localhost:5000/register", {
                  username: usernameToCheck,
                  password: jelszoReg,
                  vnev: vezeteknevReg,
                  knev: keresztnevReg,
                  knev2: keresztnev2Reg,
                  email: emailReg,
                  szul: szulReg,
                  lakhely: lakhelyReg,
                  tel: telReg,
                  role: role, // Szerepkör elküldése
                });

                setReg("Sikeres regisztráció!");
                setTimeout(() => {
                  navigate("/login");
                }, 1000);
              } else {
                setReg("A beírt jelszó nem egyezik!");
              }
            } else {
              setReg("Minden kötelező mezőt ki kell tölteni!");
            }
          }
        }, 10);
      } catch (error) {
        console.error("Hiba történt a szerverrel:", error);
        setReg("Hiba történt a regisztráció során.");
      }
    }
  };

  return (
    <div className="regisztracio">
      <h2>Regisztráció</h2>
      <p>
        A csillaggal jelölt mezőket a regisztráció során <span className="kotelezo">KÖTELEZŐ</span> kitölteni.
      </p>

      <main>
        <div className="reg">
          <div className="reg_data">
            <div className="reg_names">
              <div>
                <label><span className="kotelezo">*</span>Vezetéknév:</label> <br />
                <input
                  type="text"
                  placeholder="Vezetéknév*"
                  onChange={(e) => setVezeteknevReg(e.target.value)}
                />
              </div>
              <div>
                <label><span className="kotelezo">*</span>Keresztnév:</label> <br />
                <input
                  type="text"
                  placeholder="Keresztnév*"
                  onChange={(e) => setKeresztnevReg(e.target.value)}
                />
              </div>
              <div>
                <label>Harmadik név: <span className="nemkotelezo">(ha van)</span></label> <br />
                <input
                  type="text"
                  placeholder="Harmadik név(ha van)"
                  onChange={(e) => {
                    if (e.target.value === "") setKeresztnev2Reg(null);
                    else setKeresztnev2Reg(e.target.value);
                  }}
                />
              </div>
            </div>

            <div>
              <label><span className="kotelezo">*</span>Email cím:</label> <br />
              <input
                type="text"
                placeholder="Email cím*"
                onChange={(e) => setEmailReg(e.target.value)}
              />
            </div>

            <div className="reg_names">
              <div>
                <label><span className="kotelezo">*</span>Születési idő:</label> <br />
                <input type="date" onChange={(e) => setSzulReg(e.target.value)} required />
              </div>
              <div>
                <label><span className="kotelezo">*</span>Lakhely:</label> <br />
                <select onChange={(e) => setLakhelyReg(e.target.value)}>
                  <option>Válassz..</option>
                  <option>Budapest</option>
                  <option>Szeged</option>
                  <option>Pécs</option>
                  <option>Kazincbarcika</option>
                </select>
              </div>
            </div>

            <div>
              <label>Telefonszám: <span className="nemkotelezo">(nem kötelező)</span></label> <br />
              <input
                type="text"
                placeholder="Telefon(nem kötelező)"
                onChange={(e) => setTelReg(e.target.value)}
              />
            </div>

            <div>
              <label><span className="kotelezo">*</span>Felhasználónév:</label> <br />
              <input
                type="text"
                placeholder="Felhasználónév*"
                onChange={(e) => setFelhasznalonevReg(e.target.value)}
                required
              />
            </div>

            <div>
              <label><span className="kotelezo">*</span>Jelszó:</label> <br />
              <input
                type="password"
                placeholder="Jelszó*"
                onChange={(e) => setJelszoReg(e.target.value)}
                required
              />
            </div>

            <div>
              <label><span className="kotelezo">*</span>Jelszó ismét:</label> <br />
              <input
                type="password"
                placeholder="Jelszó újra*"
                onChange={(e) => setJelszoReg2(e.target.value)}
                required
              />
            </div>

            <div>
              <label><span className="kotelezo">*</span>Szerepkör:</label> <br />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="visitor">Látogató</option>
                <option value="coach">Edző</option>
              </select>
            </div>
          </div>

          <div>
            <p>{reg}</p>
            <button type="submit" onClick={register}>Regisztráció</button>
          </div>
          <p>
            Van már fiókód? <br />
            <Link to="/login">Jelentkezz be itt!</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;