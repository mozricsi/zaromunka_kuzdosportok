import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/kartyak.css';

const SportKartyak = () => {
  const navigate = useNavigate();

  // Kártyák adatai
  const cards = [
    { id: 'boxing', title: 'Box', image: 'https://via.placeholder.com/300x200?text=Box' },
    { id: 'judo', title: 'Judo', image: 'https://via.placeholder.com/300x200?text=Judo' },
    { id: 'jiu-jitsu', title: 'Jiu Jitsu', image: 'https://via.placeholder.com/300x200?text=Jiu+Jitsu' },
    { id: 'muay-thai', title: 'Muay Thai', image: 'https://via.placeholder.com/300x200?text=Muay+Thai' },
    { id: 'k1', title: 'K1', image: 'https://via.placeholder.com/300x200?text=K1' },
    { id: 'wrestling', title: 'Birkózás', image: 'https://via.placeholder.com/300x200?text=Birkózás' },
    { id: 'kickbox', title: 'Kickbox', image: 'https://via.placeholder.com/300x200?text=Kickbox' },
  ];

  // Kártyára kattintás eseménykezelő
  const handleCardClick = (id) => {
    navigate(`/sport/${id}`);
  };

  return (
    <div>
      <h1>Sportkártyák</h1>
      <main>
        {cards.map((card) => (
          <div
            key={card.id}
            className="card"
            onClick={() => handleCardClick(card.id)}
          >
            <img src={card.image} alt={card.title} className="card-image" />
            <h2>{card.title}</h2>
            <p>Kattints a részletekért!</p>
          </div>
        ))}
      </main>
    </div>
  );
};

export default SportKartyak;