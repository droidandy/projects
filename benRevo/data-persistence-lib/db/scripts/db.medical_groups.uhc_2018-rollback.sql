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
    values ('4209', 'BAKERSFIELD FAMILY MEDICAL CENTER', 'Kern', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '4209' and county = 'Kern'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '4209' and county = 'Kern'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '4209' and county = 'Kern'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '4209' and county = 'Kern'));

insert into medical_group (dec_number, name, county, region, state)
    values ('25188', 'GOLDEN EMPIRE MANAGED CARE II A MEDICAL GROUP INC/DELANO', 'Kern', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '25188' and county = 'Kern'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '25188' and county = 'Kern'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '25188' and county = 'Kern'));

insert into medical_group (dec_number, name, county, region, state)
    values ('25190', 'GOLDEN EMPIRE MANAGED CARE II A MEDICAL GROUP INC/BAKERSFIELD', 'Kern', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '25190' and county = 'Kern'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '25190' and county = 'Kern'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '25190' and county = 'Kern'));

insert into medical_group (dec_number, name, county, region, state)
    values ('7665', 'HERITAGE PHYSICIAN NETWORK', 'Kern', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '7665' and county = 'Kern'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '7665' and county = 'Kern'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '7665' and county = 'Kern'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '7665' and county = 'Kern'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '7665' and county = 'Kern'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '7665' and county = 'Kern'));

