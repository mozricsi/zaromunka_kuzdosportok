import { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/ranglista.css';

function Ranglista() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/ranglista')
      .then((res) => {
        setLeaderboard(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Hiba a ranglista lekérdezésekor:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center min-h-screen bg-333">
        <h1 className="text-3xl font-bold text-ff4500 animate-pulse">Ranglista betöltése...</h1>
      </div>
    );
  }

  return (
    <div className="sport-page min-h-screen bg-333 text-ff4500">
      <h1 className="text-4xl font-bold mb-6 text-center animate-pulse bg-333 p-5">
        Ranglista - A Legjobb Edzők
      </h1>
      <div className="max-w-1200 mx-auto p-4">
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="w-full text-left bg-2c2c2c border-separate border-spacing-0">
            <thead>
              <tr className="bg-333">
                <th className="p-3 border-b-2 border-ccc">Helyezés</th>
                <th className="p-3 border-b-2 border-ccc">Felhasználónév</th>
                <th className="p-3 border-b-2 border-ccc">Edzések Száma</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
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
                        {index === 0 && '🥇 Arany'}
                        {index === 1 && '🥈 Ezüst'}
                        {index === 2 && '🥉 Bronz'}
                      </span>
                    )}
                  </td>
                  <td className="p-3 border-b border-ccc">{user.felhasznalonev}</td>
                  <td className="p-3 border-b border-ccc">{user.edzesek} edzés</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {leaderboard.length === 0 && (
          <p className="text-center mt-4 text-ccc">Még nincs ranglista adat.</p>
        )}
      </div>
    </div>
  );
}

export default Ranglista;