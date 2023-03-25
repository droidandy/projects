INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('policy_number', 'Policy Number', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('date_questionnaire_completed', 'Date questionnaire completed', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('day_to_day_contact_name', 'Day to day contact name', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('title', 'Title', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('address', 'Address', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('city_state_zip', 'City, State, Zip', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('office_telephone_number', 'Office telephone number', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('fax_number', 'Fax number', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('email_address', 'E-mail address', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('type_of_business', 'Type of business (industry or service)', FALSE);

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('type_of_organization', 'Type of organization', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'ACEC Trust for Engineers', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_organization'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Collective Bargaining', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_organization'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'Individual Proprietorship', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_organization'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (4, 'Partnership', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_organization'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (5, 'Trust Case', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_organization'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (6, 'Association', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_organization'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (7, 'Compulsory Trust', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_organization'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (8, 'Municipality', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_organization'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (9, 'Political Subdivision', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_organization'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (10, 'Voluntary Trust', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_organization'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (11, 'Church', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_organization'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (12, 'Corporation', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_organization'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (13, 'Non-Profit Organization', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_organization'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (14, 'School District', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_organization'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('company_federal_tax_id', 'Company federal tax ID', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('billing_contact_name', 'Billing Contact name', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('billing_contact_title', 'Billing Contact title', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('billing_contact_address', 'Billing Contact address / PO Box', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('billing_contact_city_state_zip', 'Billing Contact city, State, Zip', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('billing_contact_office_telephone_number', 'Billing Contact office telephone number', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('billing_contact_fax_number', 'Billing Contact fax number', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('billing_contact_email_address', 'Billing Contact E-mail address', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('atne_current_year', 'ATNE Current Year', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('atne_prior_year', 'ATNE Prior Year', FALSE);

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('type_of_eligibility_transmission', 'Type of eligibility transmission', TRUE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Excel  spreadsheet / xTool  (Standard)', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_eligibility_transmission'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Employer eServices (Standard)', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_eligibility_transmission'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'Electronic Feed', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_eligibility_transmission'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (4, 'Enrollment Forms', (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_eligibility_transmission'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('benefits_eligibility_end', 'Benefits eligibility end', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Date of Termination', (SELECT `question_id` FROM `question` WHERE CODE = 'benefits_eligibility_end'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Last day of the month when termination occurs', (SELECT `question_id` FROM `question` WHERE CODE = 'benefits_eligibility_end'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('are_early_retirees_covered', 'Are early retirees covered', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'are_early_retirees_covered'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'are_early_retirees_covered'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('surviving_spouse_eligibility', 'Surviving spouse eligibility', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'surviving_spouse_eligibility'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'surviving_spouse_eligibility'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'N/A', (SELECT `question_id` FROM `question` WHERE CODE = 'surviving_spouse_eligibility'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('surviving_spouse_eligibility_how_handled', 'If surviving spouse eligibility "yes" how will they be handled', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Continue coverage under deceased Employee’s SSN', (SELECT `question_id` FROM `question` WHERE CODE = 'surviving_spouse_eligibility_how_handled'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Set up coverage under his/her SSN', (SELECT `question_id` FROM `question` WHERE CODE = 'surviving_spouse_eligibility_how_handled'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('surviving_spouse_eligibility_how_long_covered', 'If surviving spouse eligibility "yes" how long will surviving spouse be covered', FALSE);

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('retiree_billing_provided_by', 'Retiree billing provided by?', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'UnitedHealthcare', (SELECT `question_id` FROM `question` WHERE CODE = 'retiree_billing_provided_by'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Self-Administered', (SELECT `question_id` FROM `question` WHERE CODE = 'retiree_billing_provided_by'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'Outside Vendor', (SELECT `question_id` FROM `question` WHERE CODE = 'retiree_billing_provided_by'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (4, 'N/A', (SELECT `question_id` FROM `question` WHERE CODE = 'retiree_billing_provided_by'));
-- If Vendor
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('vendor_name', 'Vendor Name', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('vendor_contact_name', 'Contact Name', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('vendor_address', 'Address', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('vendor_phone', 'Phone', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('vendor_fax', 'Fax', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('vendor_email', 'e-Mail', FALSE);

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('retiree_vendor_name', 'Retiree vendor name', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('retiree_vendor_contact_name', 'Retiree vendor contact name', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('retiree_vendor_address', 'Retiree vendor address', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('retiree_vendor_phone', 'Retiree vendor phone', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('retiree_vendor_fax', 'Retiree vendor fax', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('retiree_vendor_email', 'Retiree vendor email', FALSE);

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('cobra_will_be_managed_by', 'Will cobra be managed by uhc, an outside vendor or self administered', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'uhc', (SELECT `question_id` FROM `question` WHERE CODE = 'cobra_will_be_managed_by'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'outside vendor', (SELECT `question_id` FROM `question` WHERE CODE = 'cobra_will_be_managed_by'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'self administered', (SELECT `question_id` FROM `question` WHERE CODE = 'cobra_will_be_managed_by'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('outside_vendor_name', 'Outside Vendor name', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('outside_vendor_toll', 'Outside Vendor toll', FALSE);

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('cobra_benefits_maintained', 'Cobra benefits maintained', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Paid Through Dates', (SELECT `question_id` FROM `question` WHERE CODE = 'cobra_benefits_maintained'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Future Stop Dates', (SELECT `question_id` FROM `question` WHERE CODE = 'cobra_benefits_maintained'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'Open Ended', (SELECT `question_id` FROM `question` WHERE CODE = 'cobra_benefits_maintained'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('binder_payment_collected', 'Binder payment collected?', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'binder_payment_collected'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'binder_payment_collected'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'N/A', (SELECT `question_id` FROM `question` WHERE CODE = 'binder_payment_collected'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('billing_invoice_type', 'Billing invoice type', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Eligibility Based Bills (List Bill) - UHC Standard', (SELECT `question_id` FROM `question` WHERE CODE = 'billing_invoice_type'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('billing_proration_method', 'Billing proration method', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Mid Month (Standard)', (SELECT `question_id` FROM `question` WHERE CODE = 'billing_proration_method'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('billing_payment_method', 'Billing payment method', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Scheduled Direct Debit (Standard)', (SELECT `question_id` FROM `question` WHERE CODE = 'billing_payment_method'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Online Payment Remittance (via EBPP)', (SELECT `question_id` FROM `question` WHERE CODE = 'billing_payment_method'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'ACH (Automatic Clearing House)', (SELECT `question_id` FROM `question` WHERE CODE = 'billing_payment_method'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (4, 'Wire Transfer', (SELECT `question_id` FROM `question` WHERE CODE = 'billing_payment_method'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (5, 'Check', (SELECT `question_id` FROM `question` WHERE CODE = 'billing_payment_method'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('erisa_medical_plan', 'Is this an ERISA medical plan', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'erisa_medical_plan'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'erisa_medical_plan'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('erisa_plan_number', 'If "yes" for ERISA based plan what is the ERISA plan Number', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, '501', (SELECT `question_id` FROM `question` WHERE CODE = 'erisa_plan_number'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, '502', (SELECT `question_id` FROM `question` WHERE CODE = 'erisa_plan_number'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('employee_structure_breakout', 'Employee Structure breakout', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Product', (SELECT `question_id` FROM `question` WHERE CODE = 'employee_structure_breakout'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Salary', (SELECT `question_id` FROM `question` WHERE CODE = 'employee_structure_breakout'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'Active', (SELECT `question_id` FROM `question` WHERE CODE = 'employee_structure_breakout'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (4, 'Hourly', (SELECT `question_id` FROM `question` WHERE CODE = 'employee_structure_breakout'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (5, 'Cobra', (SELECT `question_id` FROM `question` WHERE CODE = 'employee_structure_breakout'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (6, 'Location / Division/ Other', (SELECT `question_id` FROM `question` WHERE CODE = 'employee_structure_breakout'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('customer_name_on_id_cards', 'Customer name on ID cards', FALSE);

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('method_of_contract_distribution', 'Method of contract distribution', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Electronic Copies available on UHC portals with 1 hardcopy mailed (STANDARD PROCESS)', (SELECT `question_id` FROM `question` WHERE CODE = 'method_of_contract_distribution'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Electronic Copy to human resource contact with 1 hardcopy mailed', (SELECT `question_id` FROM `question` WHERE CODE = 'method_of_contract_distribution'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'Bulk Mailed to human resource contact', (SELECT `question_id` FROM `question` WHERE CODE = 'method_of_contract_distribution'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (4, 'Home Delivery', (SELECT `question_id` FROM `question` WHERE CODE = 'method_of_contract_distribution'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('history_conversion', 'Will history conversion be offered for medical claims	coverage history', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'history_conversion'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'history_conversion'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('history_conversion_date', 'If yes for history conversion, date history will be received', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('history_conversion_indicate_products', 'If yes for history conversion indicate products', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('history_conversion_carrier_name', 'If yes for history conversion carrier name', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('history_conversion_contact_name', 'If yes for history conversion contact name', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('history_conversion_contact_phone', 'If yes for history conversion contact phone', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('history_conversion_contact_fax', 'If yes for history conversion contact fax', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('history_conversion_contact_email', 'If yes for history conversion contact email', FALSE);

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('multi_location_group', 'Multi-location group', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'multi_location_group'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'multi_location_group'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('number_of_locations', '# of locations', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('addresses_for_each_location', 'Addresses for each location', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('waiting_period_for_rehire', 'Waiting period for rehire', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Same as New Hire', (SELECT `question_id` FROM `question` WHERE CODE = 'waiting_period_for_rehire'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No Wait', (SELECT `question_id` FROM `question` WHERE CODE = 'waiting_period_for_rehire'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('waiting_period_waived', 'Waiting period waived for initial enrollees?', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'waiting_period_waived'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'waiting_period_waived'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('workers_compensation_insurance', 'Do you have workers compensation insurance?', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'workers_compensation_insurance'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'workers_compensation_insurance'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('workers_comp_carrier_name', 'Workers comp carrier name', FALSE);

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('local_living_wage_law', 'Are you subject to a local living wage law?', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'local_living_wage_law'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'local_living_wage_law'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('premium_payment_options', 'Premium payment options', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Standard', (SELECT `question_id` FROM `question` WHERE CODE = 'premium_payment_options'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Alternate Payment Schedule', (SELECT `question_id` FROM `question` WHERE CODE = 'premium_payment_options'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('current_medical_carrier_policy_number', 'Current medical carrier policy #', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('current_dental_carrier_policy_number', 'Current dental carrier policy #', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('covered_by_united_healthcare', 'Has the group been insured/covered by united healthcare in the last 12 months. If yes, indicate months covered', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'covered_by_united_healthcare'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'covered_by_united_healthcare'));
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('how_long_do_you_continue_to_pay', 'How long do you continue to pay health care premium for employees on leave of absence?', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('employer_sponsored_group_medical_plans', 'Name of other employer sponsored group medical plans	coverage', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('enrolling_under_another_groups', 'Number of employees enrolling under another groups medical plan(s) sponsored by employer', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('number_of_full_tie_employees', '# of Full Tie (30+ hours) employees', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('employee_in_waiting_period', '# of employee in waiting period', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('inelligible_employees', '# of inelligible employees (other then those mentioned  above)', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('total_employees', '# of total employees', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('elligible_employees', '# of total elligible employees', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('cobra_participants', '# of cobra participants', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('early_retirees', '# of early retirees', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('employees_applying_for_medical', 'Total employees applying for  Medical', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('employees_applying_for_dental', 'Total employees applying for dental', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('employees_applying_for_vision', 'Total employees applying for vision', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('employees_waiving_medical', 'Total employees waiving medical', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('employees_waiving_dental', 'Total employees waiving dental', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('employees_waiving_vision', 'Total employees waiving vision', FALSE);

-- Are you aware of any employee or dependent having been diagnosed or treated for any of the following conditions in the past three years?
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('cardiac_disorder', 'Cardiac disorder', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'cardiac_disorder'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'cardiac_disorder'));
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('cancer', 'Cancer (any form)', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'cancer'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'cancer'));
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('diabetes', 'Diabetes', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'diabetes'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'diabetes'));
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('kidney_disorder', 'Kidney disorder', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'kidney_disorder'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'kidney_disorder'));
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('respiratory_disorder', 'Respiratory disorder', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'respiratory_disorder'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'respiratory_disorder'));
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('liver_disorder', 'Liver disorder', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'liver_disorder'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'liver_disorder'));
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('aids', 'AIDS', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'aids'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'aids'));
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('kaposis_sarcoma', 'Kaposi’s sarcoma', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'kaposis_sarcoma'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'kaposis_sarcoma'));
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('pneumocystis_pneumonia', 'Pneumocystis pneumonia', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'pneumocystis_pneumonia'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'pneumocystis_pneumonia'));
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('psychological_disorders', 'Psychological disorders', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'psychological_disorders'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'psychological_disorders'));
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('neuromuscular_disorder', 'Neuromuscular disorder', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'neuromuscular_disorder'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'neuromuscular_disorder'));
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('transplant_candidate', 'Transplant candidate', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'transplant_candidate'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'transplant_candidate'));
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('alcohol_drug_abuse', 'Alcohol/Drug abuse', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'alcohol_drug_abuse'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'alcohol_drug_abuse'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('medical_disability', 'Are you aware of any employee or dependent who is currently disabled or receiving ongoing care for a medical disability?	Medical disclosures', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_disability'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_disability'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('currently_hospitalized', 'Are you aware of any employee or dependent who is currently hospitalized or who is anticipating hospitalization or surgery within the next 60 days?', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'currently_hospitalized'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'currently_hospitalized'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('missed_more_than_ten_days', 'Are you aware of any employee who has missed more than 10 consecutive days of work in the past 12 months due to illness or injury?', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'missed_more_than_ten_days'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'missed_more_than_ten_days'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('medical_claims_last_12_months', 'Has any employee or dependent accumulated medical claims in excess of $25,000 in the past 12 months?	Medical disclosures', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_claims_last_12_months'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'medical_claims_last_12_months'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('currently_pregnant', 'Are you aware of any employee or dependent who is currently pregnant? If yes, how many?	Medical disclosures', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'currently_pregnant'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'currently_pregnant'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('psychiatrically_disabled_dependent', 'Are you aware of any employee who has an autistic or otherwise psychiatrically disabled dependent?', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'psychiatrically_disabled_dependent'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'psychiatrically_disabled_dependent'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('medical_disclosures_additional_information', 'If you answered “Yes” to any of the above questions, then please provide the additional information requested below for each individual. Please attach additional sheet if necessary', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('authorized_signer_for_group_name', 'Authorized signer for group name', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('authorized_signer_for_group_title', 'Authorized signer for group title', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('writing_agent_name', 'Writing agent name', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('writing_agent_ssn_or_tin', 'Writing agent SSN or TIN', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('writing_agent_license_number', 'Writing agent license #', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('writing_agent_license_expiration_date', 'Writing agent license expiration date', FALSE);

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('writing_agent_currently_holds_appointment', 'Writing agent currently holds appointment?', FALSE);

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('wa_crid_code', 'WA CRID code', FALSE);

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('commission_payable_to', 'Commission payable to?', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Writing Agent', (SELECT `question_id` FROM `question` WHERE CODE = 'commission_payable_to'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Firm', (SELECT `question_id` FROM `question` WHERE CODE = 'commission_payable_to'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('firm_tin', 'Firm Tin', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('firm_license_number', 'Firm License #', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('firm_license_expiration_date', 'Firm License expiration date', FALSE);

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('firm_holds_appointment_with_uhc', 'Firm holds current appointment with UHC', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'On', (SELECT `question_id` FROM `question` WHERE CODE = 'firm_holds_appointment_with_uhc'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Off', (SELECT `question_id` FROM `question` WHERE CODE = 'firm_holds_appointment_with_uhc'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('firms_crid_code', 'Firms CRID code', FALSE);

INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('open_enrollment_date_from', 'Open enrollment date from', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('open_enrollment_date_to', 'Open enrollment date to', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('indicate_whether_employee_dependent_1', 'Indicate whether employee or dependent', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Employee', (SELECT `question_id` FROM `question` WHERE CODE = 'indicate_whether_employee_dependent_1'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Dependent', (SELECT `question_id` FROM `question` WHERE CODE = 'indicate_whether_employee_dependent_1'));
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('indicate_whether_employee_dependent_2', 'Indicate whether employee or dependent', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Employee', (SELECT `question_id` FROM `question` WHERE CODE = 'indicate_whether_employee_dependent_2'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Dependent', (SELECT `question_id` FROM `question` WHERE CODE = 'indicate_whether_employee_dependent_2'));
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('indicate_whether_employee_dependent_3', 'Indicate whether employee or dependent', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Employee', (SELECT `question_id` FROM `question` WHERE CODE = 'indicate_whether_employee_dependent_3'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Dependent', (SELECT `question_id` FROM `question` WHERE CODE = 'indicate_whether_employee_dependent_3'));
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('nature_of_illness_1', 'Nature of illness', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('nature_of_illness_2', 'Nature of illness', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('nature_of_illness_3', 'Nature of illness', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('date_of_onset_1', 'Date of onset', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('date_of_onset_2', 'Date of onset', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('date_of_onset_3', 'Date of onset', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('approximate_amount_of_claim_1', 'Approximate amount of claim', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('approximate_amount_of_claim_2', 'Approximate amount of claim', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('approximate_amount_of_claim_3', 'Approximate amount of claim', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('length_of_disability_1', 'Length of disability', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('length_of_disability_2', 'Length of disability', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('length_of_disability_3', 'Length of disability', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('current_health_status_1', 'Current health status', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('current_health_status_2', 'Current health status', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('current_health_status_3', 'Current health status', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('wa_currently_holds_appointment_with_uhc', 'Writing agent holds appointment with UnitedHealthcare ?', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'On', (SELECT `question_id` FROM `question` WHERE CODE = 'wa_currently_holds_appointment_with_uhc'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Off', (SELECT `question_id` FROM `question` WHERE CODE = 'wa_currently_holds_appointment_with_uhc'));
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('more_than_1_writing_agent_name_1', 'Name of the second agent', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('more_than_1_writing_agent_at_1', '% of the second agent', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('more_than_1_writing_agent_name_2', 'Name of the third agent', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('more_than_1_writing_agent_at_2', '% of the third agent', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('commission_payable_to_other', 'Comission payable to other sources', FALSE);

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('direct_retiree_managed_by', 'Will direct retiree cobra be managed by uhc, an outside vendor or self administered', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'uhc', (SELECT `question_id` FROM `question` WHERE CODE = 'direct_retiree_managed_by'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'outside vendor', (SELECT `question_id` FROM `question` WHERE CODE = 'direct_retiree_managed_by'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (3, 'self administered', (SELECT `question_id` FROM `question` WHERE CODE = 'direct_retiree_managed_by'));

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('direct_retiree_vendor_name', 'Outside Vendor name', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('direct_retiree_vendor_toll', 'Outside Vendor toll', FALSE);
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('eligibility_transmission_excel_spreadsheet', 'Excel  spreadsheet / xTool  (Standard)', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Initial', (SELECT `question_id` FROM `question` WHERE CODE = 'eligibility_transmission_excel_spreadsheet'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Subsequent', (SELECT `question_id` FROM `question` WHERE CODE = 'eligibility_transmission_excel_spreadsheet'));
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('eligibility_transmission_employer_eservices', 'Outside Vendor toll', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Initial', (SELECT `question_id` FROM `question` WHERE CODE = 'eligibility_transmission_employer_eservices'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Subsequent', (SELECT `question_id` FROM `question` WHERE CODE = 'eligibility_transmission_employer_eservices'));
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('eligibility_transmission_electronic_feed', 'Outside Vendor toll', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Initial', (SELECT `question_id` FROM `question` WHERE CODE = 'eligibility_transmission_electronic_feed'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Subsequent', (SELECT `question_id` FROM `question` WHERE CODE = 'eligibility_transmission_electronic_feed'));
INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES ('eligibility_transmission_enrollment_forms', 'Outside Vendor toll', FALSE);
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Initial', (SELECT `question_id` FROM `question` WHERE CODE = 'eligibility_transmission_enrollment_forms'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'Subsequent', (SELECT `question_id` FROM `question` WHERE CODE = 'eligibility_transmission_enrollment_forms'));

INSERT INTO `form` (`name`, `carrier_id`) VALUES ('questionnaire', (SELECT `carrier_id` FROM `carrier` WHERE name = 'UHC'));
INSERT INTO `form` (`name`, `carrier_id`) VALUES ('group-application', (SELECT `carrier_id` FROM `carrier` WHERE name = 'UHC'));

INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (1, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'multi_location_group'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (2, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'number_of_locations'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (3, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'addresses_for_each_location'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (4, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'waiting_period_for_rehire'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (5, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'waiting_period_waived'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (6, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'workers_compensation_insurance'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (7, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'workers_comp_carrier_name'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (8, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'local_living_wage_law'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (9, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'premium_payment_options'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (10, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'current_medical_carrier_policy_number'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (11, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'current_dental_carrier_policy_number'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (12, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'covered_by_united_healthcare'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (13, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'how_long_do_you_continue_to_pay'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (14, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'employer_sponsored_group_medical_plans'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (15, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'enrolling_under_another_groups'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (16, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'number_of_full_tie_employees'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (17, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'employee_in_waiting_period'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (18, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'inelligible_employees'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (19, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'total_employees'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (20, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'elligible_employees'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (21, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'cobra_participants'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (22, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'early_retirees'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (23, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'employees_applying_for_medical'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (24, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'employees_applying_for_dental'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (25, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'employees_applying_for_vision'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (26, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'employees_waiving_medical'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (27, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'employees_waiving_dental'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (28, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'employees_waiving_vision'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (29, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'cardiac_disorder'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (30, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'cancer'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (31, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'diabetes'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (32, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'kidney_disorder'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (33, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'respiratory_disorder'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (34, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'liver_disorder'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (35, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'aids'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (36, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'kaposis_sarcoma'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (37, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'pneumocystis_pneumonia'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (38, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'psychological_disorders'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (39, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'neuromuscular_disorder'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (40, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'transplant_candidate'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (41, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'alcohol_drug_abuse'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (42, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_disability'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (43, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'currently_hospitalized'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (44, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'missed_more_than_ten_days'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (45, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'medical_claims_last_12_months'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (46, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'currently_pregnant'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (47, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'psychiatrically_disabled_dependent'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (48, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'authorized_signer_for_group_name'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (49, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'authorized_signer_for_group_title'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (50, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'writing_agent_name'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (51, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'writing_agent_ssn_or_tin'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (52, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'writing_agent_license_number'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (53, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'writing_agent_license_expiration_date'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (54, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'writing_agent_currently_holds_appointment'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (55, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'wa_crid_code'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (56, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'commission_payable_to'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (57, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'firm_tin'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (58, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'firm_license_number'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (59, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'firm_license_expiration_date'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (60, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'firm_holds_appointment_with_uhc'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (61, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'firms_crid_code'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (62, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'open_enrollment_date_from'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (63, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'open_enrollment_date_to'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (64, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'indicate_whether_employee_dependent_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (65, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'indicate_whether_employee_dependent_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (66, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'indicate_whether_employee_dependent_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (67, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'nature_of_illness_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (68, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'nature_of_illness_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (69, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'nature_of_illness_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (70, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'date_of_onset_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (71, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'date_of_onset_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (72, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'date_of_onset_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (73, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'approximate_amount_of_claim_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (74, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'approximate_amount_of_claim_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (75, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'approximate_amount_of_claim_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (76, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'length_of_disability_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (77, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'length_of_disability_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (78, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'length_of_disability_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (79, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'current_health_status_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (80, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'current_health_status_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (81, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'current_health_status_3'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (82, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'wa_currently_holds_appointment_with_uhc'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (83, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'more_than_1_writing_agent_name_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (84, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'more_than_1_writing_agent_at_1'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (85, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'more_than_1_writing_agent_name_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (86, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'more_than_1_writing_agent_at_2'), (SELECT `form_id` FROM `form` WHERE name = 'group-application'));

INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (1, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'policy_number'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (2, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'date_questionnaire_completed'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (3, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'day_to_day_contact_name'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (4, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'title'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (5, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'address'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (6, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'city_state_zip'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (7, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'office_telephone_number'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (8, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'fax_number'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (9, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'email_address'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (10, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_business'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (11, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_organization'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (12, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'billing_contact_name'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (13, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'billing_contact_title'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (14, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'billing_contact_address'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (15, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'billing_contact_city_state_zip'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (16, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'billing_contact_office_telephone_number'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (17, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'billing_contact_fax_number'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (18, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'billing_contact_email_address'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (19, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'atne_current_year'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (20, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'atne_prior_year'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (21, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'type_of_eligibility_transmission'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (22, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'eligibility_transmission_excel_spreadsheet'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (23, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'eligibility_transmission_employer_eservices'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (24, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'eligibility_transmission_electronic_feed'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (25, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'eligibility_transmission_enrollment_forms'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (26, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'benefits_eligibility_end'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (27, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'are_early_retirees_covered'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (28, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'surviving_spouse_eligibility'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (29, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'surviving_spouse_eligibility_how_handled'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (30, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'surviving_spouse_eligibility_how_long_covered'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (31, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'direct_retiree_managed_by'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (32, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'direct_retiree_vendor_name'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (33, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'direct_retiree_vendor_toll'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (34, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'cobra_will_be_managed_by'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (35, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'outside_vendor_name'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (36, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'outside_vendor_toll'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (37, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'cobra_benefits_maintained'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (38, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'retiree_billing_provided_by'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (39, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'retiree_vendor_name'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (40, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'retiree_vendor_contact_name'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (41, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'retiree_vendor_address'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (42, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'retiree_vendor_phone'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (43, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'retiree_vendor_fax'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (44, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'retiree_vendor_email'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (45, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'binder_payment_collected'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (46, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'billing_invoice_type'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (47, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'billing_proration_method'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (48, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'billing_payment_method'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (49, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'erisa_medical_plan'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (50, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'erisa_plan_number'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (51, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'employee_structure_breakout'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (52, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'customer_name_on_id_cards'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (53, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'method_of_contract_distribution'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (54, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'history_conversion'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (55, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'history_conversion_date'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (56, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'history_conversion_indicate_products'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (57, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'history_conversion_carrier_name'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (58, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'history_conversion_contact_name'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (59, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'history_conversion_contact_phone'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (60, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'history_conversion_contact_fax'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`index_number`, `required`, `question_id`, `form_id`) VALUES (61, FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'history_conversion_contact_email'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));

