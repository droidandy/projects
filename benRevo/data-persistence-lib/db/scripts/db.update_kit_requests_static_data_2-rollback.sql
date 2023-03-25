delete from answer where question_id in (select question_id from question where code in (
	'should_enrollment_packets_be_mailed_to_physical_address', 
	'enrollment_packets_address',
	'enrollment_packets_city',
	'enrollment_packets_state',	    
	'enrollment_packets_zip'
));
delete from form_question where question_id in (select question_id from question where code in (
	'should_enrollment_packets_be_mailed_to_physical_address', 
	'enrollment_packets_address',
	'enrollment_packets_city',
	'enrollment_packets_state',	    
	'enrollment_packets_zip'
));
delete from variant where question_id in (select question_id from question where code in (
	'should_enrollment_packets_be_mailed_to_physical_address'
));
delete from question where code in (
	'should_enrollment_packets_be_mailed_to_physical_address', 
	'enrollment_packets_address',
	'enrollment_packets_city',
	'enrollment_packets_state',	    
	'enrollment_packets_zip'
);