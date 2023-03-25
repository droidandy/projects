INSERT INTO person (first_name, last_name, full_name, email, `type`, carrier_id) VALUES 
('Corey', 'Hahn', 'Corey Hahn', 'corey.hahn@anthem.com', 'SPECIALTY', (select carrier_id from carrier where name = 'ANTHEM_BLUE_CROSS')),
('Joy', 'Chai', 'Joy Chai', 'joy.chai@anthem.com', 'SPECIALTY', (select carrier_id from carrier where name = 'ANTHEM_BLUE_CROSS')),
('Lucas', 'Trauth', 'Lucas Trauth', 'lucas.trauth@anthem.com', 'SPECIALTY', (select carrier_id from carrier where name = 'ANTHEM_BLUE_CROSS')),
('Jordan', 'Jenkins', 'Jordan Jenkins', 'jordan.jenkins@anthem.com', 'SPECIALTY', (select carrier_id from carrier where name = 'ANTHEM_BLUE_CROSS')),
('Trenton', 'Rocha', 'Trenton Rocha', 'trenten.rocha@anthem.com', 'SPECIALTY', (select carrier_id from carrier where name = 'ANTHEM_BLUE_CROSS')),
('Conor', 'Brumfield', 'Conor Brumfield', 'conor.brumfield@anthem.com', 'SPECIALTY', (select carrier_id from carrier where name = 'ANTHEM_BLUE_CROSS')),
('David', 'Attarian', 'David Attarian', 'david.attarian@anthem.com', 'SPECIALTY', (select carrier_id from carrier where name = 'ANTHEM_BLUE_CROSS')),
('Gregg', 'Hall', 'Gregg Hall', 'gregg.hall@anthem.com', 'SPECIALTY', (select carrier_id from carrier where name = 'ANTHEM_BLUE_CROSS')),
('Michael', 'Williams', 'Michael Williams', 'michael.williams4@anthem.com', 'SPECIALTY', (select carrier_id from carrier where name = 'ANTHEM_BLUE_CROSS')),
('Mitch', 'Kumagai', 'Mitch Kumagai', 'mitch.kumagai@anthem.com', 'SPECIALTY', (select carrier_id from carrier where name = 'ANTHEM_BLUE_CROSS'));

INSERT INTO person (first_name, last_name, full_name, email, `type`, carrier_id) VALUES 
('Rosemarie', 'Bayham', 'Rosemarie Bayham', 'rosemarie_bayham@uhc.com','SPECIALTY', (select carrier_id from carrier where name = 'UHC')),
('Caroline', 'Ruddock', 'Caroline Ruddock', 'caroline.ruddock@uhc.com','SPECIALTY', (select carrier_id from carrier where name = 'UHC')),
('Jeremy', 'Kropelnicki', 'Jeremy Kropelnicki', 'jeremy_kropelnicki@uhc.com','SPECIALTY', (select carrier_id from carrier where name = 'UHC'));
