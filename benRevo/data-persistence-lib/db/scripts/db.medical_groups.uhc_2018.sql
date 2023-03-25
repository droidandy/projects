DELETE nmg FROM network_medical_group nmg
INNER JOIN medical_group mg
INNER JOIN network n
INNER JOIN carrier c
ON nmg.`medical_group_id` = mg.`medical_group_id`
AND nmg.`network_id` = n.`network_id`
AND n.`carrier_id` = c.`carrier_id`
WHERE c.`name` = 'UHC';

delete from medical_group where dec_number in (
'5141', '21782', '14692', '25465', '28856', '26678', '24257', '23600', '27647', '28857', 
'27648', '26432', '27882', '16998', '5258', '14696', '14697', '4602', '23856', '18388', 
'5273', '21796', '21553', '23859', '16085', '5157', '27655', '26688', '29717', '21557', 
'14904', '10426', '14905', '27411', '27892', '26443', '17615', '14586', '16406', '14349', 
'16405', '6130', '4197', '12130', '18352', '15882', '20670', '5169', '23023', '22055', 
'23025', '25327', '25448', '26657', '22732', '29365', '29364', '28951', '28399', '16734', 
'14798', '15643', '6129', '29361', '28393', '28391', '12140', '12143', '1011', '1010', 
'17270', '28603', '24365', '26667', '5171', '19218', '19217', '19219', '8331', '4770', 
'3682', '27963', '23247', '5181', '16390', '17807', '30461', '14897', '14899', '18344', 
'18346', '6045', '18347', '19793', '14782', '4781', '4661', '14783', '15870', '18342', 
'14780', '12120', '18580', '25679', '26405', '22048', '20668', '29354', '27176', '27173', 
'3447', '29116', '27850', '1026', '29358', '29357', '29356', '28388', '12244', '11276', 
'6952', '6039', '16964', '30218', '14548', '29350', '30459', '17812', '21963', '17465', 
'27828', '19881', '13782', '14990', '24674', '25400', '24675', '25401', '20637', '27825', 
'24678', '25525', '24677', '24679', '15848', '30201', '24670', '1035', '24672', '24671', 
'7932', '4789', '15967', '14997', '17597', '28928', '9695', '26621', '19096', '24684', 
'3111', '24686', '21736', '30431', '29573', '29572', '30432', '24681', '24683', '24682', 
'6732', '14889', '28360', '14888', '19863', '21941', '14174', '17202', '28459', '24896', 
'20614', '28451', '27362', '28455', '25188', '28454', '18657', '4209', '25517', '15031', 
'19198', '16366', '24662', '24783', '21837', '24664', '26603', '28463', '3804', '26282', 
'28460', '29550', '13417', '14748', '28461', '28466', '2278', '28465', '8813', '25190', 
'20950', '4470', '18753', '21243', '5200', '28437', '28435', '28436', '26251', '28433', 
'28434', '12410', '12532', '4589', '5679', '16335', '18634', '17547', '11567', '30403', 
'17552', '14163', '17553', '17554', '17555', '15014', '16223', '17550', '17551', '28569', 
'25971', '25614', '28440', '28561', '14608', '3948', '28445', '28442', '21250', '5204', 
'29091', '29090', '6657', '5206', '10246', '17556', '14722', '18406', '9023', '28416', 
'24058', '28414', '19383', '28419', '28417', '26913', '10217', '28411', '26234', '28410', 
'4247', '14498', '4800', '17893', '4140', '23659', '24628', '5232', '26929', '17771', 
'26488', '28427', '25036', '29878', '28669', '26920', '19394', '28428', '24624', '28422', 
'28423', '5225', '16209', '11315', '17778', '2517', '14350', '18831', '4395', '8631', 
'5245', '7665', '18392', '12977', '26693', '23187', '26695', '13944', '20004', '26903', 
'4164', '5375', '16301', '26907', '28404', '28403', '14805', '28087', '28401', '28764', 
'14128');

insert into medical_group (dec_number, name, county, region, state)
    values ('4209', 'BAKERSFIELD FAMILY MEDICAL CENTER', 'KERN', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '4209'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '4209'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '4209'));

insert into medical_group (dec_number, name, county, region, state)
    values ('4770', 'BAKERSFIELD MEMORIAL HOSPITAL', 'KERN', 'Southern California', 'California');

insert into medical_group (dec_number, name, county, region, state)
    values ('25188', 'GEMCARE MEDICAL GROUP DELANO REGIONAL MEDICAL', 'KERN', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '25188'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '25188'));

insert into medical_group (dec_number, name, county, region, state)
    values ('25190', 'GOLDEN EMPIRE MANAGED CARE II A MEDICAL GROUP INC', 'KERN', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '25190'));

insert into medical_group (dec_number, name, county, region, state)
    values ('7665', 'HERITAGE PHYSICIAN NETWORK', 'KERN', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '7665'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '7665'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '7665'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26234', 'PHYSICIANS CHOICE MEDICAL GROUP', 'KERN', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '26234'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '26234'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '26234'));

insert into medical_group (dec_number, name, county, region, state)
    values ('10246', 'ACCESS MEDICAL GROUP INC', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '10246'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '10246'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '10246'));

insert into medical_group (dec_number, name, county, region, state)
    values ('25517', 'ACCESS SANTA MONICA INDEPENDENT PHYSICIANS ASSOCIATION, INC.', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '25517'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '25517'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '25517'));

insert into medical_group (dec_number, name, county, region, state)
    values ('25400', 'ADOC - FOUNTAIN VALLEY DIVISION', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '25400'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '25400'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '25400'));

insert into medical_group (dec_number, name, county, region, state)
    values ('25401', 'ADOC - LOS ALAMITOS DIVISION', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '25401'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '25401'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '25401'));

insert into medical_group (dec_number, name, county, region, state)
    values ('12244', 'ALLIED PACIFIC OF CALIFORNIA IPA', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '12244'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '12244'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '12244'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28928', 'ALTAMED HEALTH SERVICES CORPORATION', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28928'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28928'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28928'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28951', 'ALTAMED HEALTH SERVICES CORPORATION', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28951'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28951'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28951'));

