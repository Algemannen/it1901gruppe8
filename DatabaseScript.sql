-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: mysql.stud.ntnu.no
-- Generation Time: 09. Nov, 2017 19:44 PM
-- Server-versjon: 5.5.54-0ubuntu0.12.04.1
-- PHP Version: 7.0.22-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `it1901group8_festival`
--
CREATE DATABASE IF NOT EXISTS `it1901group8_festival` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `it1901group8_festival`;

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `album`
--

CREATE TABLE IF NOT EXISTS `album` (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `navn` varchar(30) NOT NULL,
  `salgstall` int(11) NOT NULL,
  `utgitt_aar` year(4) NOT NULL,
  `bid` int(11) NOT NULL,
  PRIMARY KEY (`aid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `band`
--

CREATE TABLE IF NOT EXISTS `band` (
  `bid` int(11) NOT NULL AUTO_INCREMENT,
  `navn` varchar(30) NOT NULL,
  `bio` text,
  `popularitet` int(11) NOT NULL,
  `sjanger` varchar(20) NOT NULL,
  `bilde_url` text NOT NULL,
  `manager_uid` int(11) NOT NULL,
  PRIMARY KEY (`bid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `band_presseomtale`
--

CREATE TABLE IF NOT EXISTS `band_presseomtale` (
  `bpid` int(11) NOT NULL AUTO_INCREMENT,
  `link` text NOT NULL,
  `link_text` text NOT NULL,
  `bid` int(11) NOT NULL,
  PRIMARY KEY (`bpid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `band_tidligere_konserter`
--

CREATE TABLE IF NOT EXISTS `band_tidligere_konserter` (
  `tkid` int(11) NOT NULL AUTO_INCREMENT,
  `navn` varchar(30) NOT NULL,
  `lokasjon` varchar(30) NOT NULL,
  `dato` date NOT NULL,
  `tilskuere` int(11) NOT NULL,
  `bid` int(11) NOT NULL,
  PRIMARY KEY (`tkid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `bruker`
--

CREATE TABLE IF NOT EXISTS `bruker` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `fornavn` varchar(30) NOT NULL,
  `etternavn` varchar(30) NOT NULL,
  `brukernavn` varchar(30) NOT NULL,
  `email` varchar(40) NOT NULL,
  `passord` varchar(30) NOT NULL,
  `brukertype` int(11) NOT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `brukernavn` (`brukernavn`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `festival`
--

CREATE TABLE IF NOT EXISTS `festival` (
  `fid` int(11) NOT NULL AUTO_INCREMENT,
  `aar` year(4) NOT NULL,
  `startDag` date NOT NULL,
  `sluttDag` date NOT NULL,
  PRIMARY KEY (`fid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `konsert`
--

CREATE TABLE IF NOT EXISTS `konsert` (
  `kid` int(11) NOT NULL AUTO_INCREMENT,
  `knavn` varchar(30) NOT NULL,
  `dato` date NOT NULL,
  `start_tid` char(5) NOT NULL,
  `slutt_tid` char(5) NOT NULL,
  `sjanger` varchar(20) NOT NULL,
  `kostnad` int(11) NOT NULL,
  `tilskuere` int(11) DEFAULT NULL,
  `billettpris` int(11) DEFAULT NULL,
  `sid` int(11) NOT NULL,
  `fid` int(11) NOT NULL,
  PRIMARY KEY (`kid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `konsert_band`
--

CREATE TABLE IF NOT EXISTS `konsert_band` (
  `bid` int(11) NOT NULL,
  `kid` int(11) NOT NULL,
  PRIMARY KEY (`bid`,`kid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `konsert_rigging`
--

CREATE TABLE IF NOT EXISTS `konsert_rigging` (
  `uid` int(11) NOT NULL,
  `kid` int(11) NOT NULL,
  PRIMARY KEY (`uid`,`kid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `scene`
--

CREATE TABLE IF NOT EXISTS `scene` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `navn` varchar(30) NOT NULL,
  `maks_plasser` int(11) NOT NULL,
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `tekniske_behov`
--

CREATE TABLE IF NOT EXISTS `tekniske_behov` (
  `tbid` int(11) NOT NULL AUTO_INCREMENT,
  `kid` int(11) NOT NULL,
  `tittel` varchar(40) NOT NULL,
  `behov` text NOT NULL,
  PRIMARY KEY (`tbid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `tilbud`
--

CREATE TABLE IF NOT EXISTS `tilbud` (
  `tid` int(11) NOT NULL AUTO_INCREMENT,
  `dato` date NOT NULL,
  `start_tid` char(5) NOT NULL,
  `slutt_tid` char(5) NOT NULL,
  `pris` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `bid` int(11) NOT NULL,
  `sid` int(11) NOT NULL,
  `sender_uid` int(11) NOT NULL,
  PRIMARY KEY (`tid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
