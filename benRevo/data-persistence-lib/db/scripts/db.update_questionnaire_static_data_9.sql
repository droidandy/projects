/* Section 9-10 */
insert into question (code, title, multiselectable) values ('infertility_treatment', 'Infertility treatment', false);
insert into question (code, title, multiselectable) values ('special_footwear', 'Special footwear and hearing aids*', false);
insert into question (code, title, multiselectable) values ('no_blue_cross_ppo', 'No Blue Cross PP0 (non-California resident) plan sold', false);
insert into question (code, title, multiselectable) values ('arkansas_hearing_aid', 'Arkansas — Hearing aid coverage', false);
insert into question (code, title, multiselectable) values ('florida_mammograms', 'Florida — Mammograms', false);
insert into question (code, title, multiselectable) values ('kansas_pregnancy', 'Kansas — Pregnancy and maternity care', false);
insert into question (code, title, multiselectable) values ('texas_in_vitro', 'Texas — In Vitro fertilization treatment', false);
insert into question (code, title, multiselectable) values ('wa_home_health', 'Washington — Home health care', false);

insert into form_question (required, question_id, form_id, invisible) 
select false, q.question_id, f.form_id, false from question q, form f 
where q.code in (
'infertility_treatment', 
'special_footwear', 
'no_blue_cross_ppo',
'arkansas_hearing_aid', 
'florida_mammograms', 
'kansas_pregnancy',
'texas_in_vitro',
'wa_home_health')
and f.name = 'anthem-blue-cross-questionnaire';

insert into variant (`number`, `option`, question_id) 
select 1, 'Accept', question_id from question where code in (
'infertility_treatment', 
'special_footwear',
'arkansas_hearing_aid',
'florida_mammograms',
'kansas_pregnancy',
'texas_in_vitro',
'wa_home_health');

insert into variant (`number`, `option`, question_id) 
select 2, 'Decline', question_id from question where code in (
'infertility_treatment', 
'special_footwear',
'arkansas_hearing_aid',
'florida_mammograms',
'kansas_pregnancy',
'texas_in_vitro',
'wa_home_health');

insert into variant (`number`, `option`, question_id) 
select 1, 'No Blue Cross PPO (non-California) plan sold', question_id from question where code = 'no_blue_cross_ppo';

/* Section 7 */
insert into question (code, title, multiselectable) values ('initial_payment_option', 'Initial payment option', false);
insert into question (code, title, multiselectable) values ('recurring_payment_option', 'Recurring payments option', false);

insert into form_question (required, question_id, form_id, invisible) 
select false, q.question_id, f.form_id, false from question q, form f 
where q.code in ('initial_payment_option', 'recurring_payment_option')
and f.name = 'anthem-blue-cross-questionnaire';

insert into variant (`number`, `option`, question_id) 
select 1, 'Electronic Debit Payment', question_id from question where code = 'initial_payment_option';
insert into variant (`number`, `option`, question_id) 
select 2, 'Automated Clearing House (ACH) or Wire Transfer', question_id from question where code = 'initial_payment_option';
insert into variant (`number`, `option`, question_id) 
select 3, 'EmployerAccess', question_id from question where code = 'initial_payment_option';
insert into variant (`number`, `option`, question_id) 
select 4, 'Other', question_id from question where code = 'initial_payment_option';

insert into variant (`number`, `option`, question_id) 
select 1, 'Automated Clearing House (ACH) or Wire Transfer', question_id from question where code = 'recurring_payment_option';
insert into variant (`number`, `option`, question_id) 
select 2, 'EmployerAccess', question_id from question where code = 'recurring_payment_option';
insert into variant (`number`, `option`, question_id) 
select 3, 'Automatic Recurring Payment via EmployerAccess', question_id from question where code = 'recurring_payment_option';
insert into variant (`number`, `option`, question_id) 
select 4, 'Employer EasyPay', question_id from question where code = 'recurring_payment_option';
insert into variant (`number`, `option`, question_id) 
select 5, 'Other', question_id from question where code = 'recurring_payment_option';

