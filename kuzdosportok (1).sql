-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Jan 27. 10:08
-- Kiszolgáló verziója: 10.4.28-MariaDB
-- PHP verzió: 8.2.4

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
-- Tábla szerkezet ehhez a táblához `bejelentkezesek`
--

CREATE TABLE `bejelentkezesek` (
  `bejelentkezes_id` int(11) NOT NULL,
  `felhasznalo_id` int(11) NOT NULL,
  `felhasznalo_tipus` enum('Edzo','Latogato') NOT NULL,
  `bejelentkezes_ido` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `bejelentkezesek`
--

INSERT INTO `bejelentkezesek` (`bejelentkezes_id`, `felhasznalo_id`, `felhasznalo_tipus`, `bejelentkezes_ido`) VALUES
(1, 1, 'Edzo', '2025-01-10 09:00:00'),
(2, 2, 'Edzo', '2025-01-10 10:00:00'),
(3, 1, 'Latogato', '2025-01-10 11:00:00'),
(4, 2, 'Latogato', '2025-01-10 12:00:00');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `edzok`
--

CREATE TABLE `edzok` (
  `edzo_id` int(11) NOT NULL,
  `teljes_nev` varchar(255) NOT NULL,
  `telefonszam` varchar(15) NOT NULL,
  `email` varchar(255) NOT NULL,
  `szul_hely_ido` datetime NOT NULL,
  `lakcim` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `edzok`
--

INSERT INTO `edzok` (`edzo_id`, `teljes_nev`, `telefonszam`, `email`, `szul_hely_ido`, `lakcim`) VALUES
(1, 'Kovács János', '+3612345678', 'kovacs.janos@edzo.com', '1985-05-15 10:00:00', 'Budapest, Kossuth utca 12.'),
(2, 'Nagy Eszter', '+3698765432', 'nagy.eszter@edzo.com', '1990-08-22 14:30:00', 'Szeged, Petőfi tér 5.');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `edzokkuzdosportok`
--

CREATE TABLE `edzokkuzdosportok` (
  `edzo_id` int(11) NOT NULL,
  `sport_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `edzokkuzdosportok`
--

INSERT INTO `edzokkuzdosportok` (`edzo_id`, `sport_id`) VALUES
(1, 1),
(2, 2);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kuzdosportok`
--

CREATE TABLE `kuzdosportok` (
  `sport_id` int(11) NOT NULL,
  `nev` varchar(255) NOT NULL,
  `hely` varchar(255) DEFAULT NULL,
  `szabalyok` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `kuzdosportok`
--

INSERT INTO `kuzdosportok` (`sport_id`, `nev`, `hely`, `szabalyok`) VALUES
(1, 'Karate', 'Budapest, Sportcsarnok', 'A karate hagyományos szabályai szerint.'),
(2, 'Judo', 'Szeged, Judo Terem', 'A judo hivatalos versenyszabályai.');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `latogatok`
--

CREATE TABLE `latogatok` (
  `latogato_id` int(11) NOT NULL,
  `teljes_nev` varchar(255) NOT NULL,
  `telefonszam` varchar(15) NOT NULL,
  `szul_hely_ido` datetime NOT NULL,
  `lakcim` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `latogatok`
--

INSERT INTO `latogatok` (`latogato_id`, `teljes_nev`, `telefonszam`, `szul_hely_ido`, `lakcim`) VALUES
(1, 'Tóth Péter', '+36201234567', '1995-03-10 08:00:00', 'Debrecen, Kossuth utca 45.'),
(2, 'Horváth Anna', '+36309876543', '1988-11-25 12:00:00', 'Pécs, Petőfi tér 8.');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `latogatokkuzdosportok`
--

CREATE TABLE `latogatokkuzdosportok` (
  `latogato_id` int(11) NOT NULL,
  `sport_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `latogatokkuzdosportok`
--

INSERT INTO `latogatokkuzdosportok` (`latogato_id`, `sport_id`) VALUES
(1, 1),
(2, 2);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `bejelentkezesek`
--
ALTER TABLE `bejelentkezesek`
  ADD PRIMARY KEY (`bejelentkezes_id`);

--
-- A tábla indexei `edzok`
--
ALTER TABLE `edzok`
  ADD PRIMARY KEY (`edzo_id`);

--
-- A tábla indexei `edzokkuzdosportok`
--
ALTER TABLE `edzokkuzdosportok`
  ADD PRIMARY KEY (`edzo_id`,`sport_id`),
  ADD KEY `sport_id` (`sport_id`);

--
-- A tábla indexei `kuzdosportok`
--
ALTER TABLE `kuzdosportok`
  ADD PRIMARY KEY (`sport_id`);

--
-- A tábla indexei `latogatok`
--
ALTER TABLE `latogatok`
  ADD PRIMARY KEY (`latogato_id`);

--
-- A tábla indexei `latogatokkuzdosportok`
--
ALTER TABLE `latogatokkuzdosportok`
  ADD PRIMARY KEY (`latogato_id`,`sport_id`),
  ADD KEY `sport_id` (`sport_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `bejelentkezesek`
--
ALTER TABLE `bejelentkezesek`
  MODIFY `bejelentkezes_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `edzok`
--
ALTER TABLE `edzok`
  MODIFY `edzo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `kuzdosportok`
--
ALTER TABLE `kuzdosportok`
  MODIFY `sport_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `latogatok`
--
ALTER TABLE `latogatok`
  MODIFY `latogato_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `edzokkuzdosportok`
--
ALTER TABLE `edzokkuzdosportok`
  ADD CONSTRAINT `edzokkuzdosportok_ibfk_1` FOREIGN KEY (`edzo_id`) REFERENCES `edzok` (`edzo_id`),
  ADD CONSTRAINT `edzokkuzdosportok_ibfk_2` FOREIGN KEY (`sport_id`) REFERENCES `kuzdosportok` (`sport_id`);

--
-- Megkötések a táblához `latogatokkuzdosportok`
--
ALTER TABLE `latogatokkuzdosportok`
  ADD CONSTRAINT `latogatokkuzdosportok_ibfk_1` FOREIGN KEY (`latogato_id`) REFERENCES `latogatok` (`latogato_id`),
  ADD CONSTRAINT `latogatokkuzdosportok_ibfk_2` FOREIGN KEY (`sport_id`) REFERENCES `kuzdosportok` (`sport_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
