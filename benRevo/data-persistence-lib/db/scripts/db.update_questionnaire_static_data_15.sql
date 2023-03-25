UPDATE question SET code = 'tpa_quantity', title = 'Number of TPAs' WHERE code = 'tpa';

UPDATE form_question SET invisible = true  
WHERE question_id = (SELECT question_id FROM question WHERE code = 'tpa_quantity');

UPDATE answer SET value = CASE value WHEN 'Yes' THEN 1 ELSE 0 END   
WHERE question_id = (SELECT question_id FROM question WHERE code = 'tpa_quantity');

UPDATE question SET code = 'tpa_name_1' WHERE code = 'tpa_name';
UPDATE question SET code = 'tpa_other_value_1' WHERE code = 'tpa_other_value';
UPDATE question SET code = 'tpa_remittance_1' WHERE code = 'tpa_remittance';
UPDATE question SET code = 'tpa_administration_fee_1' WHERE code = 'tpa_administration_fee';
UPDATE question SET code = 'tpa_fee_per_subscriber_1' WHERE code = 'tpa_fee_per_subscriber';
UPDATE question SET code = 'tpa_fee_per_member_1' WHERE code = 'tpa_fee_per_member';
UPDATE question SET code = 'tpa_how_admin_fee_paid_1' WHERE code = 'tpa_how_admin_fee_paid';
UPDATE question SET code = 'tpa_street_address_1' WHERE code = 'tpa_street_address';
UPDATE question SET code = 'tpa_title_1' WHERE code = 'tpa_title';
UPDATE question SET code = 'tpa_phone_1' WHERE code = 'tpa_phone';
UPDATE question SET code = 'tpa_city_1' WHERE code = 'tpa_city';
UPDATE question SET code = 'tpa_email_1' WHERE code = 'tpa_email';
UPDATE question SET code = 'tpa_state_1' WHERE code = 'tpa_state';
UPDATE question SET code = 'tpa_zip_1' WHERE code = 'tpa_zip';
UPDATE question SET code = 'is_tpa_broker_1' WHERE code = 'is_tpa_broker';
UPDATE question SET code = 'tpa_functions_1' WHERE code = 'tpa_functions';

INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES 
  ('tpa_other_value_2', 'On this account, the TPA will perform these functions (check all that apply):', False),
  ('tpa_remittance_2', 'If the TPA collects premiums, indicate TPA''s premium remittance method:', True),
  ('tpa_administration_fee_2', 'Administration fee is:', False),
  ('tpa_fee_per_subscriber_2', 'Administration fee is:', False),
  ('tpa_fee_per_member_2', 'Administration fee is:', False),
  ('tpa_how_admin_fee_paid_2', 'How is the administration fee to be paid?', False),
  ('tpa_name_2', '', False),
  ('tpa_street_address_2', '', False),
  ('tpa_title_2', '', False),
  ('tpa_phone_2', '', False),
  ('tpa_city_2', '', False),
  ('tpa_email_2', '', False),
  ('tpa_state_2', '', False),
  ('tpa_zip_2', '', False),
  ('is_tpa_broker_2', '', False),
  ('tpa_functions_2', 'On this account, the TPA will perform these functions (check all that apply):', True),

  ('tpa_other_value_3', 'On this account, the TPA will perform these functions (check all that apply):', False),
  ('tpa_remittance_3', 'If the TPA collects premiums, indicate TPA''s premium remittance method:', True),
  ('tpa_administration_fee_3', 'Administration fee is:', False),
  ('tpa_fee_per_subscriber_3', 'Administration fee is:', False),
  ('tpa_fee_per_member_3', 'Administration fee is:', False),
  ('tpa_how_admin_fee_paid_3', 'How is the administration fee to be paid?', False),
  ('tpa_name_3', '', False),
  ('tpa_street_address_3', '', False),
  ('tpa_title_3', '', False),
  ('tpa_phone_3', '', False),
  ('tpa_city_3', '', False),
  ('tpa_email_3', '', False),
  ('tpa_state_3', '', False),
  ('tpa_zip_3', '', False),
  ('is_tpa_broker_3', '', False),
  ('tpa_functions_3', 'On this account, the TPA will perform these functions (check all that apply):', True),

  ('tpa_other_value_4', 'On this account, the TPA will perform these functions (check all that apply):', False),
  ('tpa_remittance_4', 'If the TPA collects premiums, indicate TPA''s premium remittance method:', True),
  ('tpa_administration_fee_4', 'Administration fee is:', False),
  ('tpa_fee_per_subscriber_4', 'Administration fee is:', False),
  ('tpa_fee_per_member_4', 'Administration fee is:', False),
  ('tpa_how_admin_fee_paid_4', 'How is the administration fee to be paid?', False),
  ('tpa_name_4', '', False),
  ('tpa_street_address_4', '', False),
  ('tpa_title_4', '', False),
  ('tpa_phone_4', '', False),
  ('tpa_city_4', '', False),
  ('tpa_email_4', '', False),
  ('tpa_state_4', '', False),
  ('tpa_zip_4', '', False),
  ('is_tpa_broker_4', '', False),
  ('tpa_functions_4', 'On this account, the TPA will perform these functions (check all that apply):', True),

  ('tpa_other_value_5', 'On this account, the TPA will perform these functions (check all that apply):', False),
  ('tpa_remittance_5', 'If the TPA collects premiums, indicate TPA''s premium remittance method:', True),
  ('tpa_administration_fee_5', 'Administration fee is:', False),
  ('tpa_fee_per_subscriber_5', 'Administration fee is:', False),
  ('tpa_fee_per_member_5', 'Administration fee is:', False),
  ('tpa_how_admin_fee_paid_5', 'How is the administration fee to be paid?', False),
  ('tpa_name_5', '', False),
  ('tpa_street_address_5', '', False),
  ('tpa_title_5', '', False),
  ('tpa_phone_5', '', False),
  ('tpa_city_5', '', False),
  ('tpa_email_5', '', False),
  ('tpa_state_5', '', False),
  ('tpa_zip_5', '', False),
  ('is_tpa_broker_5', '', False),
  ('tpa_functions_5', 'On this account, the TPA will perform these functions (check all that apply):', True);

