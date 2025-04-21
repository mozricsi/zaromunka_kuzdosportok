import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/WelcomeScreen.css';
import '../Styles/hirek.css';

function WelcomeScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="welcome-screen">
      <div className="welcome-background">
        <div className="background-overlay"></div>
        <div className="background-particles"></div>
      </div>
      <div className="welcome-content">
        <h1 className="welcome-title">Üdvözlünk a Kűzdősportok Világa oldalon!</h1>
        <p className="welcome-text">
          Itt minden a harcról és a kitartásról szól! Csatlakozz hozzánk, és légy részese a legkeményebb edzéseknek, 
          versenyeknek és közösségeknek, ahol a bajnokok születnek!
        </p>
      </div>
    </div>
  );
}

export default WelcomeScreen;