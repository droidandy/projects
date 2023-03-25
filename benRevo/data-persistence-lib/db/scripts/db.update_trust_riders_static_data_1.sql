/* North Orthodontic Rider and Additional Cost (PPO Plan Only) */

INSERT INTO rider_meta (rider_code, rider_description, category, plan_type, selectable, `type`, type_value, type_2, type_value_2) 
VALUES ('Delta PPO Plan 1B', 'Child Only @ 50%, $2,000', 'Orthodontic', 'DPPO', true, 'COUNTY', 'NORTH', 'RATING_TIERS', '2');        
INSERT INTO rider (tier1_rate, tier2_rate, tier3_rate, tier4_rate, rider_meta_id) 
VALUES (11.39, 17.55, 0, 0, (select rider_meta_id from rider_meta where rider_code = 'Delta PPO Plan 1B' and type_value = 'NORTH'));

INSERT INTO rider_meta (rider_code, rider_description, category, plan_type, selectable, `type`, type_value, type_2, type_value_2) 
VALUES ('Delta PPO Plan 2B', 'Child Only @ 50%, $1,500', 'Orthodontic', 'DPPO', true, 'COUNTY', 'NORTH', 'RATING_TIERS', '2');        
INSERT INTO rider (tier1_rate, tier2_rate, tier3_rate, tier4_rate, rider_meta_id) 
VALUES (7.87, 12.13, 0, 0, (select rider_meta_id from rider_meta where rider_code = 'Delta PPO Plan 2B' and type_value = 'NORTH'));

INSERT INTO rider_meta (rider_code, rider_description, category, plan_type, selectable, `type`, type_value, type_2, type_value_2) 
VALUES ('Delta PPO Plan 3B', 'Child Only @ 50%, $1,000', 'Orthodontic', 'DPPO', true, 'COUNTY', 'NORTH', 'RATING_TIERS', '2');        
INSERT INTO rider (tier1_rate, tier2_rate, tier3_rate, tier4_rate, rider_meta_id) 
VALUES (4.59, 7.07, 0, 0, (select rider_meta_id from rider_meta where rider_code = 'Delta PPO Plan 3B' and type_value = 'NORTH'));

INSERT INTO rider_meta (rider_code, rider_description, category, plan_type, selectable, `type`, type_value, type_2, type_value_2) 
VALUES ('Delta PPO Plan 1A', 'Adult & Child @ 50%, $2,000', 'Orthodontic', 'DPPO', true, 'COUNTY', 'NORTH', 'RATING_TIERS', '4');        
INSERT INTO rider (tier1_rate, tier2_rate, tier3_rate, tier4_rate, rider_meta_id) 
VALUES (1.43, 12.91, 3.64, 21.03, (select rider_meta_id from rider_meta where rider_code = 'Delta PPO Plan 1A' and type_value = 'NORTH'));

INSERT INTO rider_meta (rider_code, rider_description, category, plan_type, selectable, `type`, type_value, type_2, type_value_2) 
VALUES ('Delta PPO Plan 2A', 'Adult & Child @ 50%, $1,500', 'Orthodontic', 'DPPO', true, 'COUNTY', 'NORTH', 'RATING_TIERS', '4');        
INSERT INTO rider (tier1_rate, tier2_rate, tier3_rate, tier4_rate, rider_meta_id) 
VALUES (0.92, 8.81, 9.31, 14.36, (select rider_meta_id from rider_meta where rider_code = 'Delta PPO Plan 2A' and type_value = 'NORTH'));
	
INSERT INTO rider_meta (rider_code, rider_description, category, plan_type, selectable, `type`, type_value, type_2, type_value_2) 
VALUES ('Delta PPO Plan 3A', 'Adult & Child @ 50%, $1,000', 'Orthodontic', 'DPPO', true, 'COUNTY', 'NORTH', 'RATING_TIERS', '4');        
INSERT INTO rider (tier1_rate, tier2_rate, tier3_rate, tier4_rate, rider_meta_id) 
VALUES (0.50, 5.06, 5.35, 8.24, (select rider_meta_id from rider_meta where rider_code = 'Delta PPO Plan 3A' and type_value = 'NORTH'));
					
