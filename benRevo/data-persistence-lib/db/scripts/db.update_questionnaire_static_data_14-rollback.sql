delete from form_question where form_id = (select form_id from form where name = 'anthem-employer-access');

delete from form_question where question_id in (select q.question_id from question q where q.code in (
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
))
and form_id = (select form_id from form where name = 'anthem-blue-cross-questionnaire');

delete from form_question where question_id in (select q.question_id from question q where q.code in (
'contact_role_5', 
'contact_email_5', 
'contact_phone_5'
))
and form_id = (select form_id from form where name = 'anthem-blue-cross-employer-application');

delete from form where name = 'anthem-employer-access';

delete from variant where alias in (
'contact_role_1_5',
'contact_role_2_5',
'contact_role_3_5',
'contact_role_4_5',
'contact_role_5_5'
);

delete from variant where question_id in (select q.question_id from question q where q.code in (
'contact_role_5',
'contact_user_is_1',
'contact_user_is_2',
'contact_user_is_3',
'contact_user_is_4',
'contact_user_is_5',
'contact_email_type_1',
'contact_email_type_2',
'contact_email_type_3',
'contact_email_type_4',
'contact_email_type_5'
));

delete from question where code in (
'contact_role_5',
'contact_name_5',
'contact_phone_5',
'contact_email_5',
'contact_title_5',
'contact_address_5',
'contact_city_5',
'contact_state_5',
'contact_zip_5',
'contact_fax_5',
'contact_user_is_1',
'contact_user_is_2',
'contact_user_is_3',
'contact_user_is_4',
'contact_user_is_5',
'contact_email_type_1',
'contact_email_type_2',
'contact_email_type_3',
'contact_email_type_4',
'contact_email_type_5'
);

