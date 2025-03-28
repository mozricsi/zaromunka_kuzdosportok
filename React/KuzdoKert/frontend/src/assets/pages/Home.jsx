import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaFistRaised, FaUserPlus, FaCalendarAlt, FaUser, FaVideo, FaTrophy, FaQuoteLeft, FaStar } from 'react-icons/fa';
import Axios from 'axios';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useTheme } from './ThemeContext';
import "../Styles/hirek.css";

const SkeletonLoader = () => (
  <div className="skeleton-news-item">
    <div className="skeleton-image"></div>
    <div className="skeleton-title"></div>
    <div className="skeleton-text"></div>
  </div>
);

const HeroSection = ({ navigate }) => (
  <motion.header
    className="hero-section"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
  >
    <div className="hero-content">
      <h1>Küzdősportok Világa</h1>
      <p>Fedezd fel a különböző küzdősportokat, regisztrálj akár edzőként, és tartsd karban az edzésnaplódat!</p>
      <button onClick={() => navigate('/register')} className="cta-button">
        Csatlakozz most!
      </button>
    </div>
  </motion.header>
);

const FeaturedTrainings = ({ featuredTrainings, loading, navigate, isLoggedIn, searchTerm, setSearchTerm, handleSearch }) => (
  <section className="featured-trainings-section">
    <h2>Kiemelt Edzések</h2>
    <div className="search-section">
      <input
        type="text"
        placeholder="Keresés (pl. Box, Budapest)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <button onClick={handleSearch} className="search-button">Keresés</button>
    </div>
    {loading ? (
      <div className="trainings-grid">
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
      </div>
    ) : featuredTrainings.length === 0 ? (
      <p>Nincsenek elérhető edzések.</p>
    ) : (
      <div className="trainings-grid">
        {featuredTrainings.map((training, index) => (
          <div key={index} className="training-item">
            <h3>{training.klubbnev}</h3>
            <p>{training.pontoscim}</p>
            <p>{training.nap} - {training.ido}</p>
            <button
              onClick={() => !isLoggedIn ? navigate('/login') : navigate(`/edzes/${training.edzes_id}`)}
              className="join-button"
            >
              Csatlakozz
            </button>
          </div>
        ))}
      </div>
    )}
  </section>
);

