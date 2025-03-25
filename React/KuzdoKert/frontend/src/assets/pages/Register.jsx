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

  // Űrlapadatok inicializálása localStorage-ból, ha vannak
  const [vezeteknevReg, setVezeteknevReg] = useState(localStorage.getItem("vezeteknevReg") || null);
  const [keresztnevReg, setKeresztnevReg] = useState(localStorage.getItem("keresztnevReg") || null);
  const [keresztnev2Reg, setKeresztnev2Reg] = useState(localStorage.getItem("keresztnev2Reg") || null);
  const [emailReg, setEmailReg] = useState(localStorage.getItem("emailReg") || null);
  const [szulReg, setSzulReg] = useState(localStorage.getItem("szulReg") || null);
  const [lakhelyReg, setLakhelyReg] = useState(localStorage.getItem("lakhelyReg") || null);
  const [telReg, setTelReg] = useState(localStorage.getItem("telReg") || null);
  const [felhasznalonevReg, setFelhasznalonevReg] = useState(localStorage.getItem("felhasznalonevReg") || null);
  const [jelszoReg, setJelszoReg] = useState(localStorage.getItem("jelszoReg") || null);
  const [jelszoReg2, setJelszoReg2] = useState(localStorage.getItem("jelszoReg2") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || "visitor");
  const [termsAccepted, setTermsAccepted] = useState(JSON.parse(localStorage.getItem("termsAccepted")) || false);

  const [reg, setReg] = useState(null);
  const navigate = useNavigate();

  // Minden állapotváltozásnál mentés a localStorage-ba
  useEffect(() => {
    localStorage.setItem("vezeteknevReg", vezeteknevReg || "");
    localStorage.setItem("keresztnevReg", keresztnevReg || "");
    localStorage.setItem("keresztnev2Reg", keresztnev2Reg || "");
    localStorage.setItem("emailReg", emailReg || "");
    localStorage.setItem("szulReg", szulReg || "");
    localStorage.setItem("lakhelyReg", lakhelyReg || "");
    localStorage.setItem("telReg", telReg || "");
    localStorage.setItem("felhasznalonevReg", felhasznalonevReg || "");
    localStorage.setItem("jelszoReg", jelszoReg || "");
    localStorage.setItem("jelszoReg2", jelszoReg2 || "");
    localStorage.setItem("role", role);
    localStorage.setItem("termsAccepted", JSON.stringify(termsAccepted));
  }, [
    vezeteknevReg, keresztnevReg, keresztnev2Reg, emailReg, szulReg, 
    lakhelyReg, telReg, felhasznalonevReg, jelszoReg, jelszoReg2, role, termsAccepted
  ]);

  const register = async () => {
    const usernameToCheck = felhasznalonevReg;

    if (!usernameToCheck) {
      setReg("A felhasználónév megadása kötelező!");
      return;
    }

    if (!termsAccepted) {
      setReg("El kell fogadnod az Általános Szerződési Feltételeket!");
      return;
    }

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
                role: role,
              });

              setReg("Sikeres regisztráció!");
              // Sikeres regisztráció után töröljük a localStorage-t
              localStorage.clear();
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
                  value={vezeteknevReg || ""}
                  onChange={(e) => setVezeteknevReg(e.target.value)}
                />
              </div>
              <div>
                <label><span className="kotelezo">*</span>Keresztnév:</label> <br />
                <input
                  type="text"
                  placeholder="Keresztnév*"
                  value={keresztnevReg || ""}
                  onChange={(e) => setKeresztnevReg(e.target.value)}
                />
              </div>
              <div>
                <label>Harmadik név: <span className="nemkotelezo">(ha van)</span></label> <br />
                <input
                  type="text"
                  placeholder="Harmadik név(ha van)"
                  value={keresztnev2Reg || ""}
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
                value={emailReg || ""}
                onChange={(e) => setEmailReg(e.target.value)}
              />
            </div>

            <div className="reg_names">
              <div>
                <label><span className="kotelezo">*</span>Születési idő:</label> <br />
                <input
                  type="date"
                  value={szulReg || ""}
                  onChange={(e) => setSzulReg(e.target.value)}
                  required
                />
              </div>
              <div>
                <label><span className="kotelezo">*</span>Lakhely:</label> <br />
                <select value={lakhelyReg || ""} onChange={(e) => setLakhelyReg(e.target.value)}>
                  <option value="">Válassz..</option>
                  <option value="Budapest">Budapest</option>
                  <option value="Szeged">Szeged</option>
                  <option value="Pécs">Pécs</option>
                  <option value="Kazincbarcika">Kazincbarcika</option>
                </select>
              </div>
            </div>

            <div>
              <label>Telefonszám: <span className="nemkotelezo">(nem kötelező)</span></label> <br />
              <input
                type="text"
                placeholder="Telefon(nem kötelező)"
                value={telReg || ""}
                onChange={(e) => setTelReg(e.target.value)}
              />
            </div>

            <div>
              <label><span className="kotelezo">*</span>Felhasználónév:</label> <br />
              <input
                type="text"
                placeholder="Felhasználónév*"
                value={felhasznalonevReg || ""}
                onChange={(e) => setFelhasznalonevReg(e.target.value)}
                required
              />
            </div>

            <div>
              <label><span className="kotelezo">*</span>Jelszó:</label> <br />
              <input
                type="password"
                placeholder="Jelszó*"
                value={jelszoReg || ""}
                onChange={(e) => setJelszoReg(e.target.value)}
                required
              />
            </div>

            <div>
              <label><span className="kotelezo">*</span>Jelszó ismét:</label> <br />
              <input
                type="password"
                placeholder="Jelszó újra*"
                value={jelszoReg2 || ""}
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

          <br />   

          <div>
            <input
              type="checkbox"
              id="termsCheckbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <label className="aszf" htmlFor="termsCheckbox">
              Elfogadom az{' '}
              <Link to="/terms">
                Általános Szerződési Feltételeket
              </Link>
            </label>
          </div>

          <div>
            <p>{reg}</p>
            <button
              type="submit"
              onClick={register}
              disabled={!termsAccepted}
              style={{
                backgroundColor: termsAccepted ? '#ff4500' : '#ccc',
                cursor: termsAccepted ? 'pointer' : 'not-allowed',
              }}
            >
              Regisztráció
            </button>
          </div>
          <p>
            Van már fiókod? <br />
            <Link to="/login">Jelentkezz be itt!</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;