INSERT INTO `variant` (`number`,`option`,`question_id`,`alias`) 
SELECT v.number, v.option, q.question_id, v.alias FROM `variant` v, 
(SELECT question_id FROM question WHERE code IN ('is_tpa_broker_2', 'is_tpa_broker_3', 'is_tpa_broker_4', 'is_tpa_broker_5')) q 
WHERE v.question_id = (SELECT question_id FROM question WHERE code = 'is_tpa_broker_1');

INSERT INTO `variant` (`number`,`option`,`question_id`,`alias`) 
SELECT v.number, v.option, q.question_id, v.alias FROM `variant` v, 
(SELECT question_id FROM question WHERE code IN ('tpa_administration_fee_2', 'tpa_administration_fee_3', 'tpa_administration_fee_4', 'tpa_administration_fee_5')) q 
WHERE v.question_id = (SELECT question_id FROM question WHERE code = 'tpa_administration_fee_1');

INSERT INTO `variant` (`number`,`option`,`question_id`,`alias`) 
SELECT v.number, v.option, q.question_id, v.alias FROM `variant` v, 
(SELECT question_id FROM question WHERE code IN ('tpa_remittance_2', 'tpa_remittance_3', 'tpa_remittance_4', 'tpa_remittance_5')) q 
WHERE v.question_id = (SELECT question_id FROM question WHERE code = 'tpa_remittance_1');

INSERT INTO `variant` (`number`,`option`,`question_id`,`alias`) 
SELECT v.number, v.option, q.question_id, v.alias FROM `variant` v, 
(SELECT question_id FROM question WHERE code IN ('tpa_how_admin_fee_paid_2', 'tpa_how_admin_fee_paid_3', 'tpa_how_admin_fee_paid_4', 'tpa_how_admin_fee_paid_5')) q 
WHERE v.question_id = (SELECT question_id FROM question WHERE code = 'tpa_how_admin_fee_paid_1');

INSERT INTO `variant` (`number`,`option`,`question_id`,`alias`) 
SELECT v.number, v.option, q.question_id, v.alias FROM `variant` v, 
(SELECT question_id FROM question WHERE code IN ('tpa_functions_2', 'tpa_functions_3', 'tpa_functions_4', 'tpa_functions_5')) q 
WHERE v.question_id = (SELECT question_id FROM question WHERE code = 'tpa_functions_1');

