delete from form_question where question_id in (select q.question_id from question q where q.code in (
'was_dental_prime_sold', 
'apply_carry_over_amounts_from_prior_carrier', 
'deductible_and_annual_maximum',
'annual_maximum_carry_in', 
'orthodontic_lifetime_maximum', 
'orthodontic_banding_by'));

delete from variant where question_id in (select q.question_id from question q where q.code in (
'was_dental_prime_sold', 
'apply_carry_over_amounts_from_prior_carrier', 
'deductible_and_annual_maximum',
'annual_maximum_carry_in', 
'orthodontic_lifetime_maximum', 
'orthodontic_banding_by'));

delete from question where code in (
'was_dental_prime_sold', 
'apply_carry_over_amounts_from_prior_carrier', 
'deductible_and_annual_maximum',
'annual_maximum_carry_in', 
'orthodontic_lifetime_maximum', 
'orthodontic_banding_by');
