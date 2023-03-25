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

INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_for_recurring_is_the_same'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_for_recurring_name'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_for_recurring_street_address'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_for_recurring_city'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_for_recurring_state'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_for_recurring_zip'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_for_recurring_routing_number'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_for_recurring_account_number'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'financial_institution_for_recurring_account_type'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'payment_information_type'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'payment_information_type_other'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);
INSERT INTO `form_question` (`required`, `question_id`, `form_id`, `invisible`) VALUES (FALSE, (SELECT `question_id` FROM `question` WHERE CODE = 'future_recurring'), (SELECT `form_id` FROM `form` WHERE name = 'anthem-blue-cross-questionnaire'), FALSE);