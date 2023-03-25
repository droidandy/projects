INSERT INTO `form` (`name`, `carrier_id`) VALUES ('anthem-blue-cross-questionnaire', (SELECT `carrier_id` FROM `carrier` WHERE name = 'ANTHEM_BLUE_CROSS'));
INSERT INTO `form` (`name`, `carrier_id`) VALUES ('anthem-blue-cross-employer-application', (SELECT `carrier_id` FROM `carrier` WHERE name = 'ANTHEM_BLUE_CROSS'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('is_mailing_address_different', 'Is mailing address different then physical street address?', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'is_mailing_address_different'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'is_mailing_address_different'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('mailing_address', 'Street address', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('mailing_city', 'City', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('mailing_state', 'State', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('mailing_zip', 'Zip Code', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('mailing_phone', 'Phone no.', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('mailing_fax', 'Fax no', FALSE);

INSERT INTO variant (`number`, `option`, `question_id`) VALUES (9, 'Corporation', (SELECT `question_id` FROM `question` WHERE CODE = 'organization_type'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (10, 'Proprietorship', (SELECT `question_id` FROM `question` WHERE CODE = 'organization_type'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_firms_quantity', 'Affiliated Firms Quantity', FALSE);

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_name_1', 'Company name', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_name_2', 'Company name', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_name_3', 'Company name', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_name_4', 'Company name', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_name_5', 'Company name', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_name_6', 'Company name', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_name_7', 'Company name', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_name_8', 'Company name', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_name_9', 'Company name', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_name_10', 'Company name', FALSE);

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_address_1', 'Address', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_address_2', 'Address', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_address_3', 'Address', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_address_4', 'Address', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_address_5', 'Address', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_address_6', 'Address', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_address_7', 'Address', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_address_8', 'Address', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_address_9', 'Address', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_address_10', 'Address', FALSE);

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('billing_statement_group_number', 'Indicate how the group name should appear on billing statement and Evidence of Coverage', FALSE);

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('initial_identification_cards_mailed_to', 'Where would you like initial identification cards mailed?', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Employees residence', (SELECT `question_id` FROM `question` WHERE CODE = 'initial_identification_cards_mailed_to'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Group', (SELECT `question_id` FROM `question` WHERE CODE = 'initial_identification_cards_mailed_to'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('maintenance_identification_cards_mailed_to', 'Where would you like maintenance identification cards (i.e., new hires) mailed?', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Employees residence', (SELECT `question_id` FROM `question` WHERE CODE = 'maintenance_identification_cards_mailed_to'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Group', (SELECT `question_id` FROM `question` WHERE CODE = 'maintenance_identification_cards_mailed_to'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('tpa', 'Will a TPA perform any functions for your group? If “Yes,” complete TPA Form.', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'tpa'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'tpa'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('payment_information_type', 'Payment Information Type', TRUE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Initial premium', (SELECT `question_id` FROM `question` WHERE CODE = 'payment_information_type'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Initial premium and recurring', (SELECT `question_id` FROM `question` WHERE CODE = 'payment_information_type'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'Other', (SELECT `question_id` FROM `question` WHERE CODE = 'payment_information_type'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('payment_information_type_other', 'Payment Information Type (Other)', FALSE);

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('future_recurring', 'For FUTURE RECURRING monthly payments, select one of the following options', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Self-service', (SELECT `question_id` FROM `question` WHERE CODE = 'future_recurring'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'ACH', (SELECT `question_id` FROM `question` WHERE CODE = 'future_recurring'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'Automatic', (SELECT `question_id` FROM `question` WHERE CODE = 'future_recurring'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (4, 'Self-bill', (SELECT `question_id` FROM `question` WHERE CODE = 'future_recurring'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('premiums_to_be_withdrawn_monthly', 'Date premiums to be withdrawn each month', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('financial_institution_name', ' Financial institution name', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('financial_institution_street_address', 'Financial institution street address', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('financial_institution_city', 'City', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('financial_institution_state', 'State', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('financial_institution_zip', 'Zip Code', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('financial_institution_routing_number', 'Transit routing number', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('financial_institution_account_number', 'Account number', FALSE);

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('financial_institution_account_type', 'Account type', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Checking', (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_account_type'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Savings', (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_account_type'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('financial_institution_for_recurring_is_the_same', 'Is the Financial institution information for monthly recurring premium payments the same as above?', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_for_recurring_is_the_same'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_for_recurring_is_the_same'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('financial_institution_for_recurring_name', 'Financial institution name', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('financial_institution_for_recurring_street_address', 'Financial institution street address', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('financial_institution_for_recurring_city', 'City', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('financial_institution_for_recurring_state', 'State', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('financial_institution_for_recurring_zip', 'Zip Code', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('financial_institution_for_recurring_routing_number', 'Transit routing number', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('financial_institution_for_recurring_account_number', 'Account number', FALSE);

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('financial_institution_for_recurring_account_type', 'Account type', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Checking', (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_for_recurring_account_type'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Savings', (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_for_recurring_account_type'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('client_point_of_contact_name', 'Name', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('client_point_of_contact_title', 'Title', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('client_point_of_contact_street_address', 'Street Address', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('client_point_of_contact_city', 'City', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('client_point_of_contact_state', 'State', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('client_point_of_contact_zip', 'Zip Code', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('client_point_of_contact_phone', 'Phone no.', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('client_point_of_contact_fax', 'Fax no', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('client_point_of_contact_email', 'Email address', FALSE);

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('billing_contact_city', 'City', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('billing_contact_state', 'State', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('billing_contact_zip', 'Zip Code', FALSE);

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('designated_hipaa_name', 'Name', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('designated_hipaa_title', 'Title', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('designated_hipaa_street_address', 'Street Address', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('designated_hipaa_city', 'City', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('designated_hipaa_state', 'State', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('designated_hipaa_zip', 'Zip Code', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('designated_hipaa_phone', 'Phone no.', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('designated_hipaa_fax', 'Fax no', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('designated_hipaa_email', 'Email address', FALSE);

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('decision_maker_name', 'Name', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('decision_maker_title', 'Title', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('decision_maker_street_address', 'Street Address', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('decision_maker_city', 'City', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('decision_maker_state', 'State', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('decision_maker_zip', 'Zip Code', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('decision_maker_phone', 'Phone no.', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('decision_maker_fax', 'Fax no', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('decision_maker_email', 'Email address', FALSE);

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('eoc_will_be_sent_out_to', 'English EOCs are available on anthem.com/ca once members register and log in after they are enrolled. Electronic version of EOC will be sent out to:', TRUE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Group administrator', (SELECT `question_id` FROM `question` WHERE CODE = 'eoc_will_be_sent_out_to'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Decision maker', (SELECT `question_id` FROM `question` WHERE CODE = 'eoc_will_be_sent_out_to'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('max_hard_copy_quantities_per_product', 'Request max hard copy quantities of each product', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'max_hard_copy_quantities_per_product'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'max_hard_copy_quantities_per_product'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('type_of_elligible_employees', 'Type of elligible employees', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Active full-time', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_elligible_employees'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Active part-time', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_elligible_employees'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'Retirees', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_elligible_employees'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('hours_per_week_for_full_time', 'Hours per week for full time employees', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('hours_per_week_for_part_time', 'Hours per week for part time employees', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('total_number_of_eligible_employees', 'Total number of eligible employees covered under a spouse’s or domestic partner’s plan', FALSE);

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('domestic_partnership_coverage', 'Domestic Partnership Coverage', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'STAT (Statutory AB2208)', (SELECT `question_id` FROM `question` WHERE CODE = 'domestic_partnership_coverage'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'STAC (Statutory AB2208) with DP COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'domestic_partnership_coverage'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'Statutory Plus', (SELECT `question_id` FROM `question` WHERE CODE = 'domestic_partnership_coverage'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (4, 'Statutory Plus with DP COBRA', (SELECT `question_id` FROM `question` WHERE CODE = 'domestic_partnership_coverage'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (5, 'SF/LA Ordinance (includes DP COBRA)', (SELECT `question_id` FROM `question` WHERE CODE = 'domestic_partnership_coverage'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (6, 'Anthem Standard (STD)', (SELECT `question_id` FROM `question` WHERE CODE = 'domestic_partnership_coverage'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('employer_contribution_of_non_anthem_for_employee', 'If a non-Anthem Blue Cross health plan is offered alongside Anthem Blue Cross, the employer contribution for the non-Anthem Blue Cross health plan is: (if yes ask questions below for employee)', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('employer_contribution_of_non_anthem_for_dependent', 'If a non-Anthem Blue Cross health plan is offered alongside Anthem Blue Cross, the employer contribution for the non-Anthem Blue Cross health plan is: (if yes ask questions below for dependent)', FALSE);

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('cal_cobra_eligibles_and_enrollees', 'Do you have any Cal-COBRA eligibles and enrollees? If “Yes,” please be sure to send open enrollment information, including Cal-COBRA enrollment forms to these members (responsibility of the employer group, per California law)', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'cal_cobra_eligibles_and_enrollees'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'cal_cobra_eligibles_and_enrollees'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('standard_method_for_initial_enrollment', 'Standard method for initial  enrollment', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Census Tool', (SELECT `question_id` FROM `question` WHERE CODE = 'standard_method_for_initial_enrollment'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, '834 File Format', (SELECT `question_id` FROM `question` WHERE CODE = 'standard_method_for_initial_enrollment'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'Real-Time Connection', (SELECT `question_id` FROM `question` WHERE CODE = 'standard_method_for_initial_enrollment'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (4, 'Paper', (SELECT `question_id` FROM `question` WHERE CODE = 'standard_method_for_initial_enrollment'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('standard_method_for_ongoing_enrollment', 'Standard method for ongoing  enrollments and maintenance changes', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'EmployerAccess', (SELECT `question_id` FROM `question` WHERE CODE = 'standard_method_for_ongoing_enrollment'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Census Tool', (SELECT `question_id` FROM `question` WHERE CODE = 'standard_method_for_ongoing_enrollment'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, '834 File Format', (SELECT `question_id` FROM `question` WHERE CODE = 'standard_method_for_ongoing_enrollment'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (4, 'Real-Time Connection', (SELECT `question_id` FROM `question` WHERE CODE = 'standard_method_for_ongoing_enrollment'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('speciality_waiting_period', 'Speciality waiting period (can be same as medical or can be different)', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Speciality products ONLY', (SELECT `question_id` FROM `question` WHERE CODE = 'speciality_waiting_period'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('defined_under_applicable_law', 'Does your group meet the definition of a large group employer as defined under applicable law', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'defined_under_applicable_law'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'defined_under_applicable_law'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('group_elects_to_opt_out_of_authorizing', 'Group elects to opt-out of authorizing the agent/producer/broker/general agent to access and change the group’s information on behalf of the group', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'group_elects_to_opt_out_of_authorizing'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('comments', 'Do you have any special comments or instructions?', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('first_proposed_enrollment_meeting_date', 'First proposed enrollment meeting date (MM/DD/YYYY)', FALSE);

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('non_anthem_plan_is_offered', 'If a non-Anthem Blue Cross health plan is offered alongside Anthem Blue Cross, the employer contribution for the non-Anthem Blue Cross health plan is', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'non_anthem_plan_is_offered'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'non_anthem_plan_is_offered'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_coverage_plan_name_1', 'Select medical plan from drop down', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Traditional HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Select HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'Select Plus HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (4, 'Vivity HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (5, 'Advantage HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (6, 'Priority HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (7, 'PPO (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (8, 'Solution PPO (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (9, 'Advantage PPO (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (10, 'BlueCard PPO Exclusive (Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (11, 'ACO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (12, 'Lumenos HSA (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (13, 'Lumenos HRA (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (14, 'Lumenos HIA Plus (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (15, 'Anthem Health Marketplace (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (16, 'EPO (Non-Pooled Only)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (17, 'CareAdvocate PPO (Non-Pooled Only; CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (18, 'POS (Non-Pooled Only)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (18, 'Medicare Supplement (Non-Pooled Only)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_1'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_employee_ca_contribution_1', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_employee_non_ca_contribution_1', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_dependent_ca_contribution_1', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_dependent_non_ca_contribution_1', '', FALSE);

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_coverage_plan_name_2', 'Select medical plan from drop down', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Traditional HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Select HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'Select Plus HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (4, 'Vivity HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (5, 'Advantage HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (6, 'Priority HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (7, 'PPO (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (8, 'Solution PPO (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (9, 'Advantage PPO (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (10, 'BlueCard PPO Exclusive (Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (11, 'ACO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (12, 'Lumenos HSA (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (13, 'Lumenos HRA (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (14, 'Lumenos HIA Plus (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (15, 'Anthem Health Marketplace (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (16, 'EPO (Non-Pooled Only)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (17, 'CareAdvocate PPO (Non-Pooled Only; CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (18, 'POS (Non-Pooled Only)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (18, 'Medicare Supplement (Non-Pooled Only)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_2'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_employee_ca_contribution_2', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_employee_non_ca_contribution_2', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_dependent_ca_contribution_2', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_dependent_non_ca_contribution_2', '', FALSE);

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_coverage_plan_name_3', 'Select medical plan from drop down', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Traditional HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_3'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Select HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_3'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'Select Plus HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_3'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (4, 'Vivity HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_3'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (5, 'Advantage HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_3'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (6, 'Priority HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_3'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (7, 'PPO (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_3'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (8, 'Solution PPO (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_3'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (9, 'Advantage PPO (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_3'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (10, 'BlueCard PPO Exclusive (Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_3'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (11, 'ACO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_3'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (12, 'Lumenos HSA (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_3'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (13, 'Lumenos HRA (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_3'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (14, 'Lumenos HIA Plus (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_3'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (15, 'Anthem Health Marketplace (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_3'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (16, 'EPO (Non-Pooled Only)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_3'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (17, 'CareAdvocate PPO (Non-Pooled Only; CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_3'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (18, 'POS (Non-Pooled Only)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_3'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (18, 'Medicare Supplement (Non-Pooled Only)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_3'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_employee_ca_contribution_3', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_employee_non_ca_contribution_3', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_dependent_ca_contribution_3', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_dependent_non_ca_contribution_3', '', FALSE);

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_coverage_plan_name_4', 'Select medical plan from drop down', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Traditional HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_4'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Select HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_4'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'Select Plus HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_4'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (4, 'Vivity HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_4'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (5, 'Advantage HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_4'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (6, 'Priority HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_4'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (7, 'PPO (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_4'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (8, 'Solution PPO (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_4'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (9, 'Advantage PPO (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_4'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (10, 'BlueCard PPO Exclusive (Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_4'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (11, 'ACO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_4'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (12, 'Lumenos HSA (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_4'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (13, 'Lumenos HRA (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_4'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (14, 'Lumenos HIA Plus (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_4'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (15, 'Anthem Health Marketplace (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_4'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (16, 'EPO (Non-Pooled Only)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_4'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (17, 'CareAdvocate PPO (Non-Pooled Only; CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_4'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (18, 'POS (Non-Pooled Only)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_4'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (18, 'Medicare Supplement (Non-Pooled Only)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_4'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_employee_ca_contribution_4', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_employee_non_ca_contribution_4', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_dependent_ca_contribution_4', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_dependent_non_ca_contribution_4', '', FALSE);

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_coverage_plan_name_5', 'Select medical plan from drop down', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Traditional HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_5'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Select HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_5'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'Select Plus HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_5'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (4, 'Vivity HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_5'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (5, 'Advantage HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_5'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (6, 'Priority HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_5'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (7, 'PPO (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_5'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (8, 'Solution PPO (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_5'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (9, 'Advantage PPO (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_5'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (10, 'BlueCard PPO Exclusive (Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_5'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (11, 'ACO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_5'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (12, 'Lumenos HSA (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_5'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (13, 'Lumenos HRA (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_5'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (14, 'Lumenos HIA Plus (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_5'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (15, 'Anthem Health Marketplace (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_5'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (16, 'EPO (Non-Pooled Only)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_5'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (17, 'CareAdvocate PPO (Non-Pooled Only; CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_5'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (18, 'POS (Non-Pooled Only)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_5'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (18, 'Medicare Supplement (Non-Pooled Only)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_5'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_employee_ca_contribution_5', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_employee_non_ca_contribution_5', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_dependent_ca_contribution_5', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_dependent_non_ca_contribution_5', '', FALSE);

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_coverage_plan_name_6', 'Select medical plan from drop down', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Traditional HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_6'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Select HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_6'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'Select Plus HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_6'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (4, 'Vivity HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_6'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (5, 'Advantage HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_6'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (6, 'Priority HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_6'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (7, 'PPO (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_6'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (8, 'Solution PPO (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_6'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (9, 'Advantage PPO (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_6'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (10, 'BlueCard PPO Exclusive (Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_6'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (11, 'ACO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_6'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (12, 'Lumenos HSA (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_6'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (13, 'Lumenos HRA (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_6'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (14, 'Lumenos HIA Plus (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_6'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (15, 'Anthem Health Marketplace (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_6'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (16, 'EPO (Non-Pooled Only)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_6'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (17, 'CareAdvocate PPO (Non-Pooled Only; CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_6'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (18, 'POS (Non-Pooled Only)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_6'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (18, 'Medicare Supplement (Non-Pooled Only)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_6'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_employee_ca_contribution_6', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_employee_non_ca_contribution_6', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_dependent_ca_contribution_6', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_dependent_non_ca_contribution_6', '', FALSE);

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_coverage_plan_name_7', 'Select medical plan from drop down', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Traditional HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_7'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Select HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_7'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'Select Plus HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_7'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (4, 'Vivity HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_7'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (5, 'Advantage HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_7'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (6, 'Priority HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_7'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (7, 'PPO (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_7'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (8, 'Solution PPO (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_7'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (9, 'Advantage PPO (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_7'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (10, 'BlueCard PPO Exclusive (Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_7'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (11, 'ACO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_7'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (12, 'Lumenos HSA (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_7'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (13, 'Lumenos HRA (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_7'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (14, 'Lumenos HIA Plus (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_7'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (15, 'Anthem Health Marketplace (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_7'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (16, 'EPO (Non-Pooled Only)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_7'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (17, 'CareAdvocate PPO (Non-Pooled Only; CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_7'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (18, 'POS (Non-Pooled Only)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_7'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (18, 'Medicare Supplement (Non-Pooled Only)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_7'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_employee_ca_contribution_7', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_employee_non_ca_contribution_7', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_dependent_ca_contribution_7', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_dependent_non_ca_contribution_7', '', FALSE);

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_coverage_plan_name_8', 'Select medical plan from drop down', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Traditional HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_8'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Select HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_8'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'Select Plus HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_8'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (4, 'Vivity HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_8'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (5, 'Advantage HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_8'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (6, 'Priority HMO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_8'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (7, 'PPO (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_8'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (8, 'Solution PPO (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_8'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (9, 'Advantage PPO (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_8'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (10, 'BlueCard PPO Exclusive (Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_8'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (11, 'ACO', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_8'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (12, 'Lumenos HSA (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_8'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (13, 'Lumenos HRA (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_8'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (14, 'Lumenos HIA Plus (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_8'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (15, 'Anthem Health Marketplace (CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_8'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (16, 'EPO (Non-Pooled Only)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_8'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (17, 'CareAdvocate PPO (Non-Pooled Only; CA or Non-CA)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_8'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (18, 'POS (Non-Pooled Only)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_8'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (18, 'Medicare Supplement (Non-Pooled Only)', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_8'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_employee_ca_contribution_8', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_employee_non_ca_contribution_8', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_dependent_ca_contribution_8', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_dependent_non_ca_contribution_8', '', FALSE);

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_coverage_plan_name_1', 'Select medical plan from drop down', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Dental Net', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Voluntary Dental Net', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'Choice Dental', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (4, 'Dental Blue PPO/Incentive', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (5, 'National Dental (Non-Pooled)', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (6, 'Dental Prime', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (7, 'Dental Complete', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (8, 'Dental Prime Voluntary', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (9, 'Dental Complete Voluntary', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_1'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_employee_ca_contribution_1', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_employee_non_ca_contribution_1', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_dependent_ca_contribution_1', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_dependent_non_ca_contribution_1', '', FALSE);

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_coverage_plan_name_2', 'Select medical plan from drop down', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Dental Net', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Voluntary Dental Net', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'Choice Dental', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (4, 'Dental Blue PPO/Incentive', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (5, 'National Dental (Non-Pooled)', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (6, 'Dental Prime', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (7, 'Dental Complete', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (8, 'Dental Prime Voluntary', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (9, 'Dental Complete Voluntary', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_2'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_employee_ca_contribution_2', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_employee_non_ca_contribution_2', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_dependent_ca_contribution_2', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_dependent_non_ca_contribution_2', '', FALSE);

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_coverage_plan_name_3', 'Select medical plan from drop down', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Dental Net', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_3'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Voluntary Dental Net', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_3'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'Choice Dental', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_3'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (4, 'Dental Blue PPO/Incentive', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_3'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (5, 'National Dental (Non-Pooled)', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_3'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (6, 'Dental Prime', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_3'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (7, 'Dental Complete', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_3'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (8, 'Dental Prime Voluntary', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_3'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (9, 'Dental Complete Voluntary', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_3'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_employee_ca_contribution_3', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_employee_non_ca_contribution_3', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_dependent_ca_contribution_3', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_dependent_non_ca_contribution_3', '', FALSE);

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_coverage_plan_name_4', 'Select medical plan from drop down', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Dental Net', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_4'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Voluntary Dental Net', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_4'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'Choice Dental', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_4'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (4, 'Dental Blue PPO/Incentive', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_4'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (5, 'National Dental (Non-Pooled)', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_4'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (6, 'Dental Prime', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_4'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (7, 'Dental Complete', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_4'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (8, 'Dental Prime Voluntary', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_4'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (9, 'Dental Complete Voluntary', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_4'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_employee_ca_contribution_4', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_employee_non_ca_contribution_4', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_dependent_ca_contribution_4', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_dependent_non_ca_contribution_4', '', FALSE);


INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('vision_coverage_plan_name_1', 'Select medical plan from drop down', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Blue View Vision', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Voluntary Vision', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_1'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('vision_employee_ca_contribution_1', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('vision_employee_non_ca_contribution_1', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('vision_dependent_ca_contribution_1', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('vision_dependent_non_ca_contribution_1', '', FALSE);

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('vision_coverage_plan_name_2', 'Select medical plan from drop down', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Blue View Vision', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Voluntary Vision', (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_2'));

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('vision_employee_ca_contribution_2', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('vision_employee_non_ca_contribution_2', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('vision_dependent_ca_contribution_2', '', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('vision_dependent_non_ca_contribution_2', '', FALSE);

INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'billing_statement_group_number'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dba'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'initial_identification_cards_mailed_to'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'maintenance_identification_cards_mailed_to'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'tpa'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'payment_information_type'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'payment_information_type_other'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'future_recurring'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'premiums_to_be_withdrawn_monthly'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_name'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_street_address'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_city'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_state'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_zip'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_routing_number'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_account_number'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_account_type'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_for_recurring_is_the_same'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_for_recurring_name'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_for_recurring_street_address'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_for_recurring_city'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_for_recurring_state'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_for_recurring_zip'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_for_recurring_routing_number'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_for_recurring_account_number'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_for_recurring_account_type'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'authorized_signer_for_group_name'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'client_point_of_contact_name'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'client_point_of_contact_title'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'client_point_of_contact_street_address'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'client_point_of_contact_city'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'client_point_of_contact_state'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'client_point_of_contact_zip'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'client_point_of_contact_phone'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'client_point_of_contact_fax'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'client_point_of_contact_email'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'billing_contact_name'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'billing_contact_title'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'billing_contact_address'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'billing_contact_city'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'billing_contact_state'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'billing_contact_zip'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'billing_contact_office_telephone_number'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'billing_contact_fax_number'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'billing_contact_email_address'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'designated_hipaa_name'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'designated_hipaa_title'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'designated_hipaa_street_address'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'designated_hipaa_city'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'designated_hipaa_state'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'designated_hipaa_zip'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'designated_hipaa_phone'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'designated_hipaa_fax'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'designated_hipaa_email'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'decision_maker_name'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'decision_maker_title'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'decision_maker_street_address'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'decision_maker_city'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'decision_maker_state'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'decision_maker_zip'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'decision_maker_phone'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'decision_maker_fax'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'decision_maker_email'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'eoc_will_be_sent_out_to'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'max_hard_copy_quantities_per_product'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'employer_contribution_of_non_anthem_for_employee'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'employer_contribution_of_non_anthem_for_dependent'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'cal_cobra_eligibles_and_enrollees'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'standard_method_for_initial_enrollment'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'standard_method_for_ongoing_enrollment'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'comments'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'first_proposed_enrollment_meeting_date'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'is_mailing_address_different'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), TRUE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'mailing_address'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'mailing_city'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'mailing_state'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'mailing_zip'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'mailing_phone'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'mailing_fax'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'non_anthem_plan_is_offered'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), TRUE);

INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_business'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'company_federal_tax_id'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'organization_type'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'organization_type_other'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'affiliated_firms_quantity'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), TRUE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'affiliated_company_name_1'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'affiliated_company_address_1'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'affiliated_company_name_2'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'affiliated_company_address_2'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'affiliated_company_name_3'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'affiliated_company_address_3'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'affiliated_company_name_4'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'affiliated_company_address_4'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'affiliated_company_name_5'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'affiliated_company_address_5'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'affiliated_company_name_6'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'affiliated_company_address_6'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'affiliated_company_name_7'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'affiliated_company_address_7'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'affiliated_company_name_8'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'affiliated_company_address_8'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'affiliated_company_name_9'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'affiliated_company_address_9'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'affiliated_company_name_10'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'affiliated_company_address_10'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'enrolling_under_another_groups'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'billing_contact_name'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'billing_contact_office_telephone_number'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'billing_contact_email_address'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_elligible_employees'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'hours_per_week_for_full_time'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'hours_per_week_for_part_time'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'total_number_of_eligible_employees'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'waiting_period_waived'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'domestic_partnership_coverage'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'speciality_waiting_period'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'defined_under_applicable_law'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'group_elects_to_opt_out_of_authorizing'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_1'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_2'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_3'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_4'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_5'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_6'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_7'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_coverage_plan_name_8'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_employee_ca_contribution_1'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_employee_ca_contribution_2'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_employee_ca_contribution_3'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_employee_ca_contribution_4'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_employee_ca_contribution_5'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_employee_ca_contribution_6'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_employee_ca_contribution_7'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_employee_ca_contribution_8'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_employee_non_ca_contribution_1'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_employee_non_ca_contribution_2'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_employee_non_ca_contribution_3'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_employee_non_ca_contribution_4'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_employee_non_ca_contribution_5'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_employee_non_ca_contribution_6'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_employee_non_ca_contribution_7'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_employee_non_ca_contribution_8'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_dependent_ca_contribution_1'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_dependent_ca_contribution_2'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_dependent_ca_contribution_3'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_dependent_ca_contribution_4'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_dependent_ca_contribution_5'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_dependent_ca_contribution_6'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_dependent_ca_contribution_7'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_dependent_ca_contribution_8'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_dependent_non_ca_contribution_1'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_dependent_non_ca_contribution_2'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_dependent_non_ca_contribution_3'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_dependent_non_ca_contribution_4'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_dependent_non_ca_contribution_5'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_dependent_non_ca_contribution_6'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_dependent_non_ca_contribution_7'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_dependent_non_ca_contribution_8'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_1'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_2'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_3'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_coverage_plan_name_4'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_employee_ca_contribution_1'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_employee_ca_contribution_2'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_employee_ca_contribution_3'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_employee_ca_contribution_4'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_employee_non_ca_contribution_1'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_employee_non_ca_contribution_2'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_employee_non_ca_contribution_3'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_employee_non_ca_contribution_4'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_dependent_ca_contribution_1'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_dependent_ca_contribution_2'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_dependent_ca_contribution_3'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_dependent_ca_contribution_4'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_dependent_non_ca_contribution_1'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_dependent_non_ca_contribution_2'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_dependent_non_ca_contribution_3'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_dependent_non_ca_contribution_4'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'vision_coverage_plan_name_1'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'vision_coverage_plan_name_2'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'vision_employee_ca_contribution_1'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'vision_employee_ca_contribution_2'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'vision_employee_non_ca_contribution_1'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'vision_employee_non_ca_contribution_2'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'vision_dependent_ca_contribution_1'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'vision_dependent_ca_contribution_2'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'vision_dependent_non_ca_contribution_1'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'vision_dependent_non_ca_contribution_2'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-employer-application'), FALSE);