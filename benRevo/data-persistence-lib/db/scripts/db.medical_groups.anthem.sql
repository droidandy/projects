insert into medical_group (dec_number, name, county, region, state) values ('0XX', 'AFFINITY MED GRP-EDEN/SAN LEANDRO REGION', 'Alameda', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0XX' and county='Alameda'));

insert into medical_group (dec_number, name, county, region, state) values ('0XW', 'AFFINITY MEDICAL GROUP-ALAMEDA REGION', 'Alameda', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0XW' and county='Alameda'));

insert into medical_group (dec_number, name, county, region, state) values ('0XQ', 'AFFINITY MEDICAL GROUP-BAY VALLEY REGION', 'Alameda', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0XQ' and county='Alameda'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0XQ' and county='Alameda'));

insert into medical_group (dec_number, name, county, region, state) values ('0PG', 'ALTA BATES MEDICAL GROUP', 'Alameda', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0PG' and county='Alameda'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0PG' and county='Alameda'));

insert into medical_group (dec_number, name, county, region, state) values ('0PB', 'HILL PHYSICIANS MEDICAL GROUP', 'Alameda', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0PB' and county='Alameda'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0PB' and county='Alameda'));

insert into medical_group (dec_number, name, county, region, state) values ('7AC', 'SELECT NETWORK/ALAMEDA', 'Alameda', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '7AC' and county='Alameda'));

insert into medical_group (dec_number, name, county, region, state) values ('0VA', 'SUTTER EAST BAY MEDICAL FOUNDATION', 'Alameda', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0VA' and county='Alameda'));

insert into medical_group (dec_number, name, county, region, state) values ('0XU', 'BUTTE COUNTY NETWORK', 'Butte', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0XU' and county='Butte'));

insert into medical_group (dec_number, name, county, region, state) values ('0XS', 'AFFINITY MEDICAL GROUP-ROSSMOOR REGION', 'Contra Costa', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0XS' and county='Contra Costa'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0XS' and county='Contra Costa'));

insert into medical_group (dec_number, name, county, region, state) values ('0XY', 'AFFINITY MEDICAL GROUP-WEST COUNTY REGION', 'Contra Costa', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0XY' and county='Contra Costa'));

insert into medical_group (dec_number, name, county, region, state) values ('0JM', 'JOHN MUIR PHYSICIAN NETWORK', 'Contra Costa', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0JM' and county='Contra Costa'));

insert into medical_group (dec_number, name, county, region, state) values ('1CG', 'SEBMF-DIABLO DIVISION Contra', 'Contra Costa', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '1CG' and county='Contra Costa'));

insert into medical_group (dec_number, name, county, region, state) values ('7AH', 'SELECT NETWORK/CONTRA COSTA', 'Costa', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '7AH' and county='Costa'));

insert into medical_group (dec_number, name, county, region, state) values ('0KQ', 'SANTE COMMUNITY PHYSICIANS', 'Fresno', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0KQ' and county='Fresno'));

insert into medical_group (dec_number, name, county, region, state) values ('7AA', 'SELECT NETWORK/FRESNO', 'Fresno', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '7AA' and county='Fresno'));

insert into medical_group (dec_number, name, county, region, state) values ('0KR', 'HUMBOLDT IPA', 'Humboldt', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0KR' and county='Humboldt'));

insert into medical_group (dec_number, name, county, region, state) values ('Z5R', 'IMPERIAL COUNTY PHYSICIANS MEDICAL GROUP INC', 'Imperial', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'Z5R' and county='Imperial'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = 'Z5R' and county='Imperial'));

insert into medical_group (dec_number, name, county, region, state) values ('0EY', 'BAKERSFIELD FAMILY MEDICAL CENTER', 'Kern', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0EY' and county='Kern'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0EY' and county='Kern'));

insert into medical_group (dec_number, name, county, region, state) values ('XJD', 'DELANO MEDICAL GROUP', 'Kern', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'XJD' and county='Kern'));

insert into medical_group (dec_number, name, county, region, state) values ('XJE', 'GEMCARE MEDICAL GROUP', 'Kern', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'XJE' and county='Kern'));

insert into medical_group (dec_number, name, county, region, state) values ('Z0Z', 'HISPANIC PHYSICIANS IPA', 'Kern', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'Z0Z' and county='Kern'));

insert into medical_group (dec_number, name, county, region, state) values ('0JH', 'INDEPENDENCE MEDICAL GROUP', 'Kern', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0JH' and county='Kern'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0JH' and county='Kern'));

insert into medical_group (dec_number, name, county, region, state) values ('7AK', 'SELECT NETWORK/KINGS', 'Kings', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '7AK' and county='Kings'));

