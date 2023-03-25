/* Anthem */
/* Network clean up scripts */
UPDATE network SET name='Traditional Network' WHERE name='Traditional' AND tier ='TIER_1_FULL' AND carrier_id = 3 AND type ='HMO';
UPDATE network SET name='Select Network' WHERE name='Select +' AND tier ='TIER_2_NARROW' AND carrier_id = 3 AND type ='HMO';
UPDATE network SET name='Priority Select Network' WHERE name='Priority Select' AND tier ='TIER_3_NARROW_SPECIALTY' AND carrier_id = 3 AND type ='HMO';
INSERT INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Vivity Network', 'HMO', 'TIER_3_NARROW_SPECIALTY');

UPDATE plan_name_by_network SET network_id = (select network_id FROM network WHERE name='Select Network' AND tier='TIER_2_NARROW' AND carrier_id = 3 AND type ='HMO')
WHERE network_id = 7;
UPDATE rfp_quote_network SET network_id = (select network_id FROM network WHERE name='Select Network' AND tier='TIER_2_NARROW' AND carrier_id = 3 AND type ='HMO')
WHERE network_id = 7;
DELETE FROM network WHERE network_id = 7 AND type ='HMO';

/* move off of invalid networks */
/* Traditional */
UPDATE plan_name_by_network SET network_id = (select network_id FROM network WHERE name='Traditional Network' AND tier='TIER_1_FULL' AND carrier_id = 3 AND type ='HMO')
WHERE network_id IN (107,108,109,110,111,112,113);

UPDATE rfp_quote_network SET network_id = (select network_id FROM network WHERE name='Traditional Network' AND tier ='TIER_1_FULL' AND carrier_id = 3 AND type ='HMO')
WHERE network_id IN (107,108,109,110,111,112,113);

/* Select */
UPDATE plan_name_by_network SET network_id = (select network_id FROM network WHERE name='Select Network' AND tier ='TIER_2_NARROW' AND carrier_id = 3 AND type ='HMO')
WHERE network_id IN (114, 115, 116, 117, 118, 119, 120);

UPDATE rfp_quote_network SET network_id = (select network_id FROM network WHERE name='Select Network' AND tier ='TIER_2_NARROW' AND carrier_id = 3 AND type ='HMO')
WHERE network_id IN (114, 115, 116, 117, 118, 119, 120);

/* Vivity */
UPDATE plan_name_by_network SET network_id = (select network_id FROM network WHERE name='Vivity Network' AND tier ='TIER_3_NARROW_SPECIALTY' AND carrier_id = 3 AND type ='HMO')
WHERE network_id IN (121,122,123,124);

UPDATE rfp_quote_network SET network_id = (select network_id FROM network WHERE name='Vivity Network' AND tier ='TIER_3_NARROW_SPECIALTY' AND carrier_id = 3 AND type ='HMO')
WHERE network_id IN (121,122,123,124);

/* Priority Select */
UPDATE plan_name_by_network SET network_id = (select network_id FROM network WHERE name='Priority Select Network' AND tier ='TIER_3_NARROW_SPECIALTY' AND carrier_id = 3 AND type ='HMO')
WHERE network_id IN (125,126,127,128,129,130,131);

UPDATE rfp_quote_network SET network_id = (select network_id FROM network WHERE name='Priority Select Network' AND tier ='TIER_3_NARROW_SPECIALTY' AND carrier_id = 3 AND type ='HMO')
WHERE network_id IN (125,126,127,128,129,130,131);

DELETE FROM network WHERE network_id >= 107 and network_id <= 131 AND type ='HMO';

/* Aetna */
UPDATE network SET name='Value HMO' WHERE name='AVN HMO' AND tier ='TIER_2_NARROW' AND carrier_id = 1 AND type ='HMO';
INSERT INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='AETNA'), 'PrimeCare ACO', 'HMO', 'TIER_4_OTHER');

/* Blue Shield */
UPDATE network SET name='Access Plus HMO' WHERE name='Access + HMO' AND tier ='TIER_1_FULL' AND carrier_id = 5 AND type ='HMO';
UPDATE network SET name='Local Access Plus HMO', tier='TIER_2_NARROW' WHERE name='Local Access + HMO' AND tier ='TIER_3_NARROW_SPECIALTY' AND carrier_id = 5 AND type ='HMO';
UPDATE network SET name='Access Plus Savenet HMO' WHERE name='Access + HMO Savenet' AND tier ='TIER_2_NARROW' AND carrier_id = 5 AND type ='HMO';
INSERT INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='BLUE_SHIELD'), 'Trio ACO HMO', 'HMO', 'TIER_3_NARROW_SPECIALTY');

