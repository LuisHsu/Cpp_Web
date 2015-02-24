-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- 主機: localhost
-- 建立日期: 2015 年 02 月 24 日 08:38
-- 伺服器版本: 5.5.41-MariaDB-1ubuntu0.14.04.1
-- PHP 版本: 5.5.9-1ubuntu4.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 資料庫: `Cpp2015`
--
CREATE DATABASE IF NOT EXISTS `Cpp2015` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `Cpp2015`;

-- --------------------------------------------------------

--
-- 資料表結構 `Account_Table`
--

CREATE TABLE IF NOT EXISTS `Account_Table` (
  `index` smallint(6) NOT NULL AUTO_INCREMENT,
  `id` tinytext COLLATE utf8_unicode_ci NOT NULL,
  `password` tinytext COLLATE utf8_unicode_ci NOT NULL,
  `permission` tinytext COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=4 ;

-- --------------------------------------------------------

--
-- 資料表結構 `Project_Table`
--

CREATE TABLE IF NOT EXISTS `Project_Table` (
  `project_index` tinyint(4) NOT NULL AUTO_INCREMENT,
  `title` tinytext COLLATE utf8_unicode_ci,
  `subtitle` tinytext COLLATE utf8_unicode_ci,
  `author` tinytext COLLATE utf8_unicode_ci NOT NULL,
  `category` text COLLATE utf8_unicode_ci NOT NULL,
  `upload_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `star` tinyint(4) NOT NULL DEFAULT '0',
  `popularity` int(11) NOT NULL DEFAULT '0',
  `download_times` int(11) NOT NULL DEFAULT '0',
  `pic_count` tinyint(4) NOT NULL DEFAULT '0',
  `win_path` tinytext COLLATE utf8_unicode_ci,
  `linux_path` tinytext COLLATE utf8_unicode_ci,
  `mac_path` tinytext COLLATE utf8_unicode_ci,
  `description` mediumtext COLLATE utf8_unicode_ci,
  PRIMARY KEY (`project_index`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=2 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