const Home = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredTrainings, setFeaturedTrainings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const NEWS_API_KEY = '6ed9be5621794199b9b943fbb1a4febf';
  const TRANSLATE_API_KEY = 'YOUR_GOOGLE_TRANSLATE_KEY';
  const TOPIC = 'Boxing OR Kickboxing OR MMA';
  const isLoggedIn = false; // Feltételezem, hogy van egy autentikációs logika

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

  const fetchFeaturedTrainings = async (term = '') => {
    try {
      const response = await Axios.get(`http://localhost:5000/edzesek?search=${term}`);
      const trainings = response.data;
      setFeaturedTrainings(trainings.slice(0, 3));
    } catch (error) {
      console.error("Hiba a kiemelt edzések lekérésekor:", error);
    }
  };

  const handleSearch = () => {
    fetchFeaturedTrainings(searchTerm);
  };

  useEffect(() => {
    fetchNews();
    fetchFeaturedTrainings();
    const interval = setInterval(fetchNews, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const images = document.querySelectorAll('.lazy-load');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    });

    images.forEach((img) => observer.observe(img));
  }, []);

  const mainNews = news.slice(0, -2);
  const lastTwoNews = news.slice(-2);

  return (
    <div className={`App ${theme}`}>
      <Helmet>
        <title>Küzdősportok - Főoldal</title>
        <meta name="description" content="Csatlakozz a legjobb küzdősport edzésekhez Magyarországon!" />
      </Helmet>
      <button onClick={toggleTheme} className="theme-toggle">
        {theme === 'dark' ? 'Világos mód' : 'Sötét mód'}
      </button>

      <HeroSection navigate={navigate} />

      <section className="intro-section">
        <h2><FaFistRaised className="section-icon" /> Üdvözöllek a Küzdősportok Világában!</h2>
        <div className="intro-content">
          <p>
            Weboldalunkon különböző küzdősportokkal ismerkedhetsz meg, mint például a box, kickbox és MMA.
            Legyen szó kezdőkről vagy haladókról, nálunk mindenki megtalálja a számára megfelelő edzéseket és információkat.
          </p>
        </div>
      </section>

      <section className="coach-section">
        <h2><FaUserPlus className="section-icon" /> Edzőként regisztrálj!</h2>
        <p>
          Ha edző vagy, regisztrálj és töltsd fel a saját klubod adatait, valamint az edzéseid időpontjait és helyszíneit.
          Így a felhasználók könnyen megtalálhatják és csatlakozhatnak az edzéseidhez.
        </p>
      </section>

      <section className="training-log-section">
        <h2><FaCalendarAlt className="section-icon" /> Edzésnapló</h2>
        <p>
          A sima felhasználók számára elérhető az edzésnapló funkció, ahol a saját edzéseidet tudod vezetni.
          Kövesd nyomon a fejlődésedet, és maradj motivált!
        </p>
      </section>

      <section className="profile-section">
        <h2><FaUser className="section-icon" /> Profil</h2>
        <p>
          A profil oldalon módosíthatod a saját adataidat, és beállíthatod, hogy milyen típusú edzések érdekelnek téged.
          Így személyre szabott ajánlatokat kaphatsz.
        </p>
      </section>

      <section className="profile-section">
        <h2><FaCalendarAlt className="section-icon" /> Események</h2>
        <p>
          Az események oldalon naptárból nézheted meg a közelgő vagy elmúlt események adatait, szervezőit és nekik az elérhetőségeiket.
          Így könnyen és egyszerűen tudsz érdeklődni a közelgő versenyekről és történésekről.
        </p>
      </section>

      <section className="profile-section">
        <h2><FaVideo className="section-icon" /> Élő Stream</h2>
        <p>
          Az élő stream oldalon élőben tudsz edzők által közvetített videót nézni, így akár otthonról is a megfelelő körülmények között részt tudsz venni.
        </p>
      </section>

      <section className="profile-section">
        <h2><FaTrophy className="section-icon" /> Ranglista</h2>
        <p>
          A ranglistán láthatod a legaktívabb edzőket és résztvevőit.
          Nyomon követheted hogy ki mennyi edzést tart és ki és ki mennyi edzésre megy el.
        </p>
      </section>

      <FeaturedTrainings
        featuredTrainings={featuredTrainings}
        loading={loading}
        navigate={navigate}
        isLoggedIn={isLoggedIn}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
      />

      <section className="news-section">
        <h2>Legfrissebb hírek (Box, Kickbox, MMA)</h2>
        {loading ? (
          <div className="news-grid">
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
          </div>
        ) : news.length === 0 ? (
          <p>Nincsenek elérhető hírek a box, kickbox vagy MMA témában.</p>
        ) : (
          <>
            {mainNews.length > 0 && (
              <div className="news-grid">
                {mainNews.map((article, index) => (
                  <div key={index} className="news-item">
                    {article.urlToImage && (
                      <img
                        src="placeholder.jpg"
                        data-src={article.urlToImage}
                        alt={article.title}
                        className="lazy-load"
                      />
                    )}
                    <h3>{article.title}</h3>
                    <p>{article.description}</p>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">További információk</a>
                  </div>
                ))}
              </div>
            )}
            {lastTwoNews.length > 0 && (
              <div className="last-two-news">
                {lastTwoNews.map((article, index) => (
                  <div key={index} className="news-item last-news-item">
                    {article.urlToImage && (
                      <img
                        src="placeholder.jpg"
                        data-src={article.urlToImage}
                        alt={article.title}
                        className="lazy-load"
                      />
                    )}
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

      <section className="about-section">
        <h2>Rólunk</h2>
        <div className="about-content">
          <div className="about-text">
            <h3>A platform célja</h3>
            <p>
              A Küzdősportok Világa platform azért jött létre, hogy összekösse a küzdősportok szerelmeseit. Célunk egy olyan közösségi tér létrehozása, ahol a felhasználók edzéseket, eseményeket és ranglistákat követhetnek nyomon, valós idejű csevegést folytathatnak, valamint élő közvetítéseket nézhetnek. Legyen szó kezdőkről vagy profi sportolókról, nálunk mindenki megtalálja a helyét!
            </p>
            <h3>Csapatunk</h3>
            <p>
              A platformot egy elhivatatott csapat fejlesztette, akik maguk is szenvedélyes küzdősport-rajongók. A fejlesztést Rapcsák Marcell, Pekny Márk és Mózer Richárd vezette, akik a BGSzC Pestszentlőrinci Közgazdasági és Informatikai Szakgimnázium diákjaiként készítették el ezt a projektet záródolgozatként. A dizájnt és a közösségi funkciókat egy fiktív csapat támogatta:
            </p>
            <ul>
              <li><strong>Kovács Anna</strong> - UI/UX dizájner</li>
              <li><strong>Nagy Péter</strong> - Backend fejlesztő</li>
              <li><strong>Szabó Eszter</strong> - Marketing és közösségi média</li>
            </ul>
            <h3>Kapcsolat</h3>
            <p>
              Ha kérdésed van, vagy szeretnél csatlakozni hozzánk, lépj velünk kapcsolatba az alábbi email címen:
            </p>
            <div className="contact-links">
              <a href="mailto:info@kuzdosportok.hu">
                <FaEnvelope /> info@kuzdosportok.hu
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <h2>Mit mondanak rólunk?</h2>
        <div className="testimonials-grid">
          <div className="testimonial-item">
            <FaQuoteLeft className="quote-icon" />
            <p>"Ez a platform teljesen megváltoztatta az edzéseimhez való hozzáállásomat. Könnyen megtalálom a legjobb edzéseket!"</p>
            <div className="testimonial-author">
              <p><strong>Kiss Tamás</strong> - MMA rajongó</p>
              <div className="rating">
                <FaStar className="star-icon" />
                <FaStar className="star-icon" />
                <FaStar className="star-icon" />
                <FaStar className="star-icon" />
                <FaStar className="star-icon" />
              </div>
            </div>
          </div>
          <div className="testimonial-item">
            <FaQuoteLeft className="quote-icon" />
            <p>"Edzőként nagyon egyszerűen tudom kezelni az edzéseimet, és a közösség nagyon támogató!"</p>
            <div className="testimonial-author">
              <p><strong>Nagy Éva</strong> - Kickbox edző</p>
              <div className="rating">
                <FaStar className="star-icon" />
                <FaStar className="star-icon" />
                <FaStar className="star-icon" />
                <FaStar className="star-icon" />
                <FaStar className="star-icon" />
              </div>
            </div>
          </div>
        </div>
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