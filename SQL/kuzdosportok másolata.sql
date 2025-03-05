-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 2025. Mar 04 08:45
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Set character set and collation
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kuzdosportok`
--

-- --------------------------------------------------------

--
-- Table structure for table `adatmodositas`
--

CREATE TABLE `adatmodositas` (
  `modositas_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `adat_modositas_datum` DATETIME NOT NULL,
  PRIMARY KEY (`modositas_id`),
  KEY `fr_user_id_idx` (`user_id`),
  CONSTRAINT `fk_adatmodositas_user` FOREIGN KEY (`user_id`) REFERENCES `latogatok` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ertekelesek`
--

CREATE TABLE `ertekelesek` (
  `ertekeles_id` INT(11) NOT NULL AUTO_INCREMENT,
  `szoveges_ertekeles` VARCHAR(255) NOT NULL,
  `csillagos_ertekeles` INT(1) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `sportklub_id` INT(11) NOT NULL,
  PRIMARY KEY (`ertekeles_id`),
  KEY `fr_user_id_idx` (`user_id`),
  KEY `fr_sportklub_idx` (`sportklub_id`),
  CONSTRAINT `fk_ertekelesek_user` FOREIGN KEY (`user_id`) REFERENCES `latogatok` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ertekelesek_sportklub` FOREIGN KEY (`sportklub_id`) REFERENCES `klubbok` (`sportklub_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `esemenyek`
--

CREATE TABLE `esemenyek` (
  `esemeny_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `latogato_resztvevo` INT(1) NOT NULL,
  `pontos_cim` VARCHAR(255) NOT NULL,
  `ido` DATETIME NOT NULL,
  `sportneve` VARCHAR(255) NOT NULL,
  `leiras` VARCHAR(255) NOT NULL,
  `szervezo_neve` VARCHAR(255) NOT NULL,
  `szervezo_tel` VARCHAR(15) NOT NULL,
  `szervezo_email` VARCHAR(255) NOT NULL,
  `esemeny_weboldal` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`esemeny_id`),
  KEY `fr_user_id_idx` (`user_id`),
  CONSTRAINT `fk_esemenyek_user` FOREIGN KEY (`user_id`) REFERENCES `latogatok` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jelentkezes`
--

CREATE TABLE `jelentkezes` (
  `jelentkezes_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `sportklub_id` INT(11) NOT NULL,
  `jelentkezes_ido` DATETIME NOT NULL,
  `elfogadasi_ido` DATETIME NOT NULL,
  `elfogadva` INT(1) NOT NULL,
  PRIMARY KEY (`jelentkezes_id`),
  KEY `fk_user_id_idx` (`user_id`),
  KEY `fk_sportklub_id_idx` (`sportklub_id`),
  CONSTRAINT `fk_jelentkezes_user` FOREIGN KEY (`user_id`) REFERENCES `latogatok` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_jelentkezes_sportklub` FOREIGN KEY (`sportklub_id`) REFERENCES `klubbok` (`sportklub_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `klubbok`
--

