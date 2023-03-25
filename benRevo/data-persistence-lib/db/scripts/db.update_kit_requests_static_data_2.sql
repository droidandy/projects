insert into question (code, title, multiselectable) values ('should_enrollment_packets_be_mailed_to_physical_address', 'Should enrollment packets be mailed to address:', false);
insert into question (code, title, multiselectable) values ('enrollment_packets_address', 'Address', false);
insert into question (code, title, multiselectable) values ('enrollment_packets_city', 'City', false);
insert into question (code, title, multiselectable) values ('enrollment_packets_state', 'State', false);
insert into question (code, title, multiselectable) values ('enrollment_packets_zip', 'Zip', false);

insert into variant (`number`, `option`, question_id) 
select 1, 'Yes', question_id from question where code in (
'should_enrollment_packets_be_mailed_to_physical_address');
insert into variant (`number`, `option`, question_id) 
select 2, 'Other', question_id from question where code in (
'should_enrollment_packets_be_mailed_to_physical_address');

insert into form_question (required, question_id, form_id, invisible) 
select false, q.question_id, f.form_id, false from question q, form f 
where q.code in (
	'should_enrollment_packets_be_mailed_to_physical_address', 
	'enrollment_packets_address',
	'enrollment_packets_city',
	'enrollment_packets_state',	    
	'enrollment_packets_zip'
)
and f.name = 'kit_requests';


