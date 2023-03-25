insert into question (code, title, multiselectable) values ('are_open_enrollment_meetings_planned', 'Are Open Enrollment meetings planned?', false);
insert into question (code, title, multiselectable) values ('meetings_planned_count', 'How many meetings?', false);
insert into question (code, title, multiselectable) values ('does_the_group_want_enrollment_packets', 'Does the group want enrollment packets?', false);
insert into question (code, title, multiselectable) values ('english_enrollment_packets_required', 'How many ENGLISH enrollment packets are required?', false);
insert into question (code, title, multiselectable) values ('spanish_enrollment_packets_required', 'How many SPANISH enrollment packets are required?', false);

insert into question (code, title, multiselectable) values ('meeting_date_1', 'Date', false);
insert into question (code, title, multiselectable) values ('meeting_address_1', 'Address', false);
insert into question (code, title, multiselectable) values ('meeting_city_1', 'City', false);
insert into question (code, title, multiselectable) values ('meeting_state_1', 'State', false);
insert into question (code, title, multiselectable) values ('meeting_zip_1', 'Zip', false);
insert into question (code, title, multiselectable) values ('meeting_estimated_attendance_1', 'Estimated attendance', false);
insert into question (code, title, multiselectable) values ('meeting_anthem_representation_needed_1', 'Anthem representation needed?', false);
insert into question (code, title, multiselectable) values ('meeting_spanish_required_1', 'Spanish required?', false);
insert into question (code, title, multiselectable) values ('meeting_special_instructions_1', 'Special instructions for day of OE meeting', false);
insert into question (code, title, multiselectable) values ('meeting_english_enrollment_packets_required_1', 'How many ENGLISH enrollment packets are required?', false);
insert into question (code, title, multiselectable) values ('meeting_spanish_enrollment_packets_required_1', 'How many SPANISH enrollment packets are required?', false);

insert into question (code, title, multiselectable) values ('meeting_date_2', 'Date', false);
insert into question (code, title, multiselectable) values ('meeting_address_2', 'Address', false);
insert into question (code, title, multiselectable) values ('meeting_city_2', 'City', false);
insert into question (code, title, multiselectable) values ('meeting_state_2', 'State', false);
insert into question (code, title, multiselectable) values ('meeting_zip_2', 'Zip', false);
insert into question (code, title, multiselectable) values ('meeting_estimated_attendance_2', 'Estimated attendance', false);
insert into question (code, title, multiselectable) values ('meeting_anthem_representation_needed_2', 'Anthem representation needed?', false);
insert into question (code, title, multiselectable) values ('meeting_spanish_required_2', 'Spanish required?', false);
insert into question (code, title, multiselectable) values ('meeting_special_instructions_2', 'Special instructions for day of OE meeting', false);
insert into question (code, title, multiselectable) values ('meeting_english_enrollment_packets_required_2', 'How many ENGLISH enrollment packets are required?', false);
insert into question (code, title, multiselectable) values ('meeting_spanish_enrollment_packets_required_2', 'How many SPANISH enrollment packets are required?', false);

insert into question (code, title, multiselectable) values ('meeting_date_3', 'Date', false);
insert into question (code, title, multiselectable) values ('meeting_address_3', 'Address', false);
insert into question (code, title, multiselectable) values ('meeting_city_3', 'City', false);
insert into question (code, title, multiselectable) values ('meeting_state_3', 'State', false);
insert into question (code, title, multiselectable) values ('meeting_zip_3', 'Zip', false);
insert into question (code, title, multiselectable) values ('meeting_estimated_attendance_3', 'Estimated attendance', false);
insert into question (code, title, multiselectable) values ('meeting_anthem_representation_needed_3', 'Anthem representation needed?', false);
insert into question (code, title, multiselectable) values ('meeting_spanish_required_3', 'Spanish required?', false);
insert into question (code, title, multiselectable) values ('meeting_special_instructions_3', 'Special instructions for day of OE meeting', false);
insert into question (code, title, multiselectable) values ('meeting_english_enrollment_packets_required_3', 'How many ENGLISH enrollment packets are required?', false);
insert into question (code, title, multiselectable) values ('meeting_spanish_enrollment_packets_required_3', 'How many SPANISH enrollment packets are required?', false);

insert into question (code, title, multiselectable) values ('meeting_date_4', 'Date', false);
insert into question (code, title, multiselectable) values ('meeting_address_4', 'Address', false);
insert into question (code, title, multiselectable) values ('meeting_city_4', 'City', false);
insert into question (code, title, multiselectable) values ('meeting_state_4', 'State', false);
insert into question (code, title, multiselectable) values ('meeting_zip_4', 'Zip', false);
insert into question (code, title, multiselectable) values ('meeting_estimated_attendance_4', 'Estimated attendance', false);
insert into question (code, title, multiselectable) values ('meeting_anthem_representation_needed_4', 'Anthem representation needed?', false);
insert into question (code, title, multiselectable) values ('meeting_spanish_required_4', 'Spanish required?', false);
insert into question (code, title, multiselectable) values ('meeting_special_instructions_4', 'Special instructions for day of OE meeting', false);
insert into question (code, title, multiselectable) values ('meeting_english_enrollment_packets_required_4', 'How many ENGLISH enrollment packets are required?', false);
insert into question (code, title, multiselectable) values ('meeting_spanish_enrollment_packets_required_4', 'How many SPANISH enrollment packets are required?', false);

