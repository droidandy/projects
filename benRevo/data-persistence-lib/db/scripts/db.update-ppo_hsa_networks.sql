/********************
* PPO
********************/
/* Aetna */
INSERT INTO network (name, type, tier, carrier_id) VALUES ('Open Choice PPO', 'PPO', 'TIER_2_NARROW', (SELECT carrier_id FROM carrier WHERE name='AETNA'));
INSERT INTO network (name, type, tier, carrier_id) VALUES ('OAMC – Open Access Managed Choice', 'PPO', 'TIER_1_FULL', (SELECT carrier_id FROM carrier WHERE name='AETNA'));

/* Anthem */
UPDATE network SET name='PPO' WHERE name='Full Network' AND tier ='TIER_1_FULL' AND type ='PPO' AND carrier_id = (SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS');
UPDATE network SET name='PPO - Solution', tier ='TIER_2_NARROW' WHERE name='Unlimited Rollover' AND tier ='TIER_1_FULL' AND type ='PPO' AND carrier_id = (SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS');
UPDATE network SET name='PPO - Select (CA Only)', tier ='TIER_2_NARROW' WHERE name='1x Rollover' AND tier ='TIER_1_FULL' AND type ='PPO' AND carrier_id = (SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS');
 /* 2x Rollover - id 37 deleted below */
UPDATE network SET name='HSA Select PPO Network (CA Only)', type ='HSA' WHERE name='HSA Traditional PPO Network' AND tier ='TIER_1_FULL' AND type ='PPO' AND carrier_id = (SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS');
/* Premier Plus PPO - id 97 deleted below */ 
/* Premier PPO - id 98 deleted below */

UPDATE plan_name_by_network SET network_id = (select network_id FROM network WHERE name='PPO' AND tier ='TIER_1_FULL' AND type ='PPO'AND carrier_id = (SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'))
WHERE network_id IN (37,97,98,99,100,101,103, 104, 105, 106);
UPDATE rfp_quote_network SET network_id = (select network_id FROM network WHERE name='PPO' AND tier ='TIER_1_FULL' AND type ='PPO'AND carrier_id = (SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'))
WHERE network_id IN (37,97,98,99,100,101,103, 104, 105, 106);
DELETE FROM network WHERE network_id IN (37,98,99,100,101,103, 104, 105,106) AND type ='PPO' AND carrier_id = (SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS');

/* Blue Shield */
UPDATE network SET name='Full PPO' WHERE name='Select Network' AND tier ='TIER_1_FULL' AND type ='PPO' AND carrier_id = (SELECT carrier_id FROM carrier WHERE name='BLUE_SHIELD');
INSERT INTO network (name, type, tier, carrier_id) VALUES ('Active Choice PPO', 'PPO', 'TIER_2_NARROW', (SELECT carrier_id FROM carrier WHERE name='BLUE_SHIELD'));
INSERT INTO network (name, type, tier, carrier_id) VALUES ('Shield Spectrum PPO', 'PPO', 'TIER_2_NARROW', (SELECT carrier_id FROM carrier WHERE name='BLUE_SHIELD'));
INSERT INTO network (name, type, tier, carrier_id) VALUES ('Tandem PPO', 'PPO', 'TIER_1_FULL', (SELECT carrier_id FROM carrier WHERE name='BLUE_SHIELD'));

/* Cigna*/
UPDATE network SET name='OAP – Open Access Plus' WHERE name='Full Network' AND tier ='TIER_1_FULL' AND type ='PPO' AND carrier_id = (SELECT carrier_id FROM carrier WHERE name='CIGNA');

/* Healthnet */
UPDATE network SET name='PPO' WHERE name='Full Network' AND tier ='TIER_1_FULL' AND type ='PPO' AND carrier_id = (SELECT carrier_id FROM carrier WHERE name='HEALTHNET');

UPDATE plan_name_by_network SET network_id = (select network_id FROM network WHERE name='PPO' AND tier ='TIER_1_FULL' AND type ='PPO'AND carrier_id = (SELECT carrier_id FROM carrier WHERE name='HEALTHNET'))
WHERE network_id IN (39, 40);
UPDATE rfp_quote_network SET network_id = (select network_id FROM network WHERE name='PPO' AND tier ='TIER_1_FULL' AND type ='PPO'AND carrier_id = (SELECT carrier_id FROM carrier WHERE name='HEALTHNET'))
WHERE network_id IN (39, 40);
DELETE FROM network WHERE network_id IN (39, 40) AND type ='PPO' AND carrier_id = (SELECT carrier_id FROM carrier WHERE name='HEALTHNET');

/********************
* HSA
********************/
/* Aetna */
INSERT INTO network (name, type, tier, carrier_id) VALUES ('Open Choice HSA', 'HSA', 'TIER_2_NARROW', (SELECT carrier_id FROM carrier WHERE name='AETNA'));
INSERT INTO network (name, type, tier, carrier_id) VALUES ('OAMC – Open Access Managed Choice HSA', 'HSA', 'TIER_1_FULL', (SELECT carrier_id FROM carrier WHERE name='AETNA'));

/*Blue Shield */
INSERT INTO network (name, type, tier, carrier_id) VALUES ('Full HSA', 'HSA', 'TIER_1_FULL', (SELECT carrier_id FROM carrier WHERE name='BLUE_SHIELD'));
INSERT INTO network (name, type, tier, carrier_id) VALUES ('Active Choice HSA', 'HSA', 'TIER_2_NARROW', (SELECT carrier_id FROM carrier WHERE name='BLUE_SHIELD'));
INSERT INTO network (name, type, tier, carrier_id) VALUES ('Shield Spectrum HSA', 'HSA', 'TIER_2_NARROW', (SELECT carrier_id FROM carrier WHERE name='BLUE_SHIELD'));
INSERT INTO network (name, type, tier, carrier_id) VALUES ('Tandem HSA', 'HSA', 'TIER_1_FULL', (SELECT carrier_id FROM carrier WHERE name='BLUE_SHIELD'));

/* Cigna*/
UPDATE network SET name='OAP – Open Access Plus HSA' WHERE name='Entire Network' AND tier ='TIER_1_FULL' AND type ='HSA' AND carrier_id = (SELECT carrier_id FROM carrier WHERE name='CIGNA');

/* Healthnet */
INSERT INTO network (name, type, tier, carrier_id) VALUES ('HSA', 'HSA', 'TIER_1_FULL', (SELECT carrier_id FROM carrier WHERE name='HEALTHNET'));
