import React from "react";
import {Link, NavLink} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css' 
import 'bootstrap/dist/js/bootstrap.min.js'
import  logo from './assets/kepek/fiok.png'
import { useState } from "react";
import './assets/Styles/dropdown.css'


const Navbar = (()=>{

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return(
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">

                <Link className="navbar-brand" to='/'>Főoldal</Link>
                <NavLink className="navbar-brand" to='/Profil'>Profilom</NavLink>
                <NavLink className="navbar-brand" to='/EdzoiOldal'>Edzői oldal</NavLink>
                <NavLink className="navbar-brand" to='/SportKartyak'>Sportok</NavLink>
                <NavLink className="navbar-brand" to='/EdzesNaplo'>Edzésnapló</NavLink>
                <NavLink className="navbar-brand" to='/Login'>Bejelentkezés</NavLink>
                <NavLink className="navbar-brand" to='/Register'>Regisztráció</NavLink>
        
            <div className="d-flex justify-content-end w-100">
                {/* Fiók ikonú dropdown */}
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
                        <li><NavLink className="dropdown-item" to='/Login'>Bejelentkezés</NavLink></li>
                        <li><NavLink className="dropdown-item" to='/Register'>Regisztráció</NavLink></li>
                    </ul>
                </div>
            </div>
                

            </nav>
        </div>
    )

}
)
export default Navbar