/* Cigna*/
UPDATE network SET name='HMO' WHERE name='Full Network' AND tier ='TIER_1_FULL' AND carrier_id = 6 AND type ='HMO';
UPDATE plan_name_by_network SET network_id = (select network_id FROM network WHERE name='HMO' AND tier='TIER_1_FULL' AND carrier_id = 6 AND type ='HMO')
WHERE network_id = (SELECT network_id FROM network WHERE name='Select Network' AND tier ='TIER_3_NARROW_SPECIALTY' AND carrier_id = 6 AND type ='HMO');
UPDATE rfp_quote_network SET network_id = (select network_id FROM network WHERE name='HMO' AND tier='TIER_1_FULL' AND carrier_id = 6 AND type ='HMO')
WHERE network_id = (SELECT network_id FROM network WHERE name='Select Network' AND tier ='TIER_3_NARROW_SPECIALTY' AND carrier_id = 6 AND type ='HMO');
DELETE FROM network WHERE name='Select Network' AND tier ='TIER_3_NARROW_SPECIALTY' AND carrier_id = 6 AND type ='HMO';

UPDATE plan_name_by_network SET network_id = (select network_id FROM network WHERE name='HMO' AND tier='TIER_1_FULL' AND carrier_id = 6 AND type ='HMO')
WHERE network_id = (SELECT network_id FROM network WHERE name='Value Network' AND tier ='TIER_3_NARROW_SPECIALTY' AND carrier_id = 6 AND type ='HMO');
UPDATE rfp_quote_network SET network_id = (select network_id FROM network WHERE name='HMO' AND tier='TIER_1_FULL' AND carrier_id = 6 AND type ='HMO')
WHERE network_id = (SELECT network_id FROM network WHERE name='Value Network' AND tier ='TIER_3_NARROW_SPECIALTY' AND carrier_id = 6 AND type ='HMO');
DELETE FROM network WHERE name='Value Network' AND tier ='TIER_3_NARROW_SPECIALTY' AND carrier_id = 6 AND type ='HMO';

/* Health Net*/
UPDATE network SET name='Full HMO' WHERE name='HMO' AND tier ='TIER_1_FULL' AND carrier_id = 12 AND type ='HMO';
UPDATE network SET name='Wholecare', tier='TIER_2_NARROW' WHERE name='EOA' AND tier ='TIER_1_FULL' AND carrier_id = 12 AND type ='HMO';
UPDATE network SET name='SmartCare' WHERE name='HMO Excelcare' AND tier ='TIER_2_NARROW' AND carrier_id = 12 AND type ='HMO';
UPDATE network SET name='Excelcare' WHERE name='EOA Excelcare' AND tier ='TIER_2_NARROW' AND carrier_id = 12 AND type ='HMO';
UPDATE plan_name_by_network SET network_id = (select network_id FROM network WHERE name='Full HMO' AND tier ='TIER_1_FULL' AND carrier_id = 12 AND type ='HMO')
WHERE network_id IN (19,20,21,22);
UPDATE rfp_quote_network SET network_id = (select network_id FROM network WHERE name='Full HMO' AND tier ='TIER_1_FULL' AND carrier_id = 12 AND type ='HMO')
WHERE network_id IN (19,20,21,22);
DELETE FROM network WHERE network_id >= 19 AND network_id <= 22 AND type ='HMO';
UPDATE network SET name='CA Salud HMO Plus y Mas' WHERE name='Salud HMO y Mas Mexico' AND tier ='TIER_3_NARROW_SPECIALTY' AND carrier_id = 12 AND type ='HMO';
UPDATE network SET name='CA HMO Community Care' WHERE name='Salud HMO y Mas San Diego' AND tier ='TIER_3_NARROW_SPECIALTY' AND carrier_id = 12 AND type ='HMO';

/* Kaiser */
UPDATE network SET tier='TIER_4_OTHER' WHERE name='Kaiser HMO' AND tier ='TIER_1_FULL' AND carrier_id = 13 AND type ='HMO';

/* Sharp Health Plan */
INSERT INTO network (carrier_id,name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='SHARP_HEALTH_PLANS'), 'Choice', 'HMO', 'TIER_4_OTHER');
INSERT INTO network (carrier_id,name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='SHARP_HEALTH_PLANS'), 'Value', 'HMO', 'TIER_4_OTHER');
INSERT INTO network (carrier_id,name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='SHARP_HEALTH_PLANS'), 'Performance', 'HMO', 'TIER_4_OTHER');
INSERT INTO network (carrier_id,name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='SHARP_HEALTH_PLANS'), 'Premier', 'HMO', 'TIER_4_OTHER');