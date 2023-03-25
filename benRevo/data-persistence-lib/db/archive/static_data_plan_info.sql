USE `br_dev`;
/* Plan info questions for each form */
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('IN_OFFICE_VISIT', 'Office Visit', 'DECIMAL', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('IN_ADA_2140_AMALGAM', '2140 Amalgam 1 surface primary/permanent tooth', 'DECIMAL', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('IN_ADA_2750_CROWN', 'ADA 2750 Crown', 'DECIMAL', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('IN_ADA_3330_ROOT_CANAL', 'ADA 3330 - Root Canal', 'DECIMAL', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('IN_ADA_8080_COMP_ORTHO_CHILD', 'ADA 8080 Children', 'DECIMAL', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('IN_ADA_8090_COMP_ORTHO_ADULT', 'ADA 8090 Adults', 'DECIMAL', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('IN_ADA_8680_COMP_ORTHO_RETENTION_FEES', 'ADA 8680 Retention Fees Children/Adult', 'DECIMAL', b'0', 1);

INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('IN_CALENDAR_YEAR_MAXIMUM', 'Calendar Year Maximum', 'DECIMAL', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('OUT_CALENDAR_YEAR_MAXIMUM', 'Calendar Year Maximum', 'DECIMAL', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('IN_CALENDAR_YEAR_DEDUCTIBLE_INDIVIDUAL', 'Per Individual', 'DECIMAL', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('OUT_CALENDAR_YEAR_DEDUCTIBLE_INDIVIDUAL', 'Per Individual', 'DECIMAL', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('IN_CALENDAR_YEAR_DEDUCTIBLE_FAMILY', 'Per Family', 'DECIMAL', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('OUT_CALENDAR_YEAR_DEDUCTIBLE_FAMILY', 'Per Family', 'DECIMAL', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('IN_CLASS_I', 'Class I Expenses - Preventive', 'DECIMAL', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('OUT_CLASS_I', 'Class I Expenses - Preventive', 'DECIMAL', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('IN_CLASS_II', 'Class II Expenses - Basic', 'DECIMAL', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('OUT_CLASS_II', 'Class II Expenses - Basic', 'DECIMAL', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('IN_CLASS_III', 'Class III Expenses - Major', 'DECIMAL', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('OUT_CLASS_III', 'Class III Expenses - Major', 'DECIMAL', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('IN_CLASS_IV', 'Class IV Expenses - Orthodontia', 'DECIMAL', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('OUT_CLASS_IV', 'Class IV Expenses - Orthodontia', 'DECIMAL', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('IN_ORTHODONTIA_MAX', 'Orthodontia Max', 'DECIMAL', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('OUT_ORTHODONTIA_MAX', 'Orthodontia Max', 'DECIMAL', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('OUT_OF_NETWORK_REIMBURSEMENT', 'Out-of-Network Reimbursement', 'TEXT', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('IMPLANT_COVERAGE', 'Implant Coverage', 'BOOLEAN', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('ENDO_COVERED_IN_BASIC', 'Endo covered in Basic?', 'BOOLEAN', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('PERIO_COVERED_IN_BASIC', 'Perio covered in Basic?', 'BOOLEAN', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('DEDUCTIBLE_WAVED_FOR_PREVENTIVE', 'Deductible waved for preventive?', 'BOOLEAN', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('IN_WAITING_PERIOD_MAJOR_SERVICE', 'Waiting period for major service', 'TEXT', b'0', 1);
INSERT INTO `plan_info` (`code`, `text`, `data_type`, `multivalue`, `limit`) VALUES ('OUT_WAITING_PERIOD_MAJOR_SERVICE', 'Waiting period for major service', 'TEXT', b'0', 1);


/* Medical plan info */
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 1);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 2);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 3);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 4);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 5);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 6);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 7);

INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 8);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 9);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 10);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 11);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 12);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 13);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 14);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 15);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 16);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 17);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 18);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 19);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 20);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 21);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 22);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 23);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 24);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 25);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 26);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 27);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 28);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 29);
INSERT INTO `plan_category_info` (`benefit_category_id`, `plan_info_id`) VALUES (2, 30);
