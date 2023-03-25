update question set code = 'all_products_waiting_period' where code = 'medical_waiting_period_for';
update question set code = 'speciality_waiting_period' where code = 'speciality_waiting_period_for';

delete from form_question where question_id in (select q.question_id from question q where q.code in (
	'medical_waiting_period_begin_date',
	'speciality_waiting_period_begin_date'));

delete from variant where question_id in (select question_id from question where code in (
	'medical_waiting_period_begin_date',
	'speciality_waiting_period_begin_date'));
	
delete from question where code in (
	'medical_waiting_period_begin_date',
	'speciality_waiting_period_begin_date');
	
	