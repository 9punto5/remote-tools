-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 14, 2020 at 11:11 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.2.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `remote_tools`
--

-- --------------------------------------------------------

--
-- Table structure for table `rating_parameters_averages`
--
DROP TABLE IF EXISTS `rating_parameters_averages`;
CREATE TABLE `rating_parameters_averages` (
  `id` int(10) UNSIGNED NOT NULL,
  `tool_id` int(10) NOT NULL,
  `parameter_id` int(10) NOT NULL,
  `rating` float DEFAULT NULL,
  `users_rating` float DEFAULT NULL,
  `users_rating_count` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `rating_parameters_averages`
--

INSERT INTO `rating_parameters_averages` (`id`, `tool_id`, `parameter_id`, `rating`, `users_rating`, `users_rating_count`) VALUES
(1, 1, 1, 3.33, NULL, NULL),
(2, 2, 1, 4.5, NULL, NULL),
(3, 3, 1, 6.25, NULL, NULL),
(4, 4, 1, 3.67, NULL, NULL),
(5, 5, 1, 4, NULL, NULL),
(6, 6, 1, 2, NULL, NULL),
(7, 7, 1, 5.5, NULL, NULL),
(8, 8, 1, 4.75, NULL, NULL),
(9, 9, 1, 7.33, NULL, NULL),
(10, 10, 1, 5.75, NULL, NULL),
(11, 11, 1, 4.4, NULL, NULL),
(12, 12, 1, 8.33, NULL, NULL),
(13, 13, 1, 4, NULL, NULL),
(14, 1, 2, 6.33, NULL, NULL),
(15, 2, 2, 7, NULL, NULL),
(16, 3, 2, 8.25, NULL, NULL),
(17, 4, 2, 3.33, NULL, NULL),
(18, 5, 2, 5, NULL, NULL),
(19, 6, 2, 4, NULL, NULL),
(20, 7, 2, 6.2, NULL, NULL),
(21, 8, 2, 8, NULL, NULL),
(22, 9, 2, 3.5, NULL, NULL),
(23, 10, 2, 3.75, NULL, NULL),
(24, 11, 2, 6.67, NULL, NULL),
(25, 12, 2, 5, NULL, NULL),
(26, 13, 2, 3, NULL, NULL),
(27, 1, 3, 6, NULL, NULL),
(28, 2, 3, 6, NULL, NULL),
(29, 3, 3, 8.5, NULL, NULL),
(30, 4, 3, 4, NULL, NULL),
(31, 5, 3, 6, NULL, NULL),
(32, 6, 3, 6, NULL, NULL),
(33, 7, 3, 6.8, NULL, NULL),
(34, 8, 3, 6.25, NULL, NULL),
(35, 9, 3, 3.33, NULL, NULL),
(36, 10, 3, 4.25, NULL, NULL),
(37, 11, 3, 6, NULL, NULL),
(38, 12, 3, 7.67, NULL, NULL),
(39, 13, 3, 3, NULL, NULL),
(40, 1, 4, 5, NULL, NULL),
(41, 2, 4, 5.5, NULL, NULL),
(42, 3, 4, 7.5, NULL, NULL),
(43, 4, 4, 4.33, NULL, NULL),
(44, 5, 4, 7, NULL, NULL),
(45, 6, 4, 8, NULL, NULL),
(46, 7, 4, 8.8, NULL, NULL),
(47, 8, 4, 6.25, NULL, NULL),
(48, 9, 4, 3.67, NULL, NULL),
(49, 10, 4, 2.5, NULL, NULL),
(50, 11, 4, 5.5, NULL, NULL),
(51, 12, 4, 4.67, NULL, NULL),
(52, 13, 4, 2, NULL, NULL),
(53, 1, 5, 8, NULL, NULL),
(54, 2, 5, 5.5, NULL, NULL),
(55, 3, 5, 5, NULL, NULL),
(56, 4, 5, 5, NULL, NULL),
(57, 5, 5, 7, NULL, NULL),
(58, 6, 5, 8, NULL, NULL),
(59, 7, 5, 7, NULL, NULL),
(60, 8, 5, 6.75, NULL, NULL),
(61, 9, 5, 7.8, NULL, NULL),
(62, 10, 5, 6, NULL, NULL),
(63, 11, 5, 5.8, NULL, NULL),
(64, 12, 5, 4.75, NULL, NULL),
(65, 13, 5, 4, NULL, NULL),
(66, 1, 6, 8, NULL, NULL),
(67, 2, 6, 6.5, NULL, NULL),
(68, 3, 6, 8, NULL, NULL),
(69, 4, 6, 4.2, NULL, NULL),
(70, 5, 6, 7, NULL, NULL),
(71, 6, 6, 8, NULL, NULL),
(72, 7, 6, 8, NULL, NULL),
(73, 8, 6, 6.75, NULL, NULL),
(74, 9, 6, 7.4, NULL, NULL),
(75, 10, 6, 5.25, NULL, NULL),
(76, 11, 6, 7.2, NULL, NULL),
(77, 12, 6, 7.67, NULL, NULL),
(78, 13, 6, 5, NULL, NULL),
(79, 1, 7, 4.67, NULL, NULL),
(80, 2, 7, 6.5, NULL, NULL),
(81, 3, 7, 8, NULL, NULL),
(82, 4, 7, 8.6, NULL, NULL),
(83, 5, 7, 8, NULL, NULL),
(84, 6, 7, 8, NULL, NULL),
(85, 7, 7, 7.25, NULL, NULL),
(86, 8, 7, 4.75, NULL, NULL),
(87, 9, 7, 8.2, NULL, NULL),
(88, 10, 7, 8.25, NULL, NULL),
(89, 11, 7, 7.2, NULL, NULL),
(90, 12, 7, 8.33, NULL, NULL),
(91, 13, 7, 9, NULL, NULL),
(92, 1, 8, 7, NULL, NULL),
(93, 2, 8, 7.25, NULL, NULL),
(94, 3, 8, 8.25, NULL, NULL),
(95, 4, 8, 9, NULL, NULL),
(96, 5, 8, 8, NULL, NULL),
(97, 6, 8, 9, NULL, NULL),
(98, 7, 8, 7.75, NULL, NULL),
(99, 8, 8, 4, NULL, NULL),
(100, 9, 8, 7.8, NULL, NULL),
(101, 10, 8, 8.75, NULL, NULL),
(102, 11, 8, 8.2, NULL, NULL),
(103, 12, 8, 7, NULL, NULL),
(104, 13, 8, 9, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tools`
--
DROP TABLE IF EXISTS `tools`;
CREATE TABLE `tools` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `average` float DEFAULT NULL,
  `average_users` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tools`
--

INSERT INTO `tools` (`id`, `name`, `average`, `average_users`) VALUES
(1, 'Airtable', 6.04, NULL),
(2, 'Asana', 6.09, 0),
(3, 'Basecamp', 7.47, 0),
(4, 'Correo electrónico', 5.27, 0),
(5, 'Dropbox Paper', 6.38, NULL),
(6, 'Google D', 6.54, 0),
(7, 'Notion', 7.16, 0),
(8, 'Jira', 5.94, 0),
(9, 'Slack', 6.13, 0),
(10, 'Telegram', 5.56, 0),
(11, 'Trello', 6.37, 0),
(12, 'Twist', 6.68, 0),
(13, 'Whatsapp', 4.76, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tool_rating_parameters`
--

--
-- Table structure for table `tool_rating_parameters`
--

DROP TABLE IF EXISTS `tool_rating_parameters`;
CREATE TABLE `tool_rating_parameters` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tool_rating_parameters`
--

INSERT INTO `tool_rating_parameters` (`id`, `name`) VALUES
(1, 'Conversación de calidad'),
(2, 'Management'),
(3, 'Calma/Foco'),
(4, 'Documentación'),
(5, 'Versatilidad'),
(6, 'Colaboración'),
(7, 'Simple'),
(8, 'Accesibilidad');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `rating_parameters_averages`
--
ALTER TABLE `rating_parameters_averages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tools`
--
ALTER TABLE `tools`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tool_rating_parameters`
--
ALTER TABLE `tool_rating_parameters`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;