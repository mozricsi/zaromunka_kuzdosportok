import { useState, } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Terms.css"; 

const Terms = () => {
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();

  const handleAccept = () => {
    if (accepted) {
      // Itt lehetne backend hívás, hogy az elfogadást mentse
      alert("Az ÁSZF elfogadva!");
      navigate("/"); // Visszatér a főoldalra
    } else {
      alert("Kérjük, jelöld be az elfogadási checkboxot!");
    }
  };

  return (
    <div className="terms-page">
      <h1>Általános Szerződési Feltételek</h1>
      <div className="terms-content">
        <h3>1. Bevezetés</h3>
        <p>
          Üdvözöljük a Küzdősportok Világa weboldalon! Az oldal használatával elfogadja az alábbi feltételeket. Kérjük, olvassa el figyelmesen.
        </p>

        <h3>2. Szolgáltatások</h3>
        <p>
          A weboldal lehetőséget biztosít edzések keresésére, jelentkezésre, edzésnapló vezetésére és hírek olvasására. A szolgáltatások ingyenesek, de regisztrációhoz kötöttek.
        </p>

        <h3>3. Felhasználói felelősség</h3>
        <p>
          A felhasználók kötelesek valós adatokat megadni regisztrációkor. Az edzésekre való jelentkezés kötelezettségekkel nem jár, de az edzők feltételeit be kell tartani.
        </p>

        <h3>4. Adatvédelem</h3>
        <p>
          Az Ön adatait bizalmasan kezeljük, és kizárólag a szolgáltatás nyújtásához használjuk fel. További részletek az Adatvédelmi Nyilatkozatban.
        </p>

        <h3>5. Felelősség kizárása</h3>
        <p>
          A weboldal nem vállal felelősséget az edzések tartalmáért vagy az edzők által nyújtott szolgáltatásokért. A hírek külső forrásból származnak.
        </p>

        <h3>6. Módosítások</h3>
        <p>
          Fenntartjuk a jogot, hogy az ÁSZF-et bármikor módosítsuk. A változásokról a weboldalon értesítjük a felhasználókat.
        </p>
      </div>

      <div className="accept-section">
        <label>
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />
          Elfogadom az Általános Szerződési Feltételeket
        </label>
        <button onClick={handleAccept} className="accept-btn">
          Elfogadás
        </button>
      </div>
    </div>
  );
};

export default Terms;