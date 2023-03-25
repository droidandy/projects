-- adding placeholder for 5th role
insert into question (code, title, multiselectable) values ('contact_name_5', 'Name', false);
insert into question (code, title, multiselectable) values ('contact_phone_5', 'Phone', false);
insert into question (code, title, multiselectable) values ('contact_email_5', 'Email', false);
insert into question (code, title, multiselectable) values ('contact_title_5', 'Title', false);
insert into question (code, title, multiselectable) values ('contact_address_5', 'Address', false);
insert into question (code, title, multiselectable) values ('contact_city_5', 'City', false);
insert into question (code, title, multiselectable) values ('contact_state_5', 'State', false);
insert into question (code, title, multiselectable) values ('contact_zip_5', 'Zip', false);
insert into question (code, title, multiselectable) values ('contact_fax_5', 'Fax', false);
insert into question (code, title, multiselectable) values ('contact_role_5', 'Role', true);

-- adding new role
insert into variant (`number`, `option`, `alias`, question_id) 
select 5, 'Anthem Employer access administrator', 'contact_role_1_5', question_id from question where code = 'contact_role_1';
insert into variant (`number`, `option`, `alias`, question_id) 
select 5, 'Anthem Employer access administrator', 'contact_role_2_5', question_id from question where code = 'contact_role_2';
insert into variant (`number`, `option`, `alias`, question_id) 
select 5, 'Anthem Employer access administrator', 'contact_role_3_5', question_id from question where code = 'contact_role_3';
insert into variant (`number`, `option`, `alias`, question_id) 
select 5, 'Anthem Employer access administrator', 'contact_role_4_5', question_id from question where code = 'contact_role_4';

insert into variant (`number`, `option`, `alias`, question_id) 
select 1, 'Group Administrator', 'contact_role_5_1', question_id from question where code = 'contact_role_5';
insert into variant (`number`, `option`, `alias`, question_id) 
select 2, 'Billing Contact', 'contact_role_5_2', question_id from question where code = 'contact_role_5';
insert into variant (`number`, `option`, `alias`, question_id) 
select 3, 'Designated HIPAA Representative', 'contact_role_5_3', question_id from question where code = 'contact_role_5';
insert into variant (`number`, `option`, `alias`, question_id) 
select 4, 'Decision Maker', 'contact_role_5_4', question_id from question where code = 'contact_role_5';
insert into variant (`number`, `option`, `alias`, question_id) 
select 5, 'Anthem Employer access administrator', 'contact_role_5_5', question_id from question where code = 'contact_role_5';

-- adding new questions for contact
insert into question (code, title, multiselectable) values ('contact_email_type_1', 'Email Type', false);
insert into question (code, title, multiselectable) values ('contact_email_type_2', 'Email Type', false);
insert into question (code, title, multiselectable) values ('contact_email_type_3', 'Email Type', false);
insert into question (code, title, multiselectable) values ('contact_email_type_4', 'Email Type', false);
insert into question (code, title, multiselectable) values ('contact_email_type_5', 'Email Type', false);

-- fill data for new questions
insert into variant (`number`, `option`, `alias`, question_id) 
select 1, 'Personal Company''s email', null, question_id from question where code = 'contact_email_type_1';
insert into variant (`number`, `option`, `alias`, question_id) 
select 2, 'Company''s General email', null, question_id from question where code = 'contact_email_type_1';

insert into variant (`number`, `option`, `alias`, question_id) 
select 1, 'Personal Company''s email', null, question_id from question where code = 'contact_email_type_2';
insert into variant (`number`, `option`, `alias`, question_id) 
select 2, 'Company''s General email', null, question_id from question where code = 'contact_email_type_2';

insert into variant (`number`, `option`, `alias`, question_id) 
select 1, 'Personal Company''s email', null, question_id from question where code = 'contact_email_type_3';
insert into variant (`number`, `option`, `alias`, question_id) 
select 2, 'Company''s General email', null, question_id from question where code = 'contact_email_type_3';

insert into variant (`number`, `option`, `alias`, question_id) 
select 1, 'Personal Company''s email', null, question_id from question where code = 'contact_email_type_4';
insert into variant (`number`, `option`, `alias`, question_id) 
select 2, 'Company''s General email', null, question_id from question where code = 'contact_email_type_4';

insert into variant (`number`, `option`, `alias`, question_id) 
select 1, 'Personal Company''s email', null, question_id from question where code = 'contact_email_type_5';
insert into variant (`number`, `option`, `alias`, question_id) 
select 2, 'Company''s General email', null, question_id from question where code = 'contact_email_type_5';