insert into medical_group (dec_number, name, county, region, state)
    values ('29116', 'ALTAMED HEALTH SERVICES CORPORATION', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '29116'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '29116'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '29116'));

insert into medical_group (dec_number, name, county, region, state)
    values ('12143', 'AXMINSTER MEDICAL GROUP - PROVIDENCE MEDICAL ASSOCIATES', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '12143'));

insert into medical_group (dec_number, name, county, region, state)
    values ('12532', 'CEDARS-SINAI HEALTH ASSOCIATES', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '12532'));

insert into medical_group (dec_number, name, county, region, state)
    values ('6952', 'CEDARS-SINAI MEDICAL GROUP', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '6952'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14696', 'CENTINELA VALLEY IPA MG INC', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14696'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17465', 'EXCEPTIONAL CARE MEDICAL GROUP', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17465'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17465'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '17465'));

insert into medical_group (dec_number, name, county, region, state)
    values ('21250', 'EXCEPTIONAL CARE MG MABUHAY', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '21250'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '21250'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '21250'));

insert into medical_group (dec_number, name, county, region, state)
    values ('1010', 'FACEY MEDICAL FOUNDATION', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '1010'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27655', 'FACEY MEDICAL FOUNDATION BURBANK', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27655'));

insert into medical_group (dec_number, name, county, region, state)
    values ('15870', 'FACEY MEDICAL FOUNDATION SANTA CLARITA', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '15870'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28463', 'HCP - LA COUNTY', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28463'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28463'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28463'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28463'));

insert into medical_group (dec_number, name, county, region, state)
    values ('29878', 'HCP ARTA HEALTH NETWORK', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '29878'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '29878'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '29878'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '29878'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28388', 'HCP IPA - MONTEBELLO', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28388'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28388'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28388'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28388'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28461', 'HCP IPA - SOUTH COAST', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28461'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28461'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28461'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28461'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28435', 'HEALTHCARE PARTNER MG - BIXBY KNOLLS', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28435'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28435'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28435'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28435'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28404', 'HEALTHCARE PARTNERS IPA - ARCADIA', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28404'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28404'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28404'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28404'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28399', 'HEALTHCARE PARTNERS IPA - EAST LOS ANGELES', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28399'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28399'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28399'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28399'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28401', 'HEALTHCARE PARTNERS IPA - GLENDALE', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28401'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28401'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28401'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28401'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28393', 'HEALTHCARE PARTNERS IPA - LA COUNTY', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28393'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28393'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28393'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28393'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28454', 'HEALTHCARE PARTNERS IPA - LONG BEACH', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28454'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28454'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28454'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28454'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28416', 'HEALTHCARE PARTNERS IPA - NORTHRIDGE', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28416'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28416'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28416'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28416'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28417', 'HEALTHCARE PARTNERS IPA - SOUTH BAY', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28417'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28417'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28417'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28417'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28436', 'HEALTHCARE PARTNERS IPA LITTLE CO. OF MARY', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28436'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28436'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28436'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28436'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28410', 'HEALTHCARE PARTNERS IPA PASADENA', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28410'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28410'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28410'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28410'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28423', 'HEALTHCARE PARTNERS IPA SAN FERNANDO VALLEY', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28423'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28423'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28423'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28423'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28460', 'HEALTHCARE PARTNERS IPA SAN FERNANDO WEST', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28460'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28460'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28460'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28460'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28411', 'HEALTHCARE PARTNERS IPA-EAST WEST', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28411'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28411'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28411'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28411'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28455', 'HEALTHCARE PARTNERS LONG BEACH', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28455'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28455'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28455'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28455'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28391', 'HEALTHCARE PARTNERS MED GROUP', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28391'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28391'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28391'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28391'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28459', 'HEALTHCARE PARTNERS MED GROUP', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28459'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28459'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28459'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28459'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28414', 'HEALTHCARE PARTNERS MED GROUP- VALENCIA', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28414'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28414'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28414'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28414'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28403', 'HEALTHCARE PARTNERS MEDICAL GROUP - SOUTH BAY', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28403'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28403'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28403'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28403'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28440', 'HEALTHCARE PARTNERS MG - SAN FERNANDO HOLY CROSS', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28440'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28440'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28440'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28440'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28442', 'HEALTHCARE PARTNERS MG - SAN FERNANDO VALLEY', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28442'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28442'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28442'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28442'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28764', 'HEALTHCARE PARTNERS PLAN - SANTA ANITA', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28764'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28764'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28764'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28764'));

insert into medical_group (dec_number, name, county, region, state)
    values ('12977', 'HERITAGE PROVIDER NETWORK', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '12977'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '12977'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '12977'));

insert into medical_group (dec_number, name, county, region, state)
    values ('3804', 'HIGH DESERT MEDICAL GROUP', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '3804'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '3804'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '3804'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24675', 'LAKESIDE MEDICAL GROUP EAST- WEST COVINA', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24675'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24675'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24675'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24679', 'LAKESIDE MEDICAL GROUP EAST-POMONA', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24679'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24679'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24679'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24664', 'LAKESIDE MEDICAL GROUP-CENTRAL-BURBANK/NORTH HOLLYWOOD', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24664'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24664'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24664'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24670', 'LAKESIDE MEDICAL GROUP-CENTRAL-CENTRAL VALLEY', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24670'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24670'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24670'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24662', 'LAKESIDE MEDICAL GROUP-CENTRAL-GLENDALE', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24662'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24662'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24662'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24671', 'LAKESIDE MEDICAL GROUP-CENTRAL-NORTH VALLEY', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24671'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24671'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24671'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24677', 'LAKESIDE MEDICAL GROUP-CENTRAL-SANTA CLARITA', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24677'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24677'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24677'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24681', 'LAKESIDE MEDICAL GROUP-CENTRAL-VERDUGO HILLS', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24681'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24681'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24681'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24674', 'LAKESIDE MEDICAL GROUP-EAST-GLENDORA', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24674'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24674'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24674'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24686', 'LAKESIDE MEDICAL GROUP-EAST-SAN GABRIEL VALLEY', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24686'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24686'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24686'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24672', 'LAKESIDE MEDICAL GROUP-WEST-AGOURA HILLS', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24672'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24672'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24672'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24682', 'LAKESIDE MEDICAL GROUP-WEST-SIMI VALLEY', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24682'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24682'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24682'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24684', 'LAKESIDE MEDICAL GROUP-WEST-TARZANA', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24684'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24684'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24684'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24678', 'LAKESIDE MEDICAL GROUP-WEST-THOUSAND OAKS', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24678'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24678'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24678'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24683', 'LAKESIDE MEDICAL GROUP-WEST-WEST HILLS/CANOGA PARK', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24683'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24683'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24683'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28445', 'MAGAN MEDICAL CLINIC', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28445'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28445'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28445'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28445'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27882', 'MONARCH LONG BEACH', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27882'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '27882'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '27882'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14498', 'OMNICARE MEDICAL GROUP', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14498'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14498'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '14498'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28434', 'PHYS ASSOC/HCP IPA HUNTINGTON', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28434'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28434'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28434'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28434'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28428', 'PHYSICIAN ASSOCIATE IPA/HCP/CITRUS', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28428'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28428'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28428'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28428'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28437', 'PHYSICIANS ASSOC/HCP IPA - GLENDALE', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28437'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28437'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28437'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28437'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28451', 'PHYSICIANS ASSOC/HCP IPA - METHODIST', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28451'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28451'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28451'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28451'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28419', 'PHYSICIANS ASSOC/HCP IPA - SAN DIMAS', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28419'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28419'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28419'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28419'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28422', 'PHYSICIANS ASSOC/HCP IPA-SAN GABRIEL', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28422'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28422'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28422'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28422'));

