INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_ein_1', 'Tax ID #', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_ein_2', 'Tax ID #', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_ein_3', 'Tax ID #', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_ein_4', 'Tax ID #', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_ein_5', 'Tax ID #', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_ein_6', 'Tax ID #', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_ein_7', 'Tax ID #', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_ein_8', 'Tax ID #', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_ein_9', 'Tax ID #', FALSE);
INSERT INTO question (`code`, `title`, `multiselectable`) VALUES ('affiliated_company_ein_10', 'Tax ID #', FALSE);

INSERT INTO form (name, carrier_id) VALUES ('anthem-common-ownership', (SELECT carrier_id FROM carrier WHERE name = 'ANTHEM_BLUE_CROSS'));

INSERT INTO form_question (required, question_id, form_id, invisible) 
SELECT false, q.question_id, (select form_id from form where name = 'anthem-common-ownership'), false FROM question q 
WHERE q.code IN (
'affiliated_firms_quantity',
'affiliated_company_name_1',
'affiliated_company_name_2',
'affiliated_company_name_3',
'affiliated_company_name_4',
'affiliated_company_name_5',
'affiliated_company_name_6',
'affiliated_company_name_7',
'affiliated_company_name_8',
'affiliated_company_name_9',
'affiliated_company_name_10',
'affiliated_company_address_1',
'affiliated_company_address_2',
'affiliated_company_address_3',
'affiliated_company_address_4',
'affiliated_company_address_5',
'affiliated_company_address_6',
'affiliated_company_address_7',
'affiliated_company_address_8',
'affiliated_company_address_9',
'affiliated_company_address_10',
'affiliated_company_ein_1',
'affiliated_company_ein_2',
'affiliated_company_ein_3',
'affiliated_company_ein_4',
'affiliated_company_ein_5',
'affiliated_company_ein_6',
'affiliated_company_ein_7',
'affiliated_company_ein_8',
'affiliated_company_ein_9',
'affiliated_company_ein_10'
);

