/* Section 11 */
insert into question (code, title, multiselectable) values ('was_dental_prime_sold', 'No Dental Prime/Complete (Dental PPO) plan sold', false);
insert into question (code, title, multiselectable) values ('apply_carry_over_amounts_from_prior_carrier', 'Do you want to apply amounts used and/or import annual maximum carry-over amounts from your prior carrier?', false);
insert into question (code, title, multiselectable) values ('deductible_and_annual_maximum', 'Deductible and annual maximum?', false);
insert into question (code, title, multiselectable) values ('annual_maximum_carry_in', 'Annual maximum carry-in?', false);
insert into question (code, title, multiselectable) values ('orthodontic_lifetime_maximum', 'Orthodontic lifetime maximum?', false);
insert into question (code, title, multiselectable) values ('orthodontic_banding_by', 'For dependent child-only orthodontic coverage through age 18, orthodontic banding must occur by:', false);

insert into form_question (required, question_id, form_id, invisible) 
select false, q.question_id, f.form_id, false from question q, form f 
where q.code in (
'was_dental_prime_sold', 
'apply_carry_over_amounts_from_prior_carrier', 
'deductible_and_annual_maximum',
'annual_maximum_carry_in', 
'orthodontic_lifetime_maximum', 
'orthodontic_banding_by')
and f.name = 'anthem-blue-cross-questionnaire';

insert into variant (`number`, `option`, question_id) 
select 1, 'Yes', question_id from question where code in (
'was_dental_prime_sold', 
'apply_carry_over_amounts_from_prior_carrier', 
'deductible_and_annual_maximum',
'annual_maximum_carry_in', 
'orthodontic_lifetime_maximum');

insert into variant (`number`, `option`, question_id) 
select 2, 'No', question_id from question where code in (
'was_dental_prime_sold', 
'apply_carry_over_amounts_from_prior_carrier', 
'deductible_and_annual_maximum',
'annual_maximum_carry_in', 
'orthodontic_lifetime_maximum');

insert into variant (`number`, `option`, question_id) 
select 1, 'Birthday', question_id from question where code = 'orthodontic_banding_by';
insert into variant (`number`, `option`, question_id) 
select 2, 'End of month', question_id from question where code = 'orthodontic_banding_by';
insert into variant (`number`, `option`, question_id) 
select 3, 'Other', question_id from question where code = 'orthodontic_banding_by';
insert into variant (`number`, `option`, question_id) 
select 4, 'N/A', question_id from question where code = 'orthodontic_banding_by';

insert into form_question (required, question_id, form_id, invisible) 
select false, q.question_id, f.form_id, false from question q, form f 
where q.code in (
'was_dental_prime_sold', 
'apply_carry_over_amounts_from_prior_carrier', 
'deductible_and_annual_maximum',
'annual_maximum_carry_in', 
'orthodontic_lifetime_maximum', 
'orthodontic_banding_by')
and f.name = 'anthem-blue-cross-questionnaire';
