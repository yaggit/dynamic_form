-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 14, 2024 at 06:27 AM
-- Server version: 8.3.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dynamic_form`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat`
--

DROP TABLE IF EXISTS `chat`;
CREATE TABLE IF NOT EXISTS `chat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` int NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `message` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `chat`
--

INSERT INTO `chat` (`id`, `room_id`, `username`, `message`) VALUES
(6, 445288, '', 'now may ve getting'),
(9, 560823, 'net', 'new msg'),
(10, 560823, 'yag', 'are you sure brother'),
(11, 560823, 'savn', 'send'),
(12, 560823, 'pkt', 'new msg'),
(13, 560823, 'qwert', 'asdasd'),
(14, 560823, 'asdas', 'name in db'),
(15, 560823, 'asdasd', 'now that data is coming'),
(16, 560823, 'from another tab', 'really goof'),
(17, 560823, 'asdasd', 'sticky bottom'),
(18, 560823, 'asdasd', 'asdasdasdasd'),
(19, 560823, 'asd', 'dsfsadf'),
(20, 560823, 'asdasd', 'send message'),
(21, 560823, 'asdasd', 'svn'),
(22, 560823, 'asdas', 'not at all'),
(23, 313519, 'adasd', 'thik he');

-- --------------------------------------------------------

--
-- Table structure for table `forms`
--

DROP TABLE IF EXISTS `forms`;
CREATE TABLE IF NOT EXISTS `forms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `forms`
--

INSERT INTO `forms` (`id`, `user_id`, `title`, `description`, `created_at`) VALUES
(3, 0, 'q data', 'question data console', '2024-04-18 06:02:06'),
(2, 0, 'yagnesh', 'cricket survey form', '2024-04-18 05:29:40'),
(4, 0, 'form val', 'values', '2024-04-18 06:15:12'),
(8, 0, 'Nobis omnis eaque se', 'Voluptatibus ex id ', '2024-04-18 06:57:54'),
(29, 2, 'this is edit with api', 'this is apis', '2024-04-29 10:56:32'),
(28, 2, 'this will be edit form', 'description is set ', '2024-04-29 10:46:13'),
(17, 0, 'Adipisicing quos in ', 'Deserunt quis ad qui', '2024-04-18 07:19:16'),
(18, 2, 'from another device', 'not bad form with error', '2024-04-29 07:10:27'),
(27, 2, 'radio and checkbox', 'desc of radio aand check', '2024-04-29 10:04:11'),
(30, 3, 'Language Form', 'This is form is about language preference', '2024-04-29 11:17:33'),
(35, 3, 'Ducimus quia sint ', 'Laboriosam nulla vi', '2024-05-10 05:55:59'),
(32, 1, 'live user count', 'count', '2024-05-07 03:56:37'),
(33, 10, '123', 'qwertyu', '2024-05-08 05:57:12'),
(34, 11, 'Sint elit expedita', 'Non dolorem recusand', '2024-05-08 06:34:21'),
(36, 3, 'Sunt est dolorem e', 'Et nostrum reprehend', '2024-05-10 05:56:05'),
(37, 3, 'Incidunt adipisci q', 'Corrupti minim reru', '2024-05-10 05:56:09');

-- --------------------------------------------------------

--
-- Table structure for table `form_fields`
--

DROP TABLE IF EXISTS `form_fields`;
CREATE TABLE IF NOT EXISTS `form_fields` (
  `id` int NOT NULL AUTO_INCREMENT,
  `form_id` int NOT NULL,
  `type` enum('text','checkbox','radio','dropdown') NOT NULL,
  `value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `options` text,
  `required` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `form_id` (`form_id`)
) ENGINE=MyISAM AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `form_fields`
--

