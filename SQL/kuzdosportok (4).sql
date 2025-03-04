-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Már 03. 14:58
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `kuzdosportok`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `adatmodositas`
--

CREATE TABLE `adatmodositas` (
  `modositas_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `adat_modositas_datum` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ertekelesek`
--

CREATE TABLE `ertekelesek` (
  `ertekeles_id` int(11) NOT NULL,
  `szoveges_ertekeles` varchar(255) NOT NULL,
  `csillagos_ertekeles` int(1) NOT NULL,
  `user_id` int(11) NOT NULL,
  `sportklub_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `esemenyek`
--

CREATE TABLE `esemenyek` (
  `esemeny_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `latogato_resztvevo` int(1) NOT NULL,
  `pontos_cim` varchar(255) NOT NULL,
  `ido` datetime NOT NULL,
  `sportneve` varchar(255) NOT NULL,
  `leiras` varchar(255) NOT NULL,
  `szervezo_neve` varchar(255) NOT NULL,
  `szervezo_tel` varchar(15) NOT NULL,
  `szervezo_email` varchar(255) NOT NULL,
  `esemeny_weboldal` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `jelentkezes`
--

CREATE TABLE `jelentkezes` (
  `jelentkezes_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `sportkulb_id` int(11) NOT NULL,
  `jelentkezes_ido` datetime NOT NULL,
  `elfogadasi_ido` datetime NOT NULL,
  `elfogadva` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `klubbok`
--

CREATE TABLE `klubbok` (
  `sprotklub_id` int(11) NOT NULL,
  `sport_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `vnev` varchar(255) NOT NULL,
  `knev` varchar(255) NOT NULL,
  `klubbnev` varchar(255) NOT NULL,
  `hely` varchar(255) NOT NULL,
  `idonap` varchar(255) NOT NULL,
  `ido` time NOT NULL,
  `szabalyok` text DEFAULT NULL,
  `leiras` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `klubbok`
--

INSERT INTO `klubbok` (`sprotklub_id`, `sport_id`, `user_id`, `vnev`, `knev`, `klubbnev`, `hely`, `idonap`, `ido`, `szabalyok`, `leiras`) VALUES
(0, 2, 7, 'bela', 'feri', 'bferi Klubja', 'Vecsés', 'Hétfő', '16:28:00', NULL, 'halado'),
(1, 1, 1, 'Kiss', 'Péter', 'Szolnoki Boxegyesület', 'Szolnok', 'Hétfő', '17:30:00', 'Nincs szabály', 'Barátságos közösség vagyunk.'),
(2, 1, 2, 'Nagy', 'Anna', 'Debreceni Boxegyesület', 'Debrecen', 'Szerda', '11:30:00', 'Nincs szabály', 'Barátságos közösség vagyunk.'),
(3, 2, 3, 'Tóth', 'Gábor', 'Szolnoki Judo egyesület', 'Szeged', 'Péntek', '20:00:00', 'Nincs szabály', 'Barátságos közösség vagyunk.');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `latogatobejelentkezesek`
--

CREATE TABLE `latogatobejelentkezesek` (
  `bejelentkezes_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `bejelentkezes_ido` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `latogatok`
--

CREATE TABLE `latogatok` (
  `user_id` int(11) NOT NULL,
  `vnev` varchar(255) NOT NULL,
  `knev` varchar(255) NOT NULL,
  `knev2` varchar(255) DEFAULT NULL,
  `telefonszam` int(100) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `szul_ido` date NOT NULL,
  `lakhelyvaros` varchar(255) NOT NULL,
  `regisztracio_datum` datetime NOT NULL,
  `felhasznalonev` varchar(255) NOT NULL,
  `jelszo` varchar(255) NOT NULL,
  `role` enum('visitor','coach') DEFAULT 'visitor'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `latogatok`
--

INSERT INTO `latogatok` (`user_id`, `vnev`, `knev`, `knev2`, `telefonszam`, `email`, `szul_ido`, `lakhelyvaros`, `regisztracio_datum`, `felhasznalonev`, `jelszo`, `role`) VALUES
(1, 'Kiss', 'Péter', NULL, 1, 'kiss.peter@example.com', '1990-05-12', 'Budapest', '2025-02-22 00:00:00', 'kpeter', '$2b$10$Ye0uo3ffgRUMuM1rX369V.6di9clKRXre7/vjxOz5u3QlYDUxWlIW', 'visitor'),
(2, 'Nagy', 'Anna', NULL, 2, 'nagy.anna@example.com', '1985-08-25', 'Debrecen', '2025-02-22 00:00:00', 'nanna', '$2b$10$F6z0jKRpuk5Iw9X/Hd5FRuG.ADcQmEEOd0Fsqci1jVXz2vZhUXzQi', 'visitor'),
(3, 'Tóth', 'Gábor', 'Ferenc', 3, 'toth.gabor@example.com', '1992-11-10', 'Szeged', '2025-02-22 00:00:00', 'tgabor', '$2b$10$NTAJ.Zz7abNQN44PPYo2yOLxmWP0BXy3n/KZa6b16KTgCbD7J7MfG', 'visitor'),
(4, 'Szabó', 'Mária', 'Anna', 4, 'szabo.maria@example.com', '1995-03-14', 'Pécs', '2025-02-22 00:00:00', 'smaria', '$2b$10$lU4EEgGIuS2QhocVvFBi4eekNPi.sDCCYKqWC1.z1LarzOC23A.HG', 'visitor'),
(5, 'Varga', 'Béla', NULL, 5, 'varga.bela@example.com', '1988-07-19', 'Győr', '2025-02-22 00:00:00', 'vbela', '$2b$10$S/oxPWR1GAefsAw1sksUtu9ghwQO.M1d9pOiQ3vX0Q5uQHSfbNqV2', 'visitor'),
(6, 'kovacs', 'jeno', NULL, NULL, 'kovacsjeno@gmail.com', '2025-03-19', 'Saab', '2025-03-03 12:58:26', 'kjeno', '$2b$10$E4uY7aLRJ4uCeMCXKvDOj.Z6MzmiHVAm4mZKRLqhMcNywp8ihg8ou', 'visitor'),
(7, 'bela', 'feri', NULL, NULL, 'belaferi@gmail.com', '2025-03-14', 'Budapest', '2025-03-03 14:09:27', 'bferi', '$2b$10$I/6jCKKXuCCqpoPBu7Qcy.fLhOjeaCYOpgTx267Eu3/Rzv7CyHTZu', 'coach'),
(8, 'kati', 'bela', NULL, NULL, 'katibela@gmail.com', '2025-03-27', 'Szeged', '2025-03-03 14:10:52', 'kbela', '$2b$10$fBN1L4viZ4imJqPtzm61vOSBHLbyeLwsJsjv45h0sda/u7QTr2PSy', 'visitor');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `sport`
--

CREATE TABLE `sport` (
  `sport_id` int(11) NOT NULL,
  `sportnev` varchar(45) DEFAULT NULL,
  `leiras` varchar(255) DEFAULT NULL,
  `szabalyok` varchar(555) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `sport`
--

INSERT INTO kuzdosportok.sport (sport_id, sportnev, leiras, szabalyok)
VALUES
(1, 'Box', 'A box egy öklözősport, ahol két versenyző próbálja meg legyőzni egymást ütésekkel. A mérkőzés egy ringben zajlik, és a cél az ellenfél kiütése vagy a pontozási győzelem elérése. Az alábbiakban bemutatjuk a legfontosabb szabályokat:', 
'<ul>
    <li>A mérkőzés általában 3-12 menetből áll, egy menet 3 perc.</li>
    <li>Csak az öklökkel szabad ütni, és csak a test előre meghatározott részeire (fej, törzs).</li>
    <li>Tilos az ököllel ütni az ellenfél hátulját vagy tarkóját.</li>
    <li>A mérkőzést egy játékvezető irányítja, aki figyeli a szabályok betartását.</li>
    <li>Ha egy versenyző kétszer is a földre kerül egy menetben, az automatikus kiütésnek minősül.</li>
</ul>'),
(2, 'Judo', 'A judo egy japán eredetű harcművészet és olimpiai sport, amelynek célja az ellenfél lerángatása vagy rögzítése a földön.
          Az alábbiakban bemutatjuk a legfontosabb szabályokat:', '<ul>
<li>A mérkőzés két részből áll: tachi-waza (álló technikák) és ne-waza (fekvő technikák).</li>
<li>A győzelem ipponnal érhető el, amely teljes pontot jelent.</li>
<li>Ha nincs ippon, a waza-ari (fél pont) dönt.</li>
<li>Tilos veszélyes technikákat alkalmazni, például a hátsó fejre esést okozó dobásokat.</li>
<li>A mérkőzést három bíró figyeli, akik döntenek a technikák érvényességéről.</li>
</ul>'),
(3, 'Jiu Jitsu', 'A brazil jiu-jitsu egy harcművészet és sport, amelynek célja az ellenfél elbénítása vagy feladásra kényszerítése
          technikák segítségével, például kulcsokkal és fojtásokkal. Az alábbiakban bemutatjuk a legfontosabb szabályokat:', '<ul>
<li>A mérkőzés általában 5-10 percig tart, attól függően, hogy melyik súlycsoportban versenyeznek.</li>
<li>A győzelem akkor érhető el, ha az ellenfél feladást jelez (tap), vagy ha egy hatékony technika pontot ér.</li>
<li>A pontozás a pozíciók dominanciáján alapul: pl. mount (4 pont), back control (4 pont).</li>
<li>Tilos veszélyes technikákat alkalmazni, amelyek sérülést okozhatnak, például tiltott kulcsok használata.</li>
<li>A mérkőzést bírók figyelik, akik döntenek a technikák érvényességéről és pontozásról.</li>
</ul>'),
(4, 'Muay Thai', 'A Muay Thai, más néven "Thaiföldi ökölvívás", egy harcművészet és sport, amelynek célja az ellenfél legyőzése
          ütésekkel, rúgásokkal, térdelésekkel és bokszolással. Az alábbiakban bemutatjuk a legfontosabb szabályokat:', '<ul>
<li>A mérkőzés általában 3-5 menetből áll, egy menet 3 percig tart.</li>
<li>Engedélyezett technikák: ütés, rúgás, térdelés, bokszolás.</li>
<li>Tilos a fej használata ütésként vagy az ellenfél hátának támadása.</li>
<li>A mérkőzést bírók figyelik, akik döntenek a szabályok betartásáról és a pontozásról.</li>
<li>A győzelem pontozással, kiütéssel vagy feladással érhető el.</li>
</ul>'),
(5, 'K1', 'A K-1 egy kickboxing stílusú harcművészet és sport, amely kombinálja a lábtechnikákat, ütéseket és térdeléseket.
          Az alábbiakban bemutatjuk a legfontosabb szabályokat:', '<ul>
<li>A mérkőzés általában 3 menetből áll, egy menet 3 percig tart.</li>
<li>Engedélyezett technikák: ütés, rúgás, térdelés, fej-, törzs- és lábszár célzása.</li>
<li>Tilos a bokszolás, fejhasználat vagy az ellenfél hátának támadása.</li>
<li>A mérkőzést bírók figyelik, akik döntenek a szabályok betartásáról és a pontozásról.</li>
<li>A győzelem pontozással, kiütéssel vagy feladással érhető el.</li>
</ul>'),
(6, 'Birkózás', 'A birkózás egy harcművészet és olimpiai sport, amelynek célja az ellenfél lerángatása vagy rögzítése a földön.
          Az alábbiakban bemutatjuk a legfontosabb szabályokat:', '<ul>
<li>A mérkőzés két részből áll: álló küzdés és földi küzdés.</li>
<li>A győzelem akkor érhető el, ha az ellenfelet három másodpercre rögzítik a földön.</li>
<li>Pontozás történik technikai pontokért, például dobásokért vagy irányításért.</li>
<li>Tilos veszélyes technikákat alkalmazni, amelyek sérülést okozhatnak.</li>
<li>A mérkőzést bírók figyelik, akik döntenek a technikák érvényességéről és pontozásról.</li>
</ul>'),
(7, 'Kickbox', 'A KickBox egy harcművészet és olimpiai sport, amely kombinálja a lábtechnikákat, ütéseket és térdeléseket.
          Az alábbiakban bemutatjuk a legfontosabb szabályokat:', '<ul>
<li>A mérkőzés általában 3 menetből áll, egy menet 2-3 percig tart.</li>
<li>Engedélyezett technikák: ütés, rúgás, térdelés, fej-, törzs- és lábszár célzása.</li>
<li>Tilos a bokszolás, fejhasználat vagy az ellenfél hátának támadása.</li>
<li>A mérkőzést bírók figyelik, akik döntenek a szabályok betartásáról és a pontozásról.</li>
<li>A győzelem pontozással, kiütéssel vagy feladással érhető el.</li>
</ul>'),
(8, 'MMA', 'Az MMA (Mixed Martial Arts) egy vegyes harcművészet, amely kombinálja a birkózást, boxot, jiu-jitsut és más stílusokat.
          Az alábbiakban bemutatjuk a legfontosabb szabályokat:', '<ul>
<li>A mérkőzés általában 3-5 menetből áll, egy menet 5 percig tart.</li>
<li>Engedélyezett technikák: ütések, rúgások, bokszolás, fojtások, kulcsok és dobások.</li>
<li>Tilos veszélyes technikák, például a hátsó fejre esést okozó dobások vagy tiltott területek támadása.</li>
<li>A mérkőzést bírók figyelik, akik döntenek a szabályok betartásáról és a pontozásról.</li>
<li>A győzelem kiütéssel, feladással, bírói döntéssel vagy diszkvalifikációval érhető el.</li>
</ul>');


--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `adatmodositas`
--
ALTER TABLE `adatmodositas`
  ADD PRIMARY KEY (`modositas_id`),
  ADD KEY `fr_user_id_idx` (`user_id`);

--
-- A tábla indexei `ertekelesek`
--
ALTER TABLE `ertekelesek`
  ADD PRIMARY KEY (`ertekeles_id`),
  ADD KEY `fruserid_idx` (`user_id`),
  ADD KEY `frsportklub_idx` (`sportklub_id`);

--
-- A tábla indexei `esemenyek`
--
ALTER TABLE `esemenyek`
  ADD PRIMARY KEY (`esemeny_id`),
  ADD KEY `fr_user_id_idx` (`user_id`);

--
-- A tábla indexei `jelentkezes`
--
ALTER TABLE `jelentkezes`
  ADD PRIMARY KEY (`jelentkezes_id`),
  ADD KEY `fk_user_id_idx` (`user_id`),
  ADD KEY `fk_sportklub_id_idx` (`sportkulb_id`);

--
-- A tábla indexei `klubbok`
--
ALTER TABLE `klubbok`
  ADD PRIMARY KEY (`sprotklub_id`),
  ADD KEY `fk_user_id_idx` (`user_id`),
  ADD KEY `sportid` (`sport_id`),
  ADD KEY `kb_vnev_idx` (`vnev`),
  ADD KEY `kb_knev_idx` (`knev`);

--
-- A tábla indexei `latogatobejelentkezesek`
--
ALTER TABLE `latogatobejelentkezesek`
  ADD PRIMARY KEY (`bejelentkezes_id`),
  ADD KEY `fk_latogatobejelentkezesek_latogatok` (`user_id`);

--
-- A tábla indexei `latogatok`
--
ALTER TABLE `latogatok`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `vnevidx` (`vnev`),
  ADD KEY `knevidx` (`knev`);

--
-- A tábla indexei `sport`
--
ALTER TABLE `sport`
  ADD PRIMARY KEY (`sport_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `latogatobejelentkezesek`
--
ALTER TABLE `latogatobejelentkezesek`
  MODIFY `bejelentkezes_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `latogatok`
--
ALTER TABLE `latogatok`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `adatmodositas`
--
ALTER TABLE `adatmodositas`
  ADD CONSTRAINT `fr_user_id` FOREIGN KEY (`user_id`) REFERENCES `latogatok` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Megkötések a táblához `ertekelesek`
--
ALTER TABLE `ertekelesek`
  ADD CONSTRAINT `frsportklub` FOREIGN KEY (`sportklub_id`) REFERENCES `klubbok` (`sprotklub_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fruserid` FOREIGN KEY (`user_id`) REFERENCES `latogatok` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Megkötések a táblához `esemenyek`
--
ALTER TABLE `esemenyek`
  ADD CONSTRAINT `fr2_user_id` FOREIGN KEY (`user_id`) REFERENCES `latogatok` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Megkötések a táblához `jelentkezes`
--
ALTER TABLE `jelentkezes`
  ADD CONSTRAINT `fk1_user_id` FOREIGN KEY (`user_id`) REFERENCES `latogatok` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_sportklub_id` FOREIGN KEY (`sportkulb_id`) REFERENCES `klubbok` (`sprotklub_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Megkötések a táblához `klubbok`
--
ALTER TABLE `klubbok`
  ADD CONSTRAINT `fk_sport_id` FOREIGN KEY (`sport_id`) REFERENCES `sport` (`sport_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `latogatok` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `kb_knev` FOREIGN KEY (`knev`) REFERENCES `latogatok` (`knev`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `kb_vnev` FOREIGN KEY (`vnev`) REFERENCES `latogatok` (`vnev`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Megkötések a táblához `latogatobejelentkezesek`
--
ALTER TABLE `latogatobejelentkezesek`
  ADD CONSTRAINT `fk_latogatobejelentkezesek_latogatok` FOREIGN KEY (`user_id`) REFERENCES `latogatok` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
