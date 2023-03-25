update question set multiselectable = true where code in (
'eoc_will_be_sent_out_to',
'standard_method_for_initial_enrollment',
'standard_method_for_ongoing_enrollment',
'employer_access_option',
'no_blue_cross_ppo',
'tpa_remittance');

update variant set `alias` = 'standard_method_for_initial_enrollment_2' where question_id = (select question_id from question where code = 'standard_method_for_initial_enrollment') 
and `option` = 'EmployerAccess';
update variant set `alias` = 'standard_method_for_initial_enrollment_3' where question_id = (select question_id from question where code = 'standard_method_for_initial_enrollment') 
and `option` = '834 File Format';

update variant set `alias` = 'employer_access_option_1' where question_id = (select question_id from question where code = 'employer_access_option') 
and `option` = 'Online member enrollment';
update variant set `alias` = 'employer_access_option_2' where question_id = (select question_id from question where code = 'employer_access_option') 
and `option` = 'Online enrollment Census Tool';
update variant set `alias` = 'employer_access_option_3' where question_id = (select question_id from question where code = 'employer_access_option') 
and `option` = 'Group administrator performs online enrollments';

update variant set `alias` = 'no_blue_cross_ppo' where question_id = (select question_id from question where code = 'no_blue_cross_ppo') 
and `option` = 'No Blue Cross PPO (non-California) plan sold';

update variant set `alias` = 'tpa_remittance_net' where question_id = (select question_id from question where code = 'tpa_remittance') 
and `option` = 'Remits net';

update variant set `alias` = 'tpa_remittance_gross' where question_id = (select question_id from question where code = 'tpa_remittance') 
and `option` = 'Remits gross';


delete from form_question where question_id in (select q.question_id from question q where q.code in (
'tpa_premium_administration', 
'tpa_enroll_eligible_svs',
'tpa_cobra', 
'tpa_other'));

delete from variant where question_id in (select q.question_id from question q where q.code in (
'tpa_premium_administration', 
'tpa_enroll_eligible_svs',
'tpa_cobra', 
'tpa_other'));

delete from question where code in (
'tpa_premium_administration', 
'tpa_enroll_eligible_svs',
'tpa_cobra', 
'tpa_other');

insert into question (code, title, multiselectable) values ('tpa_functions', 'On this account, the TPA will perform these functions (check all that apply):', true);

insert into form_question (required, question_id, form_id, invisible) 
select false, q.question_id, f.form_id, false from question q, form f 
where q.code = 'tpa_functions' and f.name = 'anthem-blue-cross-questionnaire';

insert into variant (`number`, `option`, `alias`, question_id) 
select 1, 'Premium administration', 'tpa_functions_1', question_id from question where code = 'tpa_functions';
insert into variant (`number`, `option`, `alias`, question_id) 
select 2, 'Enrollment and eligibility services', 'tpa_functions_2', question_id from question where code = 'tpa_functions';
insert into variant (`number`, `option`, `alias`, question_id) 
select 3, 'COBRA', 'tpa_functions_3', question_id from question where code = 'tpa_functions';
insert into variant (`number`, `option`, `alias`, question_id) 
select 4, 'Other', 'tpa_functions_4', question_id from question where code = 'tpa_functions';