insert into question (code, title, multiselectable) values ('meeting_date_5', 'Date', false);
insert into question (code, title, multiselectable) values ('meeting_address_5', 'Address', false);
insert into question (code, title, multiselectable) values ('meeting_city_5', 'City', false);
insert into question (code, title, multiselectable) values ('meeting_state_5', 'State', false);
insert into question (code, title, multiselectable) values ('meeting_zip_5', 'Zip', false);
insert into question (code, title, multiselectable) values ('meeting_estimated_attendance_5', 'Estimated attendance', false);
insert into question (code, title, multiselectable) values ('meeting_anthem_representation_needed_5', 'Anthem representation needed?', false);
insert into question (code, title, multiselectable) values ('meeting_spanish_required_5', 'Spanish required?', false);
insert into question (code, title, multiselectable) values ('meeting_special_instructions_5', 'Special instructions for day of OE meeting', false);
insert into question (code, title, multiselectable) values ('meeting_english_enrollment_packets_required_5', 'How many ENGLISH enrollment packets are required?', false);
insert into question (code, title, multiselectable) values ('meeting_spanish_enrollment_packets_required_5', 'How many SPANISH enrollment packets are required?', false);


insert into variant (`number`, `option`, question_id) 
select 1, 'Yes', question_id from question where code in (
'are_open_enrollment_meetings_planned', 
'does_the_group_want_enrollment_packets',
'meeting_anthem_representation_needed_1',
'meeting_spanish_required_1',
'meeting_anthem_representation_needed_2',
'meeting_spanish_required_2',
'meeting_anthem_representation_needed_3',
'meeting_spanish_required_3',
'meeting_anthem_representation_needed_4',
'meeting_spanish_required_4',
'meeting_anthem_representation_needed_5',
'meeting_spanish_required_5'
);
insert into variant (`number`, `option`, question_id) 
select 2, 'No', question_id from question where code in (
'are_open_enrollment_meetings_planned', 
'does_the_group_want_enrollment_packets',
'meeting_anthem_representation_needed_1',
'meeting_spanish_required_1',
'meeting_anthem_representation_needed_2',
'meeting_spanish_required_2',
'meeting_anthem_representation_needed_3',
'meeting_spanish_required_3',
'meeting_anthem_representation_needed_4',
'meeting_spanish_required_4',
'meeting_anthem_representation_needed_5',
'meeting_spanish_required_5'
);

insert into form (name, carrier_id) values ('kit_requests', (select carrier_id from carrier where name = 'ANTHEM_BLUE_CROSS'));

insert into form_question (required, question_id, form_id, invisible) 
select false, q.question_id, f.form_id, false from question q, form f 
where q.code in (
'are_open_enrollment_meetings_planned', 
'meetings_planned_count',
'does_the_group_want_enrollment_packets',
'english_enrollment_packets_required',	    
'spanish_enrollment_packets_required',  	
'meeting_date_1',
'meeting_address_1',
'meeting_city_1',
'meeting_state_1',
'meeting_zip_1',
'meeting_estimated_attendance_1',
'meeting_anthem_representation_needed_1',
'meeting_spanish_required_1', 
'meeting_special_instructions_1',    
'meeting_english_enrollment_packets_required_1',	  
'meeting_spanish_enrollment_packets_required_1',
'meeting_date_2',
'meeting_address_2',
'meeting_city_2',
'meeting_state_2',
'meeting_zip_2',
'meeting_estimated_attendance_2',
'meeting_anthem_representation_needed_2',
'meeting_spanish_required_2', 
'meeting_special_instructions_2',    
'meeting_english_enrollment_packets_required_2',	  
'meeting_spanish_enrollment_packets_required_2',
'meeting_date_3',
'meeting_address_3',
'meeting_city_3',
'meeting_state_3',
'meeting_zip_3',
'meeting_estimated_attendance_3',
'meeting_anthem_representation_needed_3',
'meeting_spanish_required_3', 
'meeting_special_instructions_3',    
'meeting_english_enrollment_packets_required_3',	  
'meeting_spanish_enrollment_packets_required_3',
'meeting_date_4',
'meeting_address_4',
'meeting_city_4',
'meeting_state_4',
'meeting_zip_4',
'meeting_estimated_attendance_4',
'meeting_anthem_representation_needed_4',
'meeting_spanish_required_4', 
'meeting_special_instructions_4',    
'meeting_english_enrollment_packets_required_4',	  
'meeting_spanish_enrollment_packets_required_4',
'meeting_date_5',
'meeting_address_5',
'meeting_city_5',
'meeting_state_5',
'meeting_zip_5',
'meeting_estimated_attendance_5',
'meeting_anthem_representation_needed_5',
'meeting_spanish_required_5', 
'meeting_special_instructions_5',    
'meeting_english_enrollment_packets_required_5',	  
'meeting_spanish_enrollment_packets_required_5'
)
and f.name = 'kit_requests';


