-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.6.17 - MySQL Community Server (GPL)
-- Server OS:                    Win64
-- HeidiSQL Version:             9.1.0.4867
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


DROP DATABASE IF EXISTS `br_dev`;
CREATE DATABASE IF NOT EXISTS `br_dev` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `br_dev`;

/*
DROP TABLE IF EXISTS `alt_bucket`;
CREATE TABLE IF NOT EXISTS `alt_bucket` (
  	`alt_bucket_id` INT(11) NOT NULL AUTO_INCREMENT,
	`client_id` INT(11) NOT NULL,
	`category` VARCHAR(12) NOT NULL,
	`plan_type` VARCHAR(50) NOT NULL,
	`name` VARCHAR(50) NOT NULL,
	`contribution_tier1` INT(11) NULL DEFAULT NULL,
	`contribution_tier2` INT(11) NULL DEFAULT NULL,
	`contribution_tier3` INT(11) NULL DEFAULT NULL,
	`contribution_tier4` INT(11) NULL DEFAULT NULL,
	`visited` TIMESTAMP NULL DEFAULT NULL,
	`custom_name` VARCHAR(100) NULL DEFAULT NULL,
	PRIMARY KEY (`alt_bucket_id`),
	UNIQUE INDEX `uc_grp_cat_plan_name` (`client_id`, `category`, `plan_type`, `custom_name`),
	CONSTRAINT `alt_bucket_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `client` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `alt_plan_rates`;
CREATE TABLE IF NOT EXISTS `alt_plan_rates` (
  `alt_plan_rates_id` int(11) NOT NULL AUTO_INCREMENT,
  `alt_bucket_id` int(11) NOT NULL,
  `pnn_id` int(11) NOT NULL,
  `tier1` int(11) DEFAULT NULL,
  `tier2` int(11) DEFAULT NULL,
  `tier3` int(11) DEFAULT NULL,
  `tier4` int(11) DEFAULT NULL,
  `selected` tinyint(1) NOT NULL DEFAULT '0',
  `lead` tinyint(1) NOT NULL DEFAULT '0',
  `final_selected` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`alt_plan_rates_id`),
  UNIQUE KEY `uc_bucket_pnn` (`alt_bucket_id`,`pnn_id`),
  KEY `pnn_id` (`pnn_id`),
  CONSTRAINT `alt_plan_rates_ibfk_1` FOREIGN KEY (`alt_bucket_id`) REFERENCES `alt_bucket` (`alt_bucket_id`),
  CONSTRAINT `alt_plan_rates_ibfk_2` FOREIGN KEY (`pnn_id`) REFERENCES `plan_name_by_network` (`pnn_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `base_plan_rates`;
CREATE TABLE IF NOT EXISTS `base_plan_rates` (
  `base_plan_rates_id` int(11) NOT NULL AUTO_INCREMENT,
  `alt_bucket_id` int(11) NOT NULL,
  `pnn_id` int(11) NOT NULL,
  `tier1` int(11) DEFAULT NULL,
  `tier2` int(11) DEFAULT NULL,
  `tier3` int(11) DEFAULT NULL,
  `tier4` int(11) DEFAULT NULL,
  `renew_tier1` int(11) DEFAULT NULL,
  `renew_tier2` int(11) DEFAULT NULL,
  `renew_tier3` int(11) DEFAULT NULL,
  `renew_tier4` int(11) DEFAULT NULL,
  `negotiated_tier1` int(11) DEFAULT NULL,
  `negotiated_tier2` int(11) DEFAULT NULL,
  `negotiated_tier3` int(11) DEFAULT NULL,
  `negotiated_tier4` int(11) DEFAULT NULL,
  PRIMARY KEY (`base_plan_rates_id`),
  UNIQUE KEY `uc_bucket_pnn` (`alt_bucket_id`,`pnn_id`),
  KEY `pnn_id` (`pnn_id`),
  CONSTRAINT `base_plan_rates_ibfk_1` FOREIGN KEY (`alt_bucket_id`) REFERENCES `alt_bucket` (`alt_bucket_id`),
  CONSTRAINT `base_plan_rates_ibfk_2` FOREIGN KEY (`pnn_id`) REFERENCES `plan_name_by_network` (`pnn_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `benefit`;
CREATE TABLE IF NOT EXISTS `benefit` (
  `benefit_id` int(11) NOT NULL AUTO_INCREMENT,
  `plan_id` int(11) NOT NULL,
  `benefit_name_id` int(11) NOT NULL,
  `in_out_network` varchar(3) NOT NULL,
  `format` varchar(10) NOT NULL,
  `value` int(11) NOT NULL,
  `restriction` varchar(128) NOT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`benefit_id`),
  UNIQUE KEY `uc_plan_benefit_inout` (`plan_id`,`benefit_name_id`,`in_out_network`),
  KEY `IDX_PLAN_ID` (`plan_id`),
  KEY `IDX_B_NAME_ID_VALUE` (`benefit_name_id`,`value`),
  CONSTRAINT `benefit_ibfk_1` FOREIGN KEY (`plan_id`) REFERENCES `plan` (`plan_id`),
  CONSTRAINT `benefit_ibfk_2` FOREIGN KEY (`benefit_name_id`) REFERENCES `benefit_name` (`benefit_name_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
*/

