import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../Styles/sportleiras.css';
import Axios from 'axios';

const SportLeiras = () => {
  const { sport } = useParams(); // URL paraméter lekérése (pl. /sport/box)
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [clubs, setClubs] = useState([]);

  // Szimulált adatok a közelgő versenyekhez
  useEffect(() => {
    const mockEvents = [
      { id: 1, name: 'Budapest Box Gála', date: '2023-11-15', location: 'Budapest, Papp László Aréna' },
      { id: 2, name: 'Debrecen Nemzetközi Box Torna', date: '2023-12-10', location: 'Debrecen, Főnix Csarnok' },
      { id: 3, name: 'Szegedi Box Bajnokság', date: '2024-01-20', location: 'Szeged, Városi Sportcsarnok' },
    ];
    setUpcomingEvents(mockEvents);
  }, []);

  // Szimulált adatok a magyarországi egyesületekhez
  useEffect(() => {
    const mockClubs = [
      {
        id: 1,
        name: 'Budapest Box Club',
        location: 'Budapest, XIII. kerület',
        coach: 'Kovács János',
        achievements: '2022-es magyar bajnok',
      },
      {
        id: 2,
        name: 'Debrecen Fight Academy',
        location: 'Debrecen, Kassai út',
        coach: 'Nagy Péter',
        achievements: '2021-es Európa-bajnoki ezüstérmes',
      },
      {
        id: 3,
        name: 'Szegedi Box Egyesület',
        location: 'Szeged, Tisza Lajos körút',
        coach: 'Tóth István',
        achievements: '2023-as magyar kupa győztes',
      },
      {
        id: 4,
        name: 'Pécsi Box Klub',
        location: 'Pécs, Király utca',
        coach: 'Horváth Zoltán',
        achievements: '2020-as junior világbajnok',
      },
      {
        id: 5,
        name: 'Győri Ökölvívó Egyesület',
        location: 'Győr, Baross Gábor út',
        coach: 'Szabó László',
        achievements: '2019-es magyar bajnok',
      },
    ];
    setClubs(mockClubs);
  }, []);

  return (
    <div className="sport-leiras">
      <h1>Box</h1>

      {/* Box szabályai */}
      <section className="rules-section">
        <h2>A box szabályai</h2>
        <p>
          A box egy öklözősport, ahol két versenyző próbálja meg legyőzni egymást ütésekkel. A mérkőzés egy ringben zajlik,
          és a cél az ellenfél kiütése vagy a pontozási győzelem elérése. Az alábbiakban bemutatjuk a legfontosabb szabályokat:
        </p>
        <ul>
          <li>A mérkőzés általában 3-12 menetből áll, egy menet 3 perc.</li>
          <li>Csak az öklökkel szabad ütni, és csak a test előre meghatározott részeire (fej, törzs).</li>
          <li>Tilos az ököllel ütni az ellenfél hátulját vagy tarkóját.</li>
          <li>A mérkőzést egy játékvezető irányítja, aki figyeli a szabályok betartását.</li>
          <li>Ha egy versenyző kétszer is a földre kerül egy menetben, az automatikus kiütésnek minősül.</li>
        </ul>
      </section>

      {/* Közelgő versenyek */}
      <section className="events-section">
        <h2>Közelgő versenyek</h2>
        <div className="events-grid">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="event-card">
              <h3>{event.name}</h3>
              <p><strong>Dátum:</strong> {event.date}</p>
              <p><strong>Helyszín:</strong> {event.location}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Magyarországi egyesületek */}
      <section className="clubs-section">
        <h2>Magyarországi box egyesületek</h2>
        <div className="clubs-grid">
          {clubs.map((club) => (
            <div key={club.id} className="club-card">
              <h3>{club.name}</h3>
              <p><strong>Helyszín:</strong> {club.location}</p>
              <p><strong>Edző:</strong> {club.coach}</p>
              <p><strong>Eredmények:</strong> {club.achievements}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top 5 boxklub Magyarországon */}
      <section className="top-clubs-section">
        <h2>Magyarország top 5 boxklubja</h2>
        <ol className="top-clubs-list">
          <li>Budapest Box Club</li>
          <li>Debrecen Fight Academy</li>
          <li>Szegedi Box Egyesület</li>
          <li>Pécsi Box Klub</li>
          <li>Győri Ökölvívó Egyesület</li>
        </ol>
      </section>
    </div>
  );
};

export default SportLeiras;