CREATE TABLE `klubbok` (
  `sportklub_id` INT(11) NOT NULL AUTO_INCREMENT,
  `sport_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `vnev` VARCHAR(255) NOT NULL,
  `knev` VARCHAR(255) NOT NULL,
  `klubbnev` VARCHAR(255) NOT NULL,
  `hely` VARCHAR(255) NOT NULL,
  `idonap` VARCHAR(255) NOT NULL,
  `ido` TIME NOT NULL,
  `szabalyok` TEXT DEFAULT NULL,
  `leiras` TEXT DEFAULT NULL,
  PRIMARY KEY (`sportklub_id`),
  KEY `fk_user_id_idx` (`user_id`),
  KEY `sport_id_idx` (`sport_id`),
  KEY `kb_vnev_idx` (`vnev`),
  KEY `kb_knev_idx` (`knev`),
  CONSTRAINT `fk_klubbok_user` FOREIGN KEY (`user_id`) REFERENCES `latogatok` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_klubbok_sport` FOREIGN KEY (`sport_id`) REFERENCES `sport` (`sport_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `klubbok`
--

INSERT INTO `klubbok` (`sportklub_id`, `sport_id`, `user_id`, `vnev`, `knev`, `klubbnev`, `hely`, `idonap`, `ido`, `szabalyok`, `leiras`) VALUES
(1, 1, 1, 'Kiss', 'Péter', 'Szolnoki Boxegyesület', 'Szolnok', 'Hétfő', '17:30:00', 'Nincs szabály', 'Barátságos közösség vagyunk.'),
(2, 1, 2, 'Nagy', 'Anna', 'Debreceni Boxegyesület', 'Debrecen', 'Szerda', '11:30:00', 'Nincs szabály', 'Barátságos közösség vagyunk.'),
(3, 2, 3, 'Tóth', 'Gábor', 'Szolnoki Judo egyesület', 'Szeged', 'Péntek', '20:00:00', 'Nincs szabály', 'Barátságos közösség vagyunk.'),
(4, 2, 7, 'Bela', 'Feri', 'Bferi Klubja', 'Vecsés', 'Hétfő', '16:28:00', NULL, 'Haladó'),
(8, 8, 7, 'Bela', 'Feri', 'Bferi Klubja', 'Asaa', 'Kedd', '08:46:00', NULL, 'Nincs leírás megadva');

-- --------------------------------------------------------

--
-- Table structure for table `latogatobejelentkezesek`
--

CREATE TABLE `latogatobejelentkezesek` (
  `bejelentkezes_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `bejelentkezes_ido` DATETIME NOT NULL,
  PRIMARY KEY (`bejelentkezes_id`),
  KEY `fk_latogatobejelentkezesek_latogatok` (`user_id`),
  CONSTRAINT `fk_latogatobejelentkezesek_user` FOREIGN KEY (`user_id`) REFERENCES `latogatok` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `latogatobejelentkezesek`
--

INSERT INTO `latogatobejelentkezesek` (`bejelentkezes_id`, `user_id`, `bejelentkezes_ido`) VALUES
(1, 4, '2025-03-04 08:44:44');

-- --------------------------------------------------------

--
-- Table structure for table `latogatok`
--

CREATE TABLE `latogatok` (
  `user_id` INT(11) NOT NULL AUTO_INCREMENT,
  `vnev` VARCHAR(255) NOT NULL,
  `knev` VARCHAR(255) NOT NULL,
  `knev2` VARCHAR(255) DEFAULT NULL,
  `telefonszam` VARCHAR(20) DEFAULT NULL, -- Changed to VARCHAR for phone numbers
  `email` VARCHAR(255) NOT NULL,
  `szul_ido` DATE NOT NULL,
  `lakhelyvaros` VARCHAR(255) NOT NULL,
  `regisztracio_datum` DATETIME NOT NULL,
  `felhasznalonev` VARCHAR(255) NOT NULL,
  `jelszo` VARCHAR(255) NOT NULL,
  `role` ENUM('visitor', 'coach') DEFAULT 'visitor',
  PRIMARY KEY (`user_id`),
  KEY `vnev_idx` (`vnev`),
  KEY `knev_idx` (`knev`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `latogatok`
--

INSERT INTO `latogatok` (`user_id`, `vnev`, `knev`, `knev2`, `telefonszam`, `email`, `szul_ido`, `lakhelyvaros`, `regisztracio_datum`, `felhasznalonev`, `jelszo`, `role`) VALUES
(1, 'Kiss', 'Péter', NULL, '1', 'kiss.peter@example.com', '1990-05-12', 'Budapest', '2025-02-22 00:00:00', 'kpeter', '$2b$10$Ye0uo3ffgRUMuM1rX369V.6di9clKRXre7/vjxOz5u3QlYDUxWlIW', 'visitor'),
(2, 'Nagy', 'Anna', NULL, '2', 'nagy.anna@example.com', '1985-08-25', 'Debrecen', '2025-02-22 00:00:00', 'nanna', '$2b$10$F6z0jKRpuk5Iw9X/Hd5FRuG.ADcQmEEOd0Fsqci1jVXz2vZhUXzQi', 'visitor'),
(3, 'Tóth', 'Gábor', 'Ferenc', '3', 'toth.gabor@example.com', '1992-11-10', 'Szeged', '2025-02-22 00:00:00', 'tgabor', '$2b$10$NTAJ.Zz7abNQN44PPYo2yOLxmWP0BXy3n/KZa6b16KTgCbD7J7MfG', 'visitor'),
(4, 'Szabó', 'Mária', 'Anna', '4', 'szabo.maria@example.com', '1995-03-14', 'Pécs', '2025-02-22 00:00:00', 'smaria', '$2b$10$lU4EEgGIuS2QhocVvFBi4eekNPi.sDCCYKqWC1.z1LarzOC23A.HG', 'visitor'),
(5, 'Varga', 'Béla', NULL, '5', 'varga.bela@example.com', '1988-07-19', 'Győr', '2025-02-22 00:00:00', 'vbela', '$2b$10$S/oxPWR1GAefsAw1sksUtu9ghwQO.M1d9pOiQ3vX0Q5uQHSfbNqV2', 'visitor'),
(6, 'Kovacs', 'Jeno', NULL, NULL, 'kovacsjeno@gmail.com', '2025-03-19', 'Saab', '2025-03-03 12:58:26', 'kjeno', '$2b$10$E4uY7aLRJ4uCeMCXKvDOj.Z6MzmiHVAm4mZKRLqhMcNywp8ihg8ou', 'visitor'),
(7, 'Bela', 'Feri', NULL, NULL, 'belaferi@gmail.com', '2025-03-14', 'Budapest', '2025-03-03 14:09:27', 'bferi', '$2b$10$I/6jCKKXuCCqpoPBu7Qcy.fLhOjeaCYOpgTx267Eu3/Rzv7CyHTZu', 'coach'),
(8, 'Kati', 'Bela', NULL, NULL, 'katibela@gmail.com', '2025-03-27', 'Szeged', '2025-03-03 14:10:52', 'kbela', '$2b$10$fBN1L4viZ4imJqPtzm61vOSBHLbyeLwsJsjv45h0sda/u7QTr2PSy', 'visitor');

-- --------------------------------------------------------

--
-- Table structure for table `sport`
--

CREATE TABLE `sport` (
  `sport_id` INT(11) NOT NULL AUTO_INCREMENT,
  `sportnev` VARCHAR(45) DEFAULT NULL,
  `leiras` VARCHAR(255) DEFAULT NULL,
  `szabalyok` VARCHAR(555) DEFAULT NULL,
  PRIMARY KEY (`sport_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sport`
--

INSERT INTO `sport` (`sport_id`, `sportnev`, `leiras`, `szabalyok`) VALUES
(1, 'Box', 'A box egy öklözősport, ahol két versenyző próbálja meg legyőzni egymást ütésekkel. A mérkőzés egy ringben zajlik, és a cél az ellenfél kiütése vagy a pontozási győzelem elérése. Az alábbiakban bemutatjuk a legfontosabb szabályokat:', '<ul>\r\n    <li>A mérkőzés általában 3-12 menetből áll, egy menet 3 perc.</li>\r\n    <li>Csak az öklökkel szabad ütni, és csak a test előre meghatározott részeire (fej, törzs).</li>\r\n    <li>Tilos az ököllel ütni az ellenfél hátulját vagy tarkóját.</li>\r\n    <li>A mérkőzést egy játékvezető irányítja, aki figyeli a szabályok betartását.</li>\r\n    <li>Ha egy versenyző kétszer is a földre kerül egy menetben, az automatikus kiütésnek minősül.</li>\r\n</ul>'),
(2, 'Judo', 'A judo egy japán eredetű harcművészet és olimpiai sport, amelynek célja az ellenfél lerángatása vagy rögzítése a földön.\r\n          Az alábbiakban bemutatjuk a legfontosabb szabályokat:', '<ul>\r\n<li>A mérkőzés két részből áll: tachi-waza (álló technikák) és ne-waza (fekvő technikák).</li>\r\n<li>A győzelem ipponnal érhető el, amely teljes pontot jelent.</li>\r\n<li>Ha nincs ippon, a waza-ari (fél pont) dönt.</li>\r\n<li>Tilos veszélyes technikákat alkalmazni, például a hátsó fejre esést okozó dobásokat.</li>\r\n<li>A mérkőzést három bíró figyeli, akik döntenek a technikák érvényességéről.</li>\r\n</ul>'),
(3, 'Jiu Jitsu', 'A brazil jiu-jitsu egy harcművészet és sport, amelynek célja az ellenfél elbénítása vagy feladásra kényszerítése\r\n          technikák segítségével, például kulcsokkal és fojtásokkal. Az alábbiakban bemutatjuk a legfontosabb szabályokat:', '<ul>\r\n<li>A mérkőzés általában 5-10 percig tart, attól függően, hogy melyik súlycsoportban versenyeznek.</li>\r\n<li>A győzelem akkor érhető el, ha az ellenfél feladást jelez (tap), vagy ha egy hatékony technika pontot ér.</li>\r\n<li>A pontozás a pozíciók dominanciáján alapul: pl. mount (4 pont), back control (4 pont).</li>\r\n<li>Tilos veszélyes technikákat alkalmazni, amelyek sérülést okozhatnak, például tiltott kulcsok használata.</li>\r\n<li>A mérkőzést bírók figyelik, akik döntenek a technikák érvényességéről és pontozásról.</li>\r\n</ul>'),
(4, 'Muay Thai', 'A Muay Thai, más néven \"Thaiföldi ökölvívás\", egy harcművészet és sport, amelynek célja az ellenfél legyőzése\r\n          ütésekkel, rúgásokkal, térdelésekkel és bokszolással. Az alábbiakban bemutatjuk a legfontosabb szabályokat:', '<ul>\r\n<li>A mérkőzés általában 3-5 menetből áll, egy menet 3 percig tart.</li>\r\n<li>Engedélyezett technikák: ütés, rúgás, térdelés, bokszolás.</li>\r\n<li>Tilos a fej használata ütésként vagy az ellenfél hátának támadása.</li>\r\n<li>A mérkőzést bírók figyelik, akik döntenek a szabályok betartásáról és a pontozásról.</li>\r\n<li>A győzelem pontozással, kiütéssel vagy feladással érhető el.</li>\r\n</ul>'),
(5, 'K1', 'A K-1 egy kickboxing stílusú harcművészet és sport, amely kombinálja a lábtechnikákat, ütéseket és térdeléseket.\r\n          Az alábbiakban bemutatjuk a legfontosabb szabályokat:', '<ul>\r\n<li>A mérkőzés általában 3 menetből áll, egy menet 3 percig tart.</li>\r\n<li>Engedélyezett technikák: ütés, rúgás, térdelés, fej-, törzs- és lábszár célzása.</li>\r\n<li>Tilos a bokszolás, fejhasználat vagy az ellenfél hátának támadása.</li>\r\n<li>A mérkőzést bírók figyelik, akik döntenek a szabályok betartásáról és a pontozásról.</li>\r\n<li>A győzelem pontozással, kiütéssel vagy feladással érhető el.</li>\r\n</ul>'),
(6, 'Birkózás', 'A birkózás egy harcművészet és olimpiai sport, amelynek célja az ellenfél lerángatása vagy rögzítése a földön.\r\n          Az alábbiakban bemutatjuk a legfontosabb szabályokat:', '<ul>\r\n<li>A mérkőzés két részből áll: álló küzdés és földi küzdés.</li>\r\n<li>A győzelem akkor érhető el, ha az ellenfelet három másodpercre rögzítik a földön.</li>\r\n<li>Pontozás történik technikai pontokért, például dobásokért vagy irányításért.</li>\r\n<li>Tilos veszélyes technikákat alkalmazni, amelyek sérülést okozhatnak.</li>\r\n<li>A mérkőzést bírók figyelik, akik döntenek a technikák érvényességéről és pontozásról.</li>\r\n</ul>'),
(7, 'Kickbox', 'A KickBox egy harcművészet és olimpiai sport, amely kombinálja a lábtechnikákat, ütéseket és térdeléseket.\r\n          Az alábbiakban bemutatjuk a legfontosabb szabályokat:', '<ul>\r\n<li>A mérkőzés általában 3 menetből áll, egy menet 2-3 percig tart.</li>\r\n<li>Engedélyezett technikák: ütés, rúgás, térdelés, fej-, törzs- és lábszár célzása.</li>\r\n<li>Tilos a bokszolás, fejhasználat vagy az ellenfél hátának támadása.</li>\r\n<li>A mérkőzést bírók figyelik, akik döntenek a szabályok betartásáról és a pontozásról.</li>\r\n<li>A győzelem pontozással, kiütéssel vagy feladással érhető el.</li>\r\n</ul>'),
(8, 'MMA', 'Az MMA (Mixed Martial Arts) egy vegyes harcművészet, amely kombinálja a birkózást, boxot, jiu-jitsut és más stílusokat.\r\n          Az alábbiakban bemutatjuk a legfontosabb szabályokat:', '<ul>\r\n<li>A mérkőzés általában 3-5 menetből áll, egy menet 5 percig tart.</li>\r\n<li>Engedélyezett technikák: ütések, rúgások, bokszolás, fojtások, kulcsok és dobások.</li>\r\n<li>Tilos veszélyes technikák, például a hátsó fejre esést okozó dobások vagy tiltott területek támadása.</li>\r\n<li>A mérkőzést bírók figyelik, akik döntenek a szabályok betartásáról és a pontozásról.</li>\r\n<li>A győzelem kiütéssel, feladással, bírói döntéssel vagy diszkvalifikációval érhető el.</li>\r\n</ul>');

--
-- Indexes for dumped tables
--

--
-- AUTO_INCREMENT for table `klubbok`
--
ALTER TABLE `klubbok`
  MODIFY `sportklub_id` INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;