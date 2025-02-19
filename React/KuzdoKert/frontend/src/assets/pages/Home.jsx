import { useState } from "react";
import { useEffect } from "react";
import "../Styles/hirek.css";


const Home = () => {
   const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_KEY = '6ed9be5621794199b9b943fbb1a4febf'; // Helyettesítsd be a saját API kulcsoddal
  const TOPIC = 'boxing OR MMA'; // Keresési feltétel: box vagy MMA hírek

  // Hírek lekérése a NewsAPI-ról
  const fetchNews = async () => {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${TOPIC}&apiKey=${API_KEY}`
      );
      const data = await response.json();
      if (data.articles) {
        setNews(data.articles);
      }
      setLoading(false);
    } catch (error) {
      console.error("Hiba a hírek lekérésekor:", error);
      setLoading(false);
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
        <h1>Box és MMA hírek</h1>
        <p>Friss hírek a box és MMA világából</p>
      </header>

      <section>
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

      <footer>
        <p>Kövess minket a közösségi médiában, és maradj naprakész a legújabb hírekkel!</p>
      </footer>
    </div>
  );
 };
 
 export default Home;