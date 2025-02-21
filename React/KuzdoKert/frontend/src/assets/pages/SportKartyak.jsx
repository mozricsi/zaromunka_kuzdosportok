import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/kartyak.css';



const SportKartyak = () => {
  const navigate = useNavigate();

  // Kártyák adatai
  const cards = [
    { id: 'SportLeiras', title: 'Box', image: 'https://images.daznservices.com/di/library/DAZN_News/ee/26/artur-beterbiev-vs-dmitry-bivol_cus9dhbfyeoo17j3n1y5i0kuq.jpg?t=534847237' },
    { id: 'judo', title: 'Judo', image: 'https://78884ca60822a34fb0e6-082b8fd5551e97bc65e327988b444396.ssl.cf3.rackcdn.com/up/2019/12/1Iliadis9227-1577780463-1577780464.jpg' },
    { id: 'jiu-jitsu', title: 'Jiu Jitsu', image: 'https://cdn-images-1.medium.com/max/1600/1*96FA5T__PjyxjQqPdKrlCQ.jpeg' },
    { id: 'muay-thai', title: 'Muay Thai', image: 'https://th.bing.com/th/id/R.54c76e6bb6cc1526ac80b9404eb31140?rik=BkmkizItcCQANQ&pid=ImgRaw&r=0' },
    { id: 'k1', title: 'K1', image: 'https://eaglekickboxing.co.uk/wp-content/uploads/2020/05/Mtgp.jpg-400-of-644-scaled-e1592092266858.jpg' },
    { id: 'wrestling', title: 'Birkózás', image: 'https://cdn.vox-cdn.com/thumbor/rsC7jguUw-X5dDcimccgFpmZ7y0=/0x248:4000x2498/1600x900/cdn.vox-cdn.com/photo_images/8424126/150155058.jpg' },
    { id: 'kickbox', title: 'Kickbox', image: 'https://staticg.sportskeeda.com/editor/2022/02/6dd45-16443294303689-1920.jpg' },
    { id: 'mma', title: 'MMA', image: 'https://th.bing.com/th/id/OIP.Y2Qv1XgDg0JF-FSqgd5skAHaFj?rs=1&pid=ImgDetMain' },

  ];

  // Kártyára kattintás eseménykezelő
  const handleCardClick = (id) => {
    navigate(`/${id}`);
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