import React from "react";
import {Link, NavLink} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css' 
import 'bootstrap/dist/js/bootstrap.min.js'


const Navbar = (()=>{

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

            </nav>
        </div>
    )

}
)
export default Navbar