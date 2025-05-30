CREATE DATABASE  IF NOT EXISTS `apartmentdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `apartmentdb`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: apartmentdb
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `chatmessage`
--

DROP TABLE IF EXISTS `chatmessage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chatmessage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int DEFAULT NULL,
  `receiver_id` int DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `sent_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`),
  CONSTRAINT `chatmessage_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`),
  CONSTRAINT `chatmessage_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chatmessage`
--

LOCK TABLES `chatmessage` WRITE;
/*!40000 ALTER TABLE `chatmessage` DISABLE KEYS */;
/*!40000 ALTER TABLE `chatmessage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice`
--

DROP TABLE IF EXISTS `invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `amount` decimal(12,2) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` enum('PAID','UNPAID') COLLATE utf8mb4_unicode_ci DEFAULT 'UNPAID',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `invoice_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice`
--

LOCK TABLES `invoice` WRITE;
/*!40000 ALTER TABLE `invoice` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locker`
--

DROP TABLE IF EXISTS `locker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locker` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `item_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `received_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` enum('PENDING','RECEIVED') COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `locker_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locker`
--

LOCK TABLES `locker` WRITE;
/*!40000 ALTER TABLE `locker` DISABLE KEYS */;
INSERT INTO `locker` VALUES (3,10,'quần bò','2025-05-17 18:44:24','RECEIVED'),(4,17,'quần bò','2025-05-17 20:38:34','RECEIVED'),(5,18,'Quan bo','2025-05-17 21:27:00','PENDING'),(6,19,'quan bo','2025-05-17 21:30:59','PENDING'),(7,10,'quan tat','2025-05-22 18:38:29','RECEIVED'),(8,24,'quần bò','2025-05-26 18:47:07','RECEIVED'),(9,25,'quan tat','2025-05-26 22:59:56','RECEIVED'),(10,25,'Áo','2025-05-30 18:10:58','RECEIVED');
/*!40000 ALTER TABLE `locker` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `method` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_date` timestamp NULL DEFAULT NULL,
  `transaction_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_code` (`transaction_code`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (11,10,200000.00,'APPROVED','','2025-05-25 13:42:37','1748180542934'),(12,12,520000.00,'PENDING','','2025-05-25 13:46:24','1748180758873'),(13,12,330000.00,'PENDING','VNPay','2025-05-25 13:51:21','1748181058564'),(14,24,330000.00,'APPROVED','VNPay','2025-05-26 11:47:54','1748260065062'),(15,25,330000.00,'APPROVED','VNPay','2025-05-26 16:00:29','1748275223762'),(16,10,330000.00,'APPROVED','VNPay','2025-05-29 06:50:02','1748501395104'),(17,10,330000.00,'APPROVED','VNPay','2025-05-30 04:26:34','1748579188409'),(18,15,330000.00,'PENDING','VNPay','2025-05-30 07:59:05','1748591940936'),(19,26,200000.00,'APPROVED','VNPay','2025-05-30 11:16:54','1748603790748');
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_item`
--

DROP TABLE IF EXISTS `payment_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `payment_id` int NOT NULL,
  `fee_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `payment_id` (`payment_id`),
  CONSTRAINT `payment_item_ibfk_1` FOREIGN KEY (`payment_id`) REFERENCES `payment` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_item`
--

LOCK TABLES `payment_item` WRITE;
/*!40000 ALTER TABLE `payment_item` DISABLE KEYS */;
INSERT INTO `payment_item` VALUES (16,11,'tiền điện',200000.00),(17,12,'tiền điện',210000.00),(18,12,'tiền nước',310000.00),(19,13,'tiền điện',110000.00),(20,13,'tiền nước',220000.00),(21,14,'tiền điện',110000.00),(22,14,'tiền nước',220000.00),(23,15,'tiền điện',110000.00),(24,15,'tiền nước',220000.00),(25,16,'tiền điện',110000.00),(26,16,'tiền nước',220000.00),(27,17,'tiền điện',110000.00),(28,17,'tiền nước',220000.00),(29,18,'tiền điện',110000.00),(30,18,'tiền nước',220000.00),(31,19,'tiền điện',200000.00);
/*!40000 ALTER TABLE `payment_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_prove`
--

DROP TABLE IF EXISTS `payment_prove`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_prove` (
  `id` int NOT NULL AUTO_INCREMENT,
  `transaction_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `proof_image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `submitted_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `payment_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_payment_prove_payment` (`payment_id`),
  CONSTRAINT `fk_payment_prove_payment` FOREIGN KEY (`payment_id`) REFERENCES `payment` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_prove`
--

LOCK TABLES `payment_prove` WRITE;
/*!40000 ALTER TABLE `payment_prove` DISABLE KEYS */;
INSERT INTO `payment_prove` VALUES (1,'1748579188409','https://res.cloudinary.com/dxtrdrgwz/image/upload/v1748589460/kpync3bjuwjm2tprwnue.jpg','2025-05-30 14:17:43',17);
/*!40000 ALTER TABLE `payment_prove` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `survey`
--

DROP TABLE IF EXISTS `survey`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `survey` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `survey`
--

LOCK TABLES `survey` WRITE;
/*!40000 ALTER TABLE `survey` DISABLE KEYS */;
INSERT INTO `survey` VALUES (11,'khảo sát đợt 7','123','2025-05-28 15:52:14');
/*!40000 ALTER TABLE `survey` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `survey_answer`
--

DROP TABLE IF EXISTS `survey_answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `survey_answer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `survey_id` int DEFAULT NULL,
  `question_id` int DEFAULT NULL,
  `option_id` int DEFAULT NULL,
  `answered_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_answer_user` (`user_id`),
  KEY `fk_answer_option` (`option_id`),
  KEY `idx_survey_user` (`survey_id`,`user_id`),
  KEY `idx_question_option` (`question_id`,`option_id`),
  CONSTRAINT `fk_answer_option` FOREIGN KEY (`option_id`) REFERENCES `survey_option` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_answer_question` FOREIGN KEY (`question_id`) REFERENCES `survey_question` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_answer_survey` FOREIGN KEY (`survey_id`) REFERENCES `survey` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_answer_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `survey_answer`
--

LOCK TABLES `survey_answer` WRITE;
/*!40000 ALTER TABLE `survey_answer` DISABLE KEYS */;
INSERT INTO `survey_answer` VALUES (2,24,11,11,14,'2025-05-28 18:07:16'),(3,24,11,12,18,'2025-05-28 18:07:16'),(4,12,11,11,17,'2025-05-28 18:07:56'),(5,12,11,12,21,'2025-05-28 18:07:56'),(6,10,11,11,14,'2025-05-29 14:22:24'),(7,10,11,12,18,'2025-05-29 14:22:24');
/*!40000 ALTER TABLE `survey_answer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `survey_option`
--

DROP TABLE IF EXISTS `survey_option`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `survey_option` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question_id` int DEFAULT NULL,
  `option_text` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `question_id` (`question_id`),
  CONSTRAINT `survey_option_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `survey_question` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `survey_option`
--

LOCK TABLES `survey_option` WRITE;
/*!40000 ALTER TABLE `survey_option` DISABLE KEYS */;
INSERT INTO `survey_option` VALUES (14,11,'Tốt'),(15,11,'Khá'),(16,11,'Trung bình'),(17,11,'Kém'),(18,12,'Tốt'),(19,12,'Khá'),(20,12,'Trung bình'),(21,12,'Kém');
/*!40000 ALTER TABLE `survey_option` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `survey_question`
--

DROP TABLE IF EXISTS `survey_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `survey_question` (
  `id` int NOT NULL AUTO_INCREMENT,
  `survey_id` int DEFAULT NULL,
  `question_text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `survey_id` (`survey_id`),
  CONSTRAINT `survey_question_ibfk_1` FOREIGN KEY (`survey_id`) REFERENCES `survey` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `survey_question`
--

LOCK TABLES `survey_question` WRITE;
/*!40000 ALTER TABLE `survey_question` DISABLE KEYS */;
INSERT INTO `survey_question` VALUES (11,11,'Cơ sở vật chất có đủ chất lượng?'),(12,11,'Dịch vụ có đáp ứng yêu cầu?');
/*!40000 ALTER TABLE `survey_question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `password` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('ADMIN','RESIDENT') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'RESIDENT',
  `active` tinyint(1) DEFAULT '1',
  `password_changed` tinyint(1) NOT NULL DEFAULT '0',
  `avatar_uploaded` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (10,'trung2','le','a@gmail.com','123456789','resident11','$2a$10$7J8H/iOmInD9JIYfmHBhZucheYVSLJB9JzcjMzGOAJfVeBM5gDyR.','https://res.cloudinary.com/dxtrdrgwz/image/upload/v1747384148/wenbptzfbhy5g1sv7nhz.jpg','RESIDENT',1,1,1),(12,'a','a','b@gmail.com','123','resident13','$2a$10$3nagATaI9x.RWHsG21QXAe7eNthjfDgO41NaQEhoQJ0dzQ2CCLgiW','https://res.cloudinary.com/dxtrdrgwz/image/upload/v1747391828/hdw5s6zvblwsf1dguu5d.png','RESIDENT',1,1,1),(14,'trung','le','aiconcha123@gmail.com','0363546978','admin','$2a$10$q1FJAjk/KbLr7/jLgoOcBON8wcCsR10vc8hfxGOYbNfr3mqv6Axsu','https://res.cloudinary.com/dxtrdrgwz/image/upload/v1747405772/ddd1fgl1rehnhzwsheqb.png','ADMIN',1,1,1),(15,'ca','c','c@gmail.com','123456789','resident14','$2a$10$4bRDISfv2MASlhWP4WDnPePaaBKN.8yAakED/Ii3sQtAuIzMKavs.','https://res.cloudinary.com/dxtrdrgwz/image/upload/v1747461913/nwfkr9qryqakrjogobko.png','RESIDENT',1,0,0),(16,'d','d','d@gmail.com','123','resident15','$2a$10$9wwxEOjciiM8BMPI3qACXeYGF17zU30nb.6v.rIatEDuR5xwsVa5i','https://res.cloudinary.com/dxtrdrgwz/image/upload/v1747319915/q4krrtxjsfcjnx21joxh.png','RESIDENT',1,0,0),(17,'le','trung','e@gmail.com','123456789','abc123','$2a$10$0Yzx4CLdRh0qsXY78mcDjejuLRGnmGa23awm9LKLy2QL8X4zFweqi','https://res.cloudinary.com/dxtrdrgwz/image/upload/v1747489006/cakzi6heqjwxhg1wfpgy.jpg','RESIDENT',1,1,1),(18,'Nguyen','Trang','trang@gmail.com','123456789','Trang','$2a$10$SgjvcEW.qCR.WII01gBel.ncQRM9GEwIo0e4AJ9A5lapzYIvNG/ga','https://res.cloudinary.com/dxtrdrgwz/image/upload/v1747491986/depv17nhzhxgtzizg32q.png','RESIDENT',1,1,1),(19,'nguyen','trang','trang2@gmail.com','123','Trang2','$2a$10$9vS5vsIUbS5bF01lzhDIK.OlglAF90wGhwfmt4gHt30H84VQyr032','https://res.cloudinary.com/dxtrdrgwz/image/upload/v1747492215/zg9phsc3rvybjswddk0e.png','RESIDENT',1,1,1),(21,'trung','le','f@gmail.com','0363546978','resident20','$2a$10$JWfUP4N7rccIP.enmhsHe.VFhJNj6HjWL3ol9ssTam69ZGRT8sVXS','https://res.cloudinary.com/dxtrdrgwz/image/upload/v1747911778/piom73t80vdbauorcsyc.jpg','RESIDENT',1,0,0),(24,'trung','le','aa@gmail.com','0363546978','resident12','$2a$10$MVlokDh6As9UUE6k62ZWguDD/WNVanGBczHEbJQrWE1eNWcPwjLTO','https://res.cloudinary.com/dxtrdrgwz/image/upload/v1748259941/u4gj5ypnymoh2xlwc9ra.jpg','RESIDENT',1,1,1),(25,'trung','le','bb@gmail.com','0363546978','resident1','$2a$10$i4URVID3NHke56nJy3DL4eSeV3rv.JLwKIuCDT4kdYnv30Rj.wPjC','https://res.cloudinary.com/dxtrdrgwz/image/upload/v1748275152/oi9smavenhzqpcaz9e2y.png','RESIDENT',1,1,1),(26,'Nguyen','Van B','abc12@gmail.com','01234567891','resident16','$2a$10$NyXUJCDFIuQD4ZvoQEqEVuUJC7lBsrm5uI7A7gLGRu/vS6Yd7p/m2','https://res.cloudinary.com/dxtrdrgwz/image/upload/v1748603376/ivilzlfuw1b5qfoglqjr.png','RESIDENT',1,1,1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visitorcard`
--

DROP TABLE IF EXISTS `visitorcard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visitorcard` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `relationship` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registered_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `visitorcard_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visitorcard`
--

LOCK TABLES `visitorcard` WRITE;
/*!40000 ALTER TABLE `visitorcard` DISABLE KEYS */;
/*!40000 ALTER TABLE `visitorcard` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-31  0:37:59
