delete from form_question where question_id in (select q.question_id from question q where q.code in (
'infertility_treatment', 
'special_footwear',
'no_blue_cross_ppo',
'arkansas_hearing_aid',
'florida_mammograms',
'kansas_pregnancy',
'texas_in_vitro',
'wa_home_health',
'initial_payment_option',
'recurring_payment_option',
'tpa_premium_administration', 
'tpa_enroll_eligible_svs',
'tpa_cobra', 
'tpa_other', 
'tpa_other_value', 
'tpa_remittance', 
'tpa_administration_fee', 
'tpa_fee_per_subscriber', 
'tpa_fee_per_member', 
'tpa_how_admin_fee_paid',
'tpa_name',
'tpa_street_address',
'tpa_title',
'tpa_phone',
'tpa_city',
'tpa_email',
'tpa_state',
'tpa_zip',
'is_tpa_broker',
'employer_access_option'));

delete from variant where question_id in (select q.question_id from question q where q.code in (
'infertility_treatment', 
'special_footwear',
'no_blue_cross_ppo',
'arkansas_hearing_aid',
'florida_mammograms',
'kansas_pregnancy',
'texas_in_vitro',
'wa_home_health',
'initial_payment_option',
'recurring_payment_option',
'tpa_premium_administration', 
'tpa_enroll_eligible_svs',
'tpa_cobra', 
'tpa_other', 
'tpa_other_value', 
'tpa_remittance', 
'tpa_administration_fee', 
'tpa_fee_per_subscriber', 
'tpa_fee_per_member', 
'tpa_how_admin_fee_paid',
'tpa_name',
'tpa_street_address',
'tpa_title',
'tpa_phone',
'tpa_city',
'tpa_email',
'tpa_state',
'tpa_zip',
'is_tpa_broker',
'employer_access_option'));

delete from question where code in (
'infertility_treatment', 
'special_footwear',
'no_blue_cross_ppo',
'arkansas_hearing_aid',
'florida_mammograms',
'kansas_pregnancy',
'texas_in_vitro',
'wa_home_health',
'initial_payment_option',
'recurring_payment_option',
'tpa_premium_administration', 
'tpa_enroll_eligible_svs',
'tpa_cobra', 
'tpa_other', 
'tpa_other_value', 
'tpa_remittance', 
'tpa_administration_fee', 
'tpa_fee_per_subscriber', 
'tpa_fee_per_member', 
'tpa_how_admin_fee_paid',
'tpa_name',
'tpa_street_address',
'tpa_title',
'tpa_phone',
'tpa_city',
'tpa_email',
'tpa_state',
'tpa_zip',
'is_tpa_broker',
'employer_access_option');

insert into variant (`number`, `option`, question_id) 
select 4, 'Paper', question_id from question where code = 'standard_method_for_initial_enrollment';

update variant set `option` = 'Real-Time Connection' where question_id = (select question_id from question where code = 'standard_method_for_initial_enrollment') 
and `option` = 'EmployerAccess';

update question set multiselectable = true where code in (
'eoc_will_be_sent_out_to',
'standard_method_for_initial_enrollment',
'standard_method_for_ongoing_enrollment');