-- adding new questions for contact
insert into question (code, title, multiselectable) values ('contact_user_is_1', 'Employer access user is', false);
insert into question (code, title, multiselectable) values ('contact_user_is_2', 'Employer access user is', false);
insert into question (code, title, multiselectable) values ('contact_user_is_3', 'Employer access user is', false);
insert into question (code, title, multiselectable) values ('contact_user_is_4', 'Employer access user is', false);
insert into question (code, title, multiselectable) values ('contact_user_is_5', 'Employer access user is', false);

insert into variant (`number`, `option`, `alias`, question_id) 
select 1, 'an employee of the Group and responsible for the administration of the Group''s employee benefit plan', null, question_id from question where code = 'contact_user_is_1';
insert into variant (`number`, `option`, `alias`, question_id) 
select 2, 'the Group''s Third Party Administrator / Broker', null, question_id from question where code = 'contact_user_is_1';

insert into variant (`number`, `option`, `alias`, question_id) 
select 1, 'an employee of the Group and responsible for the administration of the Group''s employee benefit plan', null, question_id from question where code = 'contact_user_is_2';
insert into variant (`number`, `option`, `alias`, question_id) 
select 2, 'the Group''s Third Party Administrator / Broker', null, question_id from question where code = 'contact_user_is_2';

insert into variant (`number`, `option`, `alias`, question_id) 
select 1, 'an employee of the Group and responsible for the administration of the Group''s employee benefit plan', null, question_id from question where code = 'contact_user_is_3';
insert into variant (`number`, `option`, `alias`, question_id) 
select 2, 'the Group''s Third Party Administrator / Broker', null, question_id from question where code = 'contact_user_is_3';

insert into variant (`number`, `option`, `alias`, question_id) 
select 1, 'an employee of the Group and responsible for the administration of the Group''s employee benefit plan', null, question_id from question where code = 'contact_user_is_4';
insert into variant (`number`, `option`, `alias`, question_id) 
select 2, 'the Group''s Third Party Administrator / Broker', null, question_id from question where code = 'contact_user_is_4';

insert into variant (`number`, `option`, `alias`, question_id) 
select 1, 'an employee of the Group and responsible for the administration of the Group''s employee benefit plan', null, question_id from question where code = 'contact_user_is_5';
insert into variant (`number`, `option`, `alias`, question_id) 
select 2, 'the Group''s Third Party Administrator / Broker', null, question_id from question where code = 'contact_user_is_5';

-- adding new form
insert into form (name, carrier_id) values ('anthem-employer-access', (select carrier_id from carrier where name = 'ANTHEM_BLUE_CROSS'));

-- adding questions to new form
insert into  form_question (required, question_id, form_id, invisible) 
select false, q.question_id, (select form_id from form where name = 'anthem-employer-access'), false 
from question q where q.code in (
'contact_counter',
'contact_role_1', 
'contact_role_2', 
'contact_role_3', 
'contact_role_4',
'contact_role_5',
'contact_name_1',
'contact_address_1',
'contact_email_1', 
'contact_phone_1', 
'contact_city_1', 
'contact_state_1', 
'contact_zip_1',
'contact_email_type_1',
'contact_user_is_1',
'contact_name_2',
'contact_address_2', 
'contact_email_2', 
'contact_phone_2', 
'contact_city_2', 
'contact_state_2', 
'contact_zip_2',
'contact_email_type_2',
'contact_user_is_2',
'contact_name_3',
'contact_address_3', 
'contact_email_3', 
'contact_phone_3', 
'contact_city_3', 
'contact_state_3', 
'contact_zip_3',
'contact_email_type_3',
'contact_user_is_3',
'contact_name_4',
'contact_address_4', 
'contact_email_4', 
'contact_phone_4', 
'contact_city_4', 
'contact_state_4', 
'contact_zip_4',
'contact_email_type_4',
'contact_user_is_4',
'contact_name_5',
'contact_address_5', 
'contact_email_5', 
'contact_phone_5', 
'contact_city_5', 
'contact_state_5', 
'contact_zip_5',
'contact_email_type_5',
'contact_user_is_5'
);

-- updating existing form
insert into form_question (required, question_id, form_id, invisible) 
select false, q.question_id, f.form_id, true from question q, form f 
where q.code in (
'contact_role_5', 
'contact_name_5',
'contact_address_5', 
'contact_email_5', 
'contact_fax_5', 
'contact_phone_5', 
'contact_title_5', 
'contact_city_5', 
'contact_state_5', 
'contact_zip_5'
)
and f.name = 'anthem-blue-cross-questionnaire';

-- updating existing form
insert into form_question (required, question_id, form_id, invisible) 
select false, q.question_id, f.form_id, true from question q, form f 
where q.code in (
'contact_role_5', 
'contact_email_5', 
'contact_phone_5'
)
and f.name = 'anthem-blue-cross-employer-application';

 
