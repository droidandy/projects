delete from rider where rider_meta_id in (
	select rider_meta_id from rider_meta where rider_code like 'Delta PPO Plan%' and category = 'Orthodontic');
	
delete from rider_meta where rider_code like 'Delta PPO Plan%' and category = 'Orthodontic');