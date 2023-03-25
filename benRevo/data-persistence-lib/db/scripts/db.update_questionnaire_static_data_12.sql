insert into question (code, title, multiselectable) values ('contact_name_1', 'Name', false);
insert into question (code, title, multiselectable) values ('contact_phone_1', 'Phone', false);
insert into question (code, title, multiselectable) values ('contact_email_1', 'Email', false);
insert into question (code, title, multiselectable) values ('contact_title_1', 'Title', false);
insert into question (code, title, multiselectable) values ('contact_address_1', 'Address', false);
insert into question (code, title, multiselectable) values ('contact_city_1', 'City', false);
insert into question (code, title, multiselectable) values ('contact_state_1', 'State', false);
insert into question (code, title, multiselectable) values ('contact_zip_1', 'Zip', false);
insert into question (code, title, multiselectable) values ('contact_fax_1', 'Fax', false);

insert into question (code, title, multiselectable) values ('contact_name_2', 'Name', false);
insert into question (code, title, multiselectable) values ('contact_phone_2', 'Phone', false);
insert into question (code, title, multiselectable) values ('contact_email_2', 'Email', false);
insert into question (code, title, multiselectable) values ('contact_title_2', 'Title', false);
insert into question (code, title, multiselectable) values ('contact_address_2', 'Address', false);
insert into question (code, title, multiselectable) values ('contact_city_2', 'City', false);
insert into question (code, title, multiselectable) values ('contact_state_2', 'State', false);
insert into question (code, title, multiselectable) values ('contact_zip_2', 'Zip', false);
insert into question (code, title, multiselectable) values ('contact_fax_2', 'Fax', false);

insert into question (code, title, multiselectable) values ('contact_name_3', 'Name', false);
insert into question (code, title, multiselectable) values ('contact_phone_3', 'Phone', false);
insert into question (code, title, multiselectable) values ('contact_email_3', 'Email', false);
insert into question (code, title, multiselectable) values ('contact_title_3', 'Title', false);
insert into question (code, title, multiselectable) values ('contact_address_3', 'Address', false);
insert into question (code, title, multiselectable) values ('contact_city_3', 'City', false);
insert into question (code, title, multiselectable) values ('contact_state_3', 'State', false);
insert into question (code, title, multiselectable) values ('contact_zip_3', 'Zip', false);
insert into question (code, title, multiselectable) values ('contact_fax_3', 'Fax', false);

insert into question (code, title, multiselectable) values ('contact_name_4', 'Name', false);
insert into question (code, title, multiselectable) values ('contact_phone_4', 'Phone', false);
insert into question (code, title, multiselectable) values ('contact_email_4', 'Email', false);
insert into question (code, title, multiselectable) values ('contact_title_4', 'Title', false);
insert into question (code, title, multiselectable) values ('contact_address_4', 'Address', false);
insert into question (code, title, multiselectable) values ('contact_city_4', 'City', false);
insert into question (code, title, multiselectable) values ('contact_state_4', 'State', false);
insert into question (code, title, multiselectable) values ('contact_zip_4', 'Zip', false);
insert into question (code, title, multiselectable) values ('contact_fax_4', 'Fax', false);

insert into question (code, title, multiselectable) values ('contact_role_1', 'Role', true);
insert into question (code, title, multiselectable) values ('contact_role_2', 'Role', true);
insert into question (code, title, multiselectable) values ('contact_role_3', 'Role', true);
insert into question (code, title, multiselectable) values ('contact_role_4', 'Role', true);
insert into question (code, title, multiselectable) values ('contact_counter', 'Number of contacts', false);

insert into variant (`number`, `option`, `alias`, question_id) 
select 1, 'group_administrator', 'contact_role_1_1', question_id from question where code = 'contact_role_1';

insert into variant (`number`, `option`, `alias`, question_id) 
select 2, 'billing_contact', 'contact_role_1_2', question_id from question where code = 'contact_role_1';

insert into variant (`number`, `option`, `alias`, question_id) 
select 3, 'designated_hipaa', 'contact_role_1_3', question_id from question where code = 'contact_role_1';

insert into variant (`number`, `option`, `alias`, question_id) 
select 4, 'decision_maker', 'contact_role_1_4', question_id from question where code = 'contact_role_1';

insert into variant (`number`, `option`, `alias`, question_id) 
select 1, 'group_administrator', 'contact_role_2_1', question_id from question where code = 'contact_role_2';

insert into variant (`number`, `option`, `alias`, question_id) 
select 2, 'billing_contact', 'contact_role_2_2', question_id from question where code = 'contact_role_2';

insert into variant (`number`, `option`, `alias`, question_id) 
select 3, 'designated_hipaa', 'contact_role_2_3', question_id from question where code = 'contact_role_2';

