UPDATE `question` SET `code` = 'addresses_for_each_location_1' WHERE `code` = 'addresses_for_each_location';

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('addresses_for_each_location_2', 'Address #2 for a location', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('addresses_for_each_location_3', 'Address #3 for a location', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('addresses_for_each_location_4', 'Address #4 for a location', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('addresses_for_each_location_5', 'Address #5 for a location', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('addresses_for_each_location_6', 'Address #6 for a location', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('addresses_for_each_location_7', 'Address #7 for a location', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('addresses_for_each_location_8', 'Address #8 for a location', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('addresses_for_each_location_9', 'Address #9 for a location', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('addresses_for_each_location_10', 'Address #10 for a location', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('addresses_for_each_location_11', 'Address #11 for a location', FALSE);

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('writing_agent_name_2', 'Writing agent name', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('writing_agent_ssn_or_tin_2', 'Writing agent SSN or TIN', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('writing_agent_license_number_2', 'Writing agent license #', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('writing_agent_license_expiration_date_2', 'Writing agent license expiration date', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('wa_currently_holds_appointment_with_uhc_2', 'Writing agent holds appointment with UnitedHealthcare?', FALSE);
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (1, 'On', (SELECT `question_id` FROM `question` WHERE CODE = 'wa_currently_holds_appointment_with_uhc_2'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (2, 'Off', (SELECT `question_id` FROM `question` WHERE CODE = 'wa_currently_holds_appointment_with_uhc_2'));
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('wa_crid_code_2', 'WA CRID code', FALSE);

INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'addresses_for_each_location_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'addresses_for_each_location_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'addresses_for_each_location_4'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'addresses_for_each_location_5'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'addresses_for_each_location_6'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'addresses_for_each_location_7'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'addresses_for_each_location_8'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'addresses_for_each_location_9'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'addresses_for_each_location_10'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'addresses_for_each_location_11'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'writing_agent_name_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'writing_agent_ssn_or_tin_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'writing_agent_license_number_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'writing_agent_license_expiration_date_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'wa_currently_holds_appointment_with_uhc_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'wa_crid_code_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));