delete from form_question where question_id in (select q.question_id from question q where q.code in (
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
))
and
form_id in (select form_id from form where name = 'anthem-blue-cross-employer-application');

delete from form_question where question_id in (select q.question_id from question q where q.code in (
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
))
and form_id in (select form_id from form where name = 'anthem-blue-cross-questionnaire');


delete from variant where question_id in (select q.question_id from question q where q.code in (
'contact_role_1', 
'contact_role_2', 
'contact_role_3',
'contact_role_4'
));

delete from question where code in (
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
);

insert into form_question (required, question_id, form_id, invisible) 
select false, q.question_id, f.form_id, false from question q, form f 
where q.code in (
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
)
and f.name = 'anthem-blue-cross-questionnaire';

insert into form_question (required, question_id, form_id, invisible) 
select false, q.question_id, f.form_id, false from question q, form f 
where q.code in (
'billing_contact_email_address',
'billing_contact_name',
'billing_contact_office_telephone_number'
)
and f.name = 'anthem-blue-cross-employer-application';
