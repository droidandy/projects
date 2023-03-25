UPDATE question SET 
code = 'initial_eligibility_transmission_option', 
title = 'Eligibility Transmission - Initial payment options', 
multiselectable = false 
WHERE code = 'type_of_eligibility_transmission';

UPDATE question SET 
code = 'subsequent_eligibility_transmission_option', 
title = 'Eligibility Transmission - Subsequent payment options' 
WHERE code = 'eligibility_transmission_excel_spreadsheet';

UPDATE `variant` SET `option` = 'Excel spreadsheet / xTool (Standard)'
WHERE question_id = 
(SELECT question_id FROM question WHERE code = 'initial_eligibility_transmission_option')
AND number = 1;

UPDATE `variant` SET `option` = 'Excel spreadsheet / xTool (Standard)'
WHERE question_id = 
(SELECT question_id FROM question WHERE code = 'subsequent_eligibility_transmission_option')
AND number = 1;

UPDATE `variant` SET `option` = 'Employer eServices (Standard)'
WHERE question_id = 
(SELECT question_id FROM question WHERE code = 'subsequent_eligibility_transmission_option')
AND number = 2;

INSERT INTO variant (`number`, `option`, `question_id`) VALUES 
(3, 'Electronic Feed', 
(SELECT `question_id` FROM `question` WHERE CODE = 'subsequent_eligibility_transmission_option'));

INSERT INTO variant (`number`, `option`, `question_id`) VALUES 
(4, 'Enrollment Forms', 
(SELECT `question_id` FROM `question` WHERE CODE = 'subsequent_eligibility_transmission_option'));

DELETE FROM variant WHERE question_id IN (
SELECT question_id FROM question WHERE code IN (
'eligibility_transmission_employer_eservices',
'eligibility_transmission_electronic_feed',
'eligibility_transmission_enrollment_forms'
));

DELETE FROM form_question WHERE question_id IN (
SELECT question_id FROM question WHERE code IN (
'eligibility_transmission_employer_eservices',
'eligibility_transmission_electronic_feed',
'eligibility_transmission_enrollment_forms'
));

DELETE FROM answer WHERE question_id IN (
SELECT question_id FROM question WHERE code IN (
'eligibility_transmission_employer_eservices',
'eligibility_transmission_electronic_feed',
'eligibility_transmission_enrollment_forms'
));

DELETE FROM question WHERE code IN ( 
'eligibility_transmission_employer_eservices',
'eligibility_transmission_electronic_feed',
'eligibility_transmission_enrollment_forms'
);

