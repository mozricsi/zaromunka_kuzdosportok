import React from "react";
import {Link, NavLink} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css' 
import 'bootstrap/dist/js/bootstrap.min.js'
import  logo from './assets/kepek/fiok.png'
import { useState, useEffect } from "react";
import './assets/Styles/dropdown.css'
import Axios from "axios";


const Navbar = (()=>{

  

        // be vagy e jelentkezve lekérdezés-------------------------------
        const [loginStatus, setLoginStatus] = useState(false);
        
        Axios.defaults.withCredentials = true;
        useEffect(() => {
          const checkLoginStatus = () => {
            Axios.get("http://localhost:5000/login")
              .then((response) => {
                if (response.data.loggedIn) {
                  setLoginStatus(response.data.user[0].felhasznalonev);
                } else {
                  setLoginStatus(false);
                }
              })
              .catch((error) => {
                console.error("Hiba történt:", error);
              });
          };
        

          checkLoginStatus();
          const interval = setInterval(checkLoginStatus, 80);
        
          return () => {

            clearInterval(interval);
          };
        }, []);
   
     //--------------------------------------------------------------------

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


    return(
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">

                <Link className="navbar-brand" to='/'>Főoldal</Link>
                <NavLink className="navbar-brand" to='/SportKartyak'>Sportok</NavLink>               
                <div className="d-flex justify-content-end w-100">

                {loginStatus ? (
            <>
              {/* Ha be van jelentkezve a felhasználó, akkor mutatjuk a Profil és Kijelentkezés linkeket */}
              <NavLink className="navbar-brand" to='/EdzoiOldal'>Edzői oldal</NavLink>              
              <NavLink className="navbar-brand" to='/EdzesNaplo'>Edzésnapló</NavLink>
            </>
          ) : (
            <>
              {/* Ha nincs bejelentkezve a felhasználó, akkor mutatjuk a Bejelentkezés és Regisztráció linkeket */}
              <NavLink className="navbar-brand" to='/Login'>Bejelentkezés</NavLink>
              <NavLink className="navbar-brand" to='/Register'>Regisztráció</NavLink>
            </>
          )}

          </div>
              <div >
                {/* Fiók ikonú dropdown */}
          
              {loginStatus ? (
                  <>
                      <div 
                        className="nav-item dropdown" 
                        style={{ position: 'relative' }}
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                      >
                    <a 
                        className="nav-link dropdown-toggle" 
                        href="#" 
                        id="navbarDropdown" 
                        role="button" 
                        aria-expanded={isDropdownOpen}
                    >
                        <img src={logo} alt="Fiók" style={{ width: '30px', height: '30px' }} />
                    </a>
                      <ul 
                        className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`} 
                        aria-labelledby="navbarDropdown" 
                        style={{ backgroundColor: '#f8f9fa', minWidth: '150px' }}
                    >
                        <li><NavLink className="dropdown-item" to='/Profil'>Profilom</NavLink></li>
                        <li><NavLink className="dropdown-item" to='/Logout'>Kijelentkezés</NavLink></li>
                        </ul>
                        </div>

                  </>
                  ) : (
                  <>

                  </>
                )}
   
            </div>
            </nav>
        </div>
    )

}
)
export default Navbar