insert into medical_group (dec_number, name, county, region, state)
    values ('10246', 'ACCESS MEDICAL GROUP INC', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '10246' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '10246' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '10246' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '10246' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '10246' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('25517', 'ACCESS SANTA MONICA INDEPENDENT PHYSICIANS ASSOCIATION INC', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '25517' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '25517' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '25517' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('10217', 'ALAMITOS IPA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '10217' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '10217' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '10217' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('12244', 'ALLIED PACIFIC OF CALIFORNIA IPA (FORMERLY ALLIED PHYSICIANS OF CALIFORNIA)', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '12244' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '12244' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '12244' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '12244' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28951', 'ALTAMED LOS ANGELES COUNTY IPA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28951' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28951' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28951' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28951' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28928', 'ALTAMED MEDICAL GROUP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28928' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28928' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28928' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28928' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('15967', 'APPLECARE MEDICAL GROUP/DOWNEY REGION', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '15967' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '15967' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '15967' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '15967' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '15967' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14692', 'APPLECARE MEDICAL GROUP/ST. FRANCIS', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14692' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14692' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '14692' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '14692' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '14692' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('21736', 'APPLECARE MEDICAL GROUP/WHITTIER REGION', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '21736' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '21736' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '21736' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '21736' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('25327', 'APPLECARE MEDICAL GROUP/SELECT REGION', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '25327' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '25327' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '25327' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '25327' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '25327' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('29090', 'AXMINSTER MEDICAL GROUP - PROVIDENCE MEDICAL ASSOCIATES', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '29090' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '29090' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('23247', 'BRIGHT HEALTH PHYS OF PIH GROUP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '23247' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '23247' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('5679', 'BRIGHT HEALTH PHYS OF PIH IPA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '5679' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '5679' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('6952', 'CEDARS-SINAI MEDICAL GROUP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '6952' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '6952' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('12532', 'CEDARS-SINAI HEALTH ASSOCIATES', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '12532' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '12532' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14696', 'CENTINELA VALLEY IPA MEDICAL GROUP INC', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14696' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '14696' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27892', 'CHAFFEY MEDICAL GROUP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27892' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '27892' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '27892' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '27892' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '27892' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17465', 'EXCEPTIONAL CARE MEDICAL GROUP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17465' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17465' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '17465' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '17465' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('21250', 'EXCEPTIONAL CARE MG MABUHAY', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '21250' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '21250' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '21250' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '21250' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('1010', 'FACEY MEDICAL FOUNDATION', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '1010' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '1010' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('15870', 'FACEY MEDICAL FOUNDATION/SANTA CLARITA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '15870' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '15870' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27655', 'FACEY MEDICAL GROUP/BURBANK', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27655' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '27655' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('20004', 'FAMILY CARE SPECIALISTS IPA A MEDICAL GROUP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '20004' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '20004' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '20004' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('5273', 'GOOD SAMARITAN MEDICAL PRACTICE ASSOCIATES', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '5273' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '5273' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28435', 'HEALTHCARE PARTNERS IPA/BIXBY KNOLLS', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28435' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28435' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28435' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28435' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28435' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28404', 'HEALTHCARE PARTNERS IPA/ARCADIA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28404' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28404' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28404' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28404' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28404' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28399', 'HEALTHCARE PARTNERS IPA/EAST LOS ANGELES', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28399' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28399' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28399' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28399' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28399' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28411', 'HEALTHCARE PARTNERS IPA/EAST WEST', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28411' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28411' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28411' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28411' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28411' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28401', 'HEALTHCARE PARTNERS IPA/GLENDALE', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28401' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28401' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28401' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28401' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28401' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28436', 'HEALTHCARE PARTNERS IPA/LITTLE COMPANY OF MARY', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28436' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28436' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28436' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28436' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28436' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28454', 'HEALTHCARE PARTNERS IPA/LONG BEACH', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28454' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28454' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28454' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28454' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28454' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28393', 'HEALTHCARE PARTNERS IPA/LOS ANGELES COUNTY', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28393' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28393' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28393' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28393' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28393' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28416', 'HEALTHCARE PARTNERS IPA/NORTHRIDGE MEDICAL GROUP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28416' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28416' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28416' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28416' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28416' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28410', 'HEALTHCARE PARTNERS IPA/PASADENA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28410' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28410' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28410' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28410' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28410' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28423', 'HEALTHCARE PARTNERS IPA/SAN FERNANDO VALLEY', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28423' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28423' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28423' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28423' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28423' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28460', 'HEALTHCARE PARTNERS IPA/SAN FERNANDO VALLEY WEST', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28460' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28460' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28460' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28460' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28460' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28388', 'HEALTHCARE PARTNERS IPA/SAN GABRIEL VALLEY', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28388' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28388' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28388' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28388' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28388' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28417', 'HEALTHCARE PARTNERS IPA/SOUTH BAY', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28417' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28417' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28417' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28417' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28417' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28461', 'HEALTHCARE PARTNERS IPA/TALBERT', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28461' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28461' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28461' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28461' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28461' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28459', 'HEALTHCARE PARTNERS MEDICAL GROUP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28459' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28459' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28459' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28459' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28459' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28463', 'HEALTHCARE PARTNERS MEDICAL GROUP - TALBERT MEDICAL GROUP/LOS ANGELES COUNTY', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28463' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28463' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28463' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28463' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28463' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28455', 'HEALTHCARE PARTNERS MEDICAL GROUP/LONG BEACH', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28455' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28455' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28455' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28455' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28455' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28391', 'HEALTHCARE PARTNERS MEDICAL GROUP/PASADENA MAIN', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28391' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28391' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28391' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28391' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28391' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28440', 'HEALTHCARE PARTNERS MEDICAL GROUP/SAN FERNANDO HOLY CROSS', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28440' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28440' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28440' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28440' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28440' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28442', 'HEALTHCARE PARTNERS MEDICAL GROUP/SAN FERNANDO VALLEY', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28442' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28442' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28442' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28442' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28442' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28764', 'HEALTHCARE PARTNERS MEDICAL GROUP/SANTA ANITA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28764' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28764' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28764' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28764' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28764' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28403', 'HEALTHCARE PARTNERS MEDICAL GROUP/SOUTH BAY', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28403' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28403' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28403' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28403' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28403' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28414', 'HEALTHCARE PARTNERS MEDICAL GROUP/VALENCIA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28414' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28414' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28414' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28414' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28414' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('12977', 'HERITAGE PROVIDER NETWORK', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '12977' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '12977' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('3804', 'HIGH DESERT MEDICAL GROUP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '3804' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '3804' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '3804' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '3804' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '3804' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '3804' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('19863', 'KOREAN AMERICAN MEDICAL GROUP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '19863' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '19863' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '19863' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '19863' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24664', 'LAKESIDE MEDICAL GROUP CENTRAL - BURBANK/NORTH HOLLYWOOD', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24664' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24664' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24664' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '24664' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24670', 'LAKESIDE MEDICAL GROUP CENTRAL - CENTRAL VALLEY', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24670' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24670' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24670' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '24670' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24662', 'LAKESIDE MEDICAL GROUP CENTRAL - GLENDALE', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24662' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24662' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24662' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '24662' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24671', 'LAKESIDE MEDICAL GROUP CENTRAL - NORTH VALLEY', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24671' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24671' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24671' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '24671' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24677', 'LAKESIDE MEDICAL GROUP CENTRAL - SANTA CLARITA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24677' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24677' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24677' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '24677' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24681', 'LAKESIDE MEDICAL GROUP CENTRAL - VERDUGO HILLS', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24681' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24681' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24681' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '24681' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24674', 'LAKESIDE MEDICAL GROUP EAST - GLENDORA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24674' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24674' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24674' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '24674' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24686', 'LAKESIDE MEDICAL GROUP EAST - SAN GABRIEL VALLEY', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24686' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24686' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24686' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '24686' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24675', 'LAKESIDE MEDICAL GROUP EAST - WEST COVINA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24675' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24675' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24675' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '24675' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24684', 'LAKESIDE MEDICAL GROUP WEST - TARZANA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24684' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24684' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24684' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '24684' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24683', 'LAKESIDE MEDICAL GROUP WEST - WEST HILLS/CANOGA PARK', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24683' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24683' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24683' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '24683' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('5225', 'LAKEWOOD IPA INC', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '5225' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '5225' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '5225' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28445', 'MAGAN MEDICAL CLINIC/HEALTHCARE PARTNERS AFFILIATED PROVIDER NETWORK', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28445' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28445' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28445' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28445' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28445' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27882', 'MONARCH/LONG BEACH', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27882' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '27882' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '27882' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '27882' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('11315', 'NUESTRA FAMILIA MEDICAL GROUP INC', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '11315' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '11315' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14498', 'OMNICARE MEDICAL GROUP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14498' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14498' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '14498' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '14498' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28428', 'PHYSICIANS ASSOCIATES IPA/HEALTHCARE PARTNERS/CITRUS', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28428' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28428' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28428' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28428' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28428' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28437', 'PHYSICIANS ASSOCIATES IPA/HEALTHCARE PARTNERS/GLENDALE', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28437' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28437' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28437' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28437' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28437' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28434', 'PHYSICIANS ASSOCIATES IPA/HEALTHCARE PARTNERS/HUNTINGTON', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28434' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28434' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28434' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28434' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28434' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28451', 'PHYSICIANS ASSOCIATES IPA/HEALTHCARE PARTNERS/METHODIST', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28451' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28451' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28451' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28451' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28451' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28419', 'PHYSICIANS ASSOCIATES IPA/HEALTHCARE PARTNERS/SAN DIMAS', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28419' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28419' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28419' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28419' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28419' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28422', 'PHYSICIANS ASSOCIATES IPA/HEALTHCARE PARTNERS/SAN GABRIEL', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28422' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28422' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28422' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28422' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28422' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('15848', 'PIONEER PROVIDER NETWORK A MEDICAL GROUP INC', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '15848' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '15848' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '15848' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '15848' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('20614', 'PREMIER PHYSICIANS NETWORK/SAN FERNANDO VALLEY', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '20614' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '20614' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '20614' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '20614' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('5169', 'PREMIER PHYSICIANS NETWORK', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '5169' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '5169' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('16209', 'PROSPECT HEALTH SOURCE MEDICAL GROUP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '16209' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '16209' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17615', 'PROSPECT MEDICAL GROUP/VAN NUYS', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17615' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '17615' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14722', 'PROSPECT PROFESSIONAL CARE IPA MEDICAL GROUP INC', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14722' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14722' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '14722' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17270', 'PROSPECT PROFESSIONAL CARE IPA/MONTEBELLO', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17270' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17270' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '17270' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('29091', 'PROVIDENCE CARE NETWORK', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '29091' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '29091' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '29091' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('22732', 'PRUDENT MEDICAL GROUP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '22732' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '22732' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '22732' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '22732' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17556', 'REGAL MEDICAL GROUP BURBANK/GLENDALE', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17556' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17556' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '17556' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '17556' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('19793', 'REGAL MEDICAL GROUP/CADUCEUS', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '19793' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '19793' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '19793' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '19793' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('12410', 'REGAL MEDICAL GROUP/CENTRAL VALLEY REGION', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '12410' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '12410' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '12410' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '12410' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17547', 'REGAL MEDICAL GROUP/DOWNEY', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17547' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17547' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '17547' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '17547' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14163', 'REGAL MEDICAL GROUP/DOWNTOWN LOS ANGELES REGION', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14163' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14163' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '14163' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '14163' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17555', 'REGAL MEDICAL GROUP/EAST SAN GABRIEL', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17555' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17555' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '17555' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '17555' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('23187', 'REGAL MEDICAL GROUP/GLENDALE PHYSICIANS ALLIANCE', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '23187' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '23187' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '23187' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '23187' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17778', 'REGAL MEDICAL GROUP/GREATER COVINA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17778' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17778' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '17778' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '17778' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17552', 'REGAL MEDICAL GROUP/LONG BEACH', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17552' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17552' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '17552' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '17552' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14888', 'REGAL MEDICAL GROUP/SAN GABRIEL REGION', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14888' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14888' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '14888' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '14888' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17551', 'REGAL MEDICAL GROUP/ST. FRANCIS', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17551' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17551' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '17551' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '17551' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17554', 'REGAL MEDICAL GROUP/WEST VALLEY', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17554' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17554' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '17554' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '17554' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17550', 'REGAL MEDICAL GROUP/WHITTIER', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17550' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17550' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '17550' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '17550' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('19881', 'SEOUL MEDICAL GROUP INC', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '19881' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '19881' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '19881' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '19881' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('23025', 'SIERRA IPA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '23025' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '23025' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '23025' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '23025' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '23025' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '23025' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('23023', 'SIERRA MEDICAL GROUP CLINIC', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '23023' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '23023' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '23023' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '23023' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '23023' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '23023' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('29357', 'SIERRA MEDICAL GROUP - SANTA CLARITA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '29357' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '29357' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '29357' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '29357' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '29357' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '29357' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('18753', 'ST. MARY IPA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '18753' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '18753' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '18753' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14697', 'ST. VINCENT MEDICAL GROUP IPA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14697' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14697' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '14697' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '14697' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26488', 'TORRANCE HOSPITAL IPA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '26488' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '26488' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '26488' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '26488' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('16998', 'UCLA MEDICAL GROUP IPA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '16998' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '16998' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('25465', 'UCLA MEDICAL GROUP/SANTA MONICA BAY PHYSICIANS', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '25465' and county = 'Los Angeles'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '25465' and county = 'Los Angeles'));

insert into medical_group (dec_number, name, county, region, state)
    values ('25400', 'ADOC/FOUNTAIN VALLEY DIVISION', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '25400' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '25400' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '25400' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '25400' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('25401', 'ADOC/LOS ALAMITOS DIVISION', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '25401' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '25401' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '25401' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '25401' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('12130', 'AMVI (AMERICAN VIETNAMESE)', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '12130' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '12130' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '12130' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '12130' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28928', 'ALTAMED MEDICAL GROUP', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28928' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28928' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28928' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28928' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('29116', 'ALTAMED ORANGE COUNTY IPA', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '29116' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '29116' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '29116' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '29116' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27362', 'DAEHAN PROSPECT MEDICAL GROUP', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27362' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '27362' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '27362' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '27362' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26621', 'EDINGER MEDICAL GROUP', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '26621' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '26621' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '26621' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('19394', 'FAMILY CHOICE MEDICAL GROUP INC', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '19394' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '19394' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '19394' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '19394' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26603', 'GREATER NEWPORT PHYSICIANS/HOAG HOSPITAL', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '26603' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '26603' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26678', 'GREATER NEWPORT PHYSICIANS/LONG BEACH', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '26678' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '26678' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '26678' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26695', 'GREATER NEWPORT PHYSICIANS/ORANGE COAST', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '26695' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '26695' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '26695' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26693', 'GREATER NEWPORT PHYSICIANS/SADDLEBACK', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '26693' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '26693' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '26693' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28427', 'HEALTHCARE PARTNERS MEDICAL GROUP - TALBERT MEDICAL GROUP/ORANGE COUNTY', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28427' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28427' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28427' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28427' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28427' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27963', 'HOAG AFFILIATED PHYSICIANS', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27963' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '27963' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('25679', 'MEMORIAL CARE MEDICAL GROUP', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '25679' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '25679' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '25679' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('18352', 'MISSION HOSPITAL AFFILIATED PHYSICIANS', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '18352' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '18352' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('25036', 'MISSION HERITAGE MEDICAL GROUP', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '25036' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '25036' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('21963', 'MONARCH HEALTHCARE', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '21963' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('2278', 'MONARCH/SOUTH COAST', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '2278' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '2278' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '2278' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '2278' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('16734', 'MONARCH/ANAHEIM MEMORIAL MEDICAL CENTER', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '16734' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '16734' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '16734' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '16734' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('18634', 'MONARCH/MISSION', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '18634' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '18634' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '18634' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '18634' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('13782', 'MONARCH/ORANGE COAST', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '13782' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '13782' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '13782' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '13782' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14905', 'MONARCH/ORANGE COUNTY', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14905' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14905' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '14905' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '14905' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('4789', 'MONARCH/SADDLEBACK MEMORIAL HOSPITAL', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '4789' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '4789' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '4789' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '4789' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('13944', 'MONARCH/SAN CLEMENTE', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '13944' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '13944' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '13944' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '13944' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('16335', 'NOBLE AMA IPA', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '16335' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '16335' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '16335' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '16335' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14548', 'PROSPECT GATEWAY MEDICAL GROUP IN ASSOCIATION WITH ANAHEIM MEMORIAL', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14548' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14548' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '14548' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '14548' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14904', 'PROSPECT GENESIS HEALTHCARE', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14904' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14904' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '14904' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '14904' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('11276', 'PROSPECT MEDICAL GROUP/CENTRAL', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '11276' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '11276' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17597', 'PROSPECT MEDICAL GROUP/HUNTINGTON BEACH', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17597' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17597' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '17597' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '17597' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '17597' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('3948', 'PROSPECT MEDICAL GROUP/NORTH', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '3948' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '3948' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('8631', 'PROSPECT NORTHWEST ORANGE COUNTY MEDICAL GROUP', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '8631' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '8631' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '8631' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '8631' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('11567', 'PROSPECT NORTHWEST ORANGE COUNTY MEDICAL GROUP/ANAHEIM DIVISION', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '11567' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '11567' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '11567' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '11567' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('18831', 'REGAL MEDICAL GROUP ORANGE COUNTY', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '18831' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '18831' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '18831' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '18831' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('18346', 'ST. JOSEPH HERITAGE MEDICAL GROUP', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '18346' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '18346' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('18347', 'ST. JOSEPH HOSPITAL AFFILIATED PHYSICIANS', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '18347' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '18347' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('18344', 'ST. JUDE AFFILIATED PHYSICIANS', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '18344' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '18344' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('18342', 'ST. JUDE HERITAGE MEDICAL GROUP', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '18342' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '18342' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('29550', 'SEOUL MEDICAL GROUP ORANGE COUNTY', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '29550' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '29550' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '29550' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '29550' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28603', 'UC IRVINE HEALTH AFFILIATED PHYSICIANS', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28603' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '28603' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28569', 'UC IRVINE HEALTH MEDICAL GROUP', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28569' and county = 'Orange'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '28569' and county = 'Orange'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27825', 'BEAVER MEDICAL GROUP', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27825' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '27825' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '27825' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '27825' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '27825' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '27825' and county = 'Riverside'));

insert into medical_group (dec_number, name, county, region, state)
    values ('21796', 'DESERT OASIS HEALTHCARE', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '21796' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '21796' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '21796' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '21796' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '21796' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '21796' and county = 'Riverside'));

insert into medical_group (dec_number, name, county, region, state)
    values ('18657', 'EMPIRE PHYSICIANS MEDICAL GROUP INC', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '18657' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '18657' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '18657' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '18657' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '18657' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '18657' and county = 'Riverside'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14899', 'FAMILY SENIORS MEDICAL GROUP', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14899' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '14899' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '14899' and county = 'Riverside'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14586', 'HEMET COMMUNITY MEDICAL GROUP', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14586' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14586' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '14586' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '14586' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '14586' and county = 'Riverside'));

insert into medical_group (dec_number, name, county, region, state)
    values ('15031', 'MENIFEE VALLEY COMMUNITY MEDICAL GROUP', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '15031' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '15031' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '15031' and county = 'Riverside'));

insert into medical_group (dec_number, name, county, region, state)
    values ('21243', 'PRIMECARE CITRUS VALLEY', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '21243' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '21243' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '21243' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '21243' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '21243' and county = 'Riverside'));

insert into medical_group (dec_number, name, county, region, state)
    values ('5232', 'PRIMECARE OF CORONA', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '5232' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '5232' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '5232' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '5232' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '5232' and county = 'Riverside'));

insert into medical_group (dec_number, name, county, region, state)
    values ('9023', 'PRIMECARE OF HEMET VALLEY', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '9023' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '9023' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '9023' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '9023' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '9023' and county = 'Riverside'));

insert into medical_group (dec_number, name, county, region, state)
    values ('3111', 'PRIMECARE OF MORENO VALLEY', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '3111' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '3111' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '3111' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '3111' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '3111' and county = 'Riverside'));

insert into medical_group (dec_number, name, county, region, state)
    values ('8331', 'PRIMECARE OF RIVERSIDE', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '8331' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '8331' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '8331' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '8331' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '8331' and county = 'Riverside'));

insert into medical_group (dec_number, name, county, region, state)
    values ('4140', 'PRIMECARE OF SUN CITY', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '4140' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '4140' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '4140' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '4140' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '4140' and county = 'Riverside'));

insert into medical_group (dec_number, name, county, region, state)
    values ('6657', 'PRIMECARE OF TEMECULA', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '6657' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '6657' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '6657' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '6657' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '6657' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '6657' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '6657' and county = 'Riverside'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17807', 'PROSPECT MEDICAL GROUP/CORONA', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17807' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17807' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '17807' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '17807' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '17807' and county = 'Riverside'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27828', 'REDLANDS-YUCAIPA MEDICAL GROUP INC', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27828' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '27828' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '27828' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '27828' and county = 'Riverside'));

insert into medical_group (dec_number, name, county, region, state)
    values ('21553', 'REGAL MEDICAL GROUP/RIVERSIDE', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '21553' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '21553' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '21553' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '21553' and county = 'Riverside'));

insert into medical_group (dec_number, name, county, region, state)
    values ('20950', 'REGAL MEDICAL GROUP/TEMECULA', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '20950' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '20950' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '20950' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '20950' and county = 'Riverside'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14897', 'RIVERSIDE MEDICAL CLINIC INC', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14897' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14897' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '14897' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '14897' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '14897' and county = 'Riverside'));

insert into medical_group (dec_number, name, county, region, state)
    values ('5171', 'RIVERSIDE PHYSICIAN NETWORK', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '5171' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '5171' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '5171' and county = 'Riverside'));

insert into medical_group (dec_number, name, county, region, state)
    values ('21941', 'TEMECULA VALLEY PHYSICIANS MEDICAL GROUP', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '21941' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '21941' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '21941' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '21941' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '21941' and county = 'Riverside'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26432', 'TRI-VALLEY MEDICAL GROUP', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '26432' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '26432' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '26432' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '26432' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '26432' and county = 'Riverside'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26405', 'VALLEY PHYSICIANS NETWORK INC', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '26405' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '26405' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '26405' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '26405' and county = 'Riverside'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '26405' and county = 'Riverside'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24628', 'ALLIANCE DESERT PHYSICIANS', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24628' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24628' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24628' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '24628' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '24628' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27825', 'BEAVER MEDICAL GROUP', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27825' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '27825' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '27825' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '27825' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '27825' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '27825' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '27825' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27892', 'CHAFFEY MEDICAL GROUP', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27892' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '27892' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '27892' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '27892' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('4800', 'CHOICE MEDICAL GROUP', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '4800' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '4800' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '4800' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '4800' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '4800' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('21837', 'CHOICE MEDICAL GROUP/BARSTOW', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '21837' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '21837' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '21837' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '21837' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '21837' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('21796', 'DESERT OASIS HEALTHCARE', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '21796' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '21796' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '21796' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '21796' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '21796' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '21796' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27411', 'DESERT VALLEY MEDICAL GROUP', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27411' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '27411' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '27411' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '27411' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28433', 'DIGNITY HEALTH MEDICAL GROUP', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28433' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28433' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('1011', 'FAMILY PRACTICE MEDICAL GROUP OF SAN BERNARDINO', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '1011' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '1011' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '1011' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '1011' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24679', 'LAKESIDE MEDICAL GROUP EAST/POMONA', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24679' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24679' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24679' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '24679' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('4470', 'LOMA LINDA UNIVERSITY HEALTH CARE', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '4470' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '4470' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '4470' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('2517', 'MY FAMILY MEDICAL GROUP', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '2517' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '2517' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '2517' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27850', 'PINNACLE MEDICAL GROUP', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27850' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '27850' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '27850' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '27850' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '27850' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27648', 'PREMIER HEALTHCARE IPA', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27648' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '27648' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '27648' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('4661', 'PRIMECARE MEDICAL GROUP OF CHINO VALLEY', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '4661' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '4661' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '4661' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '4661' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '4661' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('19383', 'PRIMECARE MEDICAL GROUP OF SAN BERNARDINO', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '19383' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '19383' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '19383' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '19383' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '19383' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '19383' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '19383' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('6045', 'PRIMECARE OF INLAND VALLEY', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '6045' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '6045' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '6045' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '6045' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '6045' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '6045' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '6045' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('1026', 'PRIMECARE OF REDLANDS', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '1026' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '1026' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '1026' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '1026' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '1026' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '1026' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '1026' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('3447', 'PROMED HEALTH NETWORK OF POMONA VALLEY', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '3447' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '3447' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '3447' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27828', 'REDLANDS-YUCAIPA MEDICAL GROUP INC', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27828' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '27828' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '27828' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '27828' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '27828' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('20670', 'REGAL MEDICAL GROUP APSI', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '20670' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '20670' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '20670' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '20670' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17553', 'REGAL MEDICAL GROUP CHINO VALLEY', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17553' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17553' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '17553' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '17553' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('20668', 'REGAL MEDICAL GROUP SAN BERNARDINO', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '20668' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '20668' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '20668' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '20668' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('19198', 'SAN BERNARDINO MEDICAL GROUP INC', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '19198' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '19198' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '19198' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('29357', 'SIERRA MEDICAL GROUP - SANTA CLARITA', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '29357' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '29357' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '29357' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '29357' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '29357' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '29357' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27647', 'ST. MARY HIGH DESERT MEDICAL GROUP', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27647' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '27647' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '27647' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '27647' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '27647' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14782', 'UNITED FAMILY CARE OF FONTANA', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14782' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '14782' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14780', 'UNITED FAMILY CARE OF RIALTO', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14780' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '14780' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14783', 'UNITED FAMILY CARE OF SAN BERNARDINO', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14783' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '14783' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17771', 'UPLAND MEDICAL GROUP', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17771' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '17771' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '17771' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('13417', 'VVIPA MEDICAL GROUP', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '13417' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '13417' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '13417' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '13417' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '13417' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '13417' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28857', 'VVIPA MEDICAL GROUP', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28857' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28857' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '28857' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28857' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28857' and county = 'San Bernardino'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '28857' and county = 'San Bernardino'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17812', 'BORREGO SPRINGS DCN PCPS', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17812' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '17812' and county = 'San Diego'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14748', 'CASSIDY MEDICAL GROUP/PCAMG', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14748' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14748' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '14748' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '14748' and county = 'San Diego'));

insert into medical_group (dec_number, name, county, region, state)
    values ('16390', 'ENCOMPASS MEDICAL GROUP INC', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '16390' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '16390' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '16390' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '16390' and county = 'San Diego'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14889', 'GREATER TRI-CITIES IPA MEDICAL GROUP INC', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14889' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14889' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '14889' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '14889' and county = 'San Diego'));

insert into medical_group (dec_number, name, county, region, state)
    values ('4164', 'IMPERIAL COUNTY PHYSICIANS MEDICAL GROUP', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '4164' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '4164' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '4164' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '4164' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '4164' and county = 'San Diego'));

insert into medical_group (dec_number, name, county, region, state)
    values ('4602', 'MERCY PHYSICIANS MEDICAL GROUP', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '4602' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '4602' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '4602' and county = 'San Diego'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24783', 'MIDCOUNTY PHYSICIANS MEDICAL GROUP', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24783' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24783' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '24783' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '24783' and county = 'San Diego'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26282', 'MPMG/SCRIPPS CARE AFFILIATE', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '26282' and county = 'San Diego'));

insert into medical_group (dec_number, name, county, region, state)
    values ('7932', 'MULTICULTURAL PRIMARY CARE MEDICAL GROUP INC (MPCMG)', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '7932' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '7932' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '7932' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '7932' and county = 'San Diego'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26443', 'PCAMG - SCRIPPS CARE AFFILIATE', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '26443' and county = 'San Diego'));

insert into medical_group (dec_number, name, county, region, state)
    values ('6039', 'PRIMARY CARE ASSOCIATED MEDICAL GROUP', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '6039' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '6039' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '6039' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '6039' and county = 'San Diego'));

insert into medical_group (dec_number, name, county, region, state)
    values ('16223', 'PRIMARY CARE ASSOCIATED MEDICAL GROUP/ENCINITAS', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '16223' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '16223' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '16223' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '16223' and county = 'San Diego'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28561', '"RADY CHILDREN""S HEALTH NETWORK"', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28561' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28561' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28561' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28561' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28561' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '28561' and county = 'San Diego'));

insert into medical_group (dec_number, name, county, region, state)
    values ('28360', 'SCMG ARCH HEALTH PARTNERS', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '28360' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '28360' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '28360' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '28360' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '28360' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '28360' and county = 'San Diego'));

insert into medical_group (dec_number, name, county, region, state)
    values ('3682', 'SCRIPPS CLINIC', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '3682' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '3682' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '3682' and county = 'San Diego'));

insert into medical_group (dec_number, name, county, region, state)
    values ('23659', 'SCRIPPS COASTAL MC', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '23659' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '23659' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '23659' and county = 'San Diego'));

insert into medical_group (dec_number, name, county, region, state)
    values ('5375', 'SCRIPPS PHYSICIANS MEDICAL GROUP', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '5375' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '5375' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '5375' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '5375' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '5375' and county = 'San Diego'));

insert into medical_group (dec_number, name, county, region, state)
    values ('4395', 'SHARP COMMUNITY MEDICAL GROUP', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '4395' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '4395' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '4395' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '4395' and county = 'San Diego'));

insert into medical_group (dec_number, name, county, region, state)
    values ('6129', 'SHARP COMMUNITY MEDICAL GROUP/CHULA VISTA', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '6129' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '6129' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '6129' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '6129' and county = 'San Diego'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14128', 'SHARP COMMUNITY MEDICAL GROUP/CORONADO', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14128' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14128' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '14128' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '14128' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '14128' and county = 'San Diego'));

insert into medical_group (dec_number, name, county, region, state)
    values ('15882', 'SHARP COMMUNITY MEDICAL GROUP/GRAYBILL', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '15882' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '15882' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '15882' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '15882' and county = 'San Diego'));

insert into medical_group (dec_number, name, county, region, state)
    values ('25448', 'SHARP COMMUNITY MEDICAL GROUP/GRAYBILL NORTH COASTAL', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '25448' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '25448' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '25448' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '25448' and county = 'San Diego'));

insert into medical_group (dec_number, name, county, region, state)
    values ('6130', 'SHARP COMMUNITY MEDICAL GROUP/GROSSMONT', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '6130' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '6130' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '6130' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '6130' and county = 'San Diego'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14174', 'SHARP COMMUNITY MEDICAL GROUP/INLAND NORTH', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14174' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14174' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '14174' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '14174' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '14174' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '14174' and county = 'San Diego'));

insert into medical_group (dec_number, name, county, region, state)
    values ('1035', 'SHARP REES-STEALY MEDICAL GROUP INC', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '1035' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '1035' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '1035' and county = 'San Diego'));

insert into medical_group (dec_number, name, county, region, state)
    values ('4589', 'UCSD MEDICAL GROUP', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '4589' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '4589' and county = 'San Diego'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '4589' and county = 'San Diego'));

insert into medical_group (dec_number, name, county, region, state)
    values ('25517', 'ACCESS SANTA MONICA INDEPENDENT PHYSICIANS ASSOCIATION INC', 'Ventura', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '25517' and county = 'Ventura'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '25517' and county = 'Ventura'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '25517' and county = 'Ventura'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '25517' and county = 'Ventura'));

insert into medical_group (dec_number, name, county, region, state)
    values ('25614', 'FACEY MEDICAL FOUNDATION/SIMI VALLEY', 'Ventura', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '25614' and county = 'Ventura'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '25614' and county = 'Ventura'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '25614' and county = 'Ventura'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '25614' and county = 'Ventura'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24672', 'LAKESIDE MEDICAL GROUP WEST/AGOURA HILLS', 'Ventura', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24672' and county = 'Ventura'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24672' and county = 'Ventura'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24672' and county = 'Ventura'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '24672' and county = 'Ventura'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24682', 'LAKESIDE MEDICAL GROUP WEST/SIMI VALLEY', 'Ventura', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24682' and county = 'Ventura'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24682' and county = 'Ventura'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24682' and county = 'Ventura'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '24682' and county = 'Ventura'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24678', 'LAKESIDE MEDICAL GROUP WEST/THOUSAND OAKS', 'Ventura', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24678' and county = 'Ventura'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '24678' and county = 'Ventura'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24678' and county = 'Ventura'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '24678' and county = 'Ventura'));

insert into medical_group (dec_number, name, county, region, state)
    values ('21557', 'REGAL MEDICAL GROUP/VENTURA COUNTY', 'Ventura', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '21557' and county = 'Ventura'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '21557' and county = 'Ventura'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '21557' and county = 'Ventura'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '21557' and county = 'Ventura'));

insert into medical_group (dec_number, name, county, region, state)
    values ('5141', 'SEAVIEW IPA', 'Ventura', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '5141' and county = 'Ventura'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 2'),
        (select medical_group_id from medical_group where dec_number = '5141' and county = 'Ventura'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 3'),
        (select medical_group_id from medical_group where dec_number = '5141' and county = 'Ventura'));

insert into medical_group (dec_number, name, county, region, state)
    values ('29573', 'VALLEY CARE IPA', 'Ventura', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '29573' and county = 'Ventura'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '29573' and county = 'Ventura'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '29573' and county = 'Ventura'));

insert into medical_group (dec_number, name, county, region, state)
    values ('29572', 'VALLEY CARE SELECT IPA/WEST COUNTY', 'Ventura', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '29572' and county = 'Ventura'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '29572' and county = 'Ventura'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '29572' and county = 'Ventura'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Flex Network 1'),
        (select medical_group_id from medical_group where dec_number = '29572' and county = 'Ventura'));

insert into medical_group (dec_number, name, county, region, state)
    values ('12140', 'PALO ALTO MEDICAL FOUNDATION (FREEMONT AREA ONLY)', 'Alameda', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '12140' and county = 'Alameda'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '12140' and county = 'Alameda'));

insert into medical_group (dec_number, name, county, region, state)
    values ('18580', 'ALLCARE IPA', 'Merced', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '18580' and county = 'Merced'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '18580' and county = 'Merced'));

insert into medical_group (dec_number, name, county, region, state)
    values ('23856', 'PALO ALTO MEDICAL FOUNDATION CAMINO', 'San Mateo', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '23856' and county = 'San Mateo'));

insert into medical_group (dec_number, name, county, region, state)
    values ('14349', 'SANTA BARBARA SELECT IPA', 'Santa Barbara', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '14349' and county = 'Santa Barbara'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '14349' and county = 'Santa Barbara'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '14349' and county = 'Santa Barbara'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27173', 'AFFINITY MEDICAL GROUP PALO ALTO', 'Santa Clara', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27173' and county = 'Santa Clara'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '27173' and county = 'Santa Clara'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26657', 'VERITY MEDICAL FOUNDATION', 'Santa Clara', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '26657' and county = 'Santa Clara'));

insert into medical_group (dec_number, name, county, region, state)
    values ('27176', 'AFFINITY MEDICAL GROUP SAN JOSE', 'Santa Clara', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '27176' and county = 'Santa Clara'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '27176' and county = 'Santa Clara'));

insert into medical_group (dec_number, name, county, region, state)
    values ('12140', 'PALO ALTO MEDICAL FOUNDATION', 'Santa Clara', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '12140' and county = 'Santa Clara'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '12140' and county = 'Santa Clara'));

insert into medical_group (dec_number, name, county, region, state)
    values ('23856', 'PALO ALTO MEDICAL FOUNDATION CAMINO', 'Santa Clara', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '23856' and county = 'Santa Clara'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '23856' and county = 'Santa Clara'));

insert into medical_group (dec_number, name, county, region, state)
    values ('4197', 'PHYSICIANS MEDICAL GROUP OF SAN JOSE', 'Santa Clara', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '4197' and county = 'Santa Clara'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '4197' and county = 'Santa Clara'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '4197' and county = 'Santa Clara'));

insert into medical_group (dec_number, name, county, region, state)
    values ('4247', 'SAN JOSE MEDICAL GROUP', 'Santa Clara', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '4247' and county = 'Santa Clara'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '4247' and county = 'Santa Clara'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26688', 'DCHS MEDICAL FOUNDATION (FORMERLY SAN JOSE MEDICAL GROUP)', 'Santa Clara', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '26688' and county = 'Santa Clara'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '26688' and county = 'Santa Clara'));

insert into medical_group (dec_number, name, county, region, state)
    values ('10426', 'SANTA CLARA COUNTY IPA', 'Santa Clara', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '10426' and county = 'Santa Clara'));

insert into medical_group (dec_number, name, county, region, state)
    values ('23859', 'PALO ALTO MEDICAL FOUNDATION SANTA CRUZ', 'Santa Cruz', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '23859' and county = 'Santa Cruz'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '23859' and county = 'Santa Cruz'));

insert into medical_group (dec_number, name, county, region, state)
    values ('5181', 'PHYSICIANS MEDICAL GROUP OF SANTA CRUZ COUNTY', 'Santa Cruz', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '5181' and county = 'Santa Cruz'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '5181' and county = 'Santa Cruz'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '5181' and county = 'Santa Cruz'));

insert into medical_group (dec_number, name, county, region, state)
    values ('5157', 'HILL PHYSICIANS SOLANO', 'Solano', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '5157' and county = 'Solano'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24365', 'SUTTER MEDICAL GROUP SOLANO (FORMERLY SOLANO REGIONAL MEDICAL GROUP)', 'Solano', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24365' and county = 'Solano'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24365' and county = 'Solano'));

insert into medical_group (dec_number, name, county, region, state)
    values ('12120', 'MERITAGE MEDICAL GROUP (FORMERLY MARIN SONOMA IPA)', 'Sonoma', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '12120' and county = 'Sonoma'));

insert into medical_group (dec_number, name, county, region, state)
    values ('21782', 'NORTHERN CALIFORNIA MEDICAL ASSOCIATES', 'Sonoma', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '21782' and county = 'Sonoma'));

insert into medical_group (dec_number, name, county, region, state)
    values ('15014', 'SONOMA COUNTY PRIMARY CARE IPA', 'Sonoma', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '15014' and county = 'Sonoma'));

insert into medical_group (dec_number, name, county, region, state)
    values ('17202', 'SONOMA DCN', 'Sonoma', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '17202' and county = 'Sonoma'));

insert into medical_group (dec_number, name, county, region, state)
    values ('18346', 'ST. JOSEPH HERITAGE MEDICAL GROUP', 'Sonoma', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '18346' and county = 'Sonoma'));

insert into medical_group (dec_number, name, county, region, state)
    values ('24624', 'SUTTER MEDICAL GROUP OF THE REDWOODS', 'Sonoma', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '24624' and county = 'Sonoma'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '24624' and county = 'Sonoma'));

insert into medical_group (dec_number, name, county, region, state)
    values ('18580', 'ALLCARE IPA', 'Stanislaus', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '18580' and county = 'Stanislaus'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '18580' and county = 'Stanislaus'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '18580' and county = 'Stanislaus'));

insert into medical_group (dec_number, name, county, region, state)
    values ('29354', 'CENTRAL VALLEY MEDICAL GROUP', 'Stanislaus', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '29354' and county = 'Stanislaus'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '29354' and county = 'Stanislaus'));

insert into medical_group (dec_number, name, county, region, state)
    values ('29350', 'SUTTER GOULD MEDICAL FOUNDATION', 'Stanislaus', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '29350' and county = 'Stanislaus'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '29350' and county = 'Stanislaus'));

insert into medical_group (dec_number, name, county, region, state)
    values ('29358', 'SUTTER GOULD MEDICAL FOUNDATION TURLOCK', 'Stanislaus', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '29358' and county = 'Stanislaus'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '29358' and county = 'Stanislaus'));

insert into medical_group (dec_number, name, county, region, state)
    values ('16366', 'DINUBA DCN PCPS', 'Tulare', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '16366' and county = 'Tulare'));

insert into medical_group (dec_number, name, county, region, state)
    values ('22048', 'DINUBA MEDICAL CLINIC', 'Tulare', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '22048' and county = 'Tulare'));

insert into medical_group (dec_number, name, county, region, state)
    values ('23600', 'FAMILY HEALTHCARE NETWORK', 'Tulare', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '23600' and county = 'Tulare'));

insert into medical_group (dec_number, name, county, region, state)
    values ('25971', 'KAWEAH DELTA EXETER RHC', 'Tulare', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '25971' and county = 'Tulare'));

insert into medical_group (dec_number, name, county, region, state)
    values ('16085', 'PORTERVILLE DCN PCPS', 'Tulare', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '16085' and county = 'Tulare'));

insert into medical_group (dec_number, name, county, region, state)
    values ('22055', 'SAN JOAQUIN PRIMECARE MEDICAL', 'Tulare', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '22055' and county = 'Tulare'));

insert into medical_group (dec_number, name, county, region, state)
    values ('26667', 'TULARE COMMUNITY CLINIC RHC', 'Tulare', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '26667' and county = 'Tulare'));

insert into medical_group (dec_number, name, county, region, state)
    values ('16301', 'TULARE DCN SPECS', 'Tulare', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '16301' and county = 'Tulare'));

insert into medical_group (dec_number, name, county, region, state)
    values ('18392', 'VINAY K BUTTAN INC', 'Tulare', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '18392' and county = 'Tulare'));

insert into medical_group (dec_number, name, county, region, state)
    values ('18388', 'VISALIA FAMILY PRACTICE', 'Tulare', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '18388' and county = 'Tulare'));

insert into medical_group (dec_number, name, county, region, state)
    values ('18406', 'VISALIA MEDICAL CLINIC PCPS', 'Tulare', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '18406' and county = 'Tulare'));

insert into medical_group (dec_number, name, county, region, state)
    values ('9695', 'SUTTER MEDICAL GROUP YOLO (FORMERLY SUTTER WEST MEDICAL GROUP)', 'Yolo', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '9695' and county = 'Yolo'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Alliance'),
        (select medical_group_id from medical_group where dec_number = '9695' and county = 'Yolo'));

insert into medical_group (dec_number, name, county, region, state)
    values ('5258', 'WOODLAND CLINIC MEDICAL GROUP', 'Yolo', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Signature'),
        (select medical_group_id from medical_group where dec_number = '5258' and county = 'Yolo'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Advantage'),
        (select medical_group_id from medical_group where dec_number = '5258' and county = 'Yolo'));
insert into network_medical_group (network_id, medical_group_id)
    values ((select network_id from network where name = 'Focus'),
        (select medical_group_id from medical_group where dec_number = '5258' and county = 'Yolo'));
