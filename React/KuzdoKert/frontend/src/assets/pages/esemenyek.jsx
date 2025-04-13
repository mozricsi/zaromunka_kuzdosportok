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
      const hasEvent = events.some(event => 
        new Date(event.ido).toDateString() === date.toDateString()
      );
      return hasEvent ? 'event-day' : 'no-event-day';
    }
    return null;
  };

  // Google Maps link generálása
  const getGoogleMapsLink = (address) => {
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  };

  // Dátum formázása (teljes verzió)
  const formatDateTime = (dateString) => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleString('hu-HU', options).replace('.', ':').replace(' ', ' ');
  };

  // Státusz és időpont meghatározása
  const getEventStatusAndTime = (event) => {
    const eventDate = new Date(event.ido);
    const now = new Date();

    if (eventDate < now) return { status: "Befejezett", showTime: false };
    if (eventDate.toDateString() === now.toDateString()) return { status: "Élő", showTime: false };
    return { status: "Tervezett", showTime: true, time: formatDateTime(event.ido) };
  };

  return (
    <div className="esemenyek-container">
      <h1>Események</h1>
      <Calendar
        onChange={setDate}
        value={date}
        tileClassName={tileClassName}
      />
      <div>
        {events
          .filter(e => new Date(e.ido).toDateString() === date.toDateString())
          .map(event => {
            const { status, showTime, time } = getEventStatusAndTime(event);

            return (
              <div key={event.esemeny_id} className="event-item">
                <div className="content">
                  <p>{event.sportneve} - {event.leiras}</p>
                  <p>
                    Helyszín:{' '}
                    <a
                      href={getGoogleMapsLink(event.pontos_cim)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="location-link"
                    >
                      {event.pontos_cim}
                    </a>
                  </p>
                </div>
                <div>
                  <div className="event-status">{status}</div>
                  {showTime && <div className="event-time">{time}</div>}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Esemenyek;