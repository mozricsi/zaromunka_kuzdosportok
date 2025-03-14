-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: kuzdosportok
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `adatmodositas`
--

DROP TABLE IF EXISTS `adatmodositas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adatmodositas` (
  `modositas_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `adat_modositas_datum` datetime NOT NULL,
  PRIMARY KEY (`modositas_id`),
  KEY `fr user_id_idx` (`user_id`),
  CONSTRAINT `fr user_id` FOREIGN KEY (`user_id`) REFERENCES `latogatok` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adatmodositas`
--

LOCK TABLES `adatmodositas` WRITE;
/*!40000 ALTER TABLE `adatmodositas` DISABLE KEYS */;
/*!40000 ALTER TABLE `adatmodositas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ertekelesek`
--

DROP TABLE IF EXISTS `ertekelesek`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ertekelesek` (
  `ertekeles_id` int(11) NOT NULL AUTO_INCREMENT,
  `szoveges_ertekeles` varchar(255) NOT NULL,
  `csillagos_ertekeles` int(1) NOT NULL,
  `user_id` int(11) NOT NULL,
  `sportklub_id` int(11) NOT NULL,
  PRIMARY KEY (`ertekeles_id`),
  KEY `fruserid_idx` (`user_id`),
  KEY `frsportklub_idx` (`sportklub_id`),
  CONSTRAINT `frsportklub` FOREIGN KEY (`sportklub_id`) REFERENCES `klubbok` (`sprotklub_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fruserid` FOREIGN KEY (`user_id`) REFERENCES `latogatok` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ertekelesek`
--

LOCK TABLES `ertekelesek` WRITE;
/*!40000 ALTER TABLE `ertekelesek` DISABLE KEYS */;
/*!40000 ALTER TABLE `ertekelesek` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `esemenyek`
--

DROP TABLE IF EXISTS `esemenyek`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `esemenyek` (
  `esemeny_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `latogato_resztvevo` int(1) NOT NULL,
  `pontos_cim` varchar(255) NOT NULL,
  `ido` datetime NOT NULL,
  `sportneve` varchar(255) NOT NULL,
  `leiras` varchar(255) NOT NULL,
  `szervezo_neve` varchar(255) NOT NULL,
  `szervezo_tel` varchar(15) NOT NULL,
  `szervezo_email` varchar(255) NOT NULL,
  `esemeny_weboldal` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`esemeny_id`),
  KEY `fr user_id_idx` (`user_id`),
  CONSTRAINT `fr2_user_id` FOREIGN KEY (`user_id`) REFERENCES `latogatok` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `esemenyek`
--

LOCK TABLES `esemenyek` WRITE;
/*!40000 ALTER TABLE `esemenyek` DISABLE KEYS */;
/*!40000 ALTER TABLE `esemenyek` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jelentkezes`
--

DROP TABLE IF EXISTS `jelentkezes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jelentkezes` (
  `jelentkezes_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `sportklub_id` int(11) NOT NULL,
  `jelentkezes_ido` datetime NOT NULL,
  `elfogadasi_ido` datetime NOT NULL,
  `elfogadva` int(1) NOT NULL,
  PRIMARY KEY (`jelentkezes_id`),
  KEY `fk_user_id_idx` (`user_id`),
  KEY `fk_sportklub_id_idx` (`sportklub_id`),
  CONSTRAINT `fk1_user_id` FOREIGN KEY (`user_id`) REFERENCES `latogatok` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_sportklub_id` FOREIGN KEY (`sportklub_id`) REFERENCES `klubbok` (`sprotklub_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jelentkezes`
--

LOCK TABLES `jelentkezes` WRITE;
/*!40000 ALTER TABLE `jelentkezes` DISABLE KEYS */;
INSERT INTO `jelentkezes` VALUES (1,4,1,'2025-03-13 10:00:00','2025-03-13 12:00:00',1),(2,5,2,'2025-03-13 11:00:00','2025-03-13 13:00:00',1),(3,6,3,'2025-03-13 09:00:00','2025-03-13 11:00:00',0);
/*!40000 ALTER TABLE `jelentkezes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `klub_edzesek`
--

DROP TABLE IF EXISTS `klub_edzesek`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `klub_edzesek` (
  `edzes_id` int(11) NOT NULL AUTO_INCREMENT,
  `sportklub_id` int(11) NOT NULL,
  `pontoscim` varchar(50) NOT NULL,
  `nap` varchar(50) NOT NULL,
  `ido` time NOT NULL,
  `max_resztvevok` int(11) DEFAULT 20,
  PRIMARY KEY (`edzes_id`),
  KEY `fk_edzesek_klubbok_idx` (`sportklub_id`),
  CONSTRAINT `fk_edzesek_klubbok` FOREIGN KEY (`sportklub_id`) REFERENCES `klubbok` (`sprotklub_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `klub_edzesek`
--

LOCK TABLES `klub_edzesek` WRITE;
/*!40000 ALTER TABLE `klub_edzesek` DISABLE KEYS */;
INSERT INTO `klub_edzesek` VALUES (1,1,'Budapest, Sportcsarnok 1.','Hétfő','18:00:00',20),(2,2,'Debrecen, Edzőterem 2.','Szerda','19:30:00',20),(3,3,'Szeged, Harcművészeti Központ','Péntek','17:00:00',20),(4,1,'Budapest, Sportcsarnok 1.','Kedd','10:00:00',20);
/*!40000 ALTER TABLE `klub_edzesek` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `klubbok`
--

DROP TABLE IF EXISTS `klubbok`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `klubbok` (
  `sprotklub_id` int(11) NOT NULL AUTO_INCREMENT,
  `sport_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `vnev` varchar(255) NOT NULL,
  `knev` varchar(255) NOT NULL,
  `klubbnev` varchar(255) NOT NULL,
  `hely` varchar(255) NOT NULL,
  `szabalyok` text DEFAULT NULL,
  `leiras` text DEFAULT NULL,
  PRIMARY KEY (`sprotklub_id`),
  KEY `fk user_id_idx` (`user_id`),
  KEY `sportid` (`sport_id`),
  KEY `kb vnev_idx` (`vnev`),
  KEY `kb knev_idx` (`knev`),
  CONSTRAINT `fk user_id` FOREIGN KEY (`user_id`) REFERENCES `latogatok` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `kb knev` FOREIGN KEY (`knev`) REFERENCES `latogatok` (`knev`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `kb vnev` FOREIGN KEY (`vnev`) REFERENCES `latogatok` (`vnev`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `klubbok`
--

LOCK TABLES `klubbok` WRITE;
/*!40000 ALTER TABLE `klubbok` DISABLE KEYS */;
INSERT INTO `klubbok` VALUES (1,1,1,'Kiss','Péter','Szolnoki Boxegyesület','Szolnok','nincs szabály','barátságok közösség vagyunk cigány'),(2,1,2,'Nagy','Anna','Debreceni Boxegyesület','Debrecen','nincs szabály','barátságok közösség vagyunk cigány'),(3,2,3,'Tóth','Gábor','Szolnoki Judo egyesület','Szeged','nincs szabály','barátságok közösség vagyunk cigány');
/*!40000 ALTER TABLE `klubbok` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `latogatobejelentkezesek`
--

DROP TABLE IF EXISTS `latogatobejelentkezesek`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `latogatobejelentkezesek` (
  `bejelentkezes_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `bejelentkezes_ido` datetime NOT NULL,
  PRIMARY KEY (`bejelentkezes_id`),
  KEY `fk_latogatobejelentkezesek_latogatok` (`user_id`),
  CONSTRAINT `fk_latogatobejelentkezesek_latogatok` FOREIGN KEY (`user_id`) REFERENCES `latogatok` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `latogatobejelentkezesek`
--

LOCK TABLES `latogatobejelentkezesek` WRITE;
/*!40000 ALTER TABLE `latogatobejelentkezesek` DISABLE KEYS */;
INSERT INTO `latogatobejelentkezesek` VALUES (4,7,'2025-03-14 00:14:35'),(5,7,'2025-03-14 00:31:32'),(6,7,'2025-03-14 01:17:23'),(7,7,'2025-03-14 01:41:21'),(8,7,'2025-03-14 01:41:42'),(9,4,'2025-03-14 01:41:54'),(10,7,'2025-03-14 02:15:08');
/*!40000 ALTER TABLE `latogatobejelentkezesek` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `latogatok`
--

DROP TABLE IF EXISTS `latogatok`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `latogatok` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
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
  `role` enum('visitor','coach') DEFAULT 'visitor',
  PRIMARY KEY (`user_id`),
  KEY `vnevidx` (`vnev`),
  KEY `knevidx` (`knev`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `latogatok`
--

LOCK TABLES `latogatok` WRITE;
/*!40000 ALTER TABLE `latogatok` DISABLE KEYS */;
INSERT INTO `latogatok` VALUES (1,'Kiss','Péter',NULL,1,'kiss.peter@example.com','1990-05-12','Budapest','2025-02-22 00:00:00','kpeter','$2b$10$Ye0uo3ffgRUMuM1rX369V.6di9clKRXre7/vjxOz5u3QlYDUxWlIW','coach'),(2,'Nagy','Anna',NULL,2,'nagy.anna@example.com','1985-08-25','Debrecen','2025-02-22 00:00:00','nanna','$2b$10$F6z0jKRpuk5Iw9X/Hd5FRuG.ADcQmEEOd0Fsqci1jVXz2vZhUXzQi','coach'),(3,'Tóth','Gábor','Ferenc',3,'toth.gabor@example.com','1992-11-10','Szeged','2025-02-22 00:00:00','tgabor','$2b$10$NTAJ.Zz7abNQN44PPYo2yOLxmWP0BXy3n/KZa6b16KTgCbD7J7MfG','coach'),(4,'Szabó','Mária','Anna',4,'szabo.maria@example.com','1995-03-14','Pécs','2025-02-22 00:00:00','smaria','$2b$10$lU4EEgGIuS2QhocVvFBi4eekNPi.sDCCYKqWC1.z1LarzOC23A.HG','visitor'),(5,'Varga','Béla',NULL,5,'varga.bela@example.com','1988-07-19','Győr','2025-02-22 00:00:00','vbela','$2b$10$S/oxPWR1GAefsAw1sksUtu9ghwQO.M1d9pOiQ3vX0Q5uQHSfbNqV2','visitor'),(6,'kovacs','jeno',NULL,NULL,'kovacsjeno@gmail.com','2025-03-19','Saab','2025-03-03 12:58:26','kjeno','$2b$10$E4uY7aLRJ4uCeMCXKvDOj.Z6MzmiHVAm4mZKRLqhMcNywp8ihg8ou','visitor'),(7,'bela','feri',NULL,NULL,'belaferi@gmail.com','2025-03-14','Budapest','2025-03-03 14:09:27','bferi','$2b$10$I/6jCKKXuCCqpoPBu7Qcy.fLhOjeaCYOpgTx267Eu3/Rzv7CyHTZu','coach'),(8,'kati','bela',NULL,NULL,'katibela@gmail.com','2025-03-27','Szeged','2025-03-03 14:10:52','kbela','$2b$10$fBN1L4viZ4imJqPtzm61vOSBHLbyeLwsJsjv45h0sda/u7QTr2PSy','visitor');
/*!40000 ALTER TABLE `latogatok` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sport`
--

DROP TABLE IF EXISTS `sport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sport` (
  `sport_id` int(11) NOT NULL,
  `sportnev` varchar(45) DEFAULT NULL,
  `leiras` varchar(255) DEFAULT NULL,
  `szabalyok` varchar(555) DEFAULT NULL,
  PRIMARY KEY (`sport_id`),
  CONSTRAINT `sportid` FOREIGN KEY (`sport_id`) REFERENCES `klubbok` (`sport_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sport`
--

LOCK TABLES `sport` WRITE;
/*!40000 ALTER TABLE `sport` DISABLE KEYS */;
INSERT INTO `sport` VALUES (1,'Box','A box egy öklözősport, ahol két versenyző próbálja meg legyőzni egymást ütésekkel. A mérkőzés egy ringben zajlik, és a cél az ellenfél kiütése vagy a pontozási győzelem elérése. Az alábbiakban bemutatjuk a legfontosabb szabályokat:','<ul>\n    <li>A mérkőzés általában 3-12 menetből áll, egy menet 3 perc.</li>\n    <li>Csak az öklökkel szabad ütni, és csak a test előre meghatározott részeire (fej, törzs).</li>\n    <li>Tilos az ököllel ütni az ellenfél hátulját vagy tarkóját.</li>\n    <li>A mérkőzést egy játékvezető irányítja, aki figyeli a szabályok betartását.</li>\n    <li>Ha egy versenyző kétszer is a földre kerül egy menetben, az automatikus kiütésnek minősül.</li>\n</ul>'),(2,'Judo','A judo egy japán eredetű harcművészet és olimpiai sport, amelynek célja az ellenfél lerángatása vagy rögzítése a földön.\n          Az alábbiakban bemutatjuk a legfontosabb szabályokat:','<ul>\n<li>A mérkőzés két részből áll: tachi-waza (álló technikák) és ne-waza (fekvő technikák).</li>\n<li>A győzelem ipponnal érhető el, amely teljes pontot jelent.</li>\n<li>Ha nincs ippon, a waza-ari (fél pont) dönt.</li>\n<li>Tilos veszélyes technikákat alkalmazni, például a hátsó fejre esést okozó dobásokat.</li>\n<li>A mérkőzést három bíró figyeli, akik döntenek a technikák érvényességéről.</li>\n</ul>'),(3,'Jiu Jitsu','A brazil jiu-jitsu egy harcművészet és sport, amelynek célja az ellenfél elbénítása vagy feladásra kényszerítése\n          technikák segítségével, például kulcsokkal és fojtásokkal. Az alábbiakban bemutatjuk a legfontosabb szabályokat:','<ul>\n<li>A mérkőzés általában 5-10 percig tart, attól függően, hogy melyik súlycsoportban versenyeznek.</li>\n<li>A győzelem akkor érhető el, ha az ellenfél feladást jelez (tap), vagy ha egy hatékony technika pontot ér.</li>\n<li>A pontozás a pozíciók dominanciáján alapul: pl. mount (4 pont), back control (4 pont).</li>\n<li>Tilos veszélyes technikákat alkalmazni, amelyek sérülést okozhatnak, például tiltott kulcsok használata.</li>\n<li>A mérkőzést bírók figyelik, akik döntenek a technikák érvényességéről és pontozásról.</li>\n</ul>'),(4,'Muay Thai','A Muay Thai, más néven \"Thaiföldi ökölvívás\", egy harcművészet és sport, amelynek célja az ellenfél legyőzése\n          ütésekkel, rúgásokkal, térdelésekkel és bokszolással. Az alábbiakban bemutatjuk a legfontosabb szabályokat:','<ul>\n<li>A mérkőzés általában 3-5 menetből áll, egy menet 3 percig tart.</li>\n<li>Engedélyezett technikák: ütés, rúgás, térdelés, bokszolás.</li>\n<li>Tilos a fej használata ütésként vagy az ellenfél hátának támadása.</li>\n<li>A mérkőzést bírók figyelik, akik döntenek a szabályok betartásáról és a pontozásról.</li>\n<li>A győzelem pontozással, kiütéssel vagy feladással érhető el.</li>\n</ul>'),(5,'K1','A K-1 egy kickboxing stílusú harcművészet és sport, amely kombinálja a lábtechnikákat, ütéseket és térdeléseket.\n          Az alábbiakban bemutatjuk a legfontosabb szabályokat:','<ul>\n<li>A mérkőzés általában 3 menetből áll, egy menet 3 percig tart.</li>\n<li>Engedélyezett technikák: ütés, rúgás, térdelés, fej-, törzs- és lábszár célzása.</li>\n<li>Tilos a bokszolás, fejhasználat vagy az ellenfél hátának támadása.</li>\n<li>A mérkőzést bírók figyelik, akik döntenek a szabályok betartásáról és a pontozásról.</li>\n<li>A győzelem pontozással, kiütéssel vagy feladással érhető el.</li>\n</ul>'),(6,'Birkózás','A birkózás egy harcművészet és olimpiai sport, amelynek célja az ellenfél lerángatása vagy rögzítése a földön.\n          Az alábbiakban bemutatjuk a legfontosabb szabályokat:','<ul>\n<li>A mérkőzés két részből áll: álló küzdés és földi küzdés.</li>\n<li>A győzelem akkor érhető el, ha az ellenfelet három másodpercre rögzítik a földön.</li>\n<li>Pontozás történik technikai pontokért, például dobásokért vagy irányításért.</li>\n<li>Tilos veszélyes technikákat alkalmazni, amelyek sérülést okozhatnak.</li>\n<li>A mérkőzést bírók figyelik, akik döntenek a technikák érvényességéről és pontozásról.</li>\n</ul>'),(7,'Kickbox','A KickBox egy harcművészet és olimpiai sport, amely kombinálja a lábtechnikákat, ütéseket és térdeléseket.\n          Az alábbiakban bemutatjuk a legfontosabb szabályokat:','<ul>\n<li>A mérkőzés általában 3 menetből áll, egy menet 2-3 percig tart.</li>\n<li>Engedélyezett technikák: ütés, rúgás, térdelés, fej-, törzs- és lábszár célzása.</li>\n<li>Tilos a bokszolás, fejhasználat vagy az ellenfél hátának támadása.</li>\n<li>A mérkőzést bírók figyelik, akik döntenek a szabályok betartásáról és a pontozásról.</li>\n<li>A győzelem pontozással, kiütéssel vagy feladással érhető el.</li>\n</ul>'),(8,'MMA','Az MMA (Mixed Martial Arts) egy vegyes harcművészet, amely kombinálja a birkózást, boxot, jiu-jitsut és más stílusokat.\n          Az alábbiakban bemutatjuk a legfontosabb szabályokat:','<ul>\n<li>A mérkőzés általában 3-5 menetből áll, egy menet 5 percig tart.</li>\n<li>Engedélyezett technikák: ütések, rúgások, bokszolás, fojtások, kulcsok és dobások.</li>\n<li>Tilos veszélyes technikák, például a hátsó fejre esést okozó dobások vagy tiltott területek támadása.</li>\n<li>A mérkőzést bírók figyelik, akik döntenek a szabályok betartásáról és a pontozásról.</li>\n<li>A győzelem kiütéssel, feladással, bírói döntéssel vagy diszkvalifikációval érhető el.</li>\n</ul>');
/*!40000 ALTER TABLE `sport` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-14  2:35:48