/* Section 8 */
insert into question (code, title, multiselectable) values ('tpa_premium_administration', 'On this account, the TPA will perform these functions (check all that apply):', false);
insert into question (code, title, multiselectable) values ('tpa_enroll_eligible_svs', 'On this account, the TPA will perform these functions (check all that apply):', false);
insert into question (code, title, multiselectable) values ('tpa_cobra', 'On this account, the TPA will perform these functions (check all that apply):', false);
insert into question (code, title, multiselectable) values ('tpa_other', 'On this account, the TPA will perform these functions (check all that apply):', false);
insert into question (code, title, multiselectable) values ('tpa_other_value', 'On this account, the TPA will perform these functions (check all that apply):', false);
insert into question (code, title, multiselectable) values ('tpa_remittance', 'If the TPA collects premiums, indicate TPA’s premium remittance method:', false);
insert into question (code, title, multiselectable) values ('tpa_administration_fee', 'Administration fee is:', false);
insert into question (code, title, multiselectable) values ('tpa_fee_per_subscriber', 'Administration fee is:', false);
insert into question (code, title, multiselectable) values ('tpa_fee_per_member', 'Administration fee is:', false);
insert into question (code, title, multiselectable) values ('tpa_how_admin_fee_paid', 'How is the administration fee to be paid?', false);
insert into question (code, title, multiselectable) values ('tpa_name', '', false);
insert into question (code, title, multiselectable) values ('tpa_street_address', '', false);
insert into question (code, title, multiselectable) values ('tpa_title', '', false);
insert into question (code, title, multiselectable) values ('tpa_phone', '', false);
insert into question (code, title, multiselectable) values ('tpa_city', '', false);
insert into question (code, title, multiselectable) values ('tpa_email', '', false);
insert into question (code, title, multiselectable) values ('tpa_state', '', false);
insert into question (code, title, multiselectable) values ('tpa_zip', '', false);
insert into question (code, title, multiselectable) values ('is_tpa_broker', '', false);
insert into question (code, title, multiselectable) values ('employer_access_option', 'EmployerAccess: (choose one option)', false);


insert into form_question (required, question_id, form_id, invisible) 
select false, q.question_id, f.form_id, false from question q, form f 
where q.code in (
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
'employer_access_option')
and f.name = 'anthem-blue-cross-questionnaire';

insert into variant (`number`, `option`, question_id) 
select 1, 'Premium administration', question_id from question where code = 'tpa_premium_administration';
insert into variant (`number`, `option`, question_id) 
select 1, 'Enrollment and eligibility services', question_id from question where code = 'tpa_enroll_eligible_svs';
insert into variant (`number`, `option`, question_id) 
select 1, 'COBRA', question_id from question where code = 'tpa_cobra';
insert into variant (`number`, `option`, question_id) 
select 1, 'Other', question_id from question where code = 'tpa_other';
insert into variant (`number`, `option`, question_id) 
select 1, 'Remits net', question_id from question where code = 'tpa_remittance';
insert into variant (`number`, `option`, question_id) 
select 2, 'Remits gross', question_id from question where code = 'tpa_remittance';
insert into variant (`number`, `option`, question_id) 
select 1, 'None', question_id from question where code = 'tpa_administration_fee';
insert into variant (`number`, `option`, question_id) 
select 2, '% of premium', question_id from question where code = 'tpa_administration_fee';
insert into variant (`number`, `option`, question_id) 
select 3, '$ per member', question_id from question where code = 'tpa_administration_fee';
insert into variant (`number`, `option`, question_id) 
select 4, '$ per subscriber', question_id from question where code = 'tpa_administration_fee';
insert into variant (`number`, `option`, question_id) 
select 1, 'Directly and separately by the group', question_id from question where code = 'tpa_how_admin_fee_paid';
insert into variant (`number`, `option`, question_id) 
select 2, 'TPA nets out fee from collected premium', question_id from question where code = 'tpa_how_admin_fee_paid';
insert into variant (`number`, `option`, question_id) 
select 3, 'Monthly payment by Anthem after Anthem receives gross premium', question_id from question where code = 'tpa_how_admin_fee_paid';
insert into variant (`number`, `option`, question_id) 
select 1, 'Yes', question_id from question where code = 'is_tpa_broker';
insert into variant (`number`, `option`, question_id) 
select 1, 'Online member enrollment', question_id from question where code = 'employer_access_option';
insert into variant (`number`, `option`, question_id) 
select 2, 'Online enrollment Census Tool', question_id from question where code = 'employer_access_option';
insert into variant (`number`, `option`, question_id) 
select 3, 'Group administrator performs online enrollments', question_id from question where code = 'employer_access_option';

delete from variant where question_id = (select question_id from question where code = 'standard_method_for_initial_enrollment') 
and `option` = 'Paper';

update variant set `option` = 'EmployerAccess' where question_id = (select question_id from question where code = 'standard_method_for_initial_enrollment') 
and `option` = 'Real-Time Connection';

update question set multiselectable = false where code in (
'eoc_will_be_sent_out_to',
'standard_method_for_initial_enrollment',
'standard_method_for_ongoing_enrollment');
