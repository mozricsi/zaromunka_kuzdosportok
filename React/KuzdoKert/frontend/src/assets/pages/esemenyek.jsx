import { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import '../Styles/esemenyek.css';

function Esemenyek() {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    axios.get('http://localhost:5000/api/esemenyek').then(res => setEvents(res.data));
  }, []);

  // Függvény a naptár napjainak testreszabására
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      // Ellenőrizzük, van-e esemény az adott napon
      const hasEvent = events.some(event => 
        new Date(event.ido).toDateString() === date.toDateString()
      );
      return hasEvent ? 'event-day' : 'no-event-day';
    }
    return null;
  };

  return (
    <div className="esemenyek-container">
      <h1>Események</h1>
      <Calendar
        onChange={setDate}
        value={date}
        tileClassName={tileClassName} // Dinamikus osztályok hozzárendelése
      />
      <div>
        {events
          .filter(e => new Date(e.ido).toDateString() === date.toDateString())
          .map(event => (
            <div key={event.esemeny_id} className="event-item">
              <p>{event.sportneve} - {event.leiras}</p>
              <p>Helyszín: {event.pontos_cim}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Esemenyek;