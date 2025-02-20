import React, {useState} from "react";
import Axios from 'axios'
import '../Styles/regisztracio.css'


const Register = () => {
  const [vezeteknevReg, setVezeteknevReg] = useState("");
  const [keresztnevReg, setKeresztnevReg] = useState("");
  const [keresztnev2Reg, setKeresztnev2Reg] = useState(null);
  const [emailReg, setEmailReg] = useState("");
  const [szulReg, setSzulReg] = useState("");
  const [lakhelyReg, setLakhelyReg] = useState("");
  const [telReg, setTelReg] = useState("");
  const [felhasznalonevReg, setFelhasznalonevReg] = useState("");
  const [jelszoReg, setJelszoReg] = useState("");
  const register = () => {
    Axios.post("http://localhost:5000/register", {

      username: felhasznalonevReg,
      password: jelszoReg,
      vnev: vezeteknevReg,
      knev: keresztnevReg,
      knev2: keresztnev2Reg,
      email: emailReg,
      szul: szulReg,
      lakhely: lakhelyReg,
      tel: telReg,
      
    }).then((response) => {
      console.log(response);
    });
  };
  // Szar a reszponzivitás!!!
  return (

    <>
    <h2>Regisztráció</h2>
    <p>A csillaggal jelölt mezőket a regisztráció során <span className="kotelezo">KÖTELEZŐ</span> kitölteni.</p>


    <main>
    <div className="reg">
      
        <div className="reg_names">
          <div>
            <label><span className="kotelezo">*</span>Vezetéknév:</label> <br></br>
            <input
              type="text"
              placeholder="Vezetéknév*"
              onChange={(e) => {
                setVezeteknevReg(e.target.value)
              }}
            />
          </div>

          <div>
            <label><span className="kotelezo">*</span>Keresztnév:</label> <br></br>
            <input
              type="text"
              placeholder="Keresztnév*"
              onChange={(e) => {
                setKeresztnevReg(e.target.value)
              }}
            />
          </div>

          <div>
            <label><span className="kotelezo"></span>Harmadik név: <span className="nemkotelezo"> (ha van)</span></label> <br></br>
            <input
              type="text"
              placeholder="Harmadik név(ha van)"
              onChange={(e) => {
                if (e.target.value === "") {
                  setKeresztnev2Reg(null);
                } else {
                  setKeresztnev2Reg(e.target.value);
                }
              }}
            />
          </div>
        </div>
            
          <div>
            <label><span className="kotelezo">*</span>Email cím:</label> <br></br>
              <input
                type="text"
                placeholder="Email cím*"
                onChange={(e) => {
                  setEmailReg(e.target.value)
                }}
              />
          </div>
          <div className="reg_names">
            <div>
              <label><span className="kotelezo">*</span>Születési idő:</label> <br></br>
              <input type="date" onChange={(e) => setSzulReg(e.target.value)} required />
            </div>

            <div>
              <label><span className="kotelezo">*</span>Lakhely:</label> <br></br>
              <select onChange={(e) => {setLakhelyReg(e.target.value)}}>
                <option>Válassz..</option>
                <option>Saab</option>
                <option>Fiat</option>
                <option>Audi</option>
              </select>
            </div>
          </div>
          <div>
          <label>Telefonszám: <span className="nemkotelezo">(nem kötelező)</span></label> <br></br>
              <input
                type="text"
                placeholder="Telefon(nem kötelező)"
                onChange={(e) => {
                  setTelReg(e.target.value)
                }}
              />
          </div>

            <div>
            <label><span className="kotelezo">*</span>Felhasználónév:</label> <br></br>
                <input
                  type="text"
                  placeholder="Felhasználónév*"
                  onChange={(e) => {
                    setFelhasznalonevReg(e.target.value)
                  }}
                  required
                />
            </div>

            <div>
            <label><span className="kotelezo">*</span>Jelszó:</label> <br></br>
                <input
                  type="password"
                  placeholder="Jelszó*"
                    onChange={(e) => {
                        setJelszoReg(e.target.value)
                      }}
                    required
                  />
            </div>
            <div>
            <label><span className="kotelezo">*</span>Jelszó ismét:</label> <br></br>
                <input
                  type="password"
                  placeholder="Jelszó újra*"
                    onChange={(e) => {
                        setJelszoReg(e.target.value)
                      }}
                    required
                  />
            </div>

            <br></br>

            <div>
              <button type="submit" onClick={register}>Regisztráció</button>
            </div>
      
    </div>
    </main>
    </>
  );
};
  export default Register;