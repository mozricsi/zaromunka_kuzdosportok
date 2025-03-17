import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import logo from './assets/kepek/fiok.png';
import Axios from "axios";
import './assets/Styles/navbar.css';

const Navbar = () => { // Távolítsd el a propokat, mert nem használjuk őket
  const [loginStatus, setLoginStatus] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [visitorNotifications, setVisitorNotifications] = useState([]);
  const [coachNotifications, setCoachNotifications] = useState([]);
  const [isVisitorNotifOpen, setIsVisitorNotifOpen] = useState(false);
  const [isCoachNotifOpen, setIsCoachNotifOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    const checkLoginStatus = () => {
      Axios.get("http://localhost:5000/login")
        .then((response) => {
          if (response.data.loggedIn) {
            setLoginStatus(response.data.user[0].felhasznalonev);
            setUserRole(response.data.user[0].role);
            setUserId(response.data.user[0].user_id);
          } else {
            setLoginStatus(false);
            setUserRole(null);
            setUserId(null);
          }
        })
        .catch((error) => {
          console.error("Hiba történt:", error);
        });
    };

    checkLoginStatus();
    const interval = setInterval(checkLoginStatus, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (userId && userRole === "visitor") {
      const fetchVisitorNotifications = async () => {
        try {
          const response = await Axios.get(`http://localhost:5000/notifications/${userId}`);
          setVisitorNotifications(response.data);
        } catch (error) {
          console.error("Hiba a látogatói értesítések lekérdezésekor:", error);
        }
      };

      fetchVisitorNotifications();
      const interval = setInterval(fetchVisitorNotifications, 300000);
      return () => clearInterval(interval);
    }
  }, [userId, userRole]);

  useEffect(() => {
    if (userId && userRole === "coach") {
      const fetchCoachNotifications = async () => {
        try {
          const response = await Axios.get(`http://localhost:5000/coach-notifications/${userId}`);
          setCoachNotifications(response.data);
        } catch (error) {
          console.error("Hiba az edzői értesítések lekérdezésekor:", error);
        }
      };

      fetchCoachNotifications();
      const interval = setInterval(fetchCoachNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [userId, userRole]);

  return (
    <div>
      <nav className="navbar navbar-expand-lg custom-navbar">
        <Link className="navbar-brand nav-item" to="/">Főoldal</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <NavLink className="navbar-brand nav-item" to="/SportKartyak">Sportok</NavLink>
          
          {/* NavLink-ek az útvonalakhoz */}
          <NavLink className="navbar-brand nav-item" to="/DashBoard">Dashboard</NavLink>
          <NavLink className="navbar-brand nav-item" to="/esemenyek">Események</NavLink>
          <NavLink className="navbar-brand nav-item" to="/livestream">Élő Stream</NavLink>
          <NavLink className="navbar-brand nav-item" to="/chat">Chat</NavLink>
          <NavLink className="navbar-brand nav-item" to="/ranglista">Ranglista</NavLink>

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

          {/* Látogatói értesítések */}
          {loginStatus && userRole === "visitor" && (
            <div className="notification-container">
              <div
                className="nav-item notification"
                onMouseEnter={() => setIsVisitorNotifOpen(true)}
                onMouseLeave={() => setIsVisitorNotifOpen(false)}
              >
                <span className="nav-icon notification-bell">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  {visitorNotifications.length > 0 && (
                    <span className="notification-count">{visitorNotifications.length}</span>
                  )}
                </span>
                <ul
                  className={`dropdown-menu notification-menu ${isVisitorNotifOpen ? 'show' : ''}`}
                  aria-labelledby="notificationBell"
                >
                  {visitorNotifications.length > 0 ? (
                    visitorNotifications.map((notif) => (
                      <li key={notif.jelentkezes_id} className="notification-item">
                        <strong>Emlékeztető:</strong> Ma edzésed van!<br />
                        Klub: {notif.klubbnev}<br />
                        Helyszín: {notif.hely}<br />
                        Idő: {notif.nap} {notif.ido}<br />
                        Edző: {notif.coach_vnev} {notif.coach_knev}
                      </li>
                    ))
                  ) : (
                    <li className="notification-item">Nincs ma edzésed.</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Edzői értesítések */}
          {loginStatus && userRole === "coach" && (
            <div className="notification-container">
              <div
                className="nav-item notification"
                onMouseEnter={() => setIsCoachNotifOpen(true)}
                onMouseLeave={() => setIsCoachNotifOpen(false)}
              >
                <span className="nav-icon notification-bell">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  {coachNotifications.length > 0 && (
                    <span className="notification-count">{coachNotifications.length}</span>
                  )}
                </span>
                <ul
                  className={`dropdown-menu notification-menu ${isCoachNotifOpen ? 'show' : ''}`}
                  aria-labelledby="notificationBell"
                >
                  {coachNotifications.length > 0 ? (
                    coachNotifications.map((notif) => (
                      <li key={notif.jelentkezes_id} className="notification-item">
                        <strong>Új jelentkezés:</strong><br />
                        Látogató: {notif.visitor_username}<br />
                        Klub: {notif.klubbnev}<br />
                        Helyszín: {notif.hely}<br />
                        Idő: {notif.nap} {notif.ido}<br />
                        Jelentkezés időpontja: {new Date(notif.jelentkezes_ido).toLocaleString()}
                      </li>
                    ))
                  ) : (
                    <li className="notification-item">Nincs új jelentkezés.</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Profil dropdown */}
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
        </div>
      </nav>
    </div>
  );
};

export default Navbar;