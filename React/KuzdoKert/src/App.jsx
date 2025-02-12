import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, EdzoiOldal, Login, Register, Profil } from './assets/pages/routes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/edzoioldal" element={<EdzoiOldal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profil" element={<Profil />} />
      </Routes>
    </Router>
  );
}

export default App;