insert into variant (`number`, `option`, `alias`, question_id) 
select 4, 'decision_maker', 'contact_role_2_4', question_id from question where code = 'contact_role_2';

insert into variant (`number`, `option`, `alias`, question_id) 
select 1, 'group_administrator', 'contact_role_3_1', question_id from question where code = 'contact_role_3';

insert into variant (`number`, `option`, `alias`, question_id) 
select 2, 'billing_contact', 'contact_role_3_2', question_id from question where code = 'contact_role_3';

insert into variant (`number`, `option`, `alias`, question_id) 
select 3, 'designated_hipaa', 'contact_role_3_3', question_id from question where code = 'contact_role_3';

insert into variant (`number`, `option`, `alias`, question_id) 
select 4, 'decision_maker', 'contact_role_3_4', question_id from question where code = 'contact_role_3';

insert into variant (`number`, `option`, `alias`, question_id) 
select 1, 'group_administrator', 'contact_role_4_1', question_id from question where code = 'contact_role_4';

insert into variant (`number`, `option`, `alias`, question_id) 
select 2, 'billing_contact', 'contact_role_4_2', question_id from question where code = 'contact_role_4';

insert into variant (`number`, `option`, `alias`, question_id) 
select 3, 'designated_hipaa', 'contact_role_4_3', question_id from question where code = 'contact_role_4';

insert into variant (`number`, `option`, `alias`, question_id) 
select 4, 'decision_maker', 'contact_role_4_4', question_id from question where code = 'contact_role_4';

insert into form_question (required, question_id, form_id, invisible) 
select false, q.question_id, f.form_id, true from question q, form f 
where q.code in (
'contact_counter',
'contact_role_1', 
'contact_role_2', 
'contact_role_3', 
'contact_role_4',
'contact_name_1',
'contact_address_1', 
'contact_email_1', 
'contact_fax_1', 
'contact_phone_1', 
'contact_title_1', 
'contact_city_1', 
'contact_state_1', 
'contact_zip_1',
'contact_name_2',
'contact_address_2', 
'contact_email_2', 
'contact_fax_2', 
'contact_phone_2', 
'contact_title_2', 
'contact_city_2', 
'contact_state_2', 
'contact_zip_2',
'contact_name_3',
'contact_address_3', 
'contact_email_3', 
'contact_fax_3', 
'contact_phone_3', 
'contact_title_3', 
'contact_city_3', 
'contact_state_3', 
'contact_zip_3',
'contact_name_4',
'contact_address_4', 
'contact_email_4', 
'contact_fax_4', 
'contact_phone_4', 
'contact_title_4', 
'contact_city_4', 
'contact_state_4', 
'contact_zip_4'
)
and f.name = 'anthem-blue-cross-questionnaire';

insert into form_question (required, question_id, form_id, invisible) 
select false, q.question_id, f.form_id, true from question q, form f 
where q.code in (
'contact_counter',
'contact_role_1', 
'contact_role_2', 
'contact_role_3', 
'contact_role_4',
'contact_name_1',
'contact_email_1', 
'contact_phone_1', 
'contact_name_2',
'contact_email_2', 
'contact_phone_2', 
'contact_name_3',
'contact_email_3', 
'contact_phone_3', 
'contact_name_4',
'contact_email_4', 
'contact_phone_4'
)
and f.name = 'anthem-blue-cross-employer-application';

delete from form_question where question_id in (select q.question_id from question q where q.code in (
'client_point_of_contact_city',
'client_point_of_contact_email',
'client_point_of_contact_fax',
'client_point_of_contact_name',
'client_point_of_contact_phone',
'client_point_of_contact_state',
'client_point_of_contact_street_address',
'client_point_of_contact_title',
'client_point_of_contact_zip',
'billing_contact_address',
'billing_contact_city',
'billing_contact_email_address',
'billing_contact_fax_number',
'billing_contact_name',
'billing_contact_office_telephone_number',
'billing_contact_state',
'billing_contact_title',
'billing_contact_zip',
'decision_maker_city',
'decision_maker_email',
'decision_maker_fax',
'decision_maker_name',
'decision_maker_phone',
'decision_maker_state',
'decision_maker_street_address',
'decision_maker_title',
'decision_maker_zip',
'designated_hipaa_city',
'designated_hipaa_email',
'designated_hipaa_fax',
'designated_hipaa_name',
'designated_hipaa_phone',
'designated_hipaa_state',
'designated_hipaa_street_address',
'designated_hipaa_title',
'designated_hipaa_zip'
))
and form_id in (select form_id from form where name = 'anthem-blue-cross-questionnaire');

delete from form_question where question_id in (select q.question_id from question q where q.code in (
'billing_contact_email_address',
'billing_contact_name',
'billing_contact_office_telephone_number'
))
and form_id in (select form_id from form where name = 'anthem-blue-cross-employer-application');


