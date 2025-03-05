const axios = require('axios');
const cheerio = require('cheerio');
const mysql = require('mysql2/promise');

// Adatbázis kapcsolat
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  port: "3307",
  database: "kuzdosportok",
});

// Sportágak és URL-ek megfeleltetése (példa, pontos URL-eket kell megadni)
const sportSites = {
  1: { name: 'Box', url: 'https://www.boxing.hu/esemenynaptar' }, // Magyar Ökölvívó Szakszövetség
  2: { name: 'Judo', url: 'https://judo.hu/versenynaptar' }, // Magyar Judo Szövetség
  6: { name: 'Birkózás', url: 'https://www.birkózás.hu/esemenyek' }, // Magyar Birkózó Szövetség
  7: { name: 'Kickbox', url: 'https://kick-box.hu/versenynaptar' }, // Magyar Kick-box Szövetség
  8: { name: 'MMA', url: 'https://tapology.com/regions/hungary' }, // Tapology (nemzetközi, magyar szűrővel)
  // További sportágak (Jiu-Jitsu, Muay Thai, K1) URL-jei hiányoznak, pontosítani kell!
};

// Események kinyerése egy oldalról
async function scrapeEventsFromSite(sportId, url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const events = [];

    // Példa: Judo.hu eseménynaptár scraping (HTML struktúrát az oldalhoz kell igazítani)
    $('.event-item').each((i, elem) => { // Az osztályneveket az adott oldalhoz kell igazítani
      const title = $(elem).find('.event-title').text().trim() || 'Nincs cím';
      const dateRaw = $(elem).find('.event-date').text().trim();
      const location = $(elem).find('.event-location').text().trim() || 'Nincs helyszín';
      
      // Dátum formázása (pl. "2025. május 15" -> "2025-05-15 00:00:00")
      const dateMatch = dateRaw.match(/(\d{4})\.\s*([a-záéíóúőű]+\s*\d{1,2})/i);
      let formattedDate = dateRaw;
      if (dateMatch) {
        const year = dateMatch[1];
        const monthDay = dateMatch[2];
        const months = {
          'január': '01', 'február': '02', 'március': '03', 'április': '04', 'május': '05', 'június': '06',
          'július': '07', 'augusztus': '08', 'szeptember': '09', 'október': '10', 'november': '11', 'december': '12'
        };
        const [monthName, day] = monthDay.split(/\s+/);
        const month = months[monthName.toLowerCase()] || '01';
        formattedDate = `${year}-${month}-${day.padStart(2, '0')} 00:00:00`;
      }

      events.push({
        sport_id: sportId,
        verseny_neve: title,
        pontos_cim: location,
        ido: formattedDate,
        leiras: `${sportSites[sportId].name} verseny Magyarországon`,
        szervezo_neve: sportSites[sportId].name + ' Szövetség',
        szervezo_tel: '+3612345678', // Statikus, pontosítani kell
        szervezo_email: 'info@' + url.split('/')[2], // Pl. info@judo.hu
        esemeny_weboldal: url
      });
    });

    return events;
  } catch (error) {
    console.error(`Hiba a(z) ${url} scrapelésekor:`, error.message);
    return [];
  }
}

// Események feltöltése az adatbázisba
async function saveEventsToDatabase(events) {
  for (const event of events) {
    try {
      await db.query(
        `INSERT INTO esemenyek (user_id, latogato_resztvevo, pontos_cim, ido, sport_id, verseny_neve, leiras, szervezo_neve, szervezo_tel, szervezo_email, esemeny_weboldal)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
           pontos_cim = VALUES(pontos_cim), 
           ido = VALUES(ido), 
           leiras = VALUES(leiras), 
           szervezo_neve = VALUES(szervezo_neve), 
           szervezo_tel = VALUES(szervezo_tel), 
           szervezo_email = VALUES(szervezo_email), 
           esemeny_weboldal = VALUES(esemeny_weboldal)`,
        [1, 0, event.pontos_cim, event.ido, event.sport_id, event.verseny_neve, event.leiras, event.szervezo_neve, event.szervezo_tel, event.szervezo_email, event.esemeny_weboldal]
      );
      console.log(`Esemény feltöltve: ${event.verseny_neve}`);
    } catch (error) {
      console.error(`Hiba az esemény feltöltésekor (${event.verseny_neve}):`, error.message);
    }
  }
}

// Fő scraping folyamat
async function scrapeAllEvents() {
  for (const [sportId, site] of Object.entries(sportSites)) {
    console.log(`Scraping: ${site.name} (${site.url})`);
    const events = await scrapeEventsFromSite(sportId, site.url);
    await saveEventsToDatabase(events);
  }
  console.log('Scraping befejezve!');
  await db.end();
}

// Futtatás
scrapeAllEvents();