DELETE FROM variant WHERE question_id = (SELECT question_id FROM question WHERE code = 'tpa_quantity');

-- adding new form
INSERT INTO form (name, carrier_id) VALUES ('anthem-tpa-2', (SELECT carrier_id FROM carrier WHERE name = 'ANTHEM_BLUE_CROSS'));
INSERT INTO form (name, carrier_id) VALUES ('anthem-tpa-3', (SELECT carrier_id FROM carrier WHERE name = 'ANTHEM_BLUE_CROSS'));
INSERT INTO form (name, carrier_id) VALUES ('anthem-tpa-4', (SELECT carrier_id FROM carrier WHERE name = 'ANTHEM_BLUE_CROSS'));
INSERT INTO form (name, carrier_id) VALUES ('anthem-tpa-5', (SELECT carrier_id FROM carrier WHERE name = 'ANTHEM_BLUE_CROSS'));

-- adding questions to new form
INSERT INTO form_question (required, question_id, form_id, invisible) 
SELECT false, (SELECT question_id FROM question WHERE code = 'tpa_quantity'), f.form_id, true 
FROM form f 
WHERE f.name in (
'anthem-tpa-2',
'anthem-tpa-3',
'anthem-tpa-4',
'anthem-tpa-5'
);

INSERT INTO form_question (required, question_id, form_id, invisible) 
SELECT false, q.question_id, (SELECT form_id FROM form WHERE name = 'anthem-tpa-2'), false 
FROM question q where q.code in (
'is_tpa_broker_2',
'tpa_administration_fee_2',
'tpa_city_2',
'tpa_email_2',
'tpa_fee_per_member_2',
'tpa_fee_per_subscriber_2',
'tpa_how_admin_fee_paid_2',
'tpa_name_2',
'tpa_other_value_2',
'tpa_phone_2',
'tpa_remittance_2',
'tpa_state_2',
'tpa_street_address_2',
'tpa_title_2',
'tpa_zip_2',
'tpa_functions_2'
);

INSERT INTO form_question (required, question_id, form_id, invisible) 
SELECT false, q.question_id, (SELECT form_id FROM form WHERE name = 'anthem-tpa-3'), false 
FROM question q where q.code in (
'is_tpa_broker_3',
'tpa_administration_fee_3',
'tpa_city_3',
'tpa_email_3',
'tpa_fee_per_member_3',
'tpa_fee_per_subscriber_3',
'tpa_how_admin_fee_paid_3',
'tpa_name_3',
'tpa_other_value_3',
'tpa_phone_3',
'tpa_remittance_3',
'tpa_state_3',
'tpa_street_address_3',
'tpa_title_3',
'tpa_zip_3',
'tpa_functions_3'
);

INSERT INTO form_question (required, question_id, form_id, invisible) 
SELECT false, q.question_id, (SELECT form_id FROM form WHERE name = 'anthem-tpa-4'), false 
FROM question q where q.code in (
'is_tpa_broker_4',
'tpa_administration_fee_4',
'tpa_city_4',
'tpa_email_4',
'tpa_fee_per_member_4',
'tpa_fee_per_subscriber_4',
'tpa_how_admin_fee_paid_4',
'tpa_name_4',
'tpa_other_value_4',
'tpa_phone_4',
'tpa_remittance_4',
'tpa_state_4',
'tpa_street_address_4',
'tpa_title_4',
'tpa_zip_4',
'tpa_functions_4'
);

INSERT INTO form_question (required, question_id, form_id, invisible) 
SELECT false, q.question_id, (SELECT form_id FROM form WHERE name = 'anthem-tpa-5'), false 
FROM question q where q.code in (
'is_tpa_broker_5',
'tpa_administration_fee_5',
'tpa_city_5',
'tpa_email_5',
'tpa_fee_per_member_5',
'tpa_fee_per_subscriber_5',
'tpa_how_admin_fee_paid_5',
'tpa_name_5',
'tpa_other_value_5',
'tpa_phone_5',
'tpa_remittance_5',
'tpa_state_5',
'tpa_street_address_5',
'tpa_title_5',
'tpa_zip_5',
'tpa_functions_5'
);

