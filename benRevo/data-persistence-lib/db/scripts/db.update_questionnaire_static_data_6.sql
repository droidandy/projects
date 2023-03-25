DELETE FROM `form_question` WHERE `question_id` = (SELECT `question_id` FROM `question` WHERE CODE = 'current_medical_coverage_dates') AND `form_id` = (SELECT `form_id` FROM `form` WHERE name = 'group-application');
DELETE FROM `form_question` WHERE `question_id` = (SELECT `question_id` FROM `question` WHERE CODE = 'current_dental_coverage_dates') AND `form_id` = (SELECT `form_id` FROM `form` WHERE name = 'group-application');
DELETE FROM `form_question` WHERE `question_id` = (SELECT `question_id` FROM `question` WHERE CODE = 'covered_by_united_healthcare_date_from') AND `form_id` = (SELECT `form_id` FROM `form` WHERE name = 'group-application');
DELETE FROM `form_question` WHERE `question_id` = (SELECT `question_id` FROM `question` WHERE CODE = 'covered_by_united_healthcare_date_to') AND `form_id` = (SELECT `form_id` FROM `form` WHERE name = 'group-application');

DELETE from answer where question_id = (Select question_id from `question` WHERE `code` = 'current_medical_coverage_dates');
DELETE from form_question where question_id = (Select question_id from `question` WHERE `code` = 'current_medical_coverage_dates');
DELETE FROM `question` WHERE `code` = 'current_medical_coverage_dates';

DELETE from answer where question_id = (Select question_id from `question` WHERE `code` = 'current_dental_coverage_dates');
DELETE from form_question where question_id = (Select question_id from `question` WHERE `code` = 'current_dental_coverage_dates');
DELETE FROM `question` WHERE `code` = 'current_dental_coverage_dates';

DELETE from answer where question_id = (Select question_id from `question` WHERE `code` = 'covered_by_united_healthcare_date_from');
DELETE from form_question where question_id = (Select question_id from `question` WHERE `code` = 'covered_by_united_healthcare_date_from');
DELETE FROM `question` WHERE `code` = 'covered_by_united_healthcare_date_from';