insert into medical_group (dec_number, name, county, region, state)
    values ('5679', 'PIH HEALTH PHYSICIANS - IPA', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '5679'));

insert into medical_group (dec_number, name, county, region, state)
    values ('23247', 'PIH HEALTH PHYSICIANS MEDICAL GROUP', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '23247'));

insert into medical_group (dec_number, name, county, region, state)
    values ('15848', 'PIONEER PROVIDER NETWORK A MEDICAL GROUP INC', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '15848'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '15848'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '15848'));

insert into medical_group (dec_number, name, county, region, state)
    values ('20614', 'PREMIER PHYSICIAN NETWORK', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '20614'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '20614'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '20614'));

insert into medical_group (dec_number, name, county, region, state)
    values ('5169', 'PREMIER PHYSICIANS NETWORK', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '5169'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26251', 'PROVIDENCE CARE NETWORK', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '26251'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '26251'));

insert into medical_group (dec_number, name, county, region, state)
    values ('22732', 'PRUDENT MEDICAL GROUP', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '22732'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '22732'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '22732'));

insert into medical_group (dec_number, name, county, region, state)
    values ('21557', 'REGAL MEDICAL GROUP  VENTURA COUNTY', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '21557'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '21557'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '21557'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17556', 'REGAL MEDICAL GROUP BURBANK/GLENDALE', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17556'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17556'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '17556'));

insert into medical_group (dec_number, name, county, region, state)
    values ('12410', 'REGAL MEDICAL GROUP CENTRAL VALLEY REGION', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '12410'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '12410'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '12410'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17553', 'REGAL MEDICAL GROUP CHINO VALLEY', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17553'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17553'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '17553'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17547', 'REGAL MEDICAL GROUP DOWNEY', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17547'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17547'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '17547'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14163', 'REGAL MEDICAL GROUP DOWNTOWN LOS ANGELES REGION', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14163'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14163'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '14163'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17555', 'REGAL MEDICAL GROUP EAST SAN GABRIEL', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17555'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17555'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '17555'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17778', 'REGAL MEDICAL GROUP GREATER COVINA', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17778'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17778'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '17778'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17552', 'REGAL MEDICAL GROUP LONG BEACH', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17552'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17552'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '17552'));

insert into medical_group (dec_number, name, county, region, state)
    values ('18831', 'REGAL MEDICAL GROUP ORANGE COUNTY', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '18831'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '18831'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '18831'));

insert into medical_group (dec_number, name, county, region, state)
    values ('21553', 'REGAL MEDICAL GROUP RIVERSIDE', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '21553'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '21553'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '21553'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14888', 'REGAL MEDICAL GROUP SAN GABRIEL REGION', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14888'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14888'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '14888'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17551', 'REGAL MEDICAL GROUP ST FRANCIS', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17551'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17551'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '17551'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17554', 'REGAL MEDICAL GROUP WEST VALLEY', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17554'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17554'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '17554'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17550', 'REGAL MEDICAL GROUP WHITTIER', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17550'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17550'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '17550'));

insert into medical_group (dec_number, name, county, region, state)
    values ('23187', 'REGAL MEDICAL GROUP-GLENDALE PHYSICIANS ALLIANCE', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '23187'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '23187'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '23187'));

insert into medical_group (dec_number, name, county, region, state)
    values ('20670', 'REGAL MG APSI', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '20670'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '20670'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '20670'));

insert into medical_group (dec_number, name, county, region, state)
    values ('20668', 'REGAL MG SAN BERNARDINO', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '20668'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '20668'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '20668'));

insert into medical_group (dec_number, name, county, region, state)
    values ('20950', 'REGAL MG TEMECULA', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '20950'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '20950'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '20950'));

insert into medical_group (dec_number, name, county, region, state)
    values ('29550', 'SEOUL MEDICAL GROUP - ORANGE COUNTY', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '29550'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '29550'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '29550'));

insert into medical_group (dec_number, name, county, region, state)
    values ('19881', 'SEOUL MEDICAL GROUP INC', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '19881'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '19881'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '19881'));

insert into medical_group (dec_number, name, county, region, state)
    values ('23025', 'SIERRA IPA', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '23025'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '23025'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '23025'));

insert into medical_group (dec_number, name, county, region, state)
    values ('23023', 'SIERRA MEDICAL GROUP CLINIC', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '23023'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '23023'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '23023'));

insert into medical_group (dec_number, name, county, region, state)
    values ('29357', 'SIERRA MG-SANTA CLARITA', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '29357'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '29357'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '29357'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14697', 'ST VINCENT MEDICAL GROUP IPA', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14697'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14697'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '14697'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26488', 'TORRANCE HOSPITAL IPA', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '26488'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '26488'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '26488'));

