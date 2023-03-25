INSERT INTO person (first_name, last_name, full_name, email, `type`, carrier_id) VALUES 
('Matt', 'Bernhard', 'Matt Bernhard', 'matt.bernhard@anthem.com', 'CARRIER_MANAGER', (select carrier_id from carrier where name = 'ANTHEM_BLUE_CROSS')),
('Mary', 'Hoffman', 'Mary Hoffman', 'mary.hoffman@anthem.com', 'CARRIER_MANAGER', (select carrier_id from carrier where name = 'ANTHEM_BLUE_CROSS')),
('Roger', 'Cassidy', 'Roger Cassidy', 'roger.cassidy@anthem.com', 'CARRIER_MANAGER', (select carrier_id from carrier where name = 'ANTHEM_BLUE_CROSS'));

update person set `type` = 'SALES'
where email = 'jillian.young@anthem.com' and `type` = 'PRESALES';

INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'matt.bernhard@anthem.com'), 
(select person_id from person where email = 'jennifer.scott@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'matt.bernhard@anthem.com'), 
(select person_id from person where email = 'nicole.kharrat@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'matt.bernhard@anthem.com'), 
(select person_id from person where email = 'susan.ellman@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'matt.bernhard@anthem.com'), 
(select person_id from person where email = 'vanessa.rabay@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'matt.bernhard@anthem.com'), 
(select person_id from person where email = 'kellie.hoomalu@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'matt.bernhard@anthem.com'), 
(select person_id from person where email = 'ashlee.johnson3@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'matt.bernhard@anthem.com'), 
(select person_id from person where email = 'cynthia.khan@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'matt.bernhard@anthem.com'), 
(select person_id from person where email = 'jeff.koprivetz@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'matt.bernhard@anthem.com'), 
(select person_id from person where email = 'steven.cleeland@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'matt.bernhard@anthem.com'), 
(select person_id from person where email = 'yanet.galindo@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'matt.bernhard@anthem.com'), 
(select person_id from person where email = 'kristine.eagan@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'matt.bernhard@anthem.com'), 
(select person_id from person where email = 'kristin.fortney@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'matt.bernhard@anthem.com'), 
(select person_id from person where email = 'debra.feuerman@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'matt.bernhard@anthem.com'), 
(select person_id from person where email = 'asuncion.sanchez@anthem.com'),
'PERSON');


INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'mary.hoffman@anthem.com'), 
(select person_id from person where email = 'alejandra.lam@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'mary.hoffman@anthem.com'), 
(select person_id from person where email = 'crystal.shepard2@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'mary.hoffman@anthem.com'), 
(select person_id from person where email = 'marco.flores@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'mary.hoffman@anthem.com'), 
(select person_id from person where email = 'jillian.young@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'mary.hoffman@anthem.com'), 
(select person_id from person where email = 'kristine.eagan@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'mary.hoffman@anthem.com'), 
(select person_id from person where email = 'kristin.fortney@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'mary.hoffman@anthem.com'), 
(select person_id from person where email = 'debra.feuerman@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'mary.hoffman@anthem.com'), 
(select person_id from person where email = 'asuncion.sanchez@anthem.com'),
'PERSON');


INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'roger.cassidy@anthem.com'), 
(select person_id from person where email = 'samuel.williams@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'roger.cassidy@anthem.com'), 
(select person_id from person where email = 'stacie.thomason@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'roger.cassidy@anthem.com'), 
(select person_id from person where email = 'christine.mouanoutoua@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'roger.cassidy@anthem.com'), 
(select person_id from person where email = 'jessie.gonzalez@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'roger.cassidy@anthem.com'), 
(select person_id from person where email = 'jerry.connolly@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'roger.cassidy@anthem.com'), 
(select person_id from person where email = 'tanya.coty@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'roger.cassidy@anthem.com'), 
(select person_id from person where email = 'anita.vincent@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'roger.cassidy@anthem.com'), 
(select person_id from person where email = 'eric.windsor@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'roger.cassidy@anthem.com'), 
(select person_id from person where email = 'nicholas.shuck@anthem.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'roger.cassidy@anthem.com'), 
(select person_id from person where email = 'kerri.dicicco@anthem.com'),
'PERSON');


INSERT INTO person (first_name, last_name, full_name, email, `type`, carrier_id) VALUES 
('William', 'Sawin', 'William Sawin', 'bill.sawin@uhc.com', 'CARRIER_MANAGER', (select carrier_id from carrier where name = 'UHC'));


INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'bill.sawin@uhc.com'), 
(select person_id from person where email = 'lisa.espinosa@uhc.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'bill.sawin@uhc.com'), 
(select person_id from person where email = 'monique.galvin@uhc.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'bill.sawin@uhc.com'), 
(select person_id from person where email = 'kurt.hall@uhc.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'bill.sawin@uhc.com'), 
(select person_id from person where email = 'marisa.hodges@uhc.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'bill.sawin@uhc.com'), 
(select person_id from person where email = 'jason.jurgill@uhc.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'bill.sawin@uhc.com'), 
(select person_id from person where email = 'dustin_haala@uhc.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'bill.sawin@uhc.com'), 
(select person_id from person where email = 'chris.newman@uhc.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'bill.sawin@uhc.com'), 
(select person_id from person where email = 'kristen.rivers@uhc.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'bill.sawin@uhc.com'), 
(select person_id from person where email = 'dean.schmieder@uhc.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'bill.sawin@uhc.com'), 
(select person_id from person where email = 'kevin.stayner@uhc.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'bill.sawin@uhc.com'), 
(select person_id from person where email = 'suzanne.trujillo@uhc.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'bill.sawin@uhc.com'), 
(select person_id from person where email = 'taylor.garner@uhc.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'bill.sawin@uhc.com'), 
(select person_id from person where email = 'nicole_r_farley@uhc.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'bill.sawin@uhc.com'), 
(select person_id from person where email = 'caitlin_loonan@uhc.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'bill.sawin@uhc.com'), 
(select person_id from person where email = 'aimee.chen@uhc.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'bill.sawin@uhc.com'), 
(select person_id from person where email = 'carol.scaccia@uhc.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'bill.sawin@uhc.com'), 
(select person_id from person where email = 'nhean.keo@uhc.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'bill.sawin@uhc.com'), 
(select person_id from person where email = 'suseli.arias@uhc.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'bill.sawin@uhc.com'), 
(select person_id from person where email = 'janae.ayon@uhc.com'),
'PERSON');
INSERT INTO relation (parent_id, child_id, `type`) VALUES 
((select person_id from person where email = 'bill.sawin@uhc.com'), 
(select person_id from person where email = 'toni.cloonan@uhc.com'),
'PERSON');