DELETE from answer where question_id = (Select question_id from `question` WHERE `code` = 'covered_by_united_healthcare_date_to');
DELETE from form_question where question_id = (Select question_id from `question` WHERE `code` = 'covered_by_united_healthcare_date_to');
DELETE FROM `question` WHERE `code` = 'covered_by_united_healthcare_date_to';

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('effective_date', 'Effective Date', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('groups_legal_name', 'Group’s Legal Name', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('tax_id', 'Tax ID', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('dba', 'DBA, if applicable', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('general_information_address', 'Address', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('number_of_years_in_business', '# of Years in Business', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('general_information_city', 'City', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('general_information_state', 'State', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('general_information_zip_code', 'Zip Code', FALSE);

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('organization_type', 'Organization Type', FALSE);
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (1, 'Partnership', (SELECT `question_id` FROM `question` WHERE CODE = 'organization_type'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (2, 'C-Corp', (SELECT `question_id` FROM `question` WHERE CODE = 'organization_type'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (3, 'S-Corp', (SELECT `question_id` FROM `question` WHERE CODE = 'organization_type'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (4, 'LLC/LLP', (SELECT `question_id` FROM `question` WHERE CODE = 'organization_type'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (5, 'Ind. Contractor', (SELECT `question_id` FROM `question` WHERE CODE = 'organization_type'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (6, 'Non-Profit', (SELECT `question_id` FROM `question` WHERE CODE = 'organization_type'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (7, 'Sole Proprietor', (SELECT `question_id` FROM `question` WHERE CODE = 'organization_type'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (8, 'Other', (SELECT `question_id` FROM `question` WHERE CODE = 'organization_type'));
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('organization_type_other', 'Organization Type', FALSE);

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('industry_sic_code', 'Industry (SIC) Code', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('names_of_affiliated_firms', 'Names of affiliated/subsidiary firms whose employees are going to be covered', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('number_of_hours_per_week_to_be_eligible', '# of hours per week to be eligible', FALSE);

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('classes_excluded', 'Classes Excluded', FALSE);
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (1, 'None', (SELECT `question_id` FROM `question` WHERE CODE = 'classes_excluded'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (2, 'Union', (SELECT `question_id` FROM `question` WHERE CODE = 'classes_excluded'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (3, 'Hourly', (SELECT `question_id` FROM `question` WHERE CODE = 'classes_excluded'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (4, 'Non-Management', (SELECT `question_id` FROM `question` WHERE CODE = 'classes_excluded'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (5, 'Non-Owners"', (SELECT `question_id` FROM `question` WHERE CODE = 'classes_excluded'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('classes_excluded_number_of_hours', '# of hours', FALSE);

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('waiting_period_for_new_hires', 'Waiting Period for New Hires', FALSE);
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (1, 'First Of The Month Date of Hire', (SELECT `question_id` FROM `question` WHERE CODE = 'waiting_period_for_new_hires'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (2, 'First Of The Month', (SELECT `question_id` FROM `question` WHERE CODE = 'waiting_period_for_new_hires'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (3, 'Date of Hire No Waiting Period', (SELECT `question_id` FROM `question` WHERE CODE = 'waiting_period_for_new_hires'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('first_of_month', '1st of the month following X [months] [days] of employment', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('months_days_of_employment_following_date_of_hire', '[months] [days] of employment following Date of Hire', FALSE);

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('employees_terminate_on', 'Employees terminate on', FALSE);
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (1, 'Last day of month following date of termination', (SELECT `question_id` FROM `question` WHERE CODE = 'employees_terminate_on'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (2, 'Date of termination', (SELECT `question_id` FROM `question` WHERE CODE = 'employees_terminate_on'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('subject_to_erisa_regulation', 'Subject to ERISA Regulation', FALSE);
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'subject_to_erisa_regulation'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'subject_to_erisa_regulation'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('plan_code_1_1', 'Plan Code', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('plan_code_2_1', 'Plan Code', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('plan_code_3_1', 'Plan Code', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('plan_code_1_2', 'Plan Code', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('plan_code_2_2', 'Plan Code', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('plan_code_3_2', 'Plan Code', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('plan_code_1_3', 'Plan Code', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('plan_code_2_3', 'Plan Code', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('plan_code_3_3', 'Plan Code', FALSE);

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('signature', 'Signature (Required)', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('binding_arbitration_date', 'Date (Required)', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('authorized_signature', 'Signature', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('authorized_signature_date', 'Date', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('writing_agent_signature', 'Writing Agent Signature', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('writing_agent_date', 'Date', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('current_medical_carrier', 'Current medical carrier', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('current_medical_carrier_date_began', 'Date began', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('current_medical_carrier_date_terminated', 'Date terminated', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('current_dental_carrier', 'Current dental carrier', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('current_dental_carrier_date_began', 'Date began', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('current_dental_carrier_date_terminated', 'Date terminated', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('date_coverage_terminated', 'Date coverage terminated', FALSE);

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('names_of_persons_currently_on_cobra_name_1', 'Name of person', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('names_of_persons_currently_on_cobra_name_2', 'Name of person', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('names_of_persons_currently_on_cobra_name_3', 'Name of person', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('names_of_persons_currently_on_cobra_name_4', 'Name of person', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('names_of_persons_currently_on_cobra_name_5', 'Name of person', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('names_of_persons_currently_on_cobra_name_6', 'Name of person', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('names_of_persons_currently_on_cobra_name_7', 'Name of person', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('names_of_persons_currently_on_cobra_name_8', 'Name of person', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('names_of_persons_currently_on_cobra_name_9', 'Name of person', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('names_of_persons_currently_on_cobra_name_10', 'Name of person', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('names_of_persons_currently_on_cobra_name_11', 'Name of person', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('names_of_persons_currently_on_cobra_name_12', 'Name of person', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('names_of_persons_currently_on_cobra_name_13', 'Name of person', FALSE);

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('type_of_coverage_1', 'Type of coverage', FALSE);
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (1, 'COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_1'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (2, 'Cal-COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_1'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (3, 'Cal-COBRA-AB1401', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_1'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (4, 'Extended/Disabled COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_1'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('type_of_coverage_2', 'Type of coverage', FALSE);
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (1, 'COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_2'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (2, 'Cal-COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_2'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (3, 'Cal-COBRA-AB1401', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_2'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (4, 'Extended/Disabled COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_2'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('type_of_coverage_3', 'Type of coverage', FALSE);
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (1, 'COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_3'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (2, 'Cal-COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_3'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (3, 'Cal-COBRA-AB1401', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_3'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (4, 'Extended/Disabled COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_3'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('type_of_coverage_4', 'Type of coverage', FALSE);
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (1, 'COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_4'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (2, 'Cal-COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_4'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (3, 'Cal-COBRA-AB1401', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_4'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (4, 'Extended/Disabled COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_4'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('type_of_coverage_5', 'Type of coverage', FALSE);
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (1, 'COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_5'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (2, 'Cal-COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_5'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (3, 'Cal-COBRA-AB1401', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_5'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (4, 'Extended/Disabled COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_5'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('type_of_coverage_6', 'Type of coverage', FALSE);
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (1, 'COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_6'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (2, 'Cal-COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_6'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (3, 'Cal-COBRA-AB1401', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_6'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (4, 'Extended/Disabled COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_6'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('type_of_coverage_7', 'Type of coverage', FALSE);
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (1, 'COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_7'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (2, 'Cal-COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_7'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (3, 'Cal-COBRA-AB1401', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_7'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (4, 'Extended/Disabled COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_7'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('type_of_coverage_8', 'Type of coverage', FALSE);
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (1, 'COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_8'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (2, 'Cal-COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_8'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (3, 'Cal-COBRA-AB1401', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_8'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (4, 'Extended/Disabled COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_8'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('type_of_coverage_9', 'Type of coverage', FALSE);
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (1, 'COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_9'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (2, 'Cal-COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_9'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (3, 'Cal-COBRA-AB1401', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_9'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (4, 'Extended/Disabled COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_9'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('type_of_coverage_10', 'Type of coverage', FALSE);
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (1, 'COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_10'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (2, 'Cal-COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_10'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (3, 'Cal-COBRA-AB1401', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_10'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (4, 'Extended/Disabled COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_10'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('type_of_coverage_11', 'Type of coverage', FALSE);
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (1, 'COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_11'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (2, 'Cal-COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_11'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (3, 'Cal-COBRA-AB1401', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_11'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (4, 'Extended/Disabled COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_11'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('type_of_coverage_12', 'Type of coverage', FALSE);
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (1, 'COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_12'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (2, 'Cal-COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_12'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (3, 'Cal-COBRA-AB1401', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_12'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (4, 'Extended/Disabled COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_12'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('type_of_coverage_13', 'Type of coverage', FALSE);
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (1, 'COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_13'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (2, 'Cal-COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_13'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (3, 'Cal-COBRA-AB1401', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_13'));
INSERT INTO `variant` (`number`, `option`, `question_id`) VALUES (4, 'Extended/Disabled COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_13'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('qualifying_event_1', 'Qualifying Event', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('qualifying_event_2', 'Qualifying Event', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('qualifying_event_3', 'Qualifying Event', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('qualifying_event_4', 'Qualifying Event', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('qualifying_event_5', 'Qualifying Event', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('qualifying_event_6', 'Qualifying Event', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('qualifying_event_7', 'Qualifying Event', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('qualifying_event_8', 'Qualifying Event', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('qualifying_event_9', 'Qualifying Event', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('qualifying_event_10', 'Qualifying Event', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('qualifying_event_11', 'Qualifying Event', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('qualifying_event_12', 'Qualifying Event', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('qualifying_event_13', 'Qualifying Event', FALSE);

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('date_of_qualifying_event_1', 'Date of Qualifying Event', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('date_of_qualifying_event_2', 'Date of Qualifying Event', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('date_of_qualifying_event_3', 'Date of Qualifying Event', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('date_of_qualifying_event_4', 'Date of Qualifying Event', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('date_of_qualifying_event_5', 'Date of Qualifying Event', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('date_of_qualifying_event_6', 'Date of Qualifying Event', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('date_of_qualifying_event_7', 'Date of Qualifying Event', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('date_of_qualifying_event_8', 'Date of Qualifying Event', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('date_of_qualifying_event_9', 'Date of Qualifying Event', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('date_of_qualifying_event_10', 'Date of Qualifying Event', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('date_of_qualifying_event_11', 'Date of Qualifying Event', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('date_of_qualifying_event_12', 'Date of Qualifying Event', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('date_of_qualifying_event_13', 'Date of Qualifying Event', FALSE);

INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'effective_date'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'groups_legal_name'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'tax_id'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dba'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'general_information_address'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'number_of_years_in_business'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'general_information_city'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'general_information_state'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'general_information_zip_code'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'organization_type'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'organization_type_other'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'industry_sic_code'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'names_of_affiliated_firms'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'number_of_hours_per_week_to_be_eligible'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'classes_excluded'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'classes_excluded_number_of_hours'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'waiting_period_for_new_hires'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'first_of_month'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'months_days_of_employment_following_date_of_hire'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'employees_terminate_on'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'subject_to_erisa_regulation'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'plan_code_1_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'plan_code_2_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'plan_code_3_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'plan_code_1_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'plan_code_2_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'plan_code_3_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'plan_code_1_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'plan_code_2_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'plan_code_3_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'signature'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'binding_arbitration_date'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'authorized_signature'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'authorized_signature_date'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'writing_agent_signature'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'writing_agent_date'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'current_medical_carrier'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'current_medical_carrier_date_began'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'current_medical_carrier_date_terminated'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'current_dental_carrier'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'current_dental_carrier_date_began'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'current_dental_carrier_date_terminated'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'date_coverage_terminated'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'names_of_persons_currently_on_cobra_name_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'names_of_persons_currently_on_cobra_name_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'names_of_persons_currently_on_cobra_name_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'names_of_persons_currently_on_cobra_name_4'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'names_of_persons_currently_on_cobra_name_5'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'names_of_persons_currently_on_cobra_name_6'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'names_of_persons_currently_on_cobra_name_7'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'names_of_persons_currently_on_cobra_name_8'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'names_of_persons_currently_on_cobra_name_9'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'names_of_persons_currently_on_cobra_name_10'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'names_of_persons_currently_on_cobra_name_11'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'names_of_persons_currently_on_cobra_name_12'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'names_of_persons_currently_on_cobra_name_13'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_4'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_5'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_6'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_7'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_8'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_9'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_10'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_11'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_12'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_coverage_13'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'qualifying_event_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'qualifying_event_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'qualifying_event_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'qualifying_event_4'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'qualifying_event_5'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'qualifying_event_6'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'qualifying_event_7'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'qualifying_event_8'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'qualifying_event_9'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'qualifying_event_10'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'qualifying_event_11'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'qualifying_event_12'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'qualifying_event_13'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'date_of_qualifying_event_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'date_of_qualifying_event_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'date_of_qualifying_event_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'date_of_qualifying_event_4'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'date_of_qualifying_event_5'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'date_of_qualifying_event_6'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'date_of_qualifying_event_7'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'date_of_qualifying_event_8'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'date_of_qualifying_event_9'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'date_of_qualifying_event_10'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'date_of_qualifying_event_11'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'date_of_qualifying_event_12'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'date_of_qualifying_event_13'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));