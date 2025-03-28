import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../Styles/ranglista.css';

function Ranglista() {
  const [coachesLeaderboard, setCoachesLeaderboard] = useState([]);
  const [visitorsLeaderboard, setVisitorsLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/ranglista?page=${page}&limit=${itemsPerPage}&filter=${filter}`);
      setCoachesLeaderboard(response.data.coaches);
      setVisitorsLeaderboard(response.data.visitors);
      setLoading(false);
    } catch (err) {
      console.error('Hiba a ranglista lekérdezésekor:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000); // 30 másodpercenként frissít
    return () => clearInterval(interval);
  }, [page, filter]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1); // Visszaállítjuk az első oldalra szűréskor
  };

  if (loading) {
    return (
      <div className="p-4 text-center min-h-screen bg-333">
        <h1 className="text-3xl font-bold text-ff4500 animate-pulse">Ranglista betöltése...</h1>
      </div>
    );
  }

  return (
    <div className="sport-page min-h-screen bg-333 text-ff4500">
      {/* Szűrő gombok */}
      <div className="filter-section">
        <button onClick={() => handleFilterChange('all')} className={filter === 'all' ? 'active' : ''}>Összes</button>
        <button onClick={() => handleFilterChange('last30days')} className={filter === 'last30days' ? 'active' : ''}>Utolsó 30 nap</button>
      </div>

      {/* Edzők ranglistája */}
      <h1 className="text-4xl font-bold mb-6 text-center animate-pulse bg-333 p-5">
        Ranglista - A Legjobb Edzők
      </h1>
      <div className="max-w-1200 mx-auto p-4">
        <div className="overflow-x-auto shadow-lg rounded-lg asztal">
          <table className="w-full text-left bg-2c2c2c border-separate border-spacing-0">
            <thead>
              <tr className="bg-333">
                <th className="p-3 border-b-2 border-ccc">Helyezés</th>
                <th className="p-3 border-b-2 border-ccc">Felhasználónév</th>
                <th className="p-3 border-b-2 border-ccc">Edzések Száma</th>
              </tr>
            </thead>
            <tbody>
              {coachesLeaderboard.map((user, index) => (
                <tr
                  key={index}
                  className={`transition-all duration-500 ${
                    index === 0
                      ? 'bg-ff4500'
                      : index === 1
                      ? 'bg-ccc'
                      : index === 2
                      ? 'bg-2c2c2c'
                      : 'bg-2c2c2c hover:bg-1a1a1a'
                  }`}
                >
                  <td className="p-3 border-b border-ccc font-bold">
                    {index + 1}.
                    {index < 3 && (
                      <span className="ml-2 text-sm text-ccc">
                        {index === 0 && <span className="trophy">🏆</span>}
                        {index === 1 && <span className="trophy">🥈</span>}
                        {index === 2 && <span className="trophy">🥉</span>}
                      </span>
                    )}
                  </td>
                  <td className="p-3 border-b border-ccc">
                    <Link to={`/profil/${user.felhasznalonev}`} className="user-link">
                      <div className="user-profile">
                        <img
                          src={user.profilePic || 'https://via.placeholder.com/30?text=User'}
                          alt="Profilkép"
                          className="avatar"
                        />
                        {user.felhasznalonev}
                      </div>
                    </Link>
                  </td>
                  <td className="p-3 border-b border-ccc">{user.edzesek} edzés</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {coachesLeaderboard.length === 0 && (
          <p className="text-center mt-4 text-ccc">Még nincs ranglista adat az edzőkről.</p>
        )}
        <div className="pagination">
          <button onClick={() => setPage(page - 1)} disabled={page === 1}>Előző</button>
          <span>Oldal {page}</span>
          <button onClick={() => setPage(page + 1)}>Következő</button>
        </div>
      </div>

      {/* Látogatók ranglistája */}
      <h1 className="text-4xl font-bold mb-6 text-center animate-pulse bg-333 p-5 mt-10">
        Ranglista - A Legaktívabb Látogatók
      </h1>
      <div className="max-w-1200 mx-auto p-4">
        <div className="overflow-x-auto shadow-lg rounded-lg asztal">
          <table className="w-full text-left bg-2c2c2c border-separate border-spacing-0">
            <thead>
              <tr className="bg-333">
                <th className="p-3 border-b-2 border-ccc">Helyezés</th>
                <th className="p-3 border-b-2 border-ccc">Felhasználónév</th>
                <th className="p-3 border-b-2 border-ccc">Részt vett edzések</th>
              </tr>
            </thead>
            <tbody>
              {visitorsLeaderboard.map((user, index) => (
                <tr
                  key={index}
                  className={`transition-all duration-500 ${
                    index === 0
                      ? 'bg-ff4500'
                      : index === 1
                      ? 'bg-ccc'
                      : index === 2
                      ? 'bg-2c2c2c'
                      : 'bg-2c2c2c hover:bg-1a1a1a'
                  }`}
                >
                  <td className="p-3 border-b border-ccc font-bold">
                    {index + 1}.
                    {index < 3 && (
                      <span className="ml-2 text-sm text-ccc">
                        {index === 0 && <span className="trophy">🏆</span>}
                        {index === 1 && <span className="trophy">🥈</span>}
                        {index === 2 && <span className="trophy">🥉</span>}
                      </span>
                    )}
                  </td>
                  <td className="p-3 border-b border-ccc">
                    <Link to={`/profil/${user.felhasznalonev}`} className="user-link">
                      <div className="user-profile">
                        <img
                          src={user.profilePic || 'https://via.placeholder.com/30?text=User'}
                          alt="Profilkép"
                          className="avatar"
                        />
                        {user.felhasznalonev}
                      </div>
                    </Link>
                  </td>
                  <td className="p-3 border-b border-ccc">{user.reszvetel} edzés</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {visitorsLeaderboard.length === 0 && (
          <p className="text-center mt-4 text-ccc">Még nincs ranglista adat a látogatókról.</p>
        )}
        <div className="pagination">
          <button onClick={() => setPage(page - 1)} disabled={page === 1}>Előző</button>
          <span>Oldal {page}</span>
          <button onClick={() => setPage(page + 1)}>Következő</button>
        </div>
      </div>
    </div>
  );
}

export default Ranglista;