INSERT INTO `form_fields` (`id`, `form_id`, `type`, `value`, `options`, `required`) VALUES
(1, 0, '', '', NULL, 0),
(2, 18, 'text', 'first que?', NULL, 0),
(3, 18, 'radio', 'seconf que?', NULL, 0),
(4, 18, 'checkbox', 'third que', NULL, 0),
(5, 19, 'radio', 'what is your name', NULL, 0),
(19, 28, 'radio', 'this is with radio', '[\"1 rad\",\"2 rad\"]', 0),
(18, 28, 'text', 'this is local question with text type', '[]', 0),
(11, 23, 'radio', 'sadg', '[\"\"]', 0),
(12, 24, 'text', 'asdf', '[]', 0),
(13, 25, 'text', 'asdfasdf', '[]', 0),
(14, 25, 'radio', 'saawewae', '[]', 0),
(15, 26, 'radio', 'options of radio', '[\"asdasd\",\"asdasd\",\"qweqwe\"]', 0),
(16, 27, 'radio', 'what is radio ', '[\"r1\",\"r2\",\"r3\"]', 0),
(17, 27, 'checkbox', 'what is check', '[\"c1\",\"c2\",\"c3\"]', 0),
(20, 28, 'checkbox', 'this is with check', '[\"unmarked 1\",\"unmarked 2\"]', 0),
(21, 29, 'text', 'this is api1', '[]', 0),
(22, 29, 'radio', 'this is api 2', '[\"rad 1\"]', 0),
(23, 30, 'radio', 'Fav language', '[\"C++\",\"JS\"]', 0),
(24, 30, 'text', 'Hated language?', '[]', 0),
(25, 30, 'checkbox', 'Final question that is not answerable', '[\"not check 1\",\"not check 2\"]', 0),
(26, 31, 'radio', 'Fav language', '[\"C++\",\"JS\"]', 0),
(27, 31, 'text', 'Hated language?', '[]', 0),
(28, 31, 'text', 'third should db edit', '[]', 0),
(29, 32, 'radio', 'what is octa?', '[\"1\",\"8\",\"2\"]', 0),
(30, 32, 'checkbox', 'do you know who?', '[\"qwerty\",\"me\",\"you\"]', 0),
(31, 33, 'radio', 'qweqwe', '[\"asd\",\"asdasd\"]', 0),
(32, 34, 'radio', 'Autem dolor aut non ', '[\"Eligendi accusantium\",\"Similique aute aliqu\"]', 0),
(33, 34, 'checkbox', 'Vel dolore sapiente ', '[\"Inventore lorem sunt\",\"Pariatur Pariatur \"]', 0),
(34, 34, 'text', 'Dolor qui pariatur ', '[]', 0),
(35, 38, 'checkbox', 'Tenetur irure anim c', '[\"Molestiae quaerat eu\",\"\"]', 0),
(36, 38, 'radio', 'Aut id ea dolore odi', '[]', 0);

-- --------------------------------------------------------

--
-- Table structure for table `form_responses`
--

DROP TABLE IF EXISTS `form_responses`;
CREATE TABLE IF NOT EXISTS `form_responses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `form_id` int NOT NULL,
  `user_id` int NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `question_id` int NOT NULL,
  `response_data` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `form_id` (`form_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `form_responses`
--

