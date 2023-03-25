INSERT INTO person (first_name, last_name, full_name, email, `type`, carrier_id) VALUES 
('Terri', 'Nguyen', 'Terri Nguyen', 'terri.nguyen@anthem.com', 'RATER', (select carrier_id from carrier where name = 'ANTHEM_BLUE_CROSS')),
('Elise', 'Tucker', 'Elise Tucker', 'elise.tucker@anthem.com', 'RATER', (select carrier_id from carrier where name = 'ANTHEM_BLUE_CROSS')),
('Christine', 'Reed', 'Christine Reed', 'christine.reed@anthem.com', 'RATER', (select carrier_id from carrier where name = 'ANTHEM_BLUE_CROSS')),
('Jeaneffer', 'Delacruz', 'Jeaneffer Delacruz', 'jeaneffer.delacruz@anthem.com', 'RATER', (select carrier_id from carrier where name = 'ANTHEM_BLUE_CROSS')),
('Rosalind', 'Coats', 'Rosalind Coats', 'rosalind.coats@anthem.com', 'RATER', (select carrier_id from carrier where name = 'ANTHEM_BLUE_CROSS')),
('Gina', 'Jimenez', 'Gina Jimenez', 'gina.jimenez@anthem.com', 'RATER', (select carrier_id from carrier where name = 'ANTHEM_BLUE_CROSS')),
('Roshonda', 'Glover', 'Roshonda Glover', 'roshonda.glover@anthem.com', 'RATER', (select carrier_id from carrier where name = 'ANTHEM_BLUE_CROSS')),
('Ryan', 'Smith', 'Ryan Smith', 'ryan.smith@anthem.com', 'RATER', (select carrier_id from carrier where name = 'ANTHEM_BLUE_CROSS'));
