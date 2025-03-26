import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/hirek.css";

const Home = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const NEWS_API_KEY = '6ed9be5621794199b9b943fbb1a4febf';
  const TRANSLATE_API_KEY = 'YOUR_GOOGLE_TRANSLATE_KEY';
  const TOPIC = 'Boxing OR Kickboxing OR MMA';

  const fetchNews = async () => {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${TOPIC}&language=en&pageSize=20&apiKey=${NEWS_API_KEY}`
      );
      const data = await response.json();
      if (data.articles) {
        const filteredNews = data.articles.filter(article => {
          const title = article.title ? article.title.toLowerCase() : '';
          const description = article.description ? article.description.toLowerCase() : '';
          return (
            (title.includes('boxing') || description.includes('boxing') ||
             title.includes('kickboxing') || description.includes('kickboxing') ||
             title.includes('mma') || description.includes('mma')) &&
            !title.includes('football') && !description.includes('football') &&
            !title.includes('soccer') && !description.includes('soccer') &&
            !title.includes('basketball') && !description.includes('basketball')
          );
        });

        const newsToTranslate = filteredNews.slice(0, 10);
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

  const translateText = async (text, apiKey) => {
    if (!text) return '';
    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
      return text;
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 300000);
    return () => clearInterval(interval);
  }, []);

  // Az utolsó két hírt különválasztjuk
  const mainNews = news.slice(0, -2); // Az első hírek (rácsos elrendezés)
  const lastTwoNews = news.slice(-2); // Az utolsó két hír (középre igazítva)

  return (
    <div className="App">
      <header>
        <h1>Küzdősportok Világa</h1>
        <p>Fedezd fel a különböző küzdősportokat, regisztrálj akár edzőként, és tartsd karban az edzésnaplódat!</p>
      </header>

      <section className="intro-section">
        <h2>Üdvözöllek a Küzdősportok Világában!</h2>
        <div className="intro-content">
          <p>
            Weboldalunkon különböző küzdősportokkal ismerkedhetsz meg, mint például a box, kickbox és MMA.
            Legyen szó kezdőkről vagy haladókról, nálunk mindenki megtalálja a számára megfelelő edzéseket és információkat.
          </p>
        </div>
      </section>

      <section className="coach-section">
        <h2>Edzőként regisztrálj!</h2>
        <p>
          Ha edző vagy, regisztrálj és töltsd fel a saját klubod adatait, valamint az edzéseid időpontjait és helyszíneit.
          Így a felhasználók könnyen megtalálhatják és csatlakozhatnak az edzéseidhez.
        </p>
      </section>

      <section className="training-log-section">
        <h2>Edzésnapló</h2>
        <p>
          A sima felhasználók számára elérhető az edzésnapló funkció, ahol a saját edzéseidet tudod vezetni.
          Kövesd nyomon a fejlődésedet, és maradj motivált!
        </p>
      </section>

      <section className="profile-section">
        <h2>Profil</h2>
        <p>
          A profil oldalon módosíthatod a saját adataidat, és beállíthatod, hogy milyen típusú edzések érdekelnek téged.
          Így személyre szabott ajánlatokat kaphatsz.
        </p>
      </section>
      

      <section className="news-section">
        <h2>Legfrissebb hírek (Box, Kickbox, MMA)</h2>
        {loading ? (
          <p>Hírek betöltése...</p>
        ) : news.length === 0 ? (
          <p>Nincsenek elérhető hírek a box, kickbox vagy MMA témában.</p>
        ) : (
          <>
            {/* Az első hírek rácsos elrendezésben */}
            {mainNews.length > 0 && (
              <div className="news-grid">
                {mainNews.map((article, index) => (
                  <div key={index} className="news-item">
                    {article.urlToImage && <img src={article.urlToImage} alt={article.title} />}
                    <h3>{article.title}</h3>
                    <p>{article.description}</p>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">További információk</a>
                  </div>
                ))}
              </div>
            )}

            {/* Az utolsó két hír középre igazítva */}
            {lastTwoNews.length > 0 && (
              <div className="last-two-news">
                {lastTwoNews.map((article, index) => (
                  <div key={index} className="news-item last-news-item">
                    {article.urlToImage && <img src={article.urlToImage} alt={article.title} />}
                    <h3>{article.title}</h3>
                    <p>{article.description}</p>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">További információk</a>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <footer>
        <p>Kövess minket a közösségi médiában, és maradj naprakész a legújabb hírekkel!</p>
        <div className="social-icons">
          <a href="https://twitter.com/search?q=boxing%20OR%20kickboxing%20OR%20MMA&src=typed_query" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/124/124021.png" alt="Twitter" />
          </a>
          <a href="https://www.instagram.com/explore/tags/boxing/" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" />
          </a>
          <a href="https://www.youtube.com/results?search_query=boxing+kickboxing+MMA" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/174/174883.png" alt="YouTube" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;