DELETE FROM form_question WHERE form_id = (SELECT form_id FROM form WHERE name = 'anthem-tpa-2');
DELETE FROM form_question WHERE form_id = (SELECT form_id FROM form WHERE name = 'anthem-tpa-3');
DELETE FROM form_question WHERE form_id = (SELECT form_id FROM form WHERE name = 'anthem-tpa-4');
DELETE FROM form_question WHERE form_id = (SELECT form_id FROM form WHERE name = 'anthem-tpa-5');

DELETE FROM form WHERE name = 'anthem-tpa-2';
DELETE FROM form WHERE name = 'anthem-tpa-3';
DELETE FROM form WHERE name = 'anthem-tpa-4';
DELETE FROM form WHERE name = 'anthem-tpa-5';

UPDATE question SET code = 'tpa', title = 'Will a TPA perform any functions for your group? If Yes, complete TPA Form.' WHERE code = 'tpa_quantity';

UPDATE answer SET value = CASE WHEN value > 0 THEN 'Yes' ELSE 'No' END   
WHERE question_id = (SELECT question_id FROM question WHERE code = 'tpa');

UPDATE form_question SET invisible = false WHERE question_id = (SELECT question_id FROM question WHERE code = 'tpa');

UPDATE question SET code = 'tpa_name' WHERE code = 'tpa_name_1';
UPDATE question SET code = 'tpa_other_value' WHERE code = 'tpa_other_value_1';
UPDATE question SET code = 'tpa_remittance' WHERE code = 'tpa_remittance_1';
UPDATE question SET code = 'tpa_administration_fee' WHERE code = 'tpa_administration_fee_1';
UPDATE question SET code = 'tpa_fee_per_subscriber' WHERE code = 'tpa_fee_per_subscriber_1';
UPDATE question SET code = 'tpa_fee_per_member' WHERE code = 'tpa_fee_per_member_1';
UPDATE question SET code = 'tpa_how_admin_fee_paid' WHERE code = 'tpa_how_admin_fee_paid_1';
UPDATE question SET code = 'tpa_street_address' WHERE code = 'tpa_street_address_1';
UPDATE question SET code = 'tpa_title' WHERE code = 'tpa_title_1';
UPDATE question SET code = 'tpa_phone' WHERE code = 'tpa_phone_1';
UPDATE question SET code = 'tpa_city' WHERE code = 'tpa_city_1';
UPDATE question SET code = 'tpa_email' WHERE code = 'tpa_email_1';
UPDATE question SET code = 'tpa_state' WHERE code = 'tpa_state_1';
UPDATE question SET code = 'tpa_zip' WHERE code = 'tpa_zip_1';
UPDATE question SET code = 'is_tpa_broker' WHERE code = 'is_tpa_broker_1';
UPDATE question SET code = 'tpa_functions' WHERE code = 'tpa_functions_1';

INSERT INTO variant (`number`, `option`, `question_id`) VALUES (1, 'Yes', (SELECT `question_id` FROM `question` WHERE CODE = 'tpa'));
INSERT INTO variant (`number`, `option`, `question_id`) VALUES (2, 'No', (SELECT `question_id` FROM `question` WHERE CODE = 'tpa'));

DELETE FROM variant WHERE question_id IN (SELECT question_id FROM question WHERE code IN (
'is_tpa_broker_2',
'tpa_administration_fee_2',
'tpa_functions_2',
'tpa_how_admin_fee_paid_2',
'tpa_remittance_2',

'is_tpa_broker_3',
'tpa_administration_fee_3',
'tpa_functions_3',
'tpa_how_admin_fee_paid_3',
'tpa_remittance_3',

'is_tpa_broker_4',
'tpa_administration_fee_4',
'tpa_functions_4',
'tpa_how_admin_fee_paid_4',
'tpa_remittance_4',

'is_tpa_broker_5',
'tpa_administration_fee_5',
'tpa_functions_5',
'tpa_how_admin_fee_paid_5',
'tpa_remittance_5'

));

DELETE FROM `question` WHERE code in (
  'tpa_other_value_2',
  'tpa_remittance_2',
  'tpa_administration_fee_2',
  'tpa_fee_per_subscriber_2',
  'tpa_fee_per_member_2',
  'tpa_how_admin_fee_paid_2',
  'tpa_name_2',
  'tpa_street_address_2',
  'tpa_title_2',
  'tpa_phone_2',
  'tpa_city_2',
  'tpa_email_2',
  'tpa_state_2',
  'tpa_zip_2',
  'is_tpa_broker_2',
  'tpa_functions_2',

  'tpa_other_value_3',
  'tpa_remittance_3',
  'tpa_administration_fee_3',
  'tpa_fee_per_subscriber_3',
  'tpa_fee_per_member_3',
  'tpa_how_admin_fee_paid_3',
  'tpa_name_3',
  'tpa_street_address_3',
  'tpa_title_3',
  'tpa_phone_3',
  'tpa_city_3',
  'tpa_email_3',
  'tpa_state_3',
  'tpa_zip_3',
  'is_tpa_broker_3',
  'tpa_functions_3',

  'tpa_other_value_4',
  'tpa_remittance_4',
  'tpa_administration_fee_4',
  'tpa_fee_per_subscriber_4',
  'tpa_fee_per_member_4',
  'tpa_how_admin_fee_paid_4',
  'tpa_name_4',
  'tpa_street_address_4',
  'tpa_title_4',
  'tpa_phone_4',
  'tpa_city_4',
  'tpa_email_4',
  'tpa_state_4',
  'tpa_zip_4',
  'is_tpa_broker_4',
  'tpa_functions_4',

  'tpa_other_value_5',
  'tpa_remittance_5',
  'tpa_administration_fee_5',
  'tpa_fee_per_subscriber_5',
  'tpa_fee_per_member_5',
  'tpa_how_admin_fee_paid_5',
  'tpa_name_5',
  'tpa_street_address_5',
  'tpa_title_5',
  'tpa_phone_5',
  'tpa_city_5',
  'tpa_email_5',
  'tpa_state_5',
  'tpa_zip_5',
  'is_tpa_broker_5',
  'tpa_functions_5'

);

