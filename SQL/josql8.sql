-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema kuzdosportok
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `kuzdosportok` DEFAULT CHARACTER SET utf8mb4 ;
USE `kuzdosportok` ;

-- -----------------------------------------------------
-- Table `kuzdosportok`.`sport`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kuzdosportok`.`sport` (
  `sport_id` INT(11) NOT NULL AUTO_INCREMENT, -- AUTO_INCREMENT, hogy független legyen
  `sportnev` VARCHAR(45) NULL DEFAULT NULL,
  `leiras` VARCHAR(255) NULL DEFAULT NULL,
  `szabalyok` VARCHAR(555) NULL DEFAULT NULL,
  PRIMARY KEY (`sport_id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 9 -- Azért 9, mert 8 sportágat adunk hozzá később
  DEFAULT CHARACTER SET = utf8mb4;

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
  `role` ENUM('visitor', 'coach') NULL DEFAULT 'visitor',
  PRIMARY KEY (`user_id`),
  INDEX `vnevidx` (`vnev` ASC),
  INDEX `knevidx` (`knev` ASC)
) ENGINE = InnoDB
  AUTO_INCREMENT = 9
  DEFAULT CHARACTER SET = utf8
  COLLATE = utf8_hungarian_ci;

-- -----------------------------------------------------
-- Table `kuzdosportok`.`klubbok`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kuzdosportok`.`klubbok` (
  `sprotklub_id` INT(11) NOT NULL AUTO_INCREMENT,
  `sport_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `vnev` VARCHAR(255) NOT NULL,
  `knev` VARCHAR(255) NOT NULL,
  `klubbnev` VARCHAR(255) NOT NULL,
  `hely` VARCHAR(255) NOT NULL,
  `szabalyok` TEXT NULL DEFAULT NULL,
  `leiras` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`sprotklub_id`),
  INDEX `fk_user_id_idx` (`user_id` ASC),
  INDEX `sportid` (`sport_id` ASC),
  INDEX `kb_vnev_idx` (`vnev` ASC),
  INDEX `kb_knev_idx` (`knev` ASC),
  CONSTRAINT `fk_sport_id`
    FOREIGN KEY (`sport_id`)
    REFERENCES `kuzdosportok`.`sport` (`sport_id`)
    ON DELETE RESTRICT -- Nem törli a sportot, ha klub törlődik
    ON UPDATE CASCADE,
  CONSTRAINT `fk_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `kuzdosportok`.`latogatok` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `kb_knev`
    FOREIGN KEY (`knev`)
    REFERENCES `kuzdosportok`.`latogatok` (`knev`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `kb_vnev`
    FOREIGN KEY (`vnev`)
    REFERENCES `kuzdosportok`.`latogatok` (`vnev`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB
  AUTO_INCREMENT = 4
  DEFAULT CHARACTER SET = utf8
  COLLATE = utf8_hungarian_ci;

-- -----------------------------------------------------
-- Table `kuzdosportok`.`klub_edzesek`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kuzdosportok`.`klub_edzesek` (
  `edzes_id` INT NOT NULL AUTO_INCREMENT,
  `sportklub_id` INT(11) NOT NULL,
  `pontoscim` VARCHAR(50) NOT NULL,
  `nap` VARCHAR(50) NOT NULL,
  `ido` TIME NOT NULL,
  PRIMARY KEY (`edzes_id`),
  INDEX `fk_edzesek_klubbok_idx` (`sportklub_id` ASC),
  CONSTRAINT `fk_edzesek_klubbok`
    FOREIGN KEY (`sportklub_id`)
    REFERENCES `kuzdosportok`.`klubbok` (`sprotklub_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `kuzdosportok`.`jelentkezes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kuzdosportok`.`jelentkezes` (
  `jelentkezes_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `edzes_id` INT(11) NOT NULL,
  `jelentkezes_ido` DATETIME NOT NULL,
  PRIMARY KEY (`jelentkezes_id`),
  INDEX `fk_user_id_idx` (`user_id` ASC),
  INDEX `fk_edzes_id_idx` (`edzes_id` ASC),
  CONSTRAINT `fk_edzes_id`
    FOREIGN KEY (`edzes_id`)
    REFERENCES `kuzdosportok`.`klub_edzesek` (`edzes_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk1_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `kuzdosportok`.`latogatok` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4;

-- További táblák (nem változnak, de itt vannak a teljesség kedvéért)
-- -----------------------------------------------------
-- Table `kuzdosportok`.`adatmodositas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kuzdosportok`.`adatmodositas` (
  `modositas_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `adat_modositas_datum` DATETIME NOT NULL,
  PRIMARY KEY (`modositas_id`),
  INDEX `fr_user_id_idx` (`user_id` ASC),
  CONSTRAINT `fr_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `kuzdosportok`.`latogatok` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4;

-- -----------------------------------------------------
-- Table `kuzdosportok`.`ertekelesek`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kuzdosportok`.`ertekelesek` (
  `ertekeles_id` INT(11) NOT NULL AUTO_INCREMENT,
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
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fruserid`
    FOREIGN KEY (`user_id`)
    REFERENCES `kuzdosportok`.`latogatok` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4;

-- -----------------------------------------------------
-- Table `kuzdosportok`.`esemenyek`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kuzdosportok`.`esemenyek` (
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
  `esemeny_weboldal` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`esemeny_id`),
  INDEX `fr_user_id_idx` (`user_id` ASC),
  CONSTRAINT `fr2_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `kuzdosportok`.`latogatok` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB
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
    ON UPDATE CASCADE
) ENGINE = InnoDB
  AUTO_INCREMENT = 4
  DEFAULT CHARACTER SET = utf8
  COLLATE = utf8_hungarian_ci;

-- -----------------------------------------------------
-- Table `kuzdosportok`.`streams`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kuzdosportok`.`streams` (
  `stream_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `stream_url` VARCHAR(255) NOT NULL,
  `status` ENUM('online', 'offline') DEFAULT 'offline',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`stream_id`),
  INDEX `fk_stream_user_id_idx` (`user_id` ASC),
  CONSTRAINT `fk_stream_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `kuzdosportok`.`latogatok` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB
  AUTO_INCREMENT = 4
  DEFAULT CHARSET = utf8
  COLLATE = utf8_hungarian_ci;

-- Adatok feltöltése (INSERT-ek változatlanok, de a sport_id-kat AUTO_INCREMENT-hez igazítom)
INSERT INTO `kuzdosportok`.`latogatok` (`user_id`, `vnev`, `knev`, `knev2`, `telefonszam`, `email`, `szul_ido`, `lakhelyvaros`, `regisztracio_datum`, `felhasznalonev`, `jelszo`, `role`) VALUES
(1, 'Kiss', 'Péter', NULL, 1, 'kiss.peter@example.com', '1990-05-12', 'Budapest', '2025-02-22 00:00:00', 'kpeter', '$2b$10$Ye0uo3ffgRUMuM1rX369V.6di9clKRXre7/vjxOz5u3QlYDUxWlIW', 'coach'),
(2, 'Nagy', 'Anna', NULL, 2, 'nagy.anna@example.com', '1985-08-25', 'Debrecen', '2025-02-22 00:00:00', 'nanna', '$2b$10$F6z0jKRpuk5Iw9X/Hd5FRuG.ADcQmEEOd0Fsqci1jVXz2vZhUXzQi', 'coach'),
(3, 'Tóth', 'Gábor', 'Ferenc', 3, 'toth.gabor@example.com', '1992-11-10', 'Szeged', '2025-02-22 00:00:00', 'tgabor', '$2b$10$NTAJ.Zz7abNQN44PPYo2yOLxmWP0BXy3n/KZa6b16KTgCbD7J7MfG', 'coach'),
(4, 'Szabó', 'Mária', 'Anna', 4, 'szabo.maria@example.com', '1995-03-14', 'Pécs', '2025-02-22 00:00:00', 'smaria', '$2b$10$lU4EEgGIuS2QhocVvFBi4eekNPi.sDCCYKqWC1.z1LarzOC23A.HG', 'visitor'),
(5, 'Varga', 'Béla', NULL, 5, 'varga.bela@example.com', '1988-07-19', 'Győr', '2025-02-22 00:00:00', 'vbela', '$2b$10$S/oxPWR1GAefsAw1sksUtu9ghwQO.M1d9pOiQ3vX0Q5uQHSfbNqV2', 'visitor'),
(6, 'kovacs', 'jeno', NULL, NULL, 'kovacsjeno@gmail.com', '2025-03-19', 'Saab', '2025-03-03 12:58:26', 'kjeno', '$2b$10$E4uY7aLRJ4uCeMCXKvDOj.Z6MzmiHVAm4mZKRLqhMcNywp8ihg8ou', 'visitor'),
(7, 'bela', 'feri', NULL, NULL, 'belaferi@gmail.com', '2025-03-14', 'Budapest', '2025-03-03 14:09:27', 'bferi', '$2b$10$I/6jCKKXuCCqpoPBu7Qcy.fLhOjeaCYOpgTx267Eu3/Rzv7CyHTZu', 'coach'),
(8, 'kati', 'bela', NULL, NULL, 'katibela@gmail.com', '2025-03-27', 'Szeged', '2025-03-03 14:10:52', 'kbela', '$2b$10$fBN1L4viZ4imJqPtzm61vOSBHLbyeLwsJsjv45h0sda/u7QTr2PSy', 'visitor');

INSERT INTO `kuzdosportok`.`streams` VALUES 
(1, 1, 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'offline', '2025-03-17 12:14:52'),
(2, 2, 'https://www.youtube.com/embed/xyz123', 'offline', '2025-03-17 12:14:52'),
(3, 7, 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'offline', '2025-03-17 12:15:57');

INSERT INTO `kuzdosportok`.`sport` (`sport_id`, `sportnev`, `leiras`, `szabalyok`) VALUES
(1, 'Box', 'A box egy öklözősport, ahol két versenyző próbálja meg legyőzni egymást ütésekkel.', '<ul><li>A mérkőzés általában 3-12 menetből áll, egy menet 3 perc.</li><li>Csak az öklökkel szabad ütni.</li></ul>'),
(2, 'Judo', 'A judo egy japán eredetű harcművészet és olimpiai sport.', '<ul><li>A mérkőzés két részből áll: tachi-waza és ne-waza.</li><li>A győzelem ipponnal érhető el.</li></ul>'),
(3, 'Jiu Jitsu', 'A brazil jiu-jitsu egy harcművészet és sport.', '<ul><li>A mérkőzés általában 5-10 percig tart.</li><li>A győzelem feladással érhető el.</li></ul>'),
(4, 'Muay Thai', 'A Muay Thai egy thaiföldi harcművészet.', '<ul><li>A mérkőzés általában 3-5 menetből áll.</li><li>Engedélyezett technikák: ütés, rúgás.</li></ul>'),
(5, 'K1', 'A K-1 egy kickboxing stílusú harcművészet.', '<ul><li>A mérkőzés általában 3 menetből áll.</li><li>Engedélyezett technikák: ütés, rúgás.</li></ul>'),
(6, 'Birkózás', 'A birkózás egy harcművészet és olimpiai sport.', '<ul><li>A mérkőzés két részből áll.</li><li>A győzelem rögzítéssel érhető el.</li></ul>'),
(7, 'Kickbox', 'A KickBox egy harcművészet.', '<ul><li>A mérkőzés általában 3 menetből áll.</li><li>Engedélyezett technikák: ütés, rúgás.</li></ul>'),
(8, 'MMA', 'Az MMA egy vegyes harcművészet.', '<ul><li>A mérkőzés általában 3-5 menetből áll.</li><li>A győzelem kiütéssel, feladással érhető el.</li></ul>');

INSERT INTO `kuzdosportok`.`klubbok` (`sprotklub_id`, `sport_id`, `user_id`, `vnev`, `knev`, `klubbnev`, `hely`, `szabalyok`, `leiras`) VALUES
(1, 1, 1, 'Kiss', 'Péter', 'Szolnoki Boxegyesület', 'Szolnok', 'nincs szabály', 'barátságos közösség vagyunk'),
(2, 1, 2, 'Nagy', 'Anna', 'Debreceni Boxegyesület', 'Debrecen', 'nincs szabály', 'barátságos közösség vagyunk'),
(3, 2, 3, 'Tóth', 'Gábor', 'Szolnoki Judo egyesület', 'Szeged', 'nincs szabály', 'barátságos közösség vagyunk');

INSERT INTO `kuzdosportok`.`klub_edzesek` (`sportklub_id`, `pontoscim`, `nap`, `ido`) VALUES
(1, 'Budapest, Sportcsarnok 1.', 'Hétfő', '18:00:00'),
(2, 'Debrecen, Edzőterem 2.', 'Szerda', '19:30:00'),
(3, 'Szeged, Harcművészeti Központ', 'Péntek', '17:00:00'),
(1, 'Budapest, Sportcsarnok 1.', 'Kedd', '10:00:00');

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;