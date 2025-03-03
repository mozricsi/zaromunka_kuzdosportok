import React from "react";
import { Link, NavLink } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import logo from './assets/kepek/fiok.png';
import { useState, useEffect } from "react";
import './assets/Styles/navbar.css';
import Axios from "axios";

const Navbar = () => {
  const [loginStatus, setLoginStatus] = useState(false);
  const [userRole, setUserRole] = useState(null); // Szerepkör tárolása

  Axios.defaults.withCredentials = true;
  useEffect(() => {
    const checkLoginStatus = () => {
      Axios.get("http://localhost:5000/login")
        .then((response) => {
          if (response.data.loggedIn) {
            setLoginStatus(response.data.user[0].felhasznalonev);
            setUserRole(response.data.user[0].role); // Feltételezem, hogy a szerver visszaadja a role-t
          } else {
            setLoginStatus(false);
            setUserRole(null);
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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div>
      <nav className="navbar navbar-expand-lg custom-navbar">
        <Link className="navbar-brand nav-item" to="/">Főoldal</Link>
        <NavLink className="navbar-brand nav-item" to="/SportKartyak">Sportok</NavLink>
        <div className="d-flex justify-content-end w-100">
          {loginStatus ? (
            <>
              {userRole === "coach" && (
                <NavLink className="navbar-brand nav-item" to="/EdzoiOldal">Edzői oldal</NavLink>
              )}
              {userRole === "visitor" && (
                <NavLink className="navbar-brand nav-item" to="/EdzesNaplo">Edzésnapló</NavLink>
              )}
            </>
          ) : (
            <>
              <NavLink className="navbar-brand nav-item" to="/Login">Bejelentkezés</NavLink>
              <NavLink className="navbar-brand nav-item" to="/Register">Regisztráció</NavLink>
            </>
          )}
        </div>
        <div className="dropdown-container">
          {loginStatus ? (
            <div
              className="nav-item dropdown"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <a
                className="nav-link dropdown-toggle nav-icon"
                href="#"
                id="navbarDropdown"
                role="button"
                aria-expanded={isDropdownOpen}
              >
                <img src={logo} alt="Fiók" className="dropdown-logo" />
              </a>
              <ul
                className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}
                aria-labelledby="navbarDropdown"
              >
                <li><NavLink className="dropdown-item" to="/Profil">Profilom</NavLink></li>
                <li><NavLink className="dropdown-item" to="/Logout">Kijelentkezés</NavLink></li>
              </ul>
            </div>
          ) : null}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;