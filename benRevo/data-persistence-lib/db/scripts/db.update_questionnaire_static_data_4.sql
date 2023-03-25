INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('is_this_business_currently_in_chapter', 'Is this business currently in Chapter 11 or currently being petitioned for bankruptcy or filed for bankruptcy within the last 36 months?', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'is_this_business_currently_in_chapter'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'is_this_business_currently_in_chapter'));
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('current_medical_coverage_dates', 'Current medical carrier coverage dates', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('current_dental_coverage_dates', 'Current dental carrier coverage dates', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dependent_coverage_up_to_age', 'Dependent coverage up to age', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dependent_student_coverage_up_to_age', 'Dependent Student coverage up to age', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('tier_structure_requested', 'Tier Structure Requested', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, '1 Tier', (SELECT `question_id` FROM `question` WHERE CODE = 'tier_structure_requested'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, '2 Tier', (SELECT `question_id` FROM `question` WHERE CODE = 'tier_structure_requested'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, '3 Tier', (SELECT `question_id` FROM `question` WHERE CODE = 'tier_structure_requested'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (4, '4 Tier', (SELECT `question_id` FROM `question` WHERE CODE = 'tier_structure_requested'));
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_plan_description_1', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_plan_description_2', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_plan_description_3', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('behavioral_plan_type_1', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('behavioral_plan_type_2', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('behavioral_plan_type_3', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('rx_plan_description_1', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('rx_plan_description_2', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('rx_plan_description_3', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('optional_rider_description_1_1', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('optional_rider_description_1_2', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('optional_rider_description_1_3', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('optional_rider_description_2_1', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('optional_rider_description_2_2', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('optional_rider_description_2_3', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('optional_rider_description_3_1', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('optional_rider_description_3_2', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('optional_rider_description_3_3', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_plan_code_1', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_plan_code_2', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_plan_code_3', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('rx_plan_code_1', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('rx_plan_code_2', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('rx_plan_code_3', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_rates_1_by_tier_1', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_rates_1_by_tier_2', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_rates_1_by_tier_3', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_rates_1_by_tier_4', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_rates_2_by_tier_1', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_rates_2_by_tier_2', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_rates_2_by_tier_3', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_rates_2_by_tier_4', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_rates_3_by_tier_1', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_rates_3_by_tier_2', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_rates_3_by_tier_3', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_rates_3_by_tier_4', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_contribution_1_by_tier_1', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_contribution_1_by_tier_2', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_contribution_1_by_tier_3', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_contribution_1_by_tier_4', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_contribution_2_by_tier_1', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_contribution_2_by_tier_2', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_contribution_2_by_tier_3', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_contribution_2_by_tier_4', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_contribution_3_by_tier_1', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_contribution_3_by_tier_2', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_contribution_3_by_tier_3', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('medical_contribution_3_by_tier_4', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_plan_description_1', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_plan_description_2', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_plan_code_1', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_plan_code_2', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_plan_rates_1_tier_1', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_plan_rates_1_tier_2', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_plan_rates_1_tier_3', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_plan_rates_1_tier_4', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_plan_rates_2_tier_1', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_plan_rates_2_tier_2', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_plan_rates_2_tier_3', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_plan_rates_2_tier_4', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_plan_contribution_1_tier_1', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_plan_contribution_1_tier_2', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_plan_contribution_1_tier_3', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_plan_contribution_1_tier_4', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_plan_contribution_2_tier_1', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_plan_contribution_2_tier_2', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_plan_contribution_2_tier_3', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('dental_plan_contribution_2_tier_4', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('vision_plan_description', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('vision_plan_code', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('vision_plan_rates_tier_1', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('vision_plan_rates_tier_2', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('vision_plan_rates_tier_3', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('vision_plan_rates_tier_4', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('vision_plan_contribution_tier_1', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('vision_plan_contribution_tier_2', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('vision_plan_contribution_tier_3', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('vision_plan_contribution_tier_4', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('uhc_representative_name', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('uhc_representative_title', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('uhc_representative_phone', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('uhc_representative_rep', 'Tier Structure Requested', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('underwriter_name', 'Tier Structure Requested', FALSE);


INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('consultant_broker_company', 'Consultant / Broker Company', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('consultant_broker_contact_name', 'Consultant / Broker Contact Name', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('consultant_broker_title', 'Title', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('consultant_broker_address_po_box', 'Address / P.O. Box', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('consultant_broker_city_state_zip', 'City, State, Zip', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('consultant_broker_office_telephone', 'Office Telephone', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('consultant_broker_fax_number', 'Fax Number', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('consultant_broker_email', 'E-mail Address', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('domestic_partners_eligible', 'Domestic Partners Eligible', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'domestic_partners_eligible'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'domestic_partners_eligible'));
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('domestic_partners_eligible_sex', 'Domestic Partners Eligible Sex', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Same Sex Only', (SELECT `question_id` FROM `question` WHERE CODE = 'domestic_partners_eligible_sex'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Opposite Sex Only', (SELECT `question_id` FROM `question` WHERE CODE = 'domestic_partners_eligible_sex'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'Both sexes', (SELECT `question_id` FROM `question` WHERE CODE = 'domestic_partners_eligible_sex'));
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('new_hire_waiting_period', 'New hire waiting period', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('min_hrs_wks_to_be_considered', 'Min. # Hrs/Wks to Be Considered Eligible', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('are_retirees_covered', 'Are Retirees Covered?', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'are_retirees_covered'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'are_retirees_covered'));

INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'is_this_business_currently_in_chapter'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'current_medical_coverage_dates'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'current_dental_coverage_dates'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dependent_coverage_up_to_age'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dependent_student_coverage_up_to_age'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'tier_structure_requested'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_plan_description_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_plan_description_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_plan_description_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'behavioral_plan_type_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'behavioral_plan_type_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'behavioral_plan_type_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'rx_plan_description_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'rx_plan_description_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'rx_plan_description_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'optional_rider_description_1_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'optional_rider_description_1_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'optional_rider_description_1_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'optional_rider_description_2_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'optional_rider_description_2_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'optional_rider_description_2_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'optional_rider_description_3_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'optional_rider_description_3_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'optional_rider_description_3_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_plan_code_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_plan_code_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_plan_code_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'rx_plan_code_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'rx_plan_code_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'rx_plan_code_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_rates_1_by_tier_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_rates_1_by_tier_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_rates_1_by_tier_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_rates_1_by_tier_4'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_rates_2_by_tier_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_rates_2_by_tier_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_rates_2_by_tier_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_rates_2_by_tier_4'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_rates_3_by_tier_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_rates_3_by_tier_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_rates_3_by_tier_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_rates_3_by_tier_4'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_contribution_1_by_tier_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_contribution_1_by_tier_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_contribution_1_by_tier_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_contribution_1_by_tier_4'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_contribution_2_by_tier_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_contribution_2_by_tier_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_contribution_2_by_tier_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_contribution_2_by_tier_4'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_contribution_3_by_tier_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_contribution_3_by_tier_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_contribution_3_by_tier_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_contribution_3_by_tier_4'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_plan_description_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_plan_description_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_plan_code_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_plan_code_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_plan_rates_1_tier_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_plan_rates_1_tier_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_plan_rates_1_tier_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_plan_rates_1_tier_4'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_plan_rates_2_tier_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_plan_rates_2_tier_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_plan_rates_2_tier_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_plan_rates_2_tier_4'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_plan_contribution_1_tier_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_plan_contribution_1_tier_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_plan_contribution_1_tier_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_plan_contribution_1_tier_4'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_plan_contribution_2_tier_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_plan_contribution_2_tier_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_plan_contribution_2_tier_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'dental_plan_contribution_2_tier_4'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'vision_plan_description'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'vision_plan_code'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'vision_plan_rates_tier_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'vision_plan_rates_tier_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'vision_plan_rates_tier_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'vision_plan_rates_tier_4'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'vision_plan_contribution_tier_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'vision_plan_contribution_tier_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'vision_plan_contribution_tier_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'vision_plan_contribution_tier_4'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'uhc_representative_name'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'uhc_representative_title'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'uhc_representative_phone'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'uhc_representative_rep'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'underwriter_name'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));

INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'consultant_broker_company'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'consultant_broker_contact_name'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'consultant_broker_title'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'consultant_broker_address_po_box'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'consultant_broker_city_state_zip'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'consultant_broker_office_telephone'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'consultant_broker_fax_number'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'consultant_broker_email'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'domestic_partners_eligible'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'domestic_partners_eligible_sex'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'new_hire_waiting_period'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'min_hrs_wks_to_be_considered'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'are_retirees_covered'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));