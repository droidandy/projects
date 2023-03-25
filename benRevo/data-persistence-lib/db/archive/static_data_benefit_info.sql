USE `br_dev`;

/* Product categories */
INSERT INTO benefit_category (name) VALUES ('Medical');
INSERT INTO benefit_category (name) VALUES ('Dental');
INSERT INTO benefit_category (name) VALUES ('Vision');
INSERT INTO benefit_category (name) VALUES ('Life');
INSERT INTO benefit_category (name) VALUES ('LTD');
INSERT INTO benefit_category (name) VALUES ('STD');
INSERT INTO benefit_category (name) VALUES ('UHC');


/* create temp table to hold templates for benefit_category_info */
CREATE TABLE IF NOT EXISTS `tmp_benefit_info` (
  `tmp_benefit_info_id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(100) NOT NULL,
  `group` varchar(50) NOT NULL,
  `sub_group` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `data_type` enum('INTEGER','DECIMAL','TEXT','BOOLEAN') NOT NULL DEFAULT 'TEXT',
  `multivalue` bit(1) NOT NULL DEFAULT b'0',
  `limit` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`tmp_benefit_info_id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/* Medical Info - Questions for each section under RFP*/
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('WAIT_PERIOD', 'Information', 'WAITING PERIOD', 'How long does an employee have to wait before they are eligible for benefits?', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('HOW_GET_PAID', 'Information', 'CURRENT COMMISSION SCHEDULE', 'How do you get paid?', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('YOUR_COMISSION', 'Information', 'CURRENT COMMISSION SCHEDULE', 'What is your commission?', 'DECIMAL', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('PERCENTAGE_PAID', 'Information', 'CURRENT COMMISSION SCHEDULE', 'What % do you get paid?', 'DECIMAL', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('CURRENT_CARRIER', 'Information', 'CURRENT CARRIER', 'Which carrier are you currently with?', 'TEXT', b'1', 6);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('YEARS_CURRENT_CARRIER', 'Information', 'CURRENT CARRIER', 'How many years have you been with them?', 'INTEGER', b'1', 6);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('PREVIOUS_CARRIER', 'Information', 'CURRENT CARRIER', 'Which carrier where you previous with?', 'TEXT', b'1', 5);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('YEARS_PREVIOUS_CARRIER', 'Information', 'CURRENT CARRIER', 'How many years have you been with previous carrier?', 'INTEGER', b'1', 5);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('NUM_RATING_TIERS', 'Current Options', 'TIERS', 'How many rating tiers are there?', 'INTEGER', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('MED_PLAN_BASE', 'Current Options', 'MEDICAL OPTIONS', 'Medical base plan - select a plan type', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('MED_PLAN_OPT', 'Current Options', 'MEDICAL OPTIONS', 'Medical option - select a plan type', 'TEXT', b'1', 6);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('HOW_GROUP_CONTRIBUTE', 'Contribution', 'CONTRIBUTION', 'How does your group contribute to the plan?', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('BASE_PLAN_CONTRIBUTION_TIER1', 'Contribution', 'CONTRIBUTION AMOUT', 'How much do you contribute? (EMPLOYEE)', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('BASE_PLAN_CONTRIBUTION_TIER2', 'Contribution', 'CONTRIBUTION AMOUT', 'How much do you contribute? (EMPLOYEE + SPOUSE)', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('BASE_PLAN_CONTRIBUTION_TIER3', 'Contribution', 'CONTRIBUTION AMOUT', 'How much do you contribute? (EMPLOYEE + CHILD)', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('BASE_PLAN_CONTRIBUTION_TIER4', 'Contribution', 'CONTRIBUTION AMOUT', 'How much do you contribute? (EMPLOYEE + FAMMILY)', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('BUY_UP_BASE_PLAN', 'Contribution', 'CONTRIBUTION AMOUT', 'Are the plan options a buy up from the baseplan?', 'BOOLEAN', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('OPTION_PLAN_CONTRIBUTION_TIER1', 'Contribution', 'CONTRIBUTION AMOUT', 'How much do you contribute? (EMPLOYEE)', 'TEXT', b'1', 6);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('OPTION_PLAN_CONTRIBUTION_TIER2', 'Contribution', 'CONTRIBUTION AMOUT', 'How much do you contribute? (EMPLOYEE + SPOUSE)', 'TEXT', b'1', 6);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('OPTION_PLAN_CONTRIBUTION_TIER3', 'Contribution', 'CONTRIBUTION AMOUT', 'How much do you contribute? (EMPLOYEE + CHILD)', 'TEXT', b'1', 6);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('OPTION_PLAN_CONTRIBUTION_TIER4', 'Contribution', 'CONTRIBUTION AMOUT', 'How much do you contribute? (EMPLOYEE + FAMMILY)', 'TEXT', b'1', 6);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('INCLUDE_SELF_FUNDING', 'Plans to Quote', 'QUOTE DETAILS', 'Would you like us to include self-funding options?', 'BOOLEAN', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('ALONGSIDE_KAISER', 'Plans to Quote', 'QUOTE DETAILS', 'Would you like us to quote alongside Kaiser?', 'BOOLEAN', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('ALTERNATIVE_RATING_TIERS', 'Plans to Quote', 'QUOTE DETAILS', 'Would you like to quote alternative rating tiers?', 'INTEGER', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('ADDITIONAL_REQUESTS', 'Plans to Quote', 'QUOTE DETAILS', 'Please include any additional requests:', 'TEXT', b'0', 1);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('MATCH_CURRENT', 'Plans to Quote', 'MEDICAL OPTIONS', 'Would you like to match current?', 'BOOLEAN', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('QUOTE_ALTERNATIVE', 'Plans to Quote', 'MEDICAL OPTIONS', 'Would you like to quote an alternative?', 'BOOLEAN', b'0', 1);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('CATEGORY_EXAMS_MONTHS', 'Plans to Quote', 'BASELINE DETAILS', 'Current plan info', 'INTEGER', b'1', 2);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('CATEGORY_MATERIALS_MONTHS', 'Plans to Quote', 'BASELINE DETAILS', 'Current plan info', 'INTEGER', b'1', 2);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('CATEGORY_FRAMES_MONTHS', 'Plans to Quote', 'BASELINE DETAILS', 'Current plan info', 'INTEGER', b'1', 2);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('IN_NETWORK_EXAMINATION_COPAY', 'Plans to Quote', 'BASELINE DETAILS', 'Current plan info', 'DECIMAL', b'1', 2);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('IN_NETWORK_MATERIALS_COPAY', 'Plans to Quote', 'BASELINE DETAILS', 'Current plan info', 'TEXT', b'1', 2);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('IN_NETWORK_EXAM', 'Plans to Quote', 'BASELINE DETAILS', 'Current plan info', 'TEXT', b'1', 2);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('IN_NETWORK_SINGLE_VISION_LENSES', 'Plans to Quote', 'BASELINE DETAILS', 'Current plan info', 'TEXT', b'1', 2);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('IN_NETWORK_SINGLE_VISION_LENSES_AMMOUNT', 'Plans to Quote', 'BASELINE DETAILS', 'Current plan info', 'DECIMAL', b'1', 2);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('IN_NETWORK_BIFOCAL_LENSES', 'Plans to Quote', 'BASELINE DETAILS', 'Current plan info', 'TEXT', b'1', 2);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('IN_NETWORK_TRIFOCAL_LENSES', 'Plans to Quote', 'BASELINE DETAILS', 'Current plan info', 'TEXT', b'1', 2);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('IN_NETWORK_LENTICULAR_LENSES', 'Plans to Quote', 'BASELINE DETAILS', 'Current plan info', 'TEXT', b'1', 2);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('IN_NETWORK_CONTACT_LENSES_ELECTIVE', 'Plans to Quote', 'BASELINE DETAILS', 'Current plan info', 'TEXT', b'1', 2);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('IN_NETWORK_CONTACT_LENSES_ELECTIVE_AMMOUNT', 'Plans to Quote', 'BASELINE DETAILS', 'Current plan info', 'DECIMAL', b'1', 2);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('IN_NETWORK_CONTACT_LENSES_THERAPEUTIC', 'Plans to Quote', 'BASELINE DETAILS', 'Current plan info', 'TEXT', b'1', 2);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('IN_NETWORK_FRAME', 'Plans to Quote', 'BASELINE DETAILS', 'Current plan info', 'TEXT', b'1', 2);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('IN_NETWORK_FRAME_AMMOUNT', 'Plans to Quote', 'BASELINE DETAILS', 'Current plan info', 'DECIMAL', b'1', 2);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('OUT_OF_NETWORK_EXAMINATION_COPAY', 'Plans to Quote', 'BASELINE DETAILS', 'Current plan info', 'DECIMAL', b'1', 2);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('OUT_OF_NETWORK_MATERIALS_COPAY', 'Plans to Quote', 'BASELINE DETAILS', 'Current plan info', 'DECIMAL', b'1', 2);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('OUT_OF_NETWORK_EXAM', 'Plans to Quote', 'BASELINE DETAILS', 'Current plan info', 'DECIMAL', b'1', 2);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('OUT_OF_NETWORK_SINGLE_VISION_LENSES', 'Plans to Quote', 'BASELINE DETAILS', 'Current plan info', 'DECIMAL', b'1', 2);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('OUT_OF_NETWORK_BIFOCAL_LENSES', 'Plans to Quote', 'BASELINE DETAILS', 'Current plan info', 'DECIMAL', b'1', 2);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('OUT_OF_NETWORK_TRIFOCAL_LENSES', 'Plans to Quote', 'BASELINE DETAILS', 'Current plan info', 'DECIMAL', b'1', 2);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('OUT_OF_NETWORK_LENTICULAR_LENSES', 'Plans to Quote', 'BASELINE DETAILS', 'Current plan info', 'DECIMAL', b'1', 2);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('OUT_OF_NETWORK_CONTACT_LENSES_ELECTIVE', 'Plans to Quote', 'BASELINE DETAILS', 'Current plan info', 'DECIMAL', b'1', 2);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('OUT_OF_NETWORK_CONTACT_LENSES_THERAPEUTIC', 'Plans to Quote', 'BASELINE DETAILS', 'Current plan info', 'DECIMAL', b'1', 2);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('OUT_OF_NETWORK_FRAME_AMMOUNT', 'Plans to Quote', 'BASELINE DETAILS', 'Current plan info', 'DECIMAL', b'1', 2);


INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('BASIC_EMPLOYER_PAID_LIFE', 'General', 'BASIC LIFE INSURANCE', 'Do you offer employer paid life?', 'BOOLEAN', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('BASIC_MATCH_CURRENT', 'General', 'BASIC LIFE INSURANCE', 'Would you like to match current?', 'BOOLEAN', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('BASIC_QUOTE_ALTERNATIVE', 'General', 'BASIC LIFE INSURANCE', 'Would you like to quote alternative?', 'BOOLEAN', b'0', 1);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('VOLUNTARY_OFFER_VOLUNTARY_LIFE', 'General', 'VOLUNTARY LIFE INSURANCE', 'Do you offer voluntary life?', 'BOOLEAN', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('VOLUNTARY_MATCH_CURRENT', 'General', 'VOLUNTARY LIFE INSURANCE', 'Would you like to match current?', 'BOOLEAN', b'0', 1);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('CURRENT_LIFE_INSURANCE_TYPE', 'General', 'BASIC LIFE INSURANCE', 'Choose a type of life insurance', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('CURRENT_AMOUNT', 'General', 'BASIC LIFE INSURANCE', 'Amount', 'DECIMAL', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('VOLUNTARY_PORTABILITY', 'General', 'VOLUNTARY LIFE INSURANCE', 'Portability?', 'BOOLEAN', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('CURRENT_AGE_REDUCTION_PERCENTAGE', 'General', 'BASIC LIFE INSURANCE', 'Age reduction', 'DECIMAL', b'1', 10);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('CURRENT_AGE_REDUCTION_YEARS_OLD', 'General', 'BASIC LIFE INSURANCE', 'Age reduction', 'INTEGER', b'1', 10);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('VOLUNTARY_AGE_REDUCTION_PERCENTAGE', 'General', 'VOLUNTARY LIFE INSURANCE', 'Age reduction', 'DECIMAL', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('VOLUNTARY_AGE_REDUCTION_YEARS_OLD', 'General', 'VOLUNTARY LIFE INSURANCE', 'Age reduction', 'INTEGER', b'0', 1);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('BASELINE_CURRENT_MATCH_CURRENT', 'Plans to Quote', 'BASELINE DETAILS', 'Implant Coverage', 'BOOLEAN', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('BASELINE_CURRENT_QUOTE_ALTERNATIVE', 'Plans to Quote', 'BASELINE DETAILS', 'Implant Coverage', 'BOOLEAN', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('BASELINE_ALT_SELECTED_PLAN', 'Plans to Quote', 'BASELINE DETAILS', 'Implant Coverage', 'TEXT', b'0', 1);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('OPTIONAL_CURRENT_MATCH_CURRENT', 'Plans to Quote', 'BASELINE DETAILS', 'Implant Coverage', 'BOOLEAN', b'1', 5);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('OPTIONAL_CURRENT_QUOTE_ALTERNATIVE', 'Plans to Quote', 'BASELINE DETAILS', 'Implant Coverage', 'BOOLEAN', b'1', 5);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('OPTIONAL_ALT_SELECTED_PLAN', 'Plans to Quote', 'BASELINE DETAILS', 'Implant Coverage', 'TEXT', b'1', 5);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_EMPLOYER_PAID_LIFE', 'General', 'LONG TERM DISABILITY', 'Do you offer employer paid life?', 'BOOLEAN', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_MATCH_CURRENT', 'General', 'LONG TERM DISABILITY', 'Would you like to match current?', 'BOOLEAN', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_QUOTE_ALTERNATIVE', 'General', 'LONG TERM DISABILITY', 'Would you like to quote an alternative?', 'BOOLEAN', b'0', 1);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_VOLUNTARY_BUY_UP', 'General', 'LTD VOLUNTARY', 'Do you offer LTD Voluntary buy up', 'BOOLEAN', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_VOLUNTARY_MATCH_CURRENT', 'General', 'LTD VOLUNTARY', 'Would you like to match current?', 'BOOLEAN', b'0', 1);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_CURRENT_BENEFIT_PERCENTAGE', 'General', 'LONG TERM DISABILITY', 'Benefit', 'DECIMAL', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_CURRENT_MONTHLY_MAX', 'General', 'LONG TERM DISABILITY', 'Monthly Max', 'DECIMAL', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_CURRENT_ELIMINATION', 'General', 'LONG TERM DISABILITY', 'Elimination', 'INTEGER', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_CURRENT_MAX_BENEFIT_PERIOD', 'General', 'LONG TERM DISABILITY', 'Max benefit period', 'INTEGER', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_CURRENT_PRE_EXISTING_LIMITS', 'General', 'LONG TERM DISABILITY', 'Pre-existing limits', 'TEXT', b'0', 1);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_EMPLOYER_PAID_LIFE', 'General', 'SHORT TERM DISABILITY', 'Do you offer employer paid life?', 'BOOLEAN', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_MATCH_CURRENT', 'General', 'SHORT TERM DISABILITY', 'Would you like to match current?', 'BOOLEAN', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_QUOTE_ALTERNATIVE', 'General', 'SHORT TERM DISABILITY', 'Would you like to quote an alternative?', 'BOOLEAN', b'0', 1);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_VOLUNTARY_STD', 'General', 'STD VOLUNTARY', 'Do you offer Voluntary STD', 'BOOLEAN', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_VOLUNTARY_MATCH_CURRENT', 'General', 'STD VOLUNTARY', 'Would you like to match current?', 'BOOLEAN', b'0', 1);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_CURRENT_BENEFIT_PERCENTAGE', 'General', 'SHORT TERM DISABILITY', 'Benefit', 'DECIMAL', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_CURRENT_WEEKLY_MAX', 'General', 'SHORT TERM DISABILITY', 'Weekly Max', 'DECIMAL', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_CURRENT_ELIMINATION', 'General', 'SHORT TERM DISABILITY', 'Elimination Period', 'INTEGER', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_CURRENT_MAX_BENEFIT_PERIOD', 'General', 'SHORT TERM DISABILITY', 'Max benefit period', 'INTEGER', b'0', 1);

/* Life info */
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('CURRENT_ALT_LIFE_INSURANCE_TYPE', 'General', 'BASIC LIFE INSURANCE', 'Choose a type of life insurance', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('CURRENT_ALT_AMOUNT', 'General', 'BASIC LIFE INSURANCE', 'Amount', 'DECIMAL', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('CURRENT_ALT_INCLUDE_BONUSES', 'General', 'BASIC LIFE INSURANCE', 'Does this include bonuses and commissions?', 'BOOLEAN', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('CURRENT_ALT_INCLUDE_BONUSES_TIMES', 'General', 'BASIC LIFE INSURANCE', 'Times', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('CURRENT_ALT_INCLUDE_BONUSES_AMOUNT', 'General', 'BASIC LIFE INSURANCE', 'Amount', 'DECIMAL', b'0', 1);

/* LTD */
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_CURRENT_ALT_BENEFIT_PERCENTAGE', 'General', 'LONG TERM DISABILITY', 'Benefit', 'DECIMAL', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_CURRENT_ALT_MONTHLY_MAX', 'General', 'LONG TERM DISABILITY', 'Monthly Max', 'DECIMAL', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_CURRENT_ALT_ELIMINATION', 'General', 'LONG TERM DISABILITY', 'Elimination', 'INTEGER', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_CURRENT_ALT_MAX_BENEFIT_PERIOD', 'General', 'LONG TERM DISABILITY', 'Max benefit period', 'INTEGER', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_CURRENT_ALT_PRE_EXISTING_LIMITS', 'General', 'LONG TERM DISABILITY', 'Pre-existing limits', 'TEXT', b'0', 1);

/* STD */
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_CURRENT_ALT_BENEFIT_PERCENTAGE', 'General', 'SHORT TERM DISABILITY', 'Benefit', 'DECIMAL', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_CURRENT_ALT_WEEKLY_MAX', 'General', 'SHORT TERM DISABILITY', 'Weekly Max', 'DECIMAL', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_CURRENT_ALT_ELIMINATION', 'General', 'SHORT TERM DISABILITY', 'Elimination Period', 'INTEGER', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_CURRENT_ALT_MAX_BENEFIT_PERIOD', 'General', 'SHORT TERM DISABILITY', 'Max benefit period', 'INTEGER', b'0', 1);


/* NEW Current Options Questions */
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('BASE_PLAN_CUSTOM_NAME', 'Current Options', 'BASE PLAN', 'Plan Name', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('OPTIONAL_PLAN_CUSTOM_NAME', 'Current Options', 'OPTION', 'Plan Name', 'TEXT', b'1', 6);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('ADDITIONAL_REQUESTS', 'General', 'QUOTE DETAILS', 'Please include any additional requests:', 'TEXT', b'0', 1);


/* Contributions out of state */
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('BASE_OUT_OF_STATE', 'Contribution', 'CONTRIBUTION AMOUNT', 'Out of State Contribution', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('OPTION_OUT_OF_STATE', 'Contribution', 'CONTRIBUTION AMOUNT', 'Out of State Contribution', 'TEXT', b'1', 6);

/* Out of state under Rates section */
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('CURRENT_BASE_OUT_OF_STATE', 'Rates', 'CURRENT RATES', 'What are the rates for your current plans?', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('CURRENT_OPTIONAL_OUT_OF_STATE', 'Rates', 'CURRENT RATES', 'What are the rates for your current plans?', 'TEXT', b'1', 6);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('RENEW_BASE_OUT_OF_STATE', 'Rates', 'CURRENT RATES', 'What are the rates for your current plans?', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('RENEW_OPTIONAL_OUT_OF_STATE', 'Rates', 'CURRENT RATES', 'What are the rates for your current plans?', 'TEXT', b'1', 6);


/* New life basic changes */
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('BASIC_INCLUDE_BONUSES', 'General', 'BASIC LIFE INSURANCE', 'Does this include bonuses and commissions?', 'BOOLEAN', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('BASIC_INCLUDE_BONUSES_TIMES', 'General', 'BASIC LIFE INSURANCE', 'Times', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('BASIC_INCLUDE_BONUSES_AMOUNT', 'General', 'BASIC LIFE INSURANCE', 'Amount', 'DECIMAL', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('BASIC_INCLUDE_ADND', 'General', 'BASIC LIFE INSURANCE', 'Does your basic life include AD&D?', 'BOOLEAN', b'0', 1);

/* New life voluntary changes */
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('VOLUNTARY_EMPLOYEE_INCREMENT_FROM', 'General', 'VOLUNTARY LIFE INSURANCE', 'Benefit increments of', 'DECIMAL', b'1', 10);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('VOLUNTARY_EMPLOYEE_INCREMENT_TO', 'General', 'VOLUNTARY LIFE INSURANCE', 'Benefit increments of', 'DECIMAL', b'1', 10);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('VOLUNTARY_EMPLOYEE_GUARANTEED_AMOUNT', 'General', 'VOLUNTARY LIFE INSURANCE', 'Guaranteed issue amount', 'DECIMAL', b'0', 1);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('VOLUNTARY_SPOUSE_INCREMENT_FROM', 'General', 'VOLUNTARY LIFE INSURANCE', 'Benefit increments of', 'DECIMAL', b'1', 10);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('VOLUNTARY_SPOUSE_INCREMENT_TO', 'General', 'VOLUNTARY LIFE INSURANCE', 'Benefit increments of', 'DECIMAL', b'1', 10);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('VOLUNTARY_SPOUSE_GUARANTEED_AMOUNT', 'General', 'VOLUNTARY LIFE INSURANCE', 'Guaranteed issue amount', 'DECIMAL', b'0', 1);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('VOLUNTARY_CHILD_INCREMENT_FROM', 'General', 'VOLUNTARY LIFE INSURANCE', 'Benefit increments of', 'DECIMAL', b'1', 10);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('VOLUNTARY_CHILD_INCREMENT_TO', 'General', 'VOLUNTARY LIFE INSURANCE', 'Benefit increments of', 'DECIMAL', b'1', 10);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('VOLUNTARY_CHILD_GUARANTEED_AMOUNT', 'General', 'VOLUNTARY LIFE INSURANCE', 'Guaranteed issue amount', 'DECIMAL', b'0', 1);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('VOLUNTARY_INCLUDE_ADND', 'General', 'VOLUNTARY LIFE INSURANCE', 'Does your voluntary life include AD&D?', 'DECIMAL', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('VOLUNTARY_INCLUDE_STAND_ALONE_ADND', 'General', 'VOLUNTARY LIFE INSURANCE', 'Stand alone voluntary AD&D?', 'DECIMAL', b'0', 1);

/* New LTD info */
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_CLASS_NAME', 'General', 'LONG TERM DISABILITY', 'Class - Name', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_CLASS_BENEFIT', 'General', 'LONG TERM DISABILITY', 'Benefit', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_CLASS_MONTHLY_MAX', 'General', 'LONG TERM DISABILITY', 'Monthly Max', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_CLASS_ELIMINATION_PERIOD', 'General', 'LONG TERM DISABILITY', 'Elimination Period', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_CLASS_PRE_EXISTING_LIMITS', 'General', 'LONG TERM DISABILITY', 'Pre-Existing Limits', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_CLASS_DEFINITION_OF_DISABILITY', 'General', 'LONG TERM DISABILITY', 'Definition of disability', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_CLASS_RATE_TYPE_W2_EARNINGS', 'General', 'LONG TERM DISABILITY', 'W2 earnings', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_CLASS_RATE_TYPE_BASE_ANNUAL_SALARY', 'General', 'LONG TERM DISABILITY', 'Base annual salary', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_CLASS_RATE_TYPE_COMISSIONS', 'General', 'LONG TERM DISABILITY', 'Commissions', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_CLASS_RATE_TYPE_BONUS', 'General', 'LONG TERM DISABILITY', 'Bonus', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_CLASS_RATE_TYPE_TIPS', 'General', 'LONG TERM DISABILITY', 'Tips', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_CLASS_QUANTITY', 'General', 'LONG TERM DISABILITY', 'Tips', 'INTEGER', b'0', 1);

/* New STD info */
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_CLASS_NAME', 'General', 'SHORT TERM DISABILITY', 'Class - Name', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_CLASS_BENEFIT', 'General', 'SHORT TERM DISABILITY', 'Benefit', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_CLASS_MONTHLY_MAX', 'General', 'SHORT TERM DISABILITY', 'Monthly Max', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_CLASS_ELIMINATION_PERIOD', 'General', 'SHORT TERM DISABILITY', 'Elimination Period', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_CLASS_PRE_EXISTING_LIMITS', 'General', 'SHORT TERM DISABILITY', 'Pre-Existing Limits', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_CLASS_DEFINITION_OF_DISABILITY', 'General', 'SHORT TERM DISABILITY', 'Definition of disability', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_CLASS_RATE_TYPE_W2_EARNINGS', 'General', 'SHORT TERM DISABILITY', 'W2 earnings', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_CLASS_RATE_TYPE_BASE_ANNUAL_SALARY', 'General', 'SHORT TERM DISABILITY', 'Base annual salary', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_CLASS_RATE_TYPE_COMISSIONS', 'General', 'SHORT TERM DISABILITY', 'Commissions', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_CLASS_RATE_TYPE_BONUS', 'General', 'SHORT TERM DISABILITY', 'Bonus', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_CLASS_RATE_TYPE_TIPS', 'General', 'SHORT TERM DISABILITY', 'Tips', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_CLASS_QUANTITY', 'General', 'SHORT TERM DISABILITY', 'Tips', 'INTEGER', b'0', 1);

/* Life new questions for rates */
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LIFE_RATE_TYPE_EMPLOYEE', 'Rates', 'VOLUNTARY LIFE INSURANCE', 'What are the rate types?', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LIFE_RATE_TYPE_EMPLOYEE_TOBACCO', 'Rates', 'VOLUNTARY LIFE INSURANCE', 'What are the rate types?', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LIFE_RATE_TYPE_SPOUSE', 'Rates', 'VOLUNTARY LIFE INSURANCE', 'What are the rate types?', 'TEXT', b'0', 1);


/* NEW Voluntary LTD Questions */
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_VOLUNTARY_CLASS_NAME', 'General', 'LTD VOLUNTARY', 'Class - Name', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_VOLUNTARY_CLASS_BENEFIT', 'General', 'LTD VOLUNTARY', 'Benefit', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_VOLUNTARY_CLASS_MONTHLY_MAX', 'General', 'LTD VOLUNTARY', 'Monthly Max', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_VOLUNTARY_CLASS_ELIMINATION_PERIOD', 'General', 'LTD VOLUNTARY', 'Elimination Period', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_VOLUNTARY_CLASS_PRE_EXISTING_LIMITS', 'General', 'LTD VOLUNTARY', 'Pre-Existing Limits', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_VOLUNTARY_CLASS_DEFINITION_OF_DISABILITY', 'General', 'LTD VOLUNTARY', 'Definition of disability', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_VOLUNTARY_CLASS_RATE_TYPE_W2_EARNINGS', 'General', 'LTD VOLUNTARY', 'W2 earnings', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_VOLUNTARY_CLASS_RATE_TYPE_BASE_ANNUAL_SALARY', 'General', 'LTD VOLUNTARY', 'Base annual salary', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_VOLUNTARY_CLASS_RATE_TYPE_COMISSIONS', 'General', 'LTD VOLUNTARY', 'Commissions', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_VOLUNTARY_CLASS_RATE_TYPE_BONUS', 'General', 'LTD VOLUNTARY', 'Bonus', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_VOLUNTARY_CLASS_RATE_TYPE_TIPS', 'General', 'LTD VOLUNTARY', 'Tips', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_VOLUNTARY_CLASS_QUANTITY', 'General', 'LTD VOLUNTARY', 'Tips', 'INTEGER', b'0', 1);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_VOLUNTARY_CURRENT_BENEFIT_PERCENTAGE', 'General', 'LTD VOLUNTARY', 'Benefit', 'DECIMAL', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_VOLUNTARY_CURRENT_MONTHLY_MAX', 'General', 'LTD VOLUNTARY', 'Monthly Max', 'DECIMAL', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_VOLUNTARY_CURRENT_ELIMINATION', 'General', 'LTD VOLUNTARY', 'Elimination', 'INTEGER', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_VOLUNTARY_CURRENT_MAX_BENEFIT_PERIOD', 'General', 'LTD VOLUNTARY', 'Max benefit period', 'INTEGER', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_VOLUNTARY_CURRENT_PRE_EXISTING_LIMITS', 'General', 'LTD VOLUNTARY', 'Pre-existing limits', 'TEXT', b'0', 1);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LTD_VOLUNTARY_QUOTE_ALTERNATIVE', 'General', 'LTD VOLUNTARY', 'Pre-existing limits', 'BOOLEAN', b'0', 1);

/* NEW Voluntary STD Questions */
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_VOLUNTARY_CLASS_NAME', 'General', 'STD VOLUNTARY', 'Class - Name', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_VOLUNTARY_CLASS_BENEFIT', 'General', 'STD VOLUNTARY', 'Benefit', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_VOLUNTARY_CLASS_MONTHLY_MAX', 'General', 'STD VOLUNTARY', 'Monthly Max', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_VOLUNTARY_CLASS_ELIMINATION_PERIOD', 'General', 'STD VOLUNTARY', 'Elimination Period', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_VOLUNTARY_CLASS_PRE_EXISTING_LIMITS', 'General', 'STD VOLUNTARY', 'Pre-Existing Limits', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_VOLUNTARY_CLASS_DEFINITION_OF_DISABILITY', 'General', 'STD VOLUNTARY', 'Definition of disability', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_VOLUNTARY_CLASS_RATE_TYPE_W2_EARNINGS', 'General', 'STD VOLUNTARY', 'W2 earnings', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_VOLUNTARY_CLASS_RATE_TYPE_BASE_ANNUAL_SALARY', 'General', 'STD VOLUNTARY', 'Base annual salary', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_VOLUNTARY_CLASS_RATE_TYPE_COMISSIONS', 'General', 'STD VOLUNTARY', 'Commissions', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_VOLUNTARY_CLASS_RATE_TYPE_BONUS', 'General', 'STD VOLUNTARY', 'Bonus', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_VOLUNTARY_CLASS_RATE_TYPE_TIPS', 'General', 'STD VOLUNTARY', 'Tips', 'TEXT', b'1', 3);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_VOLUNTARY_CLASS_QUANTITY', 'General', 'STD VOLUNTARY', 'Tips', 'INTEGER', b'0', 1);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_VOLUNTARY_CURRENT_ALT_BENEFIT_PERCENTAGE', 'General', 'STD VOLUNTARY', 'Benefit', 'DECIMAL', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_VOLUNTARY_CURRENT_ALT_WEEKLY_MAX', 'General', 'STD VOLUNTARY', 'Weekly Max', 'DECIMAL', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_VOLUNTARY_CURRENT_ALT_ELIMINATION', 'General', 'STD VOLUNTARY', 'Elimination Period', 'INTEGER', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_VOLUNTARY_CURRENT_ALT_MAX_BENEFIT_PERIOD', 'General', 'STD VOLUNTARY', 'Max benefit period', 'INTEGER', b'0', 1);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('STD_VOLUNTARY_QUOTE_ALTERNATIVE', 'General', 'STD VOLUNTARY', 'Pre-existing limits', 'BOOLEAN', b'0', 1);

/* NEW Medital plans to quote question */
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('FULL_TAKEOVER_KAISER', 'Plans to Quote', 'QUOTE DETAILS', 'Would you like us to quote alongside Kaiser?', 'BOOLEAN', b'0', 1);

/* NEW Life Rates question */
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LIFE_PER_RATE', 'Rates', 'BASIC LIFE INSURANCE', 'What is the rate for Life/AD&D?', 'TEXT', b'0', 1);

/* NEW File upload benefit questions */
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('BASE_MATCH_CURRENT_UPLOADS', 'PLANS TO QUOTE', 'BASELINE DETAILS', 'Would you like to match current?', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('BASE_QUOTE_ALTERNATIVE_UPLOADS', 'PLANS TO QUOTE', 'BASELINE DETAILS', 'Would you like to quote an alternative?', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('OPTIONAL_MATCH_CURRENT_UPLOADS', 'PLANS TO QUOTE', 'BASELINE DETAILS', 'Would you like to match current?', 'TEXT', b'1', 10);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('OPTIONAL_QUOTE_ALTERNATIVE_UPLOADS', 'PLANS TO QUOTE', 'BASELINE DETAILS', 'Would you like to quote an alternative?', 'TEXT', b'1', 10);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('MATCH_CURRENT_UPLOADS', 'GENERAL', '', 'Would you like to match current?', 'TEXT', b'1', 10);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('QUOTE_ALTERNATIVE_UPLOADS', 'GENERAL', '', 'Would you like to quote an alternative?', 'TEXT', b'1', 10);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('VOLUNTARY_MATCH_CURRENT_UPLOADS', 'GENERAL', '', 'Would you like to match current?', 'TEXT', b'1', 10);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('VOLUNTARY_QUOTE_ALTERNATIVE_UPLOADS', 'GENERAL', '', 'Would you like to quote an alternative?', 'TEXT', b'1', 10);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('BASE_MATCH_CURRENT_ENTER_PLAN_INFO', 'PLANS TO QUOTE', 'BASELINE DETAILS', 'Would you like to match current?', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('BASE_QUOTE_ALTERNATIVE_ENTER_PLAN_INFO', 'PLANS TO QUOTE', 'BASELINE DETAILS', 'Would you like to quote an alternative?', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('OPTIONAL_MATCH_CURRENT_ENTER_PLAN_INFO', 'PLANS TO QUOTE', 'BASELINE DETAILS', 'Would you like to match current?', 'TEXT', b'1', 10);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('OPTIONAL_QUOTE_ALTERNATIVE_ENTER_PLAN_INFO', 'PLANS TO QUOTE', 'BASELINE DETAILS', 'Would you like to quote an alternative?', 'TEXT', b'1', 10);

INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('MATCH_CURRENT_ENTER_PLAN_INFO', 'GENERAL', '', 'Would you like to match current?', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('QUOTE_ALTERNATIVE_ENTER_PLAN_INFO', 'GENERAL', '', 'Would you like to quote an alternative?', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('VOLUNTARY_MATCH_CURRENT_ENTER_PLAN_INFO', 'GENERAL', '', 'Would you like to match current?', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('VOLUNTARY_QUOTE_ALTERNATIVE_ENTER_PLAN_INFO', 'GENERAL', '', 'Would you like to quote an alternative?', 'TEXT', b'0', 1	);

/*Stand alone - generic (209-215)*/
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('EMPLOYEE_PARTICIPATION', 'Prequal', 'PREQUAL', 'What is the total employee participation?', 'INTEGER', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('EMPLOYEE_CONTRIBUTION', 'Prequal', 'PREQUAL', 'What is the Employee contribution?', 'INTEGER', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('DEPENDENT_CONTRIBUTION', 'Prequal', 'PREQUAL', 'What is the Dependent contribution?', 'INTEGER', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('CURRENT_CARRIER', 'Prequal', 'PREQUAL', 'Which carrier are you currently with?', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('COBRA_PENETRATION', 'Prequal', 'PREQUAL', 'What is the COBRA penetration %', 'INTEGER', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('SIC_CODE', 'Prequal', 'PREQUAL', 'What is the SIC code?', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('LARGE_CLAIMS_DATA', 'Prequal', 'PREQUAL', 'Do you have the renewal or large claims data?', 'TEXT', b'0', 1);

/* More Medical Info - Questions for each section under RFP*/
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('BENEFIT_SUMMARY_FILE', 'Information', 'CURRENT CARRIER', 'Please upload to benefit summaries', 'TEXT', b'0', 1);
INSERT INTO `tmp_benefit_info` (`code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) VALUES ('CENSUS_FILE', 'Information', 'CURRENT CARRIER', 'Please upload the census', 'TEXT', b'0', 1);

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 7, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 209;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 7, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 210;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 7, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 211;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 7, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 212;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 7, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 213;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 7, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 214;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 7, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 215;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 216;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 217;


/* Medical Questions */
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 1;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 2;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 3;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 4;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 5;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 6;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 7;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 8;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 9;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 10;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 11;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 12;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 13;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 14;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 15;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 16;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 17;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 18;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 19;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 20;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 21;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 22;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 23;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 24;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 25;

/* Dental Questions */
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 2;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 3;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 5;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 6;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 7;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 8;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 9;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 10;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 11;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 12;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 13;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 14;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 15;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 16;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 17;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 18;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 19;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 20;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 21;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 66;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 67;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 68;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 69;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 70;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 71;


/* Vision Questions */
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 2;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 3;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 5;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 6;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 7;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 8;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 9;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 10;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 11;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 12;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 13;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 14;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 15;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 16;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 17;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 18;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 19;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 20;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 21;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 26;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 27;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 28;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 29;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 30;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 31;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 32;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 33;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 34;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 35;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 36;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 37;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 38;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 39;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 40;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 41;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 42;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 43;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 44;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 45;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 46;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 47;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 48;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 49;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 50;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 51;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 52;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 53;

/* Life Questions */
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 54;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 55;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 56;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 57;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 58;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 59;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 60;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 61;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 62;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 63;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 64;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 65;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 91;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 92;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 93;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 94;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 95;

/* LTD Questions */
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 72;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 73;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 74;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 75;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 76;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 77;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 78;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 79;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 80;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 81;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 96;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 97;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 98;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 99;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 100;

/* STD Questions */

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 82;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 83;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 84;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 85;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 86;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 87;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 88;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 89;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 90;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 101;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 102;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 103;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 104;

/* Current Options for Medical, Detal and Vision */
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 105;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 106;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 105;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 106;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 105;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 106;

/* Additional Requests */
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 25;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 25;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 107;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 107;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 107;

/* Out of state contributions for Medical, Vision and Dental */
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 108;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 109;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 108;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 109;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 108;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 109;

/* Out of state under Rates section */
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 110;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 111;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 112;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 113;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 110;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 111;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 112;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 113;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 110;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 111;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 112;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 113;

/* New life basic changes */
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 114;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 115;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 116;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 117;

/* New life voluntary changes */
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 118;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 119;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 120;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 121;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 122;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 123;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 124;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 125;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 126;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 127;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 128;

/* New LTD info */
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 129;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 130;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 131;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 132;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 133;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 134;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 135;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 136;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 137;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 138;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 139;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 140;

/* New STD info */
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 141;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 142;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 143;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 144;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 145;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 146;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 147;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 148;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 149;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 150;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 151;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 152;

/* Life new questions for rates */
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 153;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 154;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 155;

/* NEW Voluntary LTD Questions */
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 156;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 157;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 158;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 159;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 160;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 161;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 162;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 163;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 164;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 165;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 166;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 167;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 168;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 169;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 170;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 171;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 172;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 173;

/* NEW Voluntary STD Questions */
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 174;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 175;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 176;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 177;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 178;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 179;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 180;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 181;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 182;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 183;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 184;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 185;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 186;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 187;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 188;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 189;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 190;

/* NEW Medical and Rates Life questions */
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 1, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 191;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 192;

/* NEW File upload benefit questions */
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 193;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 194;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 195;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 196;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 193;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 194;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 195;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 196;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 197;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 198;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 197;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 198;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 199;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 200;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 197;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 198;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 199;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 200;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 201;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 202;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 203;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 2, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 204;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 201;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 202;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 203;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 3, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 204;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 205;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 4, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 206;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 205;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 206;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 207;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 5, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 208;

INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 205;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 206;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 207;
INSERT INTO `benefit_category_info` (`benefit_category_id`, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit`) select 6, `code`, `group`, `sub_group`, `name`, `data_type`, `multivalue`, `limit` from tmp_benefit_info where tmp_benefit_info_id = 208;

DROP TABLE IF EXISTS `tmp_benefit_info`;