INSERT INTO `form_responses` (`id`, `form_id`, `user_id`, `user_email`, `question_id`, `response_data`, `created_at`) VALUES
(6, 24, 0, 'none', 1, '{\"0\":\"asdfsdfasdfasf\"}', '2024-04-29 09:31:34'),
(7, 27, 0, 'my name is yagnesh', 1, '{\"0\":\"r3\"}', '2024-04-29 10:04:56'),
(4, 20, 2, 'differentmail@mail.com', 12, 'nothing has been done yet', '2024-04-29 08:32:53'),
(8, 27, 0, 'my name is yagnesh', 2, '{\"1\":true}', '2024-04-29 10:04:56'),
(9, 27, 0, 'y`1', 1, '{\"0\":\"r2\"}', '2024-04-29 10:05:58'),
(10, 27, 0, 'y`1', 2, '{\"1\":true}', '2024-04-29 10:05:58'),
(11, 30, 0, 'harshk@gmail.com', 1, '{\"0\":\"C++\"}', '2024-04-29 11:18:27'),
(13, 30, 0, 'harshk@gmail.com', 3, '{\"2\":true}', '2024-04-29 11:18:27'),
(15, 27, 0, 'yes', 2, '{\"1\":true}', '2024-04-29 12:53:26'),
(16, 27, 0, 'asdas', 1, '{\"0\":\"r1\"}', '2024-04-29 12:58:19'),
(17, 27, 0, 'asdas', 2, '{\"1\":true}', '2024-04-29 12:58:19'),
(22, 30, 0, 'try', 2, '{\"1\":\"noen\"}', '2024-04-29 14:19:19'),
(23, 30, 0, '', 1, '{\"0\":\"JS\"}', '2024-04-29 14:23:25'),
(24, 30, 0, 'asdfasf', 1, '{\"0\":\"C++\"}', '2024-05-07 05:04:12'),
(25, 30, 0, 'asdfasf', 2, '{\"1\":\"asdfasdf\"}', '2024-05-07 05:04:12'),
(26, 30, 0, 'asdfasf', 3, '{\"0\":\"not check 1\"}', '2024-05-07 05:04:12'),
(58, 30, 0, 'Eum magna dolores al', 2, '{\"1\":\"Molestiae laborum N\"}', '2024-05-07 06:44:27'),
(59, 30, 0, 'Eum magna dolores al', 3, '{\"0\":\"not check 1\"}', '2024-05-07 06:44:27'),
(60, 30, 0, 'Cupidatat est quo ci', 1, '{\"0\":\"C++\"}', '2024-05-07 06:44:42'),
(61, 30, 0, 'Cupidatat est quo ci', 2, '{\"1\":\"Incidunt quis dolor\"}', '2024-05-07 06:44:42'),
(62, 30, 0, 'Cupidatat est quo ci', 3, '{\"1\":\"not check 2\"}', '2024-05-07 06:44:42'),
(63, 30, 0, 'Cupidatat est quo ci', 1, '{\"0\":\"C++\"}', '2024-05-07 06:45:13'),
(64, 30, 0, 'Cupidatat est quo ci', 2, '{\"1\":\"Incidunt quis dolor\"}', '2024-05-07 06:45:13'),
(65, 30, 0, 'Cupidatat est quo ci', 3, '{\"1\":\"not check 2\"}', '2024-05-07 06:45:13'),
(86, 30, 0, 'Cupidatat est quo ci', 3, '{\"1\":\"not check 2\"}', '2024-05-07 07:14:17'),
(87, 30, 0, 'Dolorem vel voluptat', 1, '{\"0\":\"JS\"}', '2024-05-08 03:36:18'),
(111, 30, 0, 'Iusto sit cupiditate', 1, '{\"0\":\"C++\"}', '2024-05-08 03:46:55'),
(112, 30, 0, 'Iusto sit cupiditate', 2, '{\"1\":\"Occaecat dignissimos\"}', '2024-05-08 03:46:55'),
(113, 30, 0, 'Iusto sit cupiditate', 3, '{\"1\":\"not check 2\"}', '2024-05-08 03:46:55');

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
CREATE TABLE IF NOT EXISTS `room` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `room_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `room`
--

INSERT INTO `room` (`id`, `user_id`, `room_id`, `name`) VALUES
(1, 0, 560823, 'room1'),
(2, 0, 117515, 'room2'),
(3, 0, 399454, 'pankaj'),
(4, 0, 760788, 'new room'),
(5, 0, 689971, 'new rrom'),
(6, 0, 554152, 'again new one'),
(7, 0, 445288, 'ka kare ab'),
(8, 0, 588176, 'yagnesh'),
(9, 1, 943612, 'new'),
(10, 1, 584802, 'spam1'),
(11, 1, 936144, 'spam2'),
(12, 1, 751317, 'spam3'),
(13, 1, 481236, 'spam4'),
(14, 10, 366910, 'i have no idea'),
(15, 10, 313519, 'i have no idea'),
(16, 10, 284327, 'asdf'),
(17, 10, 49911, 'asdf');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `login_type` enum('login_form','google','','') NOT NULL,
  `profile_pic` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `login_type`, `profile_pic`) VALUES
(1, 'Yagnesh', 'mail@mail.com', '$2b$10$4tkSLvBrUh7lUuKlAgqfgOSJzNNKtSM1XXhTnjYzKMtJMF4bt/CSK', 'login_form', '/public/assets/1713411930785.jfif'),
(2, 'yagnesh', 'yagnesh@mail.com', '$2b$10$A5X.W42Zxu9OL20pxSLGQ.m9xzTGN.bwdaYDHglRhI2GTrSfDre7u', 'login_form', '/public/assets/1714374512261.jfif'),
(3, 'Harsh', 'K', '$2b$10$qA6dQj7RpgfwWTBL/lZ.aeggCGrgOQhJhWo1aJzEKesNpxBGJVX2K', 'login_form', '/public/assets/1714389283221.jfif'),
(13, 'not', 'not', '$2b$10$9QH3CqPv8PI8eLwU1KCpAOEU4ha6QAnWSPB2TlNL5h38VJJjgZat2', 'login_form', '/public/assets/1715150677818.jfif'),
(22, 'Yagnesh Patoriya', 'ypatoriya.netclues@gmail.com', '', 'google', 'https://lh3.googleusercontent.com/a/ACg8ocLdf6u7cMos-7TEylW5YQHvpnc4_xOM_GiPMmnG8uJd_mYAFw=s96-c');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
