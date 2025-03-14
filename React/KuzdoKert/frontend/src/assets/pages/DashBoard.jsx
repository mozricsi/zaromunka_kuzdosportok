// src/assets/pages/DashBoard.jsx
import { useState, useEffect } from "react";
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import "../../Styles/DashBoard.css";


const DashBoard = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    fetch('http://localhost:5000/api/edzesek/user/4') // Példa user_id = 4
      .then(res => res.json())
      .then(data => {
        const days = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek'];
        const counts = days.map(day => data.filter(d => d.nap === day).length);
        setChartData({
          labels: days,
          datasets: [{
            label: 'Edzések száma',
            data: counts,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          }]
        });
      })
      .catch(err => console.error("Hiba a statisztikák lekérdezésekor:", err));
  }, []);

  return (
    <div className="App">
      <Navbar />
      <section className="dashboard-section">
        <h2>Dashboard</h2>
        <p>Edzésstatisztikáid:</p>
        <div className="chart-container">
          <Bar data={chartData} options={{ responsive: true }} />
        </div>
      </section>
    </div>
  );
};

export default DashBoard;