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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div>
      <nav className="navbar navbar-expand-lg custom-navbar">
        <Link className="navbar-brand nav-item" to="/">Főoldal</Link>
        <NavLink className="navbar-brand nav-item" to="/SportKartyak" activeClassName="active">Sportok</NavLink>
        <div className="d-flex justify-content-end w-100">
          {loginStatus ? (
            <>
              <NavLink className="navbar-brand nav-item" to="/EdzoiOldal" activeClassName="active">Edzői oldal</NavLink>
              <NavLink className="navbar-brand nav-item" to="/EdzesNaplo" activeClassName="active">Edzésnapló</NavLink>
            </>
          ) : (
            <>
              <NavLink className="navbar-brand nav-item" to="/Login" activeClassName="active">Bejelentkezés</NavLink>
              <NavLink className="navbar-brand nav-item" to="/Register" activeClassName="active">Regisztráció</NavLink>
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
                <li><NavLink className="dropdown-item" to="/Profil" activeClassName="active">Profilom</NavLink></li>
                <li><NavLink className="dropdown-item" to="/Logout" activeClassName="active">Kijelentkezés</NavLink></li>
              </ul>
            </div>
          ) : null}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;