insert into medical_group (dec_number, name, county, region, state) values ('0MH', 'ACCOUNTABLE HEALTH CARE IPA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0MH' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0MH' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0MH' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0MT', 'ALAMITOS IPA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0MT' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0MT' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0CK', 'ALL CARE MEDICAL GROUP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0CK' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0CK' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0CK' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0HZ', 'ALLIED HEALTHCARE PROVIDERS INC', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0HZ' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0HZ' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0HZ' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0HL', 'ALLIED PHYSICIANS OF CALIFORNIA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0HL' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0HL' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0HL' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0BG', 'ALTAMED MEDICAL GROUP- PICO RIVERA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0BG' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0BG' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0BG' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0XG', 'ANGELES IPA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0XG' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0XG' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0XG' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0RH', 'APPLECARE MEDICAL GROUP-DOWNEY REGION', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0RH' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0RH' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0RH' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0SI', 'APPLECARE MEDICAL GROUP-ST.FRANCIS REGION', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0SI' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0SI' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0SI' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0Q1', 'AXMINSTER MEDICAL GROUP-SLAUSON', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0Q1' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0Q1' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('7SI', 'BROOKSHIRE IPA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '7SI' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '7SI' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '7SI' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0PN', 'CEDARS-SINAI HEALTH ASSOCIATES', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0PN' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Vivity Network'), (select medical_group_id from medical_group where dec_number = '0PN' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0UR', 'CEDARS-SINAI MEDICAL GROUP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0UR' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Vivity Network'), (select medical_group_id from medical_group where dec_number = '0UR' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0TS', 'CENTINELA VALLEY IPA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0TS' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0TS' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0TS' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0RB', 'CITRUS VALLEY PHYSICIANS GROUP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0RB' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0RB' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0RB' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0T7', 'COMMUNITY MEDICAL GROUP OF THE WEST VALLEY/CANOGA PARK/WEST HILLS', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0T7' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0T7' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0ZM', 'COMMUNITY MEDICAL GROUP-IPA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0ZM' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0ZM' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('7MD', 'CROWN CITY MEDICAL GROUP IPA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '7MD' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '7MD' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '7MD' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('W8R', 'CSMG-MDR', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Vivity Network'), (select medical_group_id from medical_group where dec_number = 'W8R' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0AH', 'DIAMOND BAR MEDICAL GROUP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0AH' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0AH' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0AH' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0HA', 'EASTLAND MEDICAL GROUP INC', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0HA' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0HA' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0UM', 'EMPLOYEE HEALTH SYSTEM MEDICAL GROUP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0UM' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0UM' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0UM' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0N0', 'FACEY MEDICAL FOUNDATION AT MISSION HILLS', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0N0' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0N0' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0GE', 'FAMILY CARE SPECIALISTS', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0GE' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0GE' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0GE' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0CS', 'GOOD SAMARITAN MEDICAL PRACTICE ASSOCIATION', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0CS' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0CS' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Vivity Network'), (select medical_group_id from medical_group where dec_number = '0CS' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('2RQ', 'GREATER NEWPORT PHYSICIAN/LONG BEACH MEMORIAL', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '2RQ' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '2RQ' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Vivity Network'), (select medical_group_id from medical_group where dec_number = '2RQ' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0DF', 'HEALTHCARE PARTNERS IPA-NORTHRIDGE MED GRP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0DF' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0DF' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Vivity Network'), (select medical_group_id from medical_group where dec_number = '0DF' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('7KJ', 'HEALTHCARE PARTNERS MEDICAL GROUP-EAST', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '7KJ' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '7KJ' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0T2', 'HEALTHCARE PARTNERS MEDICAL GROUP-MEMBER SER', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0T2' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0T2' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0P0', 'HEALTHCARE PARTNERS MEDICAL GROUP-WILLOW', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0P0' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0P0' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0EZ', 'HIGH DESERT MEDICAL GROUP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0EZ' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0EZ' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0BJ', 'HISPANIC PHYSICIAN IPA LA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0BJ' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0BJ' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0BJ' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0GM', 'KOREAN AMERICAN MEDICAL GROUP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0GM' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0GM' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0GM' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Vivity Network'), (select medical_group_id from medical_group where dec_number = '0GM' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0DR', 'LAKESIDE CENTRAL VALLEY', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0DR' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0DR' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0SY', 'LAKESIDE GLENDALE', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0SY' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0SY' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0CJ', 'LAKESIDE MEDICAL-BURBANK/NORTHHOLLYWOOD', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0CJ' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0CJ' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('1CP', 'LAKESIDE NORTH VALLEY', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '1CP' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '1CP' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0HQ', 'LAKESIDE SANTA CLARITA VALLEY', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0HQ' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0HQ' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0YW', 'LAKESIDE VERDUGO HILLS', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0YW' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0YW' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0MR', 'LAKEWOOD IPA INC', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0MR' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0MR' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0MR' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('YMW', 'MAVERICK MEDICAL GROUP INC', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'YMW' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('69U', 'PHYS ASSOC OF THE GREATER SAN GABRIEL VALLEY', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '69U' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '69U' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0AF', 'PIH HEALTH PHYSICIANS-GROUP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0AF' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Vivity Network'), (select medical_group_id from medical_group where dec_number = '0AF' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0XM', 'PIH HEALTH PHYSICIANS-IPA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0XM' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Vivity Network'), (select medical_group_id from medical_group where dec_number = '0XM' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0LK', 'PIONEER PROVIDER NETWORK-LONG BEACH', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0LK' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0LK' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0LK' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0SE', 'POMONA VALLEY MEDICAL GROUP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0SE' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0NF', 'PREMIER PHYSICIAN NETWORK/VALLEY DIVISION', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0NF' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0NF' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0NF' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0MP', 'PROSPECT HEALTH SOURCE MEDICAL GROUP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0MP' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0JS', 'PROSPECT PROFESSIONAL CARE MEDICAL GROUP INC', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0JS' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0JS' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('1AB', 'PRUDENT MEDICAL GROUP INC', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '1AB' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '1AB' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '1AB' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0YC', 'REGAL MEDICAL GROUP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0YC' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0YC' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0YP', 'REGAL-GLENDALE PHYSICIANS ALLIANCE INC', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0YP' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0YP' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0U1', 'SEASIDE HEALTH PLAN', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0U1' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0U1' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0U1' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('7AF', 'SELECT NETWORK/LOS ANGELES', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '7AF' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0YA', 'SEOUL MEDICAL GROUP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0YA' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0YA' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0YA' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('ACG', 'SIERRA MEDICAL GROUP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'ACG' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = 'ACG' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0YK', 'ST. MARY IPA', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0YK' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0JI', 'ST. VINCENT IPA MEDICAL CORPORATION', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0JI' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0JI' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0EG', 'TORRANCE HOSPITAL IPA MEDICAL', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0EG' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0EG' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Vivity Network'), (select medical_group_id from medical_group where dec_number = '0EG' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('7BK', 'UCLA MED GRP-SANTA MONICA BAY PHYSICIANS', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '7BK' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Vivity Network'), (select medical_group_id from medical_group where dec_number = '7BK' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0FQ', 'UCLA MEDICAL GROUP', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0FQ' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Vivity Network'), (select medical_group_id from medical_group where dec_number = '0FQ' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('YS8', 'VIVITY HUNTINGTON/HCP NETWORK', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Vivity Network'), (select medical_group_id from medical_group where dec_number = 'YS8' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('0T4', 'WEST COVINA MEDICAL CLINIC', 'Los Angeles', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0T4' and county='Los Angeles'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0T4' and county='Los Angeles'));

insert into medical_group (dec_number, name, county, region, state) values ('1BS', 'COASTAL COMMUNITIES PHYSICIAN NETWORK', 'Luis Obispo', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '1BS' and county='Luis Obispo'));

insert into medical_group (dec_number, name, county, region, state) values ('5MB', 'DIGNITY HEALTH MEDICAL GROUP', 'Merced', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '5MB' and county='Merced'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '5MB' and county='Merced'));

insert into medical_group (dec_number, name, county, region, state) values ('0JR', 'NIVANO PHYSICIANS INC.', 'Nevada', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0JR' and county='Nevada'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0JR' and county='Nevada'));

insert into medical_group (dec_number, name, county, region, state) values ('0ZH', 'AFFILIATED DOCTORS OF ORANGE COUNTY MEDICAL', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0ZH' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0ZH' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('0YY', 'AMVI MEDICAL GROUP INC', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0YY' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0YY' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0YY' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('6V7', 'DAEHAN PROSPECT MEDICAL GROUP', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '6V7' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '6V7' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('0DJ', 'EDINGER MEDICAL GROUP IPA', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0DJ' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Vivity Network'), (select medical_group_id from medical_group where dec_number = '0DJ' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('0YR', 'FAMILY CHOICE MEDICAL GROUP', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0YR' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0YR' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0YR' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('X08', 'FOUNTAIN VALLEY IPA', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'X08' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('0ZR', 'GREATER NEWPORT PHYSICIANS', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0ZR' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('5KW', 'GREATER NEWPORT PHYSICIANS/ORANGE COAST', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '5KW' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '5KW' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Vivity Network'), (select medical_group_id from medical_group where dec_number = '5KW' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('5KY', 'GREATER NEWPORT PHYSICIANS/SADDLEBACK', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '5KY' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '5KY' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Vivity Network'), (select medical_group_id from medical_group where dec_number = '5KY' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('0WL', 'HCP IPA ARTA HEALTH NETWORK', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0WL' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0WL' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0WL' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('0UL', 'HEALTHCARE PARTNERS AFFILIATES MEDICAL GROUP', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0UL' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0UL' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('YNL', 'HOAG AFFILIATED PHYSICIANS', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'YNL' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('0V5', 'MEMORIALCARE BPMG/COSTA MESA', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0V5' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0V5' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Vivity Network'), (select medical_group_id from medical_group where dec_number = '0V5' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('AFN', 'MISSION HERITAGE MEDICAL GROUP', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'AFN' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('0XL', 'MISSION HOSPITAL AFFILIATED PHYSICIANS', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0XL' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('0UW', 'MONARCH HEALTHCARE MEDICAL GROUP', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0UW' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0UW' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('0RK', 'NOBLE AMA IPA MEDICAL', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0RK' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0RK' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0RK' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('0V3', 'PROSPECT GATEWAY MEDICAL GROUP', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0V3' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0V3' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0V3' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('0WY', 'PROSPECT GENESIS HEALTHCARE', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0WY' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0WY' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0WY' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('0PY', 'PROSPECT MEDICAL GROUP', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0PY' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0PY' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('0DN', 'PROSPECT NWOC MEDICAL GROUP', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0DN' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0DN' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0DN' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('1BG', 'ST. JOSEPH HERITAGE MEDICAL GROUP/ORANGE-CHA', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '1BG' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('0WX', 'ST. JOSEPH HOSPITAL AFFILIATED PHYSICIANS', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0WX' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('0DL', 'ST.JUDE AFFILIATED PHYSICIANS', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0DL' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('0RD', 'ST.JUDE HERITAGE MEDICAL GROUP', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0RD' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('YV0', 'UC IRVINE - ORANGE', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'YV0' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Vivity Network'), (select medical_group_id from medical_group where dec_number = 'YV0' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('YVT', 'UC IRVINE - TUSTIN', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'YVT' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Vivity Network'), (select medical_group_id from medical_group where dec_number = 'YVT' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('YVS', 'UC IRVINE HEALTH AFFILIATED', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'YVS' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Vivity Network'), (select medical_group_id from medical_group where dec_number = 'YVS' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('W9J', 'UCI HEALTH - YORBA', 'Orange', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'W9J' and county='Orange'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Vivity Network'), (select medical_group_id from medical_group where dec_number = 'W9J' and county='Orange'));

insert into medical_group (dec_number, name, county, region, state) values ('8OO', 'BMG-TRI VALLEY MEDICAL GROUP', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '8OO' and county='Riverside'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '8OO' and county='Riverside'));

insert into medical_group (dec_number, name, county, region, state) values ('ABL', 'COACHELLA VALLEY PHYSICIANS OF', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'ABL' and county='Riverside'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = 'ABL' and county='Riverside'));

insert into medical_group (dec_number, name, county, region, state) values ('0GH', 'DESERT OASIS HEALTHCARE', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0GH' and county='Riverside'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0GH' and county='Riverside'));

insert into medical_group (dec_number, name, county, region, state) values ('0MY', 'EMPIRE PHYSICIANS MEDICAL GROUP', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0MY' and county='Riverside'));

insert into medical_group (dec_number, name, county, region, state) values ('0NL', 'HEMET COMMUNITY MEDICAL GROUP INC', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0NL' and county='Riverside'));

insert into medical_group (dec_number, name, county, region, state) values ('0RS', 'LA SALLE MEDICAL ASSOCIATES', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0RS' and county='Riverside'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0RS' and county='Riverside'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0RS' and county='Riverside'));

insert into medical_group (dec_number, name, county, region, state) values ('ABK', 'PRIMECARE MEDICAL GROUP OF CITRUS VALLEY', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'ABK' and county='Riverside'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = 'ABK' and county='Riverside'));

insert into medical_group (dec_number, name, county, region, state) values ('0LJ', 'PRIMECARE MEDICAL GROUP OF CORONA INC', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0LJ' and county='Riverside'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0LJ' and county='Riverside'));

insert into medical_group (dec_number, name, county, region, state) values ('0TY', 'PRIMECARE MEDICAL GROUP OF HEMET VALLEY INC', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0TY' and county='Riverside'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0TY' and county='Riverside'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0TY' and county='Riverside'));

insert into medical_group (dec_number, name, county, region, state) values ('0NN', 'PRIMECARE MEDICAL GROUP OF MORENO VALLEY', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0NN' and county='Riverside'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0NN' and county='Riverside'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0NN' and county='Riverside'));

insert into medical_group (dec_number, name, county, region, state) values ('0LH', 'PRIMECARE MEDICAL GROUP OF RIVERSIDE INC', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0LH' and county='Riverside'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0LH' and county='Riverside'));

insert into medical_group (dec_number, name, county, region, state) values ('0UG', 'PRIMECARE MEDICAL GROUP OF SUN', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0UG' and county='Riverside'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0UG' and county='Riverside'));

insert into medical_group (dec_number, name, county, region, state) values ('0HY', 'PRIMECARE MEDICAL GROUP OF TEMECULA INC', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0HY' and county='Riverside'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0HY' and county='Riverside'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0HY' and county='Riverside'));

insert into medical_group (dec_number, name, county, region, state) values ('0V9', 'RIVERSIDE MEDICAL CLINIC', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0V9' and county='Riverside'));

insert into medical_group (dec_number, name, county, region, state) values ('0NY', 'RIVERSIDE PHYSICIAN NETWORK', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0NY' and county='Riverside'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0NY' and county='Riverside'));

insert into medical_group (dec_number, name, county, region, state) values ('5N8', 'VALLEY PHYSICIANS NETWORK', 'Riverside', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '5N8' and county='Riverside'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '5N8' and county='Riverside'));

insert into medical_group (dec_number, name, county, region, state) values ('0JN', 'HILL PHYSICIANS MEDICAL GROUP/SACRAMENTO', 'Sacramento', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0JN' and county='Sacramento'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0JN' and county='Sacramento'));

insert into medical_group (dec_number, name, county, region, state) values ('0KY', 'MERCY MEDICAL GROUP', 'Sacramento', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0KY' and county='Sacramento'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0KY' and county='Sacramento'));

insert into medical_group (dec_number, name, county, region, state) values ('7AD', 'SELECT NETWORK/SACRAMENTO', 'Sacramento', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '7AD' and county='Sacramento'));

insert into medical_group (dec_number, name, county, region, state) values ('0XA', 'SUTTER INDEPENDENT PHYSICIANS', 'Sacramento', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0XA' and county='Sacramento'));

insert into medical_group (dec_number, name, county, region, state) values ('0WW', 'SUTTER MEDICAL GROUP', 'Sacramento', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0WW' and county='Sacramento'));

insert into medical_group (dec_number, name, county, region, state) values ('0MW', 'UC DAVIS MEDICAL GROUP', 'Sacramento', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0MW' and county='Sacramento'));

insert into medical_group (dec_number, name, county, region, state) values ('0TM', 'SAN BENITO MEDICAL ASSOCIATES', 'San Benito', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0TM' and county='San Benito'));

insert into medical_group (dec_number, name, county, region, state) values ('0K3', 'BEAVER MEDICAL GROUP', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0K3' and county='San Bernardino'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0K3' and county='San Bernardino'));

insert into medical_group (dec_number, name, county, region, state) values ('AFF', 'BMG-ALLIANCE DESERT PHYS', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'AFF' and county='San Bernardino'));

insert into medical_group (dec_number, name, county, region, state) values ('Z1I', 'CHAFFEY MEDICAL GROUP-BMG', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'Z1I' and county='San Bernardino'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = 'Z1I' and county='San Bernardino'));

insert into medical_group (dec_number, name, county, region, state) values ('0DS', 'CHOICE MEDICAL GROUP', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0DS' and county='San Bernardino'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0DS' and county='San Bernardino'));

insert into medical_group (dec_number, name, county, region, state) values ('0GP', 'INLAND HEALTHCARE GROUP INC', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0GP' and county='San Bernardino'));

insert into medical_group (dec_number, name, county, region, state) values ('0RN', 'LAKE ARROWHEAD NETWORK', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0RN' and county='San Bernardino'));

insert into medical_group (dec_number, name, county, region, state) values ('0X6', 'LOMA LINDA UNIVERSITY HEALTH CARE ADMINISTRA', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0X6' and county='San Bernardino'));

insert into medical_group (dec_number, name, county, region, state) values ('0SK', 'MY FAMILY MEDICAL GROUP', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0SK' and county='San Bernardino'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0SK' and county='San Bernardino'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0SK' and county='San Bernardino'));

insert into medical_group (dec_number, name, county, region, state) values ('0FB', 'PINNACLE MEDICAL GROUP', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0FB' and county='San Bernardino'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0FB' and county='San Bernardino'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0FB' and county='San Bernardino'));

insert into medical_group (dec_number, name, county, region, state) values ('0GK', 'PRIMECARE MEDICAL GROUP OF CHINO VALLEY INC', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0GK' and county='San Bernardino'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0GK' and county='San Bernardino'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0GK' and county='San Bernardino'));

insert into medical_group (dec_number, name, county, region, state) values ('0TX', 'PRIMECARE MEDICAL GROUP OF INLAND VALLEY INC', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0TX' and county='San Bernardino'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0TX' and county='San Bernardino'));

insert into medical_group (dec_number, name, county, region, state) values ('0UA', 'PRIMECARE MEDICAL GROUP OF REDLANDS INC', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0UA' and county='San Bernardino'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0UA' and county='San Bernardino'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0UA' and county='San Bernardino'));

insert into medical_group (dec_number, name, county, region, state) values ('ABJ', 'PRIMECARE MEDICAL GROUP OF SAN BERNARDINO', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'ABJ' and county='San Bernardino'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = 'ABJ' and county='San Bernardino'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = 'ABJ' and county='San Bernardino'));

insert into medical_group (dec_number, name, county, region, state) values ('0YN', 'REDLANDS YUCAIPA MEDICAL GROUP', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0YN' and county='San Bernardino'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0YN' and county='San Bernardino'));

insert into medical_group (dec_number, name, county, region, state) values ('1BX', 'SAN BERNARDINO MEDICAL GROUP INC', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '1BX' and county='San Bernardino'));

insert into medical_group (dec_number, name, county, region, state) values ('0ZP', 'ST MARY HIGH DESERT MEDICAL GROUP', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0ZP' and county='San Bernardino'));

insert into medical_group (dec_number, name, county, region, state) values ('0YH', 'UPLAND MEDICAL GROUP', 'San Bernardino', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0YH' and county='San Bernardino'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0YH' and county='San Bernardino'));

insert into medical_group (dec_number, name, county, region, state) values ('ABC', 'ENCOMPASS MEDICAL GROUP', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'ABC' and county='San Diego'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = 'ABC' and county='San Diego'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = 'ABC' and county='San Diego'));

insert into medical_group (dec_number, name, county, region, state) values ('99R', 'GRAYBILL MEDICAL GROUP', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '99R' and county='San Diego'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '99R' and county='San Diego'));

insert into medical_group (dec_number, name, county, region, state) values ('0TI', 'GREATER TRI CITIES IPA', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0TI' and county='San Diego'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0TI' and county='San Diego'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0TI' and county='San Diego'));

insert into medical_group (dec_number, name, county, region, state) values ('ECP', 'MERCY PHYSICIANS MEDICAL GROUP INC', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'ECP' and county='San Diego'));

insert into medical_group (dec_number, name, county, region, state) values ('0DQ', 'MULTICULTURAL PRIMARY CARE MEDICAL GROUP', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0DQ' and county='San Diego'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0DQ' and county='San Diego'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0DQ' and county='San Diego'));

insert into medical_group (dec_number, name, county, region, state) values ('0WD', 'PRIMARY CARE ASSOCIATES MEDICAL GROUP', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0WD' and county='San Diego'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0WD' and county='San Diego'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0WD' and county='San Diego'));

insert into medical_group (dec_number, name, county, region, state) values ('ZM5', 'RADY CHILDRENS HEALTH NETWORK', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'ZM5' and county='San Diego'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = 'ZM5' and county='San Diego'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = 'ZM5' and county='San Diego'));

insert into medical_group (dec_number, name, county, region, state) values ('0ZN', 'SAN DIEGO PHYSICIANS MED GRP', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0ZN' and county='San Diego'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0ZN' and county='San Diego'));

insert into medical_group (dec_number, name, county, region, state) values ('AAB', 'SCRIPPS CLINIC TORREY PINES', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'AAB' and county='San Diego'));

insert into medical_group (dec_number, name, county, region, state) values ('ABA', 'SCRIPPS COASTAL MEDICAL CENTER', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'ABA' and county='San Diego'));

insert into medical_group (dec_number, name, county, region, state) values ('7AE', 'SELECT NETWORK/SAN DIEGO', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '7AE' and county='San Diego'));

insert into medical_group (dec_number, name, county, region, state) values ('0HP', 'SHARP COMMUNITY MEDICAL GROUP', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0HP' and county='San Diego'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0HP' and county='San Diego'));

insert into medical_group (dec_number, name, county, region, state) values ('Z42', 'SHARP COMMUNITY MEDICAL GROUP - ARCH', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'Z42' and county='San Diego'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = 'Z42' and county='San Diego'));

insert into medical_group (dec_number, name, county, region, state) values ('24F', 'SHARP COMMUNITY MEDICAL GROUP - INLAND NORTH', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '24F' and county='San Diego'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '24F' and county='San Diego'));

insert into medical_group (dec_number, name, county, region, state) values ('0AW', 'SHARP REES-STEALY MEDICAL GROUP SAN DIEGO', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0AW' and county='San Diego'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0AW' and county='San Diego'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Priority Select Network'), (select medical_group_id from medical_group where dec_number = '0AW' and county='San Diego'));

insert into medical_group (dec_number, name, county, region, state) values ('1CR', 'UCSD MED GRP-FAM MED/LEWIS', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '1CR' and county='San Diego'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '1CR' and county='San Diego'));

insert into medical_group (dec_number, name, county, region, state) values ('X8V', 'UCSD PHYSICIAN NETWORK-PRIMARY CARE', 'San Diego', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'X8V' and county='San Diego'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = 'X8V' and county='San Diego'));

insert into medical_group (dec_number, name, county, region, state) values ('XAH', 'ASIAN AMERICAN MEDICAL GROUP', 'San Francisco', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'XAH' and county='San Francisco'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = 'XAH' and county='San Francisco'));

insert into medical_group (dec_number, name, county, region, state) values ('0KC', 'BROWN AND TOLAND MEDICAL GROUP', 'San Francisco', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0KC' and county='San Francisco'));

insert into medical_group (dec_number, name, county, region, state) values ('0UC', 'HILL PHYSICIANS MEDICAL GROUP/SAN FRANCISCO', 'San Francisco', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0UC' and county='San Francisco'));

insert into medical_group (dec_number, name, county, region, state) values ('0XR', 'SAN FRANCISCO NETWORK', 'San Francisco', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0XR' and county='San Francisco'));

insert into medical_group (dec_number, name, county, region, state) values ('7AL', 'SELECT NETWORK/SAN FRANCISCO', 'San Francisco', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '7AL' and county='San Francisco'));

insert into medical_group (dec_number, name, county, region, state) values ('0YZ', 'HILL PHYSICIANS MEDICAL GROUP', 'San Joaquin', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0YZ' and county='San Joaquin'));

insert into medical_group (dec_number, name, county, region, state) values ('0ZV', 'MEDCORE MEDICAL GROUP', 'San Joaquin', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0ZV' and county='San Joaquin'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0ZV' and county='San Joaquin'));

insert into medical_group (dec_number, name, county, region, state) values ('0L5', 'PHYSICIANS CHOICE', 'San Luis Obispo', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0L5' and county='San Luis Obispo'));

insert into medical_group (dec_number, name, county, region, state) values ('Z06', 'PALO ALTO MEDICAL FOUNDATION/MILLS PENINSULA DIVISION', 'San Mateo', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'Z06' and county='San Mateo'));

insert into medical_group (dec_number, name, county, region, state) values ('5PN', 'PENINSULA MEDICAL CLINIC', 'San Mateo', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '5PN' and county='San Mateo'));

insert into medical_group (dec_number, name, county, region, state) values ('ACF', 'SEQUOIA PHYSICIANS NETWORK', 'San Mateo', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'ACF' and county='San Mateo'));

insert into medical_group (dec_number, name, county, region, state) values ('0X0', 'SANSUM CLINIC', 'Santa Barbara', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0X0' and county='Santa Barbara'));

insert into medical_group (dec_number, name, county, region, state) values ('0DG', 'SANTA BARBARA SELECT IPA MED GROUP', 'Santa Barbara', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0DG' and county='Santa Barbara'));

insert into medical_group (dec_number, name, county, region, state) values ('2K9', 'AFFINITY MEDICAL GROUP - SOUTH BAY', 'Santa Clara', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '2K9' and county='Santa Clara'));

insert into medical_group (dec_number, name, county, region, state) values ('0KN', 'PALO ALTO MEDICAL FOUNDATION', 'Santa Clara', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0KN' and county='Santa Clara'));

insert into medical_group (dec_number, name, county, region, state) values ('0JF', 'PALO ALTO MEDICAL FOUNDATION/CAMINO SITE', 'Santa Clara', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0JF' and county='Santa Clara'));

insert into medical_group (dec_number, name, county, region, state) values ('0UK', 'PHYSICIANS MEDICAL GROUP OF SAN JOSE', 'Santa Clara', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0UK' and county='Santa Clara'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0UK' and county='Santa Clara'));

insert into medical_group (dec_number, name, county, region, state) values ('13Q', 'PREMIER CARE OF NORTHERN CALIFORNIA INC', 'Santa Clara', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '13Q' and county='Santa Clara'));

insert into medical_group (dec_number, name, county, region, state) values ('0MM', 'SANTA CLARA IPA', 'Santa Clara', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0MM' and county='Santa Clara'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0MM' and county='Santa Clara'));

insert into medical_group (dec_number, name, county, region, state) values ('7AB', 'SELECT NETWORK/SANTA CLARA', 'Santa Clara', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '7AB' and county='Santa Clara'));

insert into medical_group (dec_number, name, county, region, state) values ('0YS', 'SILICON VALLEY NETWORK', 'Santa Clara', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0YS' and county='Santa Clara'));

insert into medical_group (dec_number, name, county, region, state) values ('0KM', 'VERITY MEDICAL FOUNDATION', 'Santa Clara', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0KM' and county='Santa Clara'));

insert into medical_group (dec_number, name, county, region, state) values ('ADK', 'PALO ALTO FOUNDATION/SANTA CRUZ SITE', 'Santa Cruz', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'ADK' and county='Santa Cruz'));

insert into medical_group (dec_number, name, county, region, state) values ('0ER', 'PHYSICIANS MEDICAL GROUP OF SANTA CRUZ COUNTY', 'Santa Cruz', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0ER' and county='Santa Cruz'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0ER' and county='Santa Cruz'));

insert into medical_group (dec_number, name, county, region, state) values ('0RE', 'SHASTA/TEHEMA COUNTY NETWORK', 'Shasta', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0RE' and county='Shasta'));

insert into medical_group (dec_number, name, county, region, state) values ('0KS', 'HILL PHYSICIANS MEDICAL GROUP/SOLANO', 'Solano', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0KS' and county='Solano'));

insert into medical_group (dec_number, name, county, region, state) values ('1CF', 'SUTTER REGIONAL MEDICAL FOUNDATION', 'Solano', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '1CF' and county='Solano'));

insert into medical_group (dec_number, name, county, region, state) values ('0JZ', 'MERITAGE MEDICAL NETWORK', 'Sonoma', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0JZ' and county='Sonoma'));

insert into medical_group (dec_number, name, county, region, state) values ('0RG', 'SONOMA COUNTY NETWORK', 'Sonoma', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0RG' and county='Sonoma'));

insert into medical_group (dec_number, name, county, region, state) values ('0XK', 'SUTTER MEDICAL GROUP OF THE REDWOODS', 'Sonoma', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0XK' and county='Sonoma'));

insert into medical_group (dec_number, name, county, region, state) values ('0KJ', 'ALLCARE IPA', 'Stanislaus', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0KJ' and county='Stanislaus'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0KJ' and county='Stanislaus'));

insert into medical_group (dec_number, name, county, region, state) values ('7AJ', 'SELECT NETWORK/STANISLAUS', 'Stanislaus', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '7AJ' and county='Stanislaus'));

insert into medical_group (dec_number, name, county, region, state) values ('0WF', 'SUTTER GOULD MEDICAL FOUNDATION', 'Stanislaus', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0WF' and county='Stanislaus'));

insert into medical_group (dec_number, name, county, region, state) values ('1CL', 'COASTAL COMMUNITIES PHYSICIAN NETWORK', 'Tulare', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '1CL' and county='Tulare'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '1CL' and county='Tulare'));

insert into medical_group (dec_number, name, county, region, state) values ('AED', 'KEY MEDICAL GROUP', 'Tulare', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = 'AED' and county='Tulare'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = 'AED' and county='Tulare'));

insert into medical_group (dec_number, name, county, region, state) values ('7AG', 'SELECT NETWORK/TULARE', 'Tulare', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '7AG' and county='Tulare'));

insert into medical_group (dec_number, name, county, region, state) values ('0RW', 'TUOLUMNE COUNTY NETWORK', 'Tuolumne', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0RW' and county='Tuolumne'));

insert into medical_group (dec_number, name, county, region, state) values ('0LY', 'COMMUNITY MED GRP OF VENTURA CTY - IPA', 'Ventura', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0LY' and county='Ventura'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0LY' and county='Ventura'));

insert into medical_group (dec_number, name, county, region, state) values ('0LZ', 'COMMUNITY MED GRP OF VENTURA CTY- SIMI VALLE', 'Ventura', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0LZ' and county='Ventura'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0LZ' and county='Ventura'));

insert into medical_group (dec_number, name, county, region, state) values ('0GN', 'SEAVIEW IPA', 'Ventura', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0GN' and county='Ventura'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0GN' and county='Ventura'));

insert into medical_group (dec_number, name, county, region, state) values ('1CB', 'VALLEY CARE IPA', 'Ventura', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '1CB' and county='Ventura'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '1CB' and county='Ventura'));

insert into medical_group (dec_number, name, county, region, state) values ('8DK', 'VALLEY CARE SELECT IPA', 'Ventura', 'Southern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '8DK' and county='Ventura'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '8DK' and county='Ventura'));

insert into medical_group (dec_number, name, county, region, state) values ('0KK', 'SUTTER WEST MEDICAL GROUP', 'Yolo', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0KK' and county='Yolo'));

insert into medical_group (dec_number, name, county, region, state) values ('0KW', 'WOODLAND CLINIC MEDICAL GROUP', 'Yolo', 'Northern California', 'California');
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Traditional Network'), (select medical_group_id from medical_group where dec_number = '0KW' and county='Yolo'));
insert into network_medical_group (network_id, medical_group_id) values ((select network_id from network where name = 'Select Network'), (select medical_group_id from medical_group where dec_number = '0KW' and county='Yolo'));