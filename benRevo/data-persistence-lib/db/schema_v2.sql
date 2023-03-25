-- DROP DATABASE `br_dev`;

-- CREATE DATABASE  IF NOT EXISTS `br_dev` /*!40100 DEFAULT CHARACTER SET latin1 */;
-- USE `br_dev`;
-- MySQL dump 10.13  Distrib 5.7.9, for osx10.9 (x86_64)
--
-- Host: localhost    Database: br_dev
-- ------------------------------------------------------
-- Server version	5.7.9

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `benefit`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `benefit` (
  `benefit_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `benefit_name_id` bigint(20) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `format` varchar(255) DEFAULT NULL,
  `in_out_network` varchar(255) DEFAULT NULL,
  `plan_id` bigint(20) DEFAULT NULL,
  `restriction` varchar(255) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `value` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`benefit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `benefit_name`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `benefit_name` (
  `benefit_name_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created` datetime DEFAULT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`benefit_name_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `broker`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `broker` (
  `broker_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `broker_token` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `presale_email` varchar(255) DEFAULT NULL,
  `presale_first_name` varchar(255) DEFAULT NULL,
  `presale_last_name` varchar(255) DEFAULT NULL,
  `sales_email` varchar(255) DEFAULT NULL,
  `sales_first_name` varchar(255) DEFAULT NULL,
  `sales_last_name` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zip` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`broker_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `carrier`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `carrier` (
  `carrier_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `display_name` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`carrier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `client`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client` (
  `client_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `broker_id` bigint(20) NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `address2` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zip` varchar(255) DEFAULT NULL,
  `business_type` varchar(255) DEFAULT NULL,
  `sic_code` varchar(255) DEFAULT NULL,
  `employee_count` bigint(20) DEFAULT NULL,
  `participating_employees` bigint(20) DEFAULT NULL,
  `members_count` int(11) DEFAULT NULL,
  `retirees_count` int(11) DEFAULT NULL,
  `minimum_hours` bigint(20) DEFAULT NULL,
  `effective_date` datetime DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  `domestic_partner` varchar(255) DEFAULT NULL,
  `out_to_bid_reason` varchar(255) DEFAULT NULL,
  `client_state` varchar(255) DEFAULT NULL,
  `contact_address` varchar(255) DEFAULT NULL,
  `contact_city` varchar(255) DEFAULT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_fax` varchar(255) DEFAULT NULL,
  `contact_name` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(255) DEFAULT NULL,
  `contact_state` varchar(255) DEFAULT NULL,
  `contact_title` varchar(255) DEFAULT NULL,
  `contact_zip` varchar(255) DEFAULT NULL,
  `date_questionnaire_completed` datetime DEFAULT NULL,
  `fed_tax_id` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `org_type` varchar(255) DEFAULT NULL,
  `policy_number` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `last_visited` datetime DEFAULT NULL,
  PRIMARY KEY (`client_id`),
  KEY `FK9eqalf16wybarm22yus991h6y` (`broker_id`),
  CONSTRAINT `FK9eqalf16wybarm22yus991h6y` FOREIGN KEY (`broker_id`) REFERENCES `broker` (`broker_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `client_client_team_list`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client_client_team_list` (
  `client_client_id` bigint(20) NOT NULL,
  `client_team_list_id` bigint(20) NOT NULL,
  UNIQUE KEY `UK_nksee5d3q6ie9i7qh8v9lx6i1` (`client_team_list_id`),
  KEY `FKot2rasobooqq3fbgnts8lxrmh` (`client_client_id`),
  CONSTRAINT `FKk8k45xdo8j8qp0quw9wnthp45` FOREIGN KEY (`client_team_list_id`) REFERENCES `client_team` (`id`),
  CONSTRAINT `FKot2rasobooqq3fbgnts8lxrmh` FOREIGN KEY (`client_client_id`) REFERENCES `client` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `client_file_upload`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client_file_upload` (
  `client_file_upload_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `rfp_id` bigint(20) DEFAULT NULL,
  `s3_key` varchar(255) DEFAULT NULL,
  `mime_type` VARCHAR(60) NULL DEFAULT NULL,
  `section` VARCHAR(45) NULL DEFAULT NULL,
  `deleted` bit(1) NOT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`client_file_upload_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `client_plan`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client_plan` (
  `client_plan_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `er_contribution_format` varchar(255) DEFAULT NULL,
  `tier1_census` bigint(20) DEFAULT NULL,
  `tier1_er_contribution` float DEFAULT NULL,
  `tier1_rate` float DEFAULT NULL,
  `tier1_renewal` float DEFAULT NULL,
  `tier2_census` bigint(20) DEFAULT NULL,
  `tier2_er_contribution` float DEFAULT NULL,
  `tier2_rate` float DEFAULT NULL,
  `tier2_renewal` float DEFAULT NULL,
  `tier3_census` bigint(20) DEFAULT NULL,
  `tier3_er_contribution` float DEFAULT NULL,
  `tier3_rate` float DEFAULT NULL,
  `tier3_renewal` float DEFAULT NULL,
  `tier4_census` bigint(20) DEFAULT NULL,
  `tier4_er_contribution` float DEFAULT NULL,
  `tier4_rate` float DEFAULT NULL,
  `tier4_renewal` float DEFAULT NULL,
  `client_id` bigint(20) NOT NULL,
  `pnn_id` bigint(20) NOT NULL,
  PRIMARY KEY (`client_plan_id`),
  KEY `FKjm05cguoxy3ys4jp78hdcuexk` (`client_id`),
  KEY `FKa12s9jueftpchjwu8d87si17g` (`pnn_id`),
  CONSTRAINT `FKa12s9jueftpchjwu8d87si17g` FOREIGN KEY (`pnn_id`) REFERENCES `plan_name_by_network` (`pnn_id`),
  CONSTRAINT `FKjm05cguoxy3ys4jp78hdcuexk` FOREIGN KEY (`client_id`) REFERENCES `client` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `client_team`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client_team` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `auth_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `broker_id` bigint(20) NOT NULL,
  `client_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKdbi4owvt47djr7nri4cy88n60` (`broker_id`),
  KEY `FKp5err39u625h1m8c9tylbupmf` (`client_id`),
  CONSTRAINT `FKdbi4owvt47djr7nri4cy88n60` FOREIGN KEY (`broker_id`) REFERENCES `broker` (`broker_id`),
  CONSTRAINT `FKp5err39u625h1m8c9tylbupmf` FOREIGN KEY (`client_id`) REFERENCES `client` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `network`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `network` (
  `network_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created` datetime DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `tier` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `carrier_id` bigint(20) NOT NULL,
  PRIMARY KEY (`network_id`),
  KEY `FKlw14drldya5ncb9gbaj2wv225` (`carrier_id`),
  CONSTRAINT `FKlw14drldya5ncb9gbaj2wv225` FOREIGN KEY (`carrier_id`) REFERENCES `carrier` (`carrier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `options`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `options` (
  `rfp_id` bigint(20) NOT NULL,
  `option_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `plan_type` varchar(255) DEFAULT NULL,
  `label` varchar(255) DEFAULT NULL,
  `tier1_contribution` double DEFAULT NULL,
  `tier2_contribution` double DEFAULT NULL,
  `tier3_contribution` double DEFAULT NULL,
  `tier4_contribution` double DEFAULT NULL,
  `tier1_rate` double DEFAULT NULL,
  `tier2_rate` double DEFAULT NULL,
  `tier3_rate` double DEFAULT NULL,
  `tier4_rate` double DEFAULT NULL,
  `tier1_renewal` double DEFAULT NULL,
  `tier2_renewal` double DEFAULT NULL,
  `tier3_renewal` double DEFAULT NULL,
  `tier4_renewal` double DEFAULT NULL,
  `out_of_state_contribution` bit(1) DEFAULT NULL,
  `out_of_state_rate` bit(1) DEFAULT NULL,
  `out_of_state_renewal` bit(1) DEFAULT NULL,
  `tier1_oos_contribution` double DEFAULT NULL,
  `tier2_oos_contribution` double DEFAULT NULL,
  `tier3_oos_contribution` double DEFAULT NULL,
  `tier4_oos_contribution` double DEFAULT NULL,
  `tier1_oos_rate` double DEFAULT NULL,
  `tier2_oos_rate` double DEFAULT NULL,
  `tier3_oos_rate` double DEFAULT NULL,
  `tier4_oos_rate` double DEFAULT NULL,
  `tier1_oos_renewal` double DEFAULT NULL,
  `tier2_oos_renewal` double DEFAULT NULL,
  `tier3_oos_renewal` double DEFAULT NULL,
  `tier4_oos_renewal` double DEFAULT NULL,
  `match_current` bit(1) DEFAULT NULL,
  `quote_alt` bit(1) DEFAULT NULL,
  `alt_request` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`option_id`),
  KEY `FKeoplpi3ra6btiv2tpi52awg8j` (`rfp_id`),
  CONSTRAINT `FKeoplpi3ra6btiv2tpi52awg8j` FOREIGN KEY (`rfp_id`) REFERENCES `rfp` (`rfp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `plan`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plan` (
  `plan_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created` datetime DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `plan_type` varchar(255) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `carrier_id` bigint(20) NOT NULL,
  PRIMARY KEY (`plan_id`),
  KEY `FKiw1vl2h6if9q30oipjquya4pi` (`carrier_id`),
  CONSTRAINT `FKiw1vl2h6if9q30oipjquya4pi` FOREIGN KEY (`carrier_id`) REFERENCES `carrier` (`carrier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `plan_name_by_network`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plan_name_by_network` (
  `pnn_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cost` bigint(20) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `plan_type` varchar(255) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `network_id` bigint(20) NOT NULL,
  `plan_id` bigint(20) NOT NULL,
  PRIMARY KEY (`pnn_id`),
  KEY `FKpc2vb8o7ot3gdfh8abr7ntl9u` (`network_id`),
  KEY `FKbwj1ikb8ux190avste712eq2b` (`plan_id`),
  CONSTRAINT `FKbwj1ikb8ux190avste712eq2b` FOREIGN KEY (`plan_id`) REFERENCES `plan` (`plan_id`),
  CONSTRAINT `FKpc2vb8o7ot3gdfh8abr7ntl9u` FOREIGN KEY (`network_id`) REFERENCES `network` (`network_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rfp`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rfp` (
  `rfp_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `alongside` bit(1) DEFAULT NULL,
  `buy_up` bit(1) DEFAULT NULL,
  `comments` varchar(5000) DEFAULT NULL,
  `commission` varchar(255) DEFAULT NULL,
  `contribution_type` VARCHAR(45) DEFAULT NULL,
  `option_count` int(11) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `prior_carrier` bit(1) DEFAULT NULL,
  `product` varchar(255) DEFAULT NULL,
  `quote_alte_tiers` int(11) DEFAULT NULL,
  `rating_tiers` int(11) DEFAULT NULL,
  `self_funding` bit(1) DEFAULT NULL,
  `take_over` bit(1) DEFAULT NULL,
  `client_id` bigint(20) DEFAULT NULL,
  `waiting_period` varchar(25) DEFAULT NULL,
  `large_claims` varchar(5000) DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  PRIMARY KEY (`rfp_id`),
  KEY `FKmkpy7yh39mushfgxeucvrwiiw` (`client_id`),
  CONSTRAINT `FKmkpy7yh39mushfgxeucvrwiiw` FOREIGN KEY (`client_id`) REFERENCES `client` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rfp_carrier`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rfp_carrier` (
  `rfp_carrier_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `category` varchar(255) DEFAULT NULL,
  `endpoint` varchar(255) DEFAULT NULL,
  `carrier_id` bigint(20) NOT NULL,
  PRIMARY KEY (`rfp_carrier_id`),
  KEY `FKqjwdfw33kfp0ygu7f3w335nv4` (`carrier_id`),
  CONSTRAINT `FKqjwdfw33kfp0ygu7f3w335nv4` FOREIGN KEY (`carrier_id`) REFERENCES `carrier` (`carrier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rfp_quote`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rfp_quote` (
  `rfp_quote_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `rfp_submission_id` bigint(20) NOT NULL,
  `rfp_quote_version_id` bigint(20) NOT NULL,
  `kaiser` bit(1) DEFAULT NULL,
  PRIMARY KEY (`rfp_quote_id`),
  KEY `FKb3tijdsx5vuafuykj4gdmlv0h` (`rfp_submission_id`),
  CONSTRAINT `FKb3tijdsx5vuafuykj4gdmlv0h` FOREIGN KEY (`rfp_submission_id`) REFERENCES `rfp_submission` (`rfp_submission_id`),
  CONSTRAINT `FKb3tijdsx5vuafuykj4gdmlv3h` FOREIGN KEY (`rfp_quote_version_id`) REFERENCES `rfp_quote_version` (`rfp_quote_version_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rfp_quote_version` (
  `rfp_quote_version_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `rfp_submission_id` bigint(20) NOT NULL,
  PRIMARY KEY (`rfp_quote_version_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rfp_quote_network`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rfp_quote_network` (
  `rfp_quote_network_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `a_la_carte` bit(1) DEFAULT NULL,
  `rfp_quote_option_name` varchar(255) DEFAULT NULL,
  `network_id` bigint(20) NOT NULL,
  `rfp_quote_id` bigint(20) NOT NULL,
  `rfp_quote_version_id` bigint(20) NOT NULL,
  PRIMARY KEY (`rfp_quote_network_id`),
  KEY `FKqkmcupt0tni8nf6838i0l7uio` (`network_id`),
  KEY `FKngu6gmixmhtvinvgilsij038j` (`rfp_quote_id`),
  CONSTRAINT `FKngu6gmixmhtvinvgilsij038j` FOREIGN KEY (`rfp_quote_id`) REFERENCES `rfp_quote` (`rfp_quote_id`),
  CONSTRAINT `FKqkmcupt0tni8nf6838i0l7uio` FOREIGN KEY (`network_id`) REFERENCES `network` (`network_id`),
  CONSTRAINT `FKb3tijdsx5vuafuykj4gdmlv4h` FOREIGN KEY (`rfp_quote_version_id`) REFERENCES `rfp_quote_version` (`rfp_quote_version_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rfp_quote_network_plan`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rfp_quote_network_plan` (
  `rfp_quote_network_plan_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `match_plan` bit(1) DEFAULT NULL,
  `tier1_rate` float DEFAULT NULL,
  `tier2_rate` float DEFAULT NULL,
  `tier3_rate` float DEFAULT NULL,
  `tier4_rate` float DEFAULT NULL,
  `pnn_id` bigint(20) NOT NULL,
  `rfp_quote_network_id` bigint(20) NOT NULL,
  `rfp_quote_version_id` bigint(20) NOT NULL,
  PRIMARY KEY (`rfp_quote_network_plan_id`),
  KEY `FKbha7em0wrq77i17qyuy1o7aun` (`pnn_id`),
  KEY `FK2hjorn9amv9wu1h9pboufegqm` (`rfp_quote_network_id`),
  CONSTRAINT `FK2hjorn9amv9wu1h9pboufegqm` FOREIGN KEY (`rfp_quote_network_id`) REFERENCES `rfp_quote_network` (`rfp_quote_network_id`),
  CONSTRAINT `FKbha7em0wrq77i17qyuy1o7aun` FOREIGN KEY (`pnn_id`) REFERENCES `plan_name_by_network` (`pnn_id`),
  CONSTRAINT `FKb3tijdsx5vuafuykj4gdmlv5h` FOREIGN KEY (`rfp_quote_version_id`) REFERENCES `rfp_quote_version` (`rfp_quote_version_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rfp_quote_option`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rfp_quote_option` (
  `rfp_quote_option_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `matches_orig_rfp_option` bit(1) DEFAULT NULL,
  `rfp_quote_option_name` varchar(255) DEFAULT NULL,
  `rfp_quote_id` bigint(20) NOT NULL,
  `rfp_quote_version_id` bigint(20) NOT NULL,
  `final_selection` BIT(1) NOT NULL COMMENT 'Include option in final selected',
  PRIMARY KEY (`rfp_quote_option_id`),
  KEY `FK8g43ap04i1ikfg29omdf47qpi` (`rfp_quote_id`),
  CONSTRAINT `FK8g43ap04i1ikfg29omdf47qpi` FOREIGN KEY (`rfp_quote_id`) REFERENCES `rfp_quote` (`rfp_quote_id`),
  CONSTRAINT `FKb3tijdsx5vuafuykj4gdmlv6h` FOREIGN KEY (`rfp_quote_version_id`) REFERENCES `rfp_quote_version` (`rfp_quote_version_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rfp_quote_option_network`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rfp_quote_option_network` (
  `rfp_quote_option_network_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `er_contribution_format` varchar(255) DEFAULT NULL,
  `tier1_census` bigint(20) DEFAULT NULL,
  `tier1_er_contribution` float DEFAULT NULL,
  `tier2_census` bigint(20) DEFAULT NULL,
  `tier2_er_contribution` float DEFAULT NULL,
  `tier3_census` bigint(20) DEFAULT NULL,
  `tier3_er_contribution` float DEFAULT NULL,
  `tier4_census` bigint(20) DEFAULT NULL,
  `tier4_er_contribution` float DEFAULT NULL,
  `client_plan_id` bigint(20) DEFAULT NULL,
  `rfp_quote_network_id` bigint(20) NOT NULL,
  `rfp_quote_option_id` bigint(20) NOT NULL,
  `rfp_quote_version_id` bigint(20) NOT NULL,
  `selected_quote_network_plan_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`rfp_quote_option_network_id`),
  KEY `FKra7hembrpxiv2kjfyv38s2vmk` (`client_plan_id`),
  KEY `FKqvhimffmkjkomtjuw4woyil1p` (`rfp_quote_network_id`),
  KEY `FKp5hysrhbq7d88ew29hw94idvv` (`rfp_quote_option_id`),
  KEY `FK60ccsofgs3gw891tg4h7caiwp` (`selected_quote_network_plan_id`),
  CONSTRAINT `FK60ccsofgs3gw891tg4h7caiwp` FOREIGN KEY (`selected_quote_network_plan_id`) REFERENCES `rfp_quote_network_plan` (`rfp_quote_network_plan_id`),
  CONSTRAINT `FKp5hysrhbq7d88ew29hw94idvv` FOREIGN KEY (`rfp_quote_option_id`) REFERENCES `rfp_quote_option` (`rfp_quote_option_id`),
  CONSTRAINT `FKqvhimffmkjkomtjuw4woyil1p` FOREIGN KEY (`rfp_quote_network_id`) REFERENCES `rfp_quote_network` (`rfp_quote_network_id`),
  CONSTRAINT `FKra7hembrpxiv2kjfyv38s2vmk` FOREIGN KEY (`client_plan_id`) REFERENCES `client_plan` (`client_plan_id`),
  CONSTRAINT `FKb3tijdsx5vuafuykj4gdmlv7h` FOREIGN KEY (`rfp_quote_version_id`) REFERENCES `rfp_quote_version` (`rfp_quote_version_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rfp_status`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rfp_status` (
  `rfp_status_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `client_id` bigint(20) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `rfp_carrier_id` bigint(20) NOT NULL,
  PRIMARY KEY (`rfp_status_id`),
  KEY `FKrgj3rodw5nfg6l13dlgu7xuql` (`rfp_carrier_id`),
  CONSTRAINT `FKrgj3rodw5nfg6l13dlgu7xuql` FOREIGN KEY (`rfp_carrier_id`) REFERENCES `rfp_carrier` (`rfp_carrier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rfp_submission`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rfp_submission` (
  `rfp_submission_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created` datetime DEFAULT NULL,
  `request_json` longblob,
  `rfp_carrier_id` bigint(20) DEFAULT NULL,
  `salesforce_id` varchar(255) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `client_id` bigint(20) NOT NULL,
  PRIMARY KEY (`rfp_submission_id`),
  KEY `FKo5ghi4jqx2m9vlqeo3jeglpyw` (`client_id`),
  CONSTRAINT `FKo5ghi4jqx2m9vlqeo3jeglpyw` FOREIGN KEY (`client_id`) REFERENCES `client` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `timeline`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `timeline` (
  `timeline_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `assignee` varchar(255) DEFAULT NULL,
  `carrier_id` bigint(20) DEFAULT NULL,
  `client_id` bigint(20) DEFAULT NULL,
  `completed` bit(1) DEFAULT NULL,
  `completed_time` datetime DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `milestone` varchar(255) DEFAULT NULL,
  `projected_time` datetime DEFAULT NULL,
  `ref_num` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`timeline_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `active` bit(1) DEFAULT NULL,
  `admin` bit(1) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `notified` bit(1) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `verified` bit(1) DEFAULT NULL,
  `broker_id` bigint(20) NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `FKfmjlkbu9u3po8x1bnutuotr94` (`broker_id`),
  CONSTRAINT `FKfmjlkbu9u3po8x1bnutuotr94` FOREIGN KEY (`broker_id`) REFERENCES `broker` (`broker_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `form`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;

CREATE TABLE `form` (
  `form_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `carrier_id` bigint(20) NOT NULL,
  PRIMARY KEY (`form_id`),
  FOREIGN KEY (`carrier_id`) REFERENCES `carrier` (`carrier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `question`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `question` (
  `question_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `multiselectable` bit(1) NOT NULL,
  PRIMARY KEY (`question_id`),
  UNIQUE KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `answer`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `answer` (
  `answer_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `value` varchar(255) NOT NULL,
  `client_id` bigint(20) NOT NULL,
  `question_id` bigint(20) NOT NULL,
  PRIMARY KEY (`answer_id`),
  FOREIGN KEY (`client_id`) REFERENCES `client` (`client_id`),
  FOREIGN KEY (`question_id`) REFERENCES `question` (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `variant`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `variant` (
  `variant_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `number` INT(11) NOT NULL,
  `option` VARCHAR(255) NOT NULL,
  `question_id` bigint(20) NOT NULL,
  PRIMARY KEY (`variant_id`),
  FOREIGN KEY (`question_id`) REFERENCES `question` (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `form_question`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `form_question` (
  `form_question_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `index_number` int(11) NOT NULL,
  `required` bit(1) NOT NULL,
  `question_id` bigint(20) NOT NULL,
  `form_id` bigint(20) NOT NULL,
  PRIMARY KEY (`form_question_id`),
  FOREIGN KEY (`question_id`) REFERENCES `question` (`question_id`),
  FOREIGN KEY (`form_id`) REFERENCES `form` (`form_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;


/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `carrier_history` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) DEFAULT NULL,
  `years` int(11) DEFAULT NULL,
  `current` bit(1) DEFAULT NULL,
  `rfp_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_carrier_history_1_idx` (`rfp_id`),
  CONSTRAINT `fk_carrier_history_1` FOREIGN KEY (`rfp_id`) REFERENCES `rfp` (`rfp_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-04-05 17:14:16
