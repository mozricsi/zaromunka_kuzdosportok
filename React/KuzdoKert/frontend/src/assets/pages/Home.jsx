import { useState } from "react";
import { useEffect } from "react";
import "../Styles/hirek.css";


const Home = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const NEWS_API_KEY = '6ed9be5621794199b9b943fbb1a4febf'; // Helyettesítsd be a saját NewsAPI kulcsoddal
  const TRANSLATE_API_KEY = 'YOUR_GOOGLE_TRANSLATE_KEY'; // Helyettesítsd be a saját Google Translate API kulcsoddal
  const TOPIC = 'boxing OR MMA'; // Keresési feltétel: box vagy MMA hírek

  // Hírek lekérése a NewsAPI-ról
  const fetchNews = async () => {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${TOPIC}&language=en&pageSize=10&apiKey=${NEWS_API_KEY}`
      );
      const data = await response.json();
      if (data.articles) {
        // Csak az első 10 hírt fordítjuk le
        const newsToTranslate = data.articles.slice(0, 10);
        const translatedNews = await Promise.all(
          newsToTranslate.map(async (article) => {
            const translatedTitle = await translateText(article.title, TRANSLATE_API_KEY);
            const translatedDescription = await translateText(article.description, TRANSLATE_API_KEY);
            return {
              ...article,
              title: translatedTitle,
              description: translatedDescription,
            };
          })
        );
        setNews(translatedNews);
      }
      setLoading(false);
    } catch (error) {
      console.error("Hiba a hírek lekérésekor:", error);
      setLoading(false);
    }
  };

  // Szöveg fordítása magyarra a Google Translate API segítségével
  const translateText = async (text, apiKey) => {
    if (!text) return '';
    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            source: 'en',
            target: 'hu',
          }),
        }
      );
      const data = await response.json();
      return data.data.translations[0].translatedText;
    } catch (error) {
      console.error("Hiba a fordítás során:", error);
      return text; // Ha hiba történik, az eredeti szöveget adjuk vissza
    }
  };

  // Hírek lekérése az oldal betöltésekor és 5 percenként
  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 300000); // 5 percenként frissít
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <header>
        <h1>Küzdősportok Világa</h1>
        <p>Fedezd fel a különböző küzdősportokat, regisztrálj akár edzőként, és tartsd karban az edzésnaplódat!</p>
      </header>

      {/* Weboldal bemutatása */}
      <section className="intro-section">
        <h2>Üdvözöllek a Küzdősportok Világában!</h2>
        <div className="intro-content">
          <img
            src="https://cdn.qwenlm.ai/output/36a0457c-ad32-4b7e-85de-9a8ab7eee151/t2i/ecd1e84f-c5ec-45d6-a496-0c5b5173ea5e/8c054a9d-01d9-4a9e-a389-8f41c70f9c31.png"
            alt="Küzdősportok"
            className="intro-image"
          />
          <p>
            Weboldalunkon különböző küzdősportokkal ismerkedhetsz meg, mint például a box, MMA, judo, karate és még sok
            más. Legyen szó kezdőkről vagy haladókról, nálunk mindenki megtalálja a számára megfelelő edzéseket és
            információkat.
          </p>
        </div>
      </section>

      {/* Edzőként regisztráció */}
      <section className="coach-section">
        <h2>Edzőként regisztrálj!</h2>
        <p>
          Ha edző vagy, regisztrálj és töltsd fel a saját klubod adatait, valamint az edzéseid időpontjait és helyszíneit.
          Így a felhasználók könnyen megtalálhatják és csatlakozhatnak az edzéseidhez.
        </p>
      </section>

      {/* Edzésnapló */}
      <section className="training-log-section">
        <h2>Edzésnapló</h2>
        <p>
          A sima felhasználók számára elérhető az edzésnapló funkció, ahol a saját edzéseidet tudod vezetni. Kövesd
          nyomon a fejlődésedet, és maradj motivált!
        </p>
      </section>

      {/* Profil oldal */}
      <section className="profile-section">
        <h2>Profil</h2>
        <p>
          A profil oldalon módosíthatod a saját adataidat, és beállíthatod, hogy milyen típusú edzések érdekelnek téged.
          Így személyre szabott ajánlatokat kaphatsz.
        </p>
      </section>

      {/* Hírek */}
      <section className="news-section">
        <h2>Legfrissebb hírek</h2>
        {loading ? (
          <p>Hírek betöltése...</p>
        ) : (
          <div className="news-grid">
            {news.map((article, index) => (
              <div key={index} className="news-item">
                {article.urlToImage && (
                  <img src={article.urlToImage} alt={article.title} />
                )}
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  További információk
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lábléc */}
      <footer>
        <p>Kövess minket a közösségi médiában, és maradj naprakész a legújabb hírekkel!</p>
        <div className="social-icons">
          <a href="https://twitter.com/search?q=boxing%20OR%20MMA&src=typed_query" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/124/124021.png" alt="Twitter" />
          </a>
          <a href="https://www.instagram.com/explore/tags/boxing/" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" />
          </a>
          <a href="https://www.youtube.com/results?search_query=boxing+MMA" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/174/174883.png" alt="YouTube" />
          </a>
        </div>
      </footer>
    </div>
  );
 };
 
 export default Home;