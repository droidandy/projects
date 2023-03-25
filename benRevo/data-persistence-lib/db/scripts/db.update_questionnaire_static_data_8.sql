INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'effective_date'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'groups_legal_name'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));

INSERT IGNORE INTO `question` (`code`, `title`, `multiselectable`) VALUES ('situs_state', 'Situs State (State of Issue)', FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'situs_state'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));

DELETE FROM form_question WHERE question_id = (SELECT question_id FROM question WHERE code = 'new_hire_waiting_period') and form_id = (SELECT form_id FROM form WHERE name = 'questionnaire');
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'waiting_period_for_new_hires'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'employees_terminate_on'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));
INSERT INTO `form_question` (`required`, `question_id`, `form_id`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'subject_to_erisa_regulation'), (SELECT `form_id` FROM `form` WHERE name = 'questionnaire'));