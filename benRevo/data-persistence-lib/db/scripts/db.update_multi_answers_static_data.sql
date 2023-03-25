UPDATE `question` SET `multiselectable` = TRUE WHERE `code` = 'standard_method_for_initial_enrollment';
UPDATE `variant` SET `alias` = 'standard_method_for_initial_enrollment_1' WHERE number = 1 AND `question_id` = (SELECT `question_id` FROM `question` WHERE `code` = 'standard_method_for_initial_enrollment');
UPDATE `variant` SET `alias` = 'standard_method_for_initial_enrollment_2' WHERE number = 2 AND `question_id` = (SELECT `question_id` FROM `question` WHERE `code` = 'standard_method_for_initial_enrollment');
UPDATE `variant` SET `alias` = 'standard_method_for_initial_enrollment_3' WHERE number = 3 AND `question_id` = (SELECT `question_id` FROM `question` WHERE `code` = 'standard_method_for_initial_enrollment');
UPDATE `variant` SET `alias` = 'standard_method_for_initial_enrollment_4' WHERE number = 4 AND `question_id` = (SELECT `question_id` FROM `question` WHERE `code` = 'standard_method_for_initial_enrollment');

UPDATE `question` SET `multiselectable` = TRUE WHERE `code` = 'standard_method_for_ongoing_enrollment';
UPDATE `variant` SET `alias` = 'standard_method_for_ongoing_enrollment_1' WHERE number = 1 AND `question_id` = (SELECT `question_id` FROM `question` WHERE `code` = 'standard_method_for_ongoing_enrollment');
UPDATE `variant` SET `alias` = 'standard_method_for_ongoing_enrollment_2' WHERE number = 2 AND `question_id` = (SELECT `question_id` FROM `question` WHERE `code` = 'standard_method_for_ongoing_enrollment');
UPDATE `variant` SET `alias` = 'standard_method_for_ongoing_enrollment_3' WHERE number = 3 AND `question_id` = (SELECT `question_id` FROM `question` WHERE `code` = 'standard_method_for_ongoing_enrollment');
UPDATE `variant` SET `alias` = 'standard_method_for_ongoing_enrollment_4' WHERE number = 4 AND `question_id` = (SELECT `question_id` FROM `question` WHERE `code` = 'standard_method_for_ongoing_enrollment');

UPDATE `question` SET `multiselectable` = TRUE WHERE `code` = 'group_elects_to_opt_out_of_authorizing';
UPDATE `variant` SET `alias` = 'group_elects_to_opt_out_of_authorizing' WHERE number = 1 AND `question_id` = (SELECT `question_id` FROM `question` WHERE `code` = 'group_elects_to_opt_out_of_authorizing');

UPDATE `question` SET `multiselectable` = TRUE WHERE `code` = 'wa_currently_holds_appointment_with_uhc';
DELETE FROM `variant` WHERE `question_id` = (SELECT `question_id` FROM `question` WHERE `code` = 'wa_currently_holds_appointment_with_uhc') AND `number` = 2;
UPDATE `variant` SET `option` = 'UnitedHealthcare' WHERE `question_id` = (SELECT `question_id` FROM `question` WHERE `code` = 'wa_currently_holds_appointment_with_uhc') AND `number` = 1;
UPDATE `variant` SET `alias` = 'wa_currently_holds_appointment_with_uhc' WHERE number = 1 AND `question_id` = (SELECT `question_id` FROM `question` WHERE `code` = 'wa_currently_holds_appointment_with_uhc');

UPDATE `question` SET `multiselectable` = TRUE WHERE `code` = 'wa_currently_holds_appointment_with_uhc_2';
DELETE FROM `variant` WHERE `question_id` = (SELECT `question_id` FROM `question` WHERE `code` = 'wa_currently_holds_appointment_with_uhc_2') AND `number` = 2;
UPDATE `variant` SET `option` = 'UnitedHealthcare' WHERE `question_id` = (SELECT `question_id` FROM `question` WHERE `code` = 'wa_currently_holds_appointment_with_uhc_2') AND `number` = 1;
UPDATE `variant` SET `alias` = 'wa_currently_holds_appointment_with_uhc_2' WHERE number = 1 AND `question_id` = (SELECT `question_id` FROM `question` WHERE `code` = 'wa_currently_holds_appointment_with_uhc_2');

UPDATE `question` SET `multiselectable` = TRUE WHERE `code` = 'firm_holds_appointment_with_uhc';
DELETE FROM `variant` WHERE `question_id` = (SELECT `question_id` FROM `question` WHERE `code` = 'firm_holds_appointment_with_uhc') AND `number` = 2;
UPDATE `variant` SET `option` = 'UnitedHealthcare' WHERE `question_id` = (SELECT `question_id` FROM `question` WHERE `code` = 'firm_holds_appointment_with_uhc') AND `number` = 1;
UPDATE `variant` SET `alias` = 'firm_holds_appointment_with_uhc' WHERE number = 1 AND `question_id` = (SELECT `question_id` FROM `question` WHERE `code` = 'firm_holds_appointment_with_uhc');