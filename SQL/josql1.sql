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
CREATE SCHEMA IF NOT EXISTS `kuzdosportok`;
USE `kuzdosportok` ;

-- -----------------------------------------------------
-- Table `kuzdosportok`.`latogatok`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kuzdosportok`.`latogatok` (
  `user_id` INT(11) NOT NULL AUTO_INCREMENT,
  `vnev` VARCHAR(255) NOT NULL,
  `knev` VARCHAR(255) NOT NULL,
  `knev2` VARCHAR(255) NULL,
  `telefonszam` VARCHAR(15) NULL,
  `szul_ido` DATETIME NOT NULL,
  `lakhelyvaros` VARCHAR(255) NOT NULL,
  `regisztracio_datum` DATETIME NOT NULL,
  `felhasznalonev` VARCHAR(255) NOT NULL,
  `jelszo` VARCHAR(255) NOT NULL,
  `edzo` INT NOT NULL,
  PRIMARY KEY (`user_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_hungarian_ci;


-- -----------------------------------------------------
-- Table `kuzdosportok`.`kuzdosportok`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kuzdosportok`.`kuzdosportok` (
  `sprotklub_id` INT(11) NOT NULL,
  `sportneve` VARCHAR(255) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `hely` VARCHAR(255) NOT NULL,
  `ido` DATETIME NOT NULL,
  `szabalyok` TEXT NULL DEFAULT NULL,
  `leiras` TEXT NULL,
  PRIMARY KEY (`sprotklub_id`),
  INDEX `fk user_id_idx` (`user_id` ASC),
  CONSTRAINT `fk user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `kuzdosportok`.`latogatok` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_hungarian_ci;


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
  CONSTRAINT `fk1_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `kuzdosportok`.`latogatok` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk sportklub_id`
    FOREIGN KEY (`sportkulb_id`)
    REFERENCES `kuzdosportok`.`kuzdosportok` (`sprotklub_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


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
ENGINE = InnoDB;


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
  `esemeny_weboldal` VARCHAR(255) NULL,
  PRIMARY KEY (`esemeny_id`),
  INDEX `fr user_id_idx` (`user_id` ASC),
  CONSTRAINT `fr2_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `kuzdosportok`.`latogatok` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

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
  CONSTRAINT `fruserid`
    FOREIGN KEY (`user_id`)
    REFERENCES `kuzdosportok`.`latogatok` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `frsportklub`
    FOREIGN KEY (`sportklub_id`)
    REFERENCES `kuzdosportok`.`kuzdosportok` (`sprotklub_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
