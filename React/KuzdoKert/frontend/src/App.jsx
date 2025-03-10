import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, EdzoiOldal, Login, Register, Profil, SportKartyak, SportLeiras, EdzesNaplo, Logout, Klub,} from './assets/pages/routes';
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
        <Route path="/Klub" element={<Klub/>} />
        <Route path="/Klub/:id" element={<Klub/>} />
        

        

      </Routes>
    </Router>
 
    </>
  );
}

export default App;