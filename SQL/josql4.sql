-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema kuzdosportok
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema kuzdosportok
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `kuzdosportok` DEFAULT CHARACTER SET utf8mb4 ;
USE `kuzdosportok` ;

-- -----------------------------------------------------
-- Table `kuzdosportok`.`latogatok`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kuzdosportok`.`latogatok` (
  `user_id` INT(11) NOT NULL AUTO_INCREMENT,
  `vnev` VARCHAR(255) NOT NULL,
  `knev` VARCHAR(255) NOT NULL,
  `knev2` VARCHAR(255) NULL DEFAULT NULL,
  `telefonszam` INT(100) NULL DEFAULT NULL,
  `email` VARCHAR(255) NOT NULL,
  `szul_ido` DATE NOT NULL,
  `lakhelyvaros` VARCHAR(255) NOT NULL,
  `regisztracio_datum` DATETIME NOT NULL,
  `felhasznalonev` VARCHAR(255) NOT NULL,
  `jelszo` VARCHAR(255) NOT NULL,
  `edzo` INT(11) NOT NULL,
  PRIMARY KEY (`user_id`),
  INDEX `vnevidx` (`vnev` ASC),
  INDEX `knevidx` (`knev` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_hungarian_ci;


-- -----------------------------------------------------
-- Table `kuzdosportok`.`adatmodositas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kuzdosportok`.`adatmodositas` (
  `modositas_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `adat_modositas_datum` DATETIME NOT NULL,
  PRIMARY KEY (`modositas_id`),
  INDEX `fr user_id_idx` (`user_id` ASC),
  CONSTRAINT `fr user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `kuzdosportok`.`latogatok` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `kuzdosportok`.`klubbok`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kuzdosportok`.`klubbok` (
  `sprotklub_id` INT(11) NOT NULL,
  `sport_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `vnev` VARCHAR(255) NOT NULL,
  `knev` VARCHAR(255) NOT NULL,
  `klubbnev` VARCHAR(255) NOT NULL,
  `hely` VARCHAR(255) NOT NULL,
  `idonap` VARCHAR(255) NOT NULL,
  `ido` TIME NOT NULL,
  `szabalyok` TEXT NULL DEFAULT NULL,
  `leiras` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`sprotklub_id`),
  INDEX `fk user_id_idx` (`user_id` ASC) ,
  INDEX `sportid` (`sport_id` ASC),
  INDEX `kb vnev_idx` (`vnev` ASC),
  INDEX `kb knev_idx` (`knev` ASC),
  CONSTRAINT `fk user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `kuzdosportok`.`latogatok` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `kb vnev`
    FOREIGN KEY (`vnev`)
    REFERENCES `kuzdosportok`.`latogatok` (`vnev`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `kb knev`
    FOREIGN KEY (`knev`)
    REFERENCES `kuzdosportok`.`latogatok` (`knev`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_hungarian_ci;


-- -----------------------------------------------------
-- Table `kuzdosportok`.`ertekelesek`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kuzdosportok`.`ertekelesek` (
  `ertekeles_id` INT(11) NOT NULL,
  `szoveges_ertekeles` VARCHAR(255) NOT NULL,
  `csillagos_ertekeles` INT(1) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `sportklub_id` INT(11) NOT NULL,
  PRIMARY KEY (`ertekeles_id`),
  INDEX `fruserid_idx` (`user_id` ASC),
  INDEX `frsportklub_idx` (`sportklub_id` ASC),
  CONSTRAINT `frsportklub`
    FOREIGN KEY (`sportklub_id`)
    REFERENCES `kuzdosportok`.`klubbok` (`sprotklub_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fruserid`
    FOREIGN KEY (`user_id`)
    REFERENCES `kuzdosportok`.`latogatok` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `kuzdosportok`.`esemenyek`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kuzdosportok`.`esemenyek` (
  `esemeny_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `latogato_resztvevo` INT(1) NOT NULL,
  `pontos_cim` VARCHAR(255) NOT NULL,
  `ido` DATETIME NOT NULL,
  `sportneve` VARCHAR(255) NOT NULL,
  `leiras` VARCHAR(255) NOT NULL,
  `szervezo_neve` VARCHAR(255) NOT NULL,
  `szervezo_tel` VARCHAR(15) NOT NULL,
  `szervezo_email` VARCHAR(255) NOT NULL,
  `esemeny_weboldal` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`esemeny_id`),
  INDEX `fr user_id_idx` (`user_id` ASC),
  CONSTRAINT `fr2_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `kuzdosportok`.`latogatok` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `kuzdosportok`.`jelentkezes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kuzdosportok`.`jelentkezes` (
  `jelentkezes_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `sportkulb_id` INT(11) NOT NULL,
  `jelentkezes_ido` DATETIME NOT NULL,
  `elfogadasi_ido` DATETIME NOT NULL,
  `elfogadva` INT(1) NOT NULL,
  PRIMARY KEY (`jelentkezes_id`),
  INDEX `fk user_id_idx` (`user_id` ASC),
  INDEX `fk sportklub_id_idx` (`sportkulb_id` ASC),
  CONSTRAINT `fk sportklub_id`
    FOREIGN KEY (`sportkulb_id`)
    REFERENCES `kuzdosportok`.`klubbok` (`sprotklub_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk1_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `kuzdosportok`.`latogatok` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `kuzdosportok`.`latogatobejelentkezesek`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kuzdosportok`.`latogatobejelentkezesek` (
  `bejelentkezes_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `bejelentkezes_ido` DATETIME NOT NULL,
  PRIMARY KEY (`bejelentkezes_id`),
  INDEX `fk_latogatobejelentkezesek_latogatok` (`user_id` ASC),
  CONSTRAINT `fk_latogatobejelentkezesek_latogatok`
    FOREIGN KEY (`user_id`)
    REFERENCES `kuzdosportok`.`latogatok` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_hungarian_ci;


-- -----------------------------------------------------
-- Table `kuzdosportok`.`sport`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kuzdosportok`.`sport` (
  `sport_id` INT(11) NOT NULL,
  `sportnev` VARCHAR(45) NULL DEFAULT NULL,
  `leiras` VARCHAR(255) NULL DEFAULT NULL,
  `szabalyok` VARCHAR(555) NULL DEFAULT NULL,
  PRIMARY KEY (`sport_id`),
  CONSTRAINT `sportid`
    FOREIGN KEY (`sport_id`)
    REFERENCES `kuzdosportok`.`klubbok` (`sport_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;

-- látogatók insertje: abból 3 edző
-- Jelszavak:
-- 1: kispeti
-- 2: nagy
-- 3: tgabi
-- 4: Szabó
-- 5: vargabelus
INSERT INTO kuzdosportok.latogatok (user_id, vnev, knev, knev2, telefonszam, email, szul_ido, lakhelyvaros, regisztracio_datum, felhasznalonev, jelszo, edzo) 
VALUES 
(1, 'Kiss', 'Péter', NULL, '1', 'kiss.peter@example.com', '1990-05-12', 'Budapest', '2025-02-22', 'kpeter', '$2b$10$Ye0uo3ffgRUMuM1rX369V.6di9clKRXre7/vjxOz5u3QlYDUxWlIW', 1),
(2, 'Nagy', 'Anna', NULL, '2', 'nagy.anna@example.com', '1985-08-25', 'Debrecen', '2025-02-22', 'nanna', '$2b$10$F6z0jKRpuk5Iw9X/Hd5FRuG.ADcQmEEOd0Fsqci1jVXz2vZhUXzQi', 1),
(3, 'Tóth', 'Gábor', 'Ferenc', '3', 'toth.gabor@example.com', '1992-11-10', 'Szeged', '2025-02-22', 'tgabor', '$2b$10$NTAJ.Zz7abNQN44PPYo2yOLxmWP0BXy3n/KZa6b16KTgCbD7J7MfG', 1),
(4, 'Szabó', 'Mária', 'Anna', '4', 'szabo.maria@example.com', '1995-03-14', 'Pécs', '2025-02-22', 'smaria', '$2b$10$lU4EEgGIuS2QhocVvFBi4eekNPi.sDCCYKqWC1.z1LarzOC23A.HG', 0),
(5, 'Varga', 'Béla', NULL, '5', 'varga.bela@example.com', '1988-07-19', 'Győr', '2025-02-22', 'vbela', '$2b$10$S/oxPWR1GAefsAw1sksUtu9ghwQO.M1d9pOiQ3vX0Q5uQHSfbNqV2', 0);


-- sportok hozzáadása
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



-- Sportklubbok hozzáadása:

INSERT INTO kuzdosportok.klubbok (sprotklub_id, sport_id, user_id, vnev, knev, klubbnev, hely, idonap, ido, szabalyok, leiras)
VALUES
(1, '1', '1', 'Kiss', 'Péter', 'Szolnoki Boxegyesület', 'Szolnok', 'Hétfő', '17:30:00', 'nincs szabály', 'barátságok közösség vagyunk cigány'),
(2, '1', '2',  'Nagy', 'Anna', 'Debreceni Boxegyesület', 'Debrecen', 'Szerda', '11:30:00', 'nincs szabály', 'barátságok közösség vagyunk cigány'),
(3, '2', '3',  'Tóth', 'Gábor', 'Szolnoki Judo egyesület', 'Szeged', 'Péntek', '20:00:00', 'nincs szabály', 'barátságok közösség vagyunk cigány');


--


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
