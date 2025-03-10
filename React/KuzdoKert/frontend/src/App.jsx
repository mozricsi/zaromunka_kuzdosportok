import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import { Home, EdzoiOldal, Login, Register, Profil, SportKartyak, SportLeiras, EdzesNaplo, Logout, Klub,} from './assets/pages/routes';
=======
import { Home, EdzoiOldal, Login, Register, Profil, SportKartyak, SportLeiras, EdzesNaplo, Logout, SportLeiras1,} from './assets/pages/routes';

>>>>>>> 4ae6fa23b2272cb13a5e90482f81a2bfaf548d49
import Navbar from './Navbar';
import { Axios } from 'axios';
import { useState, useEffect } from 'react';


function App() {


  return (
    
    <>
    <Router>
    
      <Navbar></Navbar>
      <Routes>
        

        <Route path="/" element={<Home />} />
        <Route path="/edzoioldal" element={<EdzoiOldal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/SportKartyak" element={<SportKartyak />} />
        <Route path="/SportLeiras" element={<SportLeiras />} />
        <Route path="/EdzesNaplo" element={<EdzesNaplo />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/SportLeiras/:id" element={<SportLeiras/>} />
<<<<<<< HEAD
        <Route path="/Klub" element={<Klub/>} />
        <Route path="/Klub/:id" element={<Klub/>} />
=======
        
>>>>>>> 4ae6fa23b2272cb13a5e90482f81a2bfaf548d49
        

        

      </Routes>
    </Router>
 
    </>
  );
}

export default App;