insert into medical_group (dec_number, name, county, region, state)
    values ('25465', 'UCLA MED GRP - SANTA MONICA BAY PHYS', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '25465'));

insert into medical_group (dec_number, name, county, region, state)
    values ('16998', 'UCLA MEDICAL GROUP/IPA', 'LOS ANGELES', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '16998'));

insert into medical_group (dec_number, name, county, region, state)
    values ('10217', 'ALAMITOS IPA', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '10217'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '10217'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '10217'));

insert into medical_group (dec_number, name, county, region, state)
    values ('12130', 'AMVI (AMERICAN VIETNAMESE)', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '12130'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '12130'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '12130'));

insert into medical_group (dec_number, name, county, region, state)
    values ('15967', 'APPLECARE MEDICAL GROUP DOWNEY REGION', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '15967'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '15967'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '15967'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '15967'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14692', 'APPLECARE MEDICAL GROUP ST FRANCIS', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14692'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14692'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '14692'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '14692'));

insert into medical_group (dec_number, name, county, region, state)
    values ('21736', 'APPLECARE MEDICAL GROUP WHITTIER REGION', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '21736'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '21736'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '21736'));

insert into medical_group (dec_number, name, county, region, state)
    values ('25327', 'APPLECARE MG SELECT REGION', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '25327'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '25327'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '25327'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '25327'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17812', 'BORREGO SPRINGS DCN PCPS', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17812'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17812'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27362', 'DAEHAN PROSPECT MEDICAL GROUP', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27362'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '27362'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '27362'));

insert into medical_group (dec_number, name, county, region, state)
    values ('16366', 'DINUBA DCN PCPS', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '16366'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26621', 'EDINGER MEDICAL GROUP', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '26621'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '26621'));

insert into medical_group (dec_number, name, county, region, state)
    values ('20004', 'FAMILY CARE SPECIALISTS IPA A MEDICAL GROUP', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '20004'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '20004'));

insert into medical_group (dec_number, name, county, region, state)
    values ('19394', 'FAMILY CHOICE MEDICAL GROUP INC', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '19394'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '19394'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '19394'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26678', 'GNP - LONG BEACH', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '26678'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '26678'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26603', 'GNP -HOAG', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '26603'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26693', 'GNP- SADDLEBACK', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '26693'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '26693'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26695', 'GNP-ORANGE COAST', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '26695'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '26695'));

insert into medical_group (dec_number, name, county, region, state)
    values ('5273', 'GOOD SAMARITAN MEDICAL PRACTICE ASSOC', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '5273'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28427', 'HCP - ORANGE COUNTY', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28427'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28427'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28427'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28427'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27963', 'HOAG AFFILIATED PHYSICIANS IPA', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27963'));

insert into medical_group (dec_number, name, county, region, state)
    values ('19863', 'KOREAN AMERICAN MEDICAL GROUP', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '19863'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '19863'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '19863'));

insert into medical_group (dec_number, name, county, region, state)
    values ('5225', 'LAKEWOOD IPA INC', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '5225'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '5225'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '5225'));

insert into medical_group (dec_number, name, county, region, state)
    values ('25679', 'MEMORIALCARE MEDICAL GROUP', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '25679'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '25679'));

insert into medical_group (dec_number, name, county, region, state)
    values ('25036', 'MISSION HERITAGE MEDICAL GROUP', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '25036'));

insert into medical_group (dec_number, name, county, region, state)
    values ('18352', 'MISSION HOSPITAL AFFILIATED MEDICAL GROUP', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '18352'));

insert into medical_group (dec_number, name, county, region, state)
    values ('21963', 'MONARCH HEALTHCARE', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '21963'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14905', 'MONARCH/ORANGE COUNTY', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14905'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14905'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '14905'));

insert into medical_group (dec_number, name, county, region, state)
    values ('11315', 'NUESTRA FAMILIA MEDICAL GROUP  INC', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '11315'));

insert into medical_group (dec_number, name, county, region, state)
    values ('16085', 'PORTERVILLE DCN PCPS', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '16085'));

insert into medical_group (dec_number, name, county, region, state)
    values ('3447', 'PROMED HEALTH NETWORK OF POMONA VALLEY', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '3447'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14548', 'PROSPECT GATEWAY MEDICAL GROUP', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14548'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14548'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '14548'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14904', 'PROSPECT GENESIS HEALTHCARE', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14904'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14904'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '14904'));

insert into medical_group (dec_number, name, county, region, state)
    values ('16209', 'PROSPECT HEALTH SOURCE MEDICAL GROUP', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '16209'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17807', 'PROSPECT MEDICAL GROUP CORONA', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17807'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17807'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '17807'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17597', 'PROSPECT MEDICAL GROUP HUNTINGTON BEACH', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17597'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17597'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '17597'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17615', 'PROSPECT MEDICAL GROUP VAN NUYS', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17615'));

insert into medical_group (dec_number, name, county, region, state)
    values ('11276', 'PROSPECT MEDICAL GROUP/CENTRAL', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '11276'));

insert into medical_group (dec_number, name, county, region, state)
    values ('3948', 'PROSPECT MEDICAL GROUP/NORTH', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '3948'));

insert into medical_group (dec_number, name, county, region, state)
    values ('8631', 'PROSPECT NORTHWEST OC MG', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '8631'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '8631'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '8631'));

insert into medical_group (dec_number, name, county, region, state)
    values ('11567', 'PROSPECT NORTHWEST OC MG ANAHEIM DIVISION', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '11567'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '11567'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '11567'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14722', 'PROSPECT PROFESSIONAL CARE IPA MEDICAL GRP INC', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14722'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14722'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17270', 'PROSPECT PROFESSIONAL CARE IPA MONTEBELLO', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17270'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17270'));

insert into medical_group (dec_number, name, county, region, state)
    values ('19793', 'REGAL MEDICAL GROUP - CADUCEUS', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '19793'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '19793'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '19793'));

insert into medical_group (dec_number, name, county, region, state)
    values ('18346', 'ST JOSEPH HERITAGE MEDICAL GROUP', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '18346'));

insert into medical_group (dec_number, name, county, region, state)
    values ('18347', 'ST JOSEPH HOSPITAL AFFILIATED PHYSICIANS', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '18347'));

