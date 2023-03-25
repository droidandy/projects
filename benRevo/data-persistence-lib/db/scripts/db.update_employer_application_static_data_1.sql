update question set code = 'medical_waiting_period_for' where code = 'all_products_waiting_period';
update question set code = 'speciality_waiting_period_for' where code = 'speciality_waiting_period';

insert into question (code, title, multiselectable) values ('medical_waiting_period_begin_date', 'Eligibility/coverage begin date:', false);
insert into question (code, title, multiselectable) values ('speciality_waiting_period_begin_date', 'Eligibility/coverage begin date:', false);

insert into variant (`number`, `option`, question_id) 
select 1, '1st of the month following date of hire', question_id from question where code = 'medical_waiting_period_begin_date';
insert into variant (`number`, `option`, question_id) 
select 2, '1st of the month following 1 month from date of hire ', question_id from question where code = 'medical_waiting_period_begin_date';
insert into variant (`number`, `option`, question_id) 
select 3, '1st of the month following 2 months from date of hire*', question_id from question where code = 'medical_waiting_period_begin_date';
insert into variant (`number`, `option`, question_id) 
select 4, '1st of the month following 30 days from date of hire', question_id from question where code = 'medical_waiting_period_begin_date';
insert into variant (`number`, `option`, question_id) 
select 5, '1st of the month following 60 days from date of hire*', question_id from question where code = 'medical_waiting_period_begin_date';
insert into variant (`number`, `option`, question_id) 
select 6, 'Date of hire ', question_id from question where code = 'medical_waiting_period_begin_date';
insert into variant (`number`, `option`, question_id) 
select 7, '1 month from date of hire', question_id from question where code = 'medical_waiting_period_begin_date';
insert into variant (`number`, `option`, question_id) 
select 8, '2 months from date of hire', question_id from question where code = 'medical_waiting_period_begin_date';
insert into variant (`number`, `option`, question_id) 
select 9, '30 days from date of hire', question_id from question where code = 'medical_waiting_period_begin_date';
insert into variant (`number`, `option`, question_id) 
select 10, '60 days from date of hire', question_id from question where code = 'medical_waiting_period_begin_date';
insert into variant (`number`, `option`, question_id) 
select 11, '90 days from date of hire', question_id from question where code = 'medical_waiting_period_begin_date';
insert into variant (`number`, `option`, question_id) 
select 12, '91 days from date of hire', question_id from question where code = 'medical_waiting_period_begin_date';

insert into variant (`number`, `option`, question_id) 
select 1, '1st of the month following date of hire', question_id from question where code = 'speciality_waiting_period_begin_date';
insert into variant (`number`, `option`, question_id) 
select 2, '1st of the month following 1 month from date of hire ', question_id from question where code = 'speciality_waiting_period_begin_date';
insert into variant (`number`, `option`, question_id) 
select 3, '1st of the month following 2 months from date of hire*', question_id from question where code = 'speciality_waiting_period_begin_date';
insert into variant (`number`, `option`, question_id) 
select 4, '1st of the month following 30 days from date of hire', question_id from question where code = 'speciality_waiting_period_begin_date';
insert into variant (`number`, `option`, question_id) 
select 5, '1st of the month following 60 days from date of hire*', question_id from question where code = 'speciality_waiting_period_begin_date';
insert into variant (`number`, `option`, question_id) 
select 6, 'Date of hire ', question_id from question where code = 'speciality_waiting_period_begin_date';
insert into variant (`number`, `option`, question_id) 
select 7, '1 month from date of hire', question_id from question where code = 'speciality_waiting_period_begin_date';
insert into variant (`number`, `option`, question_id) 
select 8, '2 months from date of hire', question_id from question where code = 'speciality_waiting_period_begin_date';
insert into variant (`number`, `option`, question_id) 
select 9, '30 days from date of hire', question_id from question where code = 'speciality_waiting_period_begin_date';
insert into variant (`number`, `option`, question_id) 
select 10, '60 days from date of hire', question_id from question where code = 'speciality_waiting_period_begin_date';
insert into variant (`number`, `option`, question_id) 
select 11, '90 days from date of hire', question_id from question where code = 'speciality_waiting_period_begin_date';
insert into variant (`number`, `option`, question_id) 
select 12, '91 days from date of hire', question_id from question where code = 'speciality_waiting_period_begin_date';
insert into variant (`number`, `option`, question_id) 
select 13, 'Other (Please provide detailed information)', question_id from question where code = 'speciality_waiting_period_begin_date';

insert into form_question (required, question_id, form_id, invisible) 
select false, q.question_id, f.form_id, false from question q, form f 
where q.code in ('medical_waiting_period_begin_date', 'speciality_waiting_period_begin_date')
and f.name = 'anthem-blue-cross-employer-application';