/* South Orthodontic Rider and Additional Cost (PPO Plan Only) */			

INSERT INTO rider_meta (rider_code, rider_description, category, plan_type, selectable, `type`, type_value, type_2, type_value_2) 
VALUES ('Delta PPO Plan 1B', 'Child Only @ 50%, $2,000', 'Orthodontic', 'DPPO', true, 'COUNTY', 'SOUTH', 'RATING_TIERS', '2');        
INSERT INTO rider (tier1_rate, tier2_rate, tier3_rate, tier4_rate, rider_meta_id) 
VALUES (11.39, 17.55, 0, 0, (select rider_meta_id from rider_meta where rider_code = 'Delta PPO Plan 1B' and type_value = 'SOUTH'));

INSERT INTO rider_meta (rider_code, rider_description, category, plan_type, selectable, `type`, type_value, type_2, type_value_2) 
VALUES ('Delta PPO Plan 2B', 'Child Only @ 50%, $1,500', 'Orthodontic', 'DPPO', true, 'COUNTY', 'SOUTH', 'RATING_TIERS', '2');        
INSERT INTO rider (tier1_rate, tier2_rate, tier3_rate, tier4_rate, rider_meta_id) 
VALUES (7.87, 12.13, 0, 0, (select rider_meta_id from rider_meta where rider_code = 'Delta PPO Plan 2B' and type_value = 'SOUTH'));

INSERT INTO rider_meta (rider_code, rider_description, category, plan_type, selectable, `type`, type_value, type_2, type_value_2) 
VALUES ('Delta PPO Plan 3B', 'Child Only @ 50%, $1,000', 'Orthodontic', 'DPPO', true, 'COUNTY', 'SOUTH', 'RATING_TIERS', '2');        
INSERT INTO rider (tier1_rate, tier2_rate, tier3_rate, tier4_rate, rider_meta_id) 
VALUES (4.59, 7.07, 0, 0, (select rider_meta_id from rider_meta where rider_code = 'Delta PPO Plan 3B' and type_value = 'SOUTH'));

INSERT INTO rider_meta (rider_code, rider_description, category, plan_type, selectable, `type`, type_value, type_2, type_value_2) 
VALUES ('Delta PPO Plan 1A', 'Adult & Child @ 50%, $2,000', 'Orthodontic', 'DPPO', true, 'COUNTY', 'SOUTH', 'RATING_TIERS', '4');        
INSERT INTO rider (tier1_rate, tier2_rate, tier3_rate, tier4_rate, rider_meta_id) 
VALUES (1.43, 12.91, 3.64, 21.03, (select rider_meta_id from rider_meta where rider_code = 'Delta PPO Plan 1A' and type_value = 'SOUTH'));

INSERT INTO rider_meta (rider_code, rider_description, category, plan_type, selectable, `type`, type_value, type_2, type_value_2) 
VALUES ('Delta PPO Plan 2A', 'Adult & Child @ 50%, $1,500', 'Orthodontic', 'DPPO', true, 'COUNTY', 'SOUTH', 'RATING_TIERS', '4');        
INSERT INTO rider (tier1_rate, tier2_rate, tier3_rate, tier4_rate, rider_meta_id) 
VALUES (0.92, 8.81, 9.31, 14.36, (select rider_meta_id from rider_meta where rider_code = 'Delta PPO Plan 2A' and type_value = 'SOUTH'));
	
INSERT INTO rider_meta (rider_code, rider_description, category, plan_type, selectable, `type`, type_value, type_2, type_value_2) 
VALUES ('Delta PPO Plan 3A', 'Adult & Child @ 50%, $1,000', 'Orthodontic', 'DPPO', true, 'COUNTY', 'SOUTH', 'RATING_TIERS', '4');        
INSERT INTO rider (tier1_rate, tier2_rate, tier3_rate, tier4_rate, rider_meta_id) 
VALUES (0.50, 5.06, 5.35, 8.24, (select rider_meta_id from rider_meta where rider_code = 'Delta PPO Plan 3A' and type_value = 'SOUTH'));