DROP TABLE IF EXISTS `benefit_category`;
CREATE TABLE IF NOT EXISTS `benefit_category` (
  `benefit_category_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`benefit_category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `benefit_category_info`;
CREATE TABLE IF NOT EXISTS `benefit_category_info` (
  `benefit_category_info_id` int(11) NOT NULL AUTO_INCREMENT,
  `benefit_category_id` int(11) NOT NULL,
  `code` varchar(100) NOT NULL,
  `group` varchar(50) NOT NULL,
  `sub_group` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `data_type` enum('INTEGER','DECIMAL','TEXT','BOOLEAN') NOT NULL DEFAULT 'TEXT',
  `multivalue` bit(1) NOT NULL DEFAULT b'0',
  `limit` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`benefit_category_info_id`),
  KEY `benefit_category_id` (`benefit_category_id`),
  UNIQUE INDEX `benefit_category_id_code_group` (`benefit_category_id`, `code`, `group`, `sub_group`),
  CONSTRAINT `fk_bci_category_id` FOREIGN KEY (`benefit_category_id`) REFERENCES `benefit_category` (`benefit_category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `benefit_info_client_data`;
CREATE TABLE IF NOT EXISTS `benefit_info_client_data` (
  `benefit_info_client_data_id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(11) NOT NULL,
  `benefit_category_info_id` int(11) NOT NULL,
  `value` varchar(500) NOT NULL,
  PRIMARY KEY (`benefit_info_client_data_id`),
  KEY `client_id` (`client_id`),
  KEY `benefit_category_info_id` (`benefit_category_info_id`),
  CONSTRAINT `fk_benefit_data_benefit_info_id` FOREIGN KEY (`benefit_category_info_id`) REFERENCES `benefit_category_info` (`benefit_category_info_id`),
  CONSTRAINT `fk_benefit_data_group_id` FOREIGN KEY (`client_id`) REFERENCES `client` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*
DROP TABLE IF EXISTS `benefit_name`;
CREATE TABLE IF NOT EXISTS `benefit_name` (
  `benefit_name_id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `display_name` varchar(64) NOT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`benefit_name_id`),
  UNIQUE KEY `uc_name` (`name`),
  UNIQUE KEY `uc_display_name` (`display_name`),
  UNIQUE KEY `uc_name_display_name` (`name`,`display_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
*/

DROP TABLE IF EXISTS `broker`;
CREATE TABLE IF NOT EXISTS `broker` (
  `broker_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) DEFAULT NULL,
  `address` varchar(64) DEFAULT NULL,
  `city` varchar(64) DEFAULT NULL,
  `state` varchar(16) DEFAULT NULL,
  `zip` varchar(5) DEFAULT NULL,
  `broker_token` varchar(60) NOT NULL DEFAULT '',
  PRIMARY KEY (`broker_id`),
  UNIQUE KEY `uc_name` (`name`),
  UNIQUE KEY `uc_broker_token` (`broker_token`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `carrier`;
CREATE TABLE IF NOT EXISTS `carrier` (
  `carrier_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `display_name` varchar(64) NOT NULL,
  PRIMARY KEY (`carrier_id`),
  UNIQUE KEY `uc_name` (`name`),
  UNIQUE KEY `uc_display` (`display_name`),
  UNIQUE KEY `uc_name_display` (`name`,`display_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*
DROP TABLE IF EXISTS `census`;
CREATE TABLE IF NOT EXISTS `census` (
  `census_id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(11) NOT NULL,
  `tier1` int(11) DEFAULT NULL,
  `tier2` int(11) DEFAULT NULL,
  `tier3` int(11) DEFAULT NULL,
  `tier4` int(11) DEFAULT NULL,
  PRIMARY KEY (`census_id`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `census_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `client` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
*/

DROP TABLE IF EXISTS `client`;
CREATE TABLE IF NOT EXISTS `client` (
  `client_id` int(11) NOT NULL AUTO_INCREMENT,
  `client_name` varchar(64) DEFAULT NULL,
  `broker_id` int(11) NOT NULL,
  `employee_count` int(11) DEFAULT NULL,
  `participating_employees` int(11) DEFAULT NULL,
  `sic_code` varchar(64) DEFAULT NULL,
  `address` varchar(64) DEFAULT NULL,
  `address2` varchar(64) DEFAULT NULL,
  `city` varchar(64) DEFAULT NULL,
  `state` varchar(16) DEFAULT NULL,
  `zip` varchar(6) DEFAULT NULL,
  `image` varchar(60) DEFAULT NULL,
  `website` varchar(500) DEFAULT NULL,
  `effective_date` date DEFAULT NULL,
  `minimum_hours` int(11) DEFAULT NULL,
  `domestic_partner` varchar(100) DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `last_visited` datetime DEFAULT NULL,
  `policy_number` varchar(64) DEFAULT NULL,
  `date_questionnaire_completed` date DEFAULT NULL,
  `contact_name` varchar(64) DEFAULT NULL,
  `contact_title` varchar(64) DEFAULT NULL,
  `contact_address` varchar(64) DEFAULT NULL,
  `contact_city` varchar(64) DEFAULT NULL,
  `contact_state` varchar(16) DEFAULT NULL,
  `contact_zip` varchar(6) DEFAULT NULL,
  `contact_phone` varchar(64) DEFAULT NULL,
  `contact_fax` varchar(64) DEFAULT NULL,
  `contact_email` varchar(64) DEFAULT NULL,
  `business_type` varchar(64) DEFAULT NULL,
  `org_type` varchar(64) DEFAULT NULL,
  `fed_tax_id` varchar(64) DEFAULT NULL,
  `situs_state` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`client_id`),
  KEY `broker_id` (`broker_id`),
  CONSTRAINT `client_ibfk_1` FOREIGN KEY (`broker_id`) REFERENCES `broker` (`broker_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*
DROP TABLE IF EXISTS `network`;
CREATE TABLE IF NOT EXISTS `network` (
  `network_id` int(11) NOT NULL AUTO_INCREMENT,
  `carrier_id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `type` varchar(32) NOT NULL,
  `tier` varchar(32) NOT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`network_id`),
  UNIQUE KEY `uc_carrier_name_type_tier` (`carrier_id`,`name`,`type`,`tier`),
  CONSTRAINT `network_ibfk_1` FOREIGN KEY (`carrier_id`) REFERENCES `carrier` (`carrier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
*/

DROP TABLE IF EXISTS `oauth_access_token`;
CREATE TABLE IF NOT EXISTS `oauth_access_token` (
  `oauth_access_token_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `expires_in` bigint(20) NOT NULL,
  `access_token` varchar(255) NOT NULL,
  PRIMARY KEY (`oauth_access_token_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `fk_access_token_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*
DROP TABLE IF EXISTS `plan`;
CREATE TABLE IF NOT EXISTS `plan` (
  `plan_id` int(11) NOT NULL AUTO_INCREMENT,
  `carrier_id` int(11) NOT NULL,
  `name` varchar(256) DEFAULT NULL,
  `plan_type` varchar(25) DEFAULT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`plan_id`),
  UNIQUE KEY `uc_carrier_name` (`carrier_id`,`name`, `plan_type`),
  CONSTRAINT `plan_ibfk_1` FOREIGN KEY (`carrier_id`) REFERENCES `carrier` (`carrier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `plan_name_by_network`;
CREATE TABLE IF NOT EXISTS `plan_name_by_network` (
  `pnn_id` int(11) NOT NULL AUTO_INCREMENT,
  `plan_id` int(11) NOT NULL,
  `network_id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `plan_type` varchar(25) DEFAULT NULL,
  `cost` int(11) DEFAULT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`pnn_id`),
  UNIQUE KEY `uc_plan_network_name` (`plan_id`,`network_id`,`name`),
  KEY `network_id` (`network_id`),
  CONSTRAINT `plan_name_by_network_ibfk_1` FOREIGN KEY (`plan_id`) REFERENCES `plan` (`plan_id`),
  CONSTRAINT `plan_name_by_network_ibfk_2` FOREIGN KEY (`network_id`) REFERENCES `network` (`network_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `plan_selected`;
CREATE TABLE IF NOT EXISTS `plan_selected` (
  `plan_selected_id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(11) DEFAULT NULL,
  `pnn_id` int(11) NOT NULL,
  PRIMARY KEY (`plan_selected_id`),
  KEY `pnn_id` (`pnn_id`),
  CONSTRAINT `plan_selected_ibfk_1` FOREIGN KEY (`pnn_id`) REFERENCES `plan_name_by_network` (`pnn_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `renewal`;
CREATE TABLE IF NOT EXISTS `renewal` (
  `renewal_id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(11) NOT NULL,
  `bucket` int(11) NOT NULL,
  `name` varchar(40) DEFAULT NULL,
  `renewal` varchar(4096) DEFAULT NULL,
  `exchange` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`renewal_id`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `renewal_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `client` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `rfp_carrier`;
CREATE TABLE IF NOT EXISTS `rfp_carrier` (
  `rfp_carrier_id` int(11) NOT NULL AUTO_INCREMENT,
  `carrier_id` int(11) NOT NULL,
  `category` varchar(32) NOT NULL,
  `endpoint` varchar(68) DEFAULT NULL,
  PRIMARY KEY (`rfp_carrier_id`),
  UNIQUE KEY `uc_carrier_type` (`carrier_id`,`category`),
  CONSTRAINT `rfp_carrier_ibfk_1` FOREIGN KEY (`carrier_id`) REFERENCES `carrier` (`carrier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `rfp_status`;
CREATE TABLE IF NOT EXISTS `rfp_status` (
  `rfp_status_id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(11) NOT NULL,
  `rfp_carrier_id` int(11) NOT NULL,
  `status` varchar(32) DEFAULT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`rfp_status_id`),
  UNIQUE KEY `uc_grp_carrier_status` (`client_id`,`rfp_carrier_id`),
  KEY `rfp_carrier_id` (`rfp_carrier_id`),
  CONSTRAINT `rfp_status_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `client` (`client_id`),
  CONSTRAINT `rfp_status_ibfk_2` FOREIGN KEY (`rfp_carrier_id`) REFERENCES `rfp_carrier` (`rfp_carrier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `rfp_submission`;
CREATE TABLE IF NOT EXISTS `rfp_submission` (
  `rfp_submission_id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(11) NOT NULL,
  `rfp_carrier_id` int(11) NOT NULL,
  `salesforce_id` varchar(32) DEFAULT NULL,
  `request_json` BLOB DEFAULT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`rfp_submission_id`),
  UNIQUE KEY `uc_grp_carrier_submission` (`client_id`,`rfp_carrier_id`),
  KEY `rfp_carrier_id` (`rfp_carrier_id`),
  CONSTRAINT `rfp_submission_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `client` (`client_id`),
  CONSTRAINT `rfp_submission_ibfk_2` FOREIGN KEY (`rfp_carrier_id`) REFERENCES `rfp_carrier` (`rfp_carrier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
*/

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` varchar(60) NOT NULL,
  `phone` varchar(64) DEFAULT NULL,
  `broker_id` int(11) NOT NULL,
  `role` varchar(60) NOT NULL,
  `admin` tinyint(4) NOT NULL DEFAULT '0',
  `status` varchar(60) NOT NULL,
  `verified` tinyint(4) NOT NULL DEFAULT '0',
  `active` tinyint(4) NOT NULL DEFAULT '1',
  `notified` tinyint(4) NOT NULL DEFAULT '0',
  `created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uc_email` (`email`),
  KEY `broker_id` (`broker_id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`broker_id`) REFERENCES `broker` (`broker_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*
DROP TABLE IF EXISTS `plan_rate_value`;
CREATE TABLE IF NOT EXISTS `plan_rate_value` (
  `plan_rate_value_id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(11) NOT NULL,
  `plan` VARCHAR(50) NOT NULL,
  `rate_type` enum('CURRENT','RENEW','NEGOTIATED','CONTRIBUTION','VOLUNTARY') NOT NULL DEFAULT 'CURRENT',
  `position` int(11) NOT NULL DEFAULT '1',
  `position_label` varchar(50) NOT NULL DEFAULT '1',
  `benefit_category_id` int(11) NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `base_plan` bit(1) NOT NULL DEFAULT b'1',
  `out_of_state` bit(1) NOT NULL DEFAULT b'0',
  `option` INT(11) NOT NULL DEFAULT '0',
  `alt_bucket_id` INT(11) NOT NULL,
  PRIMARY KEY (`plan_rate_value_id`),
  KEY `client_id` (`client_id`),
  KEY `benefit_category_id` (`benefit_category_id`),
  INDEX `alt_bucket_id` (`alt_bucket_id`),
  CONSTRAINT `fk_plan_rate_alt_bucket_id` FOREIGN KEY (`alt_bucket_id`) REFERENCES `alt_bucket` (`alt_bucket_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_plan_rate_benefit_category_id` FOREIGN KEY (`benefit_category_id`) REFERENCES `benefit_category` (`benefit_category_id`),
  CONSTRAINT `fk_plan_rate_client_id` FOREIGN KEY (`client_id`) REFERENCES `client` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `plan_info`;
CREATE TABLE IF NOT EXISTS `plan_info` (
  `plan_info_id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(100) NOT NULL,
  `text` varchar(200) NOT NULL,
  `data_type` enum('INTEGER','DECIMAL','TEXT','BOOLEAN') NOT NULL DEFAULT 'TEXT',
  `multivalue` bit(1) NOT NULL DEFAULT b'0',
  `limit` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`plan_info_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `plan_category_info`;
CREATE TABLE IF NOT EXISTS `plan_category_info` (
  `plan_category_info_id` int(11) NOT NULL AUTO_INCREMENT,
  `benefit_category_id` int(11) NOT NULL,
  `plan_info_id` int(11) NOT NULL,
  PRIMARY KEY (`plan_category_info_id`),
  UNIQUE KEY `benefit_category_id_plan_info_id` (`benefit_category_id`,`plan_info_id`),
  KEY `benefit_category_id` (`benefit_category_id`),
  KEY `plan_info_id` (`plan_info_id`),
  CONSTRAINT `fk_plan_benefit_category_id` FOREIGN KEY (`benefit_category_id`) REFERENCES `benefit_category` (`benefit_category_id`),
  CONSTRAINT `fk_plan_info_id` FOREIGN KEY (`plan_info_id`) REFERENCES `plan_info` (`plan_info_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `plan_info_client_data`;
CREATE TABLE IF NOT EXISTS `plan_info_client_data` (
  `plan_info_client_data_id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(11) NOT NULL,
  `plan_category_info_id` int(11) NOT NULL,
  PRIMARY KEY (`plan_info_client_data_id`),
  UNIQUE KEY `client_id_plan_category_info_id` (`client_id`,`plan_category_info_id`),
  KEY `client_id` (`client_id`),
  KEY `plan_category_info_id` (`plan_category_info_id`),
  CONSTRAINT `fk_plan_data_category_info_id` FOREIGN KEY (`plan_category_info_id`) REFERENCES `plan_category_info` (`plan_category_info_id`),
  CONSTRAINT `fk_plan_data_client_id` FOREIGN KEY (`client_id`) REFERENCES `client` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `plan_info_value`;
CREATE TABLE IF NOT EXISTS `plan_info_value` (
  `plan_info_value_id` int(11) NOT NULL AUTO_INCREMENT,
  `plan_info_client_data_id` int(11) NOT NULL,
  `plan` varchar(100) NOT NULL,
  `optional` bit(1) NOT NULL DEFAULT b'0',
  `alternative` bit(1) NOT NULL DEFAULT b'0',
  `option` int(11) NOT NULL DEFAULT '1',
  `value` varchar(500) NOT NULL,
  PRIMARY KEY (`plan_info_value_id`),
  UNIQUE INDEX `plan_data_id_plan_optional_alternative_option` (`plan_info_client_data_id`, `plan`, `optional`, `alternative`, `option`),
  KEY `plan_info_client_data_id` (`plan_info_client_data_id`),
  CONSTRAINT `fk_plan_value_data_id` FOREIGN KEY (`plan_info_client_data_id`) REFERENCES `plan_info_client_data` (`plan_info_client_data_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
*/

DROP TABLE IF EXISTS `client_file_upload`;
CREATE TABLE IF NOT EXISTS `client_file_upload` (
	`client_file_upload_id` INT(11) NOT NULL AUTO_INCREMENT,
	`benefit_info_client_data_id` INT(11) NOT NULL DEFAULT '0',
	`s3_key` VARCHAR(500) NOT NULL DEFAULT '0',
	PRIMARY KEY (`client_file_upload_id`),
	INDEX `benefit_info_client_data_id` (`benefit_info_client_data_id`),
	CONSTRAINT `fk_upload_benefit_info_client_data_id` FOREIGN KEY (`benefit_info_client_data_id`) REFERENCES `benefit_info_client_data` (`benefit_info_client_data_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*
DROP TABLE IF EXISTS `timeline`;
CREATE TABLE IF NOT EXISTS `timeline` (
  `timeline_id` int(11) NOT NULL AUTO_INCREMENT,
  `ref_num` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `carrier_id` int(11) NOT NULL,
  `milestone` varchar(1000) NOT NULL,
  `assignee` varchar(1000) NOT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `projected_time` timestamp NULL DEFAULT NULL,
  `completed` bit(1) NOT NULL DEFAULT b'0',
  `completed_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`timeline_id`),
  UNIQUE KEY `uc_refNum_grp_carrier_timeline` (`ref_num`,`client_id`,`carrier_id`),
  CONSTRAINT `timeline_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `client` (`client_id`),
  CONSTRAINT `timeline_ibfk_2` FOREIGN KEY (`carrier_id`) REFERENCES `carrier` (`carrier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
*/

DROP TABLE IF EXISTS `broker_registration`;
CREATE TABLE IF NOT EXISTS `broker_registration` (
  `broker_registration_id` int(11) NOT NULL AUTO_INCREMENT,
  `broker_id` int(11) NULL DEFAULT NULL,
  `broker_name` varchar(60) NOT NULL,
  `contact_name` varchar(60) NOT NULL,
  `contact_email` varchar(60) NOT NULL,
  `registration_token` varchar(60) NOT NULL,
  `email_sent_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`broker_registration_id`),
  KEY `broker_id` (`broker_id`),
  CONSTRAINT `broker_reg_ibfk_1` FOREIGN KEY (`broker_id`) REFERENCES `broker` (`broker_id`),
  UNIQUE KEY `uc_brokerName_email_registration` (`broker_name`,`contact_email`),
  UNIQUE KEY `uc_regToken_registration` (`registration_token`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