insert into medical_group (dec_number, name, county, region, state)
    values ('18344', 'ST JUDE AFFILIATED PHYSICIANS', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '18344'));

insert into medical_group (dec_number, name, county, region, state)
    values ('18342', 'ST JUDE HERITAGE MEDICAL GROUP', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '18342'));

insert into medical_group (dec_number, name, county, region, state)
    values ('18753', 'ST MARY IPA', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '18753'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '18753'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28603', 'UC IRVINE HEALTH AFFILIATED PHYSICIANS', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28603'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28569', 'UC IRVINE HEALTH MEDICAL GROUP', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28569'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17771', 'UPLAND MEDICAL GROUP', 'ORANGE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17771'));

insert into medical_group (dec_number, name, county, region, state)
    values ('21796', 'DESERT OASIS HEALTHCARE', 'RIVERSIDE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '21796'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '21796'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '21796'));

insert into medical_group (dec_number, name, county, region, state)
    values ('18657', 'EMPIRE PHYSICIANS MEDICAL GROUP INC', 'RIVERSIDE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '18657'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '18657'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '18657'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14899', 'FAMILY SENIORS MEDICAL GROUP', 'RIVERSIDE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14899'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14586', 'HEMET COMMUNITY MEDICAL GROUP', 'RIVERSIDE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14586'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14586'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '14586'));

insert into medical_group (dec_number, name, county, region, state)
    values ('15031', 'MENIFEE VALLEY COMMUNITY MEDICAL GROUP', 'RIVERSIDE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '15031'));

insert into medical_group (dec_number, name, county, region, state)
    values ('5232', 'PRIMECARE OF CORONA', 'RIVERSIDE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '5232'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '5232'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '5232'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '5232'));

insert into medical_group (dec_number, name, county, region, state)
    values ('9023', 'PRIMECARE OF HEMET VALLEY', 'RIVERSIDE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '9023'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '9023'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '9023'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '9023'));

insert into medical_group (dec_number, name, county, region, state)
    values ('8331', 'PRIMECARE OF RIVERSIDE', 'RIVERSIDE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '8331'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '8331'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '8331'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '8331'));

insert into medical_group (dec_number, name, county, region, state)
    values ('4140', 'PRIMECARE OF SUN CITY', 'RIVERSIDE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '4140'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '4140'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '4140'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '4140'));

insert into medical_group (dec_number, name, county, region, state)
    values ('6657', 'PRIMECARE OF TEMECULA', 'RIVERSIDE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '6657'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '6657'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '6657'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '6657'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14897', 'RIVERSIDE MEDICAL CLINIC INC', 'RIVERSIDE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14897'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14897'));

insert into medical_group (dec_number, name, county, region, state)
    values ('5171', 'RIVERSIDE PHYSICIAN NETWORK', 'RIVERSIDE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '5171'));

insert into medical_group (dec_number, name, county, region, state)
    values ('21941', 'TEMECULA VALLEY PHYSICIANS MED GRP', 'RIVERSIDE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '21941'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '21941'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '21941'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26432', 'TRI-VALLEY MEDICAL GROUP', 'RIVERSIDE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '26432'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '26432'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '26432'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '26432'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26405', 'VALLEY PHYSICIANS NETWORK INC', 'RIVERSIDE', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '26405'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '26405'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '26405'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '26405'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24628', 'ALLIANCE DESERT PHYSICIANS', 'SAN BERNARDINO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24628'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24628'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24628'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '24628'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27825', 'BEAVER MEDICAL GROUP', 'SAN BERNARDINO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27825'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '27825'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '27825'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '27825'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27892', 'CHAFFEY MEDICAL GROUP', 'SAN BERNARDINO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27892'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '27892'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '27892'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '27892'));

insert into medical_group (dec_number, name, county, region, state)
    values ('4800', 'CHOICE MEDICAL GROUP', 'SAN BERNARDINO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '4800'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '4800'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '4800'));

insert into medical_group (dec_number, name, county, region, state)
    values ('21837', 'CHOICE MEDICAL GROUP BARSTOW', 'SAN BERNARDINO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '21837'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '21837'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '21837'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27411', 'DESERT VALLEY MEDICAL GROUP', 'SAN BERNARDINO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27411'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '27411'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '27411'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28433', 'DIGNITY HEALTH MEDICAL GROUP - INLAND EMPIRE', 'SAN BERNARDINO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28433'));

insert into medical_group (dec_number, name, county, region, state)
    values ('4470', 'FACULTY PHYSICIANS AND SURGEONS OF LLUSM', 'SAN BERNARDINO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '4470'));

insert into medical_group (dec_number, name, county, region, state)
    values ('1011', 'FAMILY PRACTICE MEDICAL GROUP OF SAN BERNARDINO', 'SAN BERNARDINO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '1011'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '1011'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '1011'));

insert into medical_group (dec_number, name, county, region, state)
    values ('2517', 'MY FAMILY MEDICAL GROUP', 'SAN BERNARDINO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '2517'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27850', 'PINNACLE MEDICAL GROUP', 'SAN BERNARDINO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27850'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '27850'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '27850'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '27850'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27648', 'PREMIER HEALTHCARE IPA', 'SAN BERNARDINO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27648'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '27648'));

insert into medical_group (dec_number, name, county, region, state)
    values ('21243', 'PRIMECARE CITRUS VALLEY', 'SAN BERNARDINO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '21243'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '21243'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '21243'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '21243'));

insert into medical_group (dec_number, name, county, region, state)
    values ('4661', 'PRIMECARE MEDICAL GROUP OF CHINO VALLEY', 'SAN BERNARDINO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '4661'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '4661'));

insert into medical_group (dec_number, name, county, region, state)
    values ('19383', 'PRIMECARE MEDICAL GROUP OF SAN BERNARDINO', 'SAN BERNARDINO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '19383'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '19383'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '19383'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '19383'));

insert into medical_group (dec_number, name, county, region, state)
    values ('6045', 'PRIMECARE OF INLAND VALLEY', 'SAN BERNARDINO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '6045'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '6045'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '6045'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '6045'));

insert into medical_group (dec_number, name, county, region, state)
    values ('3111', 'PRIMECARE OF MORENO VALLEY', 'SAN BERNARDINO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '3111'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '3111'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '3111'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '3111'));

insert into medical_group (dec_number, name, county, region, state)
    values ('1026', 'PRIMECARE OF REDLANDS', 'SAN BERNARDINO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '1026'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '1026'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '1026'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '1026'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27828', 'REDLANDS-YUCAIPA MEDICAL GROUP', 'SAN BERNARDINO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27828'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '27828'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '27828'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '27828'));

insert into medical_group (dec_number, name, county, region, state)
    values ('19198', 'SAN BERNARDINO MEDICAL GROUP INC', 'SAN BERNARDINO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '19198'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27647', 'ST. MARY HIGH DESERT MEDICAL GROUP', 'SAN BERNARDINO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27647'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '27647'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28857', 'VVIPA MEDICAL GROUP', 'SAN BERNARDINO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28857'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28857'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28857'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14748', 'CASSIDY MEDICAL GROUP/PCAMG', 'SAN DIEGO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14748'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14748'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '14748'));

insert into medical_group (dec_number, name, county, region, state)
    values ('16390', 'ENCOMPASS MEDICAL GROUP INC', 'SAN DIEGO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '16390'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '16390'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '16390'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14889', 'GREATER TRI-CITIES IPA MEDICAL GROUP INC', 'SAN DIEGO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14889'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14889'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '14889'));

insert into medical_group (dec_number, name, county, region, state)
    values ('4164', 'IMPERIAL COUNTY PHYSICIANS MEDICAL GROUP', 'SAN DIEGO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '4164'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '4164'));

insert into medical_group (dec_number, name, county, region, state)
    values ('4602', 'MERCY PHYSICIANS MEDICAL GROUP', 'SAN DIEGO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '4602'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '4602'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24783', 'MIDCOUNTY PHYSICIANS MEDICAL GROUP', 'SAN DIEGO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24783'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24783'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '24783'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26282', 'MPMG/SCRIPPS CARE AFFILIATE', 'SAN DIEGO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '26282'));

insert into medical_group (dec_number, name, county, region, state)
    values ('7932', 'MULTICULTURAL PRIMARY CARE MEDICAL GROUP INC (MPCMG)', 'SAN DIEGO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '7932'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '7932'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '7932'));

insert into medical_group (dec_number, name, county, region, state)
    values ('16335', 'NOBLE AMA IPA', 'SAN DIEGO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '16335'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '16335'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '16335'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26443', 'PCAMG- SCRIPPS CARE AFFILIATE', 'SAN DIEGO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '26443'));

insert into medical_group (dec_number, name, county, region, state)
    values ('6039', 'PRIMARY CARE ASSOCIATED MEDICAL GROUP', 'SAN DIEGO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '6039'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '6039'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '6039'));

insert into medical_group (dec_number, name, county, region, state)
    values ('16223', 'PRIMARY CARE ASSOCIATED MEDICAL GROUP/ENCINITAS', 'SAN DIEGO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '16223'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '16223'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '16223'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28561', 'RADY CHILDREN''S HEALTH NETWORK', 'SAN DIEGO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28561'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28561'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28561'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28561'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28360', 'SCMG ARCH HEALTHPARTNERS', 'SAN DIEGO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28360'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28360'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28360'));

insert into medical_group (dec_number, name, county, region, state)
    values ('3682', 'SCRIPPS CLINIC', 'SAN DIEGO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '3682'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '3682'));

insert into medical_group (dec_number, name, county, region, state)
    values ('23659', 'SCRIPPS COASTAL MC', 'SAN DIEGO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '23659'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '23659'));

insert into medical_group (dec_number, name, county, region, state)
    values ('5375', 'SCRIPPS PHYSICIAN MEDICAL GROUP', 'SAN DIEGO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '5375'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '5375'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '5375'));

insert into medical_group (dec_number, name, county, region, state)
    values ('4395', 'SHARP COMMUNITY MEDICAL GROUP', 'SAN DIEGO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '4395'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '4395'));

insert into medical_group (dec_number, name, county, region, state)
    values ('6129', 'SHARP COMMUNITY MEDICAL GROUP/CHULA VISTA', 'SAN DIEGO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '6129'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '6129'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14128', 'SHARP COMMUNITY MEDICAL GROUP/CORONADO', 'SAN DIEGO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14128'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14128'));

insert into medical_group (dec_number, name, county, region, state)
    values ('6130', 'SHARP COMMUNITY MEDICAL GROUP/GROSSMONT', 'SAN DIEGO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '6130'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '6130'));

insert into medical_group (dec_number, name, county, region, state)
    values ('25448', 'SHARP COMMUNITY MEDICAL GROUP-GRAYBILL NORTH COASTAL', 'SAN DIEGO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '25448'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '25448'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '25448'));

insert into medical_group (dec_number, name, county, region, state)
    values ('15882', 'SHARP COMMUNITY/GRAYBILL', 'SAN DIEGO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '15882'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '15882'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '15882'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14174', 'SHARP COMMUNITY/INLAND NORTH', 'SAN DIEGO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14174'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14174'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '14174'));

insert into medical_group (dec_number, name, county, region, state)
    values ('1035', 'SHARP REES-STEALY MEDICAL GROUP INC', 'SAN DIEGO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '1035'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '1035'));

insert into medical_group (dec_number, name, county, region, state)
    values ('4589', 'UCSD MEDICAL GROUP', 'SAN DIEGO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '4589'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28856', 'COASTAL COMMUNITIES PHYSICIAN NETWORK', 'SAN LUIS OBISPO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28856'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28856'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28856'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14350', 'PHYSICIANS CHOICE MEDICAL GROUP OF SLO SOUTH COUNTY', 'SAN LUIS OBISPO', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14350'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '14350'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17893', 'JACKSON MED GRP-SANSUM CLINIC', 'SANTA BARBARA', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17893'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14805', 'SANSUM CLINIC', 'SANTA BARBARA', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14805'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14798', 'SANSUM CLINIC-1225 NORTH H ST', 'SANTA BARBARA', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14798'));

insert into medical_group (dec_number, name, county, region, state)
    values ('25614', 'FACEY MEDICAL FOUNDATION - SIMI VALLEY', 'VENTURA', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '25614'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '25614'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14349', 'SANTA BARBARA SELECT IPA', 'VENTURA', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14349'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14349'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '14349'));

insert into medical_group (dec_number, name, county, region, state)
    values ('5141', 'SEAVIEW IPA', 'VENTURA', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '5141'));

insert into medical_group (dec_number, name, county, region, state)
    values ('29573', 'VALLEY CARE IPA', 'VENTURA', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '29573'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '29573'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '29573'));

insert into medical_group (dec_number, name, county, region, state)
    values ('29572', 'VALLEY CARE SELECT IPA', 'VENTURA', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '29572'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '29572'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '29572'));


insert into medical_group (dec_number, name, county, region, state)
    values ('26903', 'AFFINITY BAY VALLEY REGION', 'CONTRA COSTA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '26903'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '26903'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26913', 'AFFINITY MED GRP ALAMEDA REGION', 'CONTRA COSTA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '26913'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '26913'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26929', 'AFFINITY MED GRP EDEN/SAN LEANDRO REGION', 'CONTRA COSTA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '26929'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '26929'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27173', 'AFFINITY MEDICAL GROUP PALO ALTO', 'CONTRA COSTA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27173'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '27173'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27176', 'AFFINITY MEDICAL GROUP SAN JOSE', 'CONTRA COSTA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27176'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '27176'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26907', 'AFFINITY MEDICAL GROUP WEST COUNTY REGION', 'CONTRA COSTA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '26907'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '26907'));

insert into medical_group (dec_number, name, county, region, state)
    values ('18580', 'ALLCARE IPA', 'STANISLAUS', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '18580'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '18580'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '18580'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28465', 'ALTA BATES MEDICAL GROUP (BROWN  TOLAND EAST BAY)', 'ALAMEDA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28465'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28466', 'ALTA BATES MEDICAL GROUP (BROWN  TOLAND EAST BAY)', 'ALAMEDA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28466'));

insert into medical_group (dec_number, name, county, region, state)
    values ('29717', 'ASIAN AMERICAN MEDICAL GROUP', 'SAN FRANCISCO', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '29717'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '29717'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '29717'));

insert into medical_group (dec_number, name, county, region, state)
    values ('6732', 'BROWN & TOLAND MEDICAL GROUP', 'SAN FRANCISCO', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '6732'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26920', 'BROWN AND TOLAND MEDICAL GROUP', 'SAN FRANCISCO', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '26920'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28087', 'BROWN AND TOLAND/SAN MATEO', 'SAN FRANCISCO', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28087'));

insert into medical_group (dec_number, name, county, region, state)
    values ('30403', 'CANOPY HEALTH - HILL PHYSICIANS MEDICAL GROUP EAST BAY', 'ALAMEDA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '30403'));

insert into medical_group (dec_number, name, county, region, state)
    values ('30459', 'CANOPY HEALTH - HILL PHYSICIANS MEDICAL GROUP SAN FRANCISCO', 'ALAMEDA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '30459'));

insert into medical_group (dec_number, name, county, region, state)
    values ('30461', 'CANOPY HEALTH - HILL PHYSICIANS MEDICAL GROUP SOLANO', 'ALAMEDA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '30461'));

insert into medical_group (dec_number, name, county, region, state)
    values ('30431', 'CANOPY HEALTH - JOHN MUIR PHYSICIAN NETWORK', 'ALAMEDA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '30431'));

insert into medical_group (dec_number, name, county, region, state)
    values ('30432', 'CANOPY HEALTH - MERITAGE MEDICAL NETWORK', 'ALAMEDA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '30432'));

insert into medical_group (dec_number, name, county, region, state)
    values ('29354', 'CENTRAL VALLEY MEDICAL GROUP', 'STANISLAUS', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '29354'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '29354'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26688', 'DCHS MEDICAL FOUNDATION (FORMERLY SAN JOSE MEDICAL GROUP)', 'SANTA CLARA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '26688'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '26688'));

insert into medical_group (dec_number, name, county, region, state)
    values ('22048', 'DINUBA MEDICAL CLINIC', 'TULARE', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '22048'));

insert into medical_group (dec_number, name, county, region, state)
    values ('23600', 'FAMILY HEALTHCARE NETWORK', 'TULARE', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '23600'));

insert into medical_group (dec_number, name, county, region, state)
    values ('15643', 'HILL AUBURN/GRASS VALLEY', 'SACRAMENTO', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '15643'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '15643'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '15643'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28669', 'HILL EAST BAY ALLIANCE', 'CONTRA COSTA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28669'));

insert into medical_group (dec_number, name, county, region, state)
    values ('4781', 'HILL PHYSICIANS / SAN FRANCISCO', 'CONTRA COSTA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '4781'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '4781'));

insert into medical_group (dec_number, name, county, region, state)
    values ('5245', 'HILL PHYSICIANS EAST BAY', 'CONTRA COSTA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '5245'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '5245'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '5245'));

insert into medical_group (dec_number, name, county, region, state)
    values ('19219', 'HILL PHYSICIANS MANTECA', 'CONTRA COSTA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '19219'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '19219'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '19219'));

insert into medical_group (dec_number, name, county, region, state)
    values ('5206', 'HILL PHYSICIANS SACRAMENTO', 'SACRAMENTO', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '5206'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '5206'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '5206'));

insert into medical_group (dec_number, name, county, region, state)
    values ('5157', 'HILL PHYSICIANS SOLANO', 'CONTRA COSTA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '5157'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '5157'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '5157'));

insert into medical_group (dec_number, name, county, region, state)
    values ('19217', 'HILL PHYSICIANS STOCKTON', 'CONTRA COSTA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '19217'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '19217'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '19217'));

insert into medical_group (dec_number, name, county, region, state)
    values ('19218', 'HILL PHYSICIANS TRACY', 'CONTRA COSTA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '19218'));

insert into medical_group (dec_number, name, county, region, state)
    values ('19096', 'JOHN MUIR PHYSICIAN NETWORK', 'CONTRA COSTA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '19096'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '19096'));

insert into medical_group (dec_number, name, county, region, state)
    values ('25971', 'KAWEAH DELTA EXETER CLINIC (RHC)', 'TULARE', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '25971'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14608', 'MERCY MEDICAL GROUP', 'SACRAMENTO', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14608'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14608'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '14608'));

insert into medical_group (dec_number, name, county, region, state)
    values ('12120', 'MERITAGE MEDICAL NETWORK', 'MARIN', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '12120'));

insert into medical_group (dec_number, name, county, region, state)
    values ('21782', 'NORTHERN CALIFORNIA MEDICAL ASSOCIATES', 'SONOMA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '21782'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14997', 'OMNI IPA INC-LODI', 'SAN JOAQUIN', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14997'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14997'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '14997'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14990', 'OMNI IPA INC-STOCKTON', 'SAN JOAQUIN', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14990'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14990'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '14990'));

insert into medical_group (dec_number, name, county, region, state)
    values ('16964', 'OMNI IPA INC-TRACY', 'SAN JOAQUIN', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '16964'));

insert into medical_group (dec_number, name, county, region, state)
    values ('12140', 'PALO ALTO MEDICAL FOUNDATION', 'SAN MATEO', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '12140'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '12140'));

insert into medical_group (dec_number, name, county, region, state)
    values ('23856', 'PALO ALTO MEDICAL FOUNDATION CAMINO', 'SANTA CLARA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '23856'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '23856'));

insert into medical_group (dec_number, name, county, region, state)
    values ('23859', 'PALO ALTO MEDICAL FOUNDATION SANTA CRUZ', 'SANTA CRUZ', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '23859'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '23859'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24896', 'PALO ALTO MILLS PENINSULA DIVISION', 'SAN MATEO', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24896'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24896'));

insert into medical_group (dec_number, name, county, region, state)
    values ('25525', 'PAMF MILLS PENINSULA', 'SAN MATEO', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '25525'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '25525'));

insert into medical_group (dec_number, name, county, region, state)
    values ('4197', 'PHYSICIANS MEDICAL GROUP OF SAN JOSE', 'SANTA CLARA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '4197'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '4197'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '4197'));

insert into medical_group (dec_number, name, county, region, state)
    values ('5181', 'PHYSICIANS MEDICAL GROUP OF SANTA CRUZ COUNTY', 'SANTA CRUZ', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '5181'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '5181'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '5181'));

insert into medical_group (dec_number, name, county, region, state)
    values ('22055', 'SAN JOAQUIN PRIME CARE MEDICAL', 'TULARE', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '22055'));

insert into medical_group (dec_number, name, county, region, state)
    values ('10426', 'SANTA CLARA COUNTY IPA', 'SAN MATEO', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '10426'));

insert into medical_group (dec_number, name, county, region, state)
    values ('16406', 'SANTE COMMUNITY PHYSICIANS KINGS', 'FRESNO', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '16406'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '16406'));

insert into medical_group (dec_number, name, county, region, state)
    values ('16405', 'SANTE COMMUNITY PHYSICIANS-FRESNO', 'FRESNO', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '16405'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '16405'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '16405'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24257', 'SEQUOIA PHYSICIAN NETWORK', 'SAN MATEO', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24257'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24257'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '24257'));

insert into medical_group (dec_number, name, county, region, state)
    values ('20637', 'SUTTER EAST BAY MEDICAL FOUNDATION', 'ALAMEDA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '20637'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '20637'));

insert into medical_group (dec_number, name, county, region, state)
    values ('30201', 'SUTTER EAST BAY MEDICAL FOUNDATION', 'ALAMEDA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '30201'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '30201'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24058', 'SUTTER EAST BAY-DIABLO DIV', 'CONTRA COSTA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24058'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24058'));

insert into medical_group (dec_number, name, county, region, state)
    values ('29350', 'SUTTER GOULD MEDICAL FOUNDATION', 'STANISLAUS', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '29350'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '29350'));

insert into medical_group (dec_number, name, county, region, state)
    values ('29361', 'SUTTER GOULD MEDICAL FOUNDATION- LODI', 'STANISLAUS', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '29361'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '29361'));

insert into medical_group (dec_number, name, county, region, state)
    values ('29365', 'SUTTER GOULD MEDICAL FOUNDATION-LOS BANOS', 'STANISLAUS', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '29365'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '29365'));

insert into medical_group (dec_number, name, county, region, state)
    values ('29356', 'SUTTER GOULD MEDICAL FOUNDATION-SAN JOAQUIN', 'STANISLAUS', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '29356'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '29356'));

insert into medical_group (dec_number, name, county, region, state)
    values ('29364', 'SUTTER GOULD MEDICAL FOUNDATION-TRACY', 'STANISLAUS', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '29364'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '29364'));

insert into medical_group (dec_number, name, county, region, state)
    values ('29358', 'SUTTER GOULD MF-TURLOCK', 'STANISLAUS', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '29358'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '29358'));

insert into medical_group (dec_number, name, county, region, state)
    values ('5204', 'SUTTER INDEPENDENT PHYSICIANS (FORMERLY SPN)', 'SACRAMENTO', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '5204'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '5204'));

insert into medical_group (dec_number, name, county, region, state)
    values ('9695', 'SUTTER MED GRP YOLO', 'YOLO', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '9695'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '9695'));

insert into medical_group (dec_number, name, county, region, state)
    values ('30218', 'SUTTER MEDICAL GROUP OF THE REDWOODS', 'SONOMA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '30218'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '30218'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24365', 'SUTTER MEDICAL GRP SOLANO', 'SOLANO', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24365'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24365'));

insert into medical_group (dec_number, name, county, region, state)
    values ('5200', 'SUTTER MG SACRA/PLACER', 'SACRAMENTO', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '5200'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '5200'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26667', 'TULARE COMMUNITY CLINIC RHC', 'TULARE', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '26667'));

insert into medical_group (dec_number, name, county, region, state)
    values ('8813', 'UC DAVIS MEDICAL GROUP', 'SACRAMENTO', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '8813'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '8813'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26657', 'VERITY MEDICAL FOUNDATION', 'SANTA CLARA', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '26657'));

insert into medical_group (dec_number, name, county, region, state)
    values ('5258', 'WOODLAND CLINIC MED GROUP', 'YOLO', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '5258'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '5258'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '5258'));

