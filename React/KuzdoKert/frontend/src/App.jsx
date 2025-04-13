import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, EdzoiOldal, Login, Register, Profil, SportKartyak, SportLeiras, EdzesNaplo, Logout, LiveStream, Klub, Terms, Ranglista, Esemenyek, WelcomeScreen } from './assets/pages/routes';
import Navbar from './Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edzoioldal" element={<EdzoiOldal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/SportKartyak" element={<SportKartyak />} />
        <Route path="/SportLeiras" element={<SportLeiras />} />
        <Route path="/SportLeiras/:id" element={<SportLeiras />} />
        <Route path="/EdzesNaplo" element={<EdzesNaplo />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/Klub" element={<Klub />} />
        <Route path="/Klub/:id" element={<Klub />} />
        <Route path="/Terms" element={<Terms />} />
        <Route path="/Ranglista" element={<Ranglista />} />
        <Route path="/Esemenyek" element={<Esemenyek />} />
        <Route path="/LiveStream" element={<LiveStream />} />
        <Route path="/WelcomeScreen" element={<WelcomeScreen />} />
      </Routes>
    </Router>
  );
}

export default App;