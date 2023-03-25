
delete from form_question where form_id = (select form_id from form where name = 'anthem-common-ownership');

delete from form where name = 'anthem-common-ownership';

delete from question where code in (
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

