INSERT INTO `question` (`code`, `title`, `multiselectable`) VALUES 
  ('eligibility_transmission_employer_eservices', 'Outside Vendor toll', False),
  ('eligibility_transmission_electronic_feed', 'Outside Vendor toll', False),
  ('eligibility_transmission_enrollment_forms', 'Outside Vendor toll', False);

UPDATE question SET 
code = 'type_of_eligibility_transmission', 
title = 'Type of eligibility transmission', 
multiselectable = true 
WHERE code = 'initial_eligibility_transmission_option';

UPDATE question SET 
code = 'eligibility_transmission_excel_spreadsheet', 
title = 'Excel  spreadsheet / xTool  (Standard)' 
WHERE code = 'subsequent_eligibility_transmission_option';

INSERT INTO form_question (required, question_id, form_id, invisible) 
SELECT false, q.question_id, (SELECT form_id FROM form WHERE name = 'questionnaire'), false 
FROM question q where q.code in (
'eligibility_transmission_employer_eservices',
'eligibility_transmission_electronic_feed',
'eligibility_transmission_enrollment_forms'
);

UPDATE `variant` SET `option` = 'Excel  spreadsheet / xTool  (Standard)'
WHERE question_id = 
(SELECT question_id FROM question WHERE code = 'type_of_eligibility_transmission')
AND number = 1;

UPDATE `variant` SET `option` = 'Initial'
WHERE question_id = 
(SELECT question_id FROM question WHERE code = 'eligibility_transmission_excel_spreadsheet')
AND number = 1;

UPDATE `variant` SET `option` = 'Subsequent'
WHERE question_id = 
(SELECT question_id FROM question WHERE code = 'eligibility_transmission_excel_spreadsheet')
AND number = 2;

DELETE FROM variant WHERE number IN (3,4) and question_id = 
(SELECT `question_id` FROM `question` WHERE CODE = 'eligibility_transmission_excel_spreadsheet');

INSERT INTO variant (`number`, `option`, `question_id`) VALUES 
(1, 'Initial', 
(SELECT `question_id` FROM `question` WHERE CODE = 'eligibility_transmission_employer_eservices'));

INSERT INTO variant (`number`, `option`, `question_id`) VALUES 
(2, 'Subsequent', 
(SELECT `question_id` FROM `question` WHERE CODE = 'eligibility_transmission_employer_eservices'));

INSERT INTO variant (`number`, `option`, `question_id`) VALUES 
(1, 'Initial', 
(SELECT `question_id` FROM `question` WHERE CODE = 'eligibility_transmission_electronic_feed'));

INSERT INTO variant (`number`, `option`, `question_id`) VALUES 
(2, 'Subsequent', 
(SELECT `question_id` FROM `question` WHERE CODE = 'eligibility_transmission_electronic_feed'));

INSERT INTO variant (`number`, `option`, `question_id`) VALUES 
(1, 'Initial', 
(SELECT `question_id` FROM `question` WHERE CODE = 'eligibility_transmission_enrollment_forms'));

INSERT INTO variant (`number`, `option`, `question_id`) VALUES 
(2, 'Subsequent', 
(SELECT `question_id` FROM `question` WHERE CODE = 'eligibility_transmission_enrollment_forms'));


