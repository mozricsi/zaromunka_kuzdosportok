import { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import "../Styles/esemeneyek.css";

function Esemenyek() {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    axios.get('http://localhost:5000/api/esemenyek').then(res => setEvents(res.data));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Események</h1>
      <Calendar onChange={setDate} value={date} />
      <div>
        {events.filter(e => new Date(e.ido).toDateString() === date.toDateString()).map(event => (
          <div key={event.esemeny_id} className="p-2 bg-blue-100 rounded">
            <p>{event.sportneve} - {event.leiras}</p>
            <p>Helyszín: {event.pontos_cim}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Esemenyek;