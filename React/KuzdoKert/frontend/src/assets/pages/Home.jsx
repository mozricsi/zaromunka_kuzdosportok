import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaFistRaised, FaUserPlus, FaCalendarAlt, FaUser, FaVideo, FaTrophy, FaQuoteLeft, FaStar, FaSearch } from 'react-icons/fa';
import Axios from 'axios';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import "../Styles/hirek.css";

const SkeletonLoader = () => (
  <div className="skeleton-news-item">
    <div className="skeleton-image"></div>
    <div className="skeleton-title"></div>
    <div className="skeleton-text"></div>
    <div className="skeleton-link"></div>
  </div>
);


const HeroSection = ({ navigate, loginStatus }) => (
  <motion.header
    className="hero-section"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
  >
    <div className="hero-content">
      <h1>Küzdősportok Világa</h1>
      <p>Fedezd fel a különböző küzdősportokat, regisztrálj akár edzőként, és tartsd karban az edzésnaplódat!</p>
      {!loginStatus && (
        <button onClick={() => navigate('/login')} className="cta-button">
          Bejelentkezés
        </button>
      )}
    </div>
  </motion.header>
);
const Home = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredTrainings, setFeaturedTrainings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loginStatus, setLoginStatus] = useState(false);
  const navigate = useNavigate();
  const NEWS_API_KEY = '6ed9be5621794199b9b943fbb1a4febf';
  const TRANSLATE_API_KEY = 'YOUR_GOOGLE_TRANSLATE_KEY';
  const TOPIC = 'Boxing OR Kickboxing OR MMA';


    useEffect(() => {
    const checkLoginStatus = () => {
      Axios.get("http://localhost:5000/login", { withCredentials: true })
        .then((response) => {
          if (response.data.loggedIn) {
            setLoginStatus(true);
          } else {
            setLoginStatus(false);
          }
        })
        .catch((error) => {
          console.error("Hiba történt a bejelentkezés ellenőrzésekor:", error);
        });
    };

    checkLoginStatus();
    const interval = setInterval(checkLoginStatus, 5000); // Minden 5 másodpercben újra ellenőrzi
    return () => clearInterval(interval);
  }, []);


  const fetchNews = async () => {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${TOPIC}&language=en&pageSize=20&apiKey=${NEWS_API_KEY}`
      );
      const data = await response.json();
      console.log("API válasz:", data); // Nézzük meg, mit kapunk az API-tól
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
        console.log("Szűrt hírek:", filteredNews);

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
        console.log("Fordított hírek:", translatedNews);
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

  const fetchFeaturedTrainings = async () => {
    try {
      const response = await Axios.get('http://localhost:5000/api/kiemelt-edzesek');
      setFeaturedTrainings(response.data);
    } catch (error) {
      console.error("Hiba a kiemelt edzések lekérésekor:", error);
    }
  };

  const handleSearch = () => {
    Axios.get(`http://localhost:5000/api/kereses?term=${searchTerm}`)
      .then((res) => setFeaturedTrainings(res.data))
      .catch((err) => console.error('Hiba a keresés során:', err));
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
  }, [news]);

  const mainNews = news.slice(0, -2);
  const lastTwoNews = news.slice(-2);

  return (
    <>
      <Helmet>
        <title>Küzdősportok - Főoldal</title>
        <meta name="description" content="Csatlakozz a legjobb küzdősport edzésekhez Magyarországon!" />
      </Helmet>
      <div className="App">
        <HeroSection navigate={navigate}  loginStatus={loginStatus} />

        

        <motion.section
          className="intro-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2><FaFistRaised className="section-icon" /> Üdvözöllek a Küzdősportok Világában!</h2>
          <div className="intro-content">
            <p>
              Weboldalunkon különböző küzdősportokkal ismerkedhetsz meg, mint például a box, kickbox és MMA.
              Legyen szó kezdőkről vagy haladókról, nálunk mindenki megtalálja a számára megfelelő edzéseket és információkat.
            </p>
          </div>
        </motion.section>

        <motion.section
          className="coach-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2><FaUserPlus className="section-icon" /> Edzőként regisztrálj!</h2>
          <p>
            Ha edző vagy, regisztrálj és töltsd fel a saját klubod adatait, valamint az edzéseid időpontjait és helyszíneit.
            Így a felhasználók könnyen megtalálhatják és csatlakozhatnak az edzéseidhez.
          </p>
        </motion.section>

        <motion.section
          className="training-log-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2><FaCalendarAlt className="section-icon" /> Edzésnapló</h2>
          <p>
            A sima felhasználók számára elérhető az edzésnapló funkció, ahol a saját edzéseidet tudod vezetni.
            Kövesd nyomon a fejlődésedet, és maradj motivált!
          </p>
        </motion.section>

        <motion.section
          className="profile-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2><FaUser className="section-icon" /> Profil</h2>
          <p>
            A profil oldalon módosíthatod a saját adataidat, és beállíthatod, hogy milyen típusú edzések érdekelnek téged.
            Így személyre szabott ajánlatokat kaphatsz.
          </p>
        </motion.section>

        <motion.section
          className="profile-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2><FaCalendarAlt className="section-icon" /> Események</h2>
          <p>
            Az események oldalon naptárból nézheted meg a közelgő vagy elmúlt események adatait, szervezőit és nekik az elérhetőségeiket.
            Így könnyen és egyszerűen tudsz érdeklődni a közelgő versenyekről és történésekről.
          </p>
        </motion.section>

        <motion.section
          className="profile-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <h2><FaVideo className="section-icon" /> Élő Stream</h2>
          <p>
            Az élő stream oldalon élőben tudsz edzők által közvetített videót nézni, így akár otthonról is a megfelelő körülmények között részt tudsz venni.
          </p>
        </motion.section>

        <motion.section
          className="profile-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <h2><FaTrophy className="section-icon" /> Ranglista</h2>
          <p>
            A ranglistán láthatod a legaktívabb edzőket és résztvevőit.
            Nyomon követheted hogy ki mennyi edzést tart és ki mennyi edzésre megy el.
          </p>
        </motion.section>

       

        <motion.section
          className="news-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
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
                      {article.urlToImage ? (
                        <img
                          src={article.urlToImage}
                          alt={article.title}
                          className="lazy-load"
                          data-src={article.urlToImage}
                          onError={(e) => (e.target.src = 'https://via.placeholder.com/300x200?text=Nincs+kép')}
                        />
                      ) : (
                        <img src="https://via.placeholder.com/300x200?text=Nincs+kép" alt="Nincs kép" />
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
                      {article.urlToImage ? (
                        <img
                          src={article.urlToImage}
                          alt={article.title}
                          className="lazy-load"
                          data-src={article.urlToImage}
                          onError={(e) => (e.target.src = 'https://via.placeholder.com/300x200?text=Nincs+kép')}
                        />
                      ) : (
                        <img src="https://via.placeholder.com/300x200?text=Nincs+kép" alt="Nincs kép" />
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
        </motion.section>

        <motion.section
          className="about-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
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
        </motion.section>

        <motion.section
          className="testimonials-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.0 }}
        >
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
        </motion.section>

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
    </>
  );
};

export default Home;