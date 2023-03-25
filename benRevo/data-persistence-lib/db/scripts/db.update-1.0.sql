UPDATE network SET name = 'Select' WHERE carrier_id = 22 AND network_id = 42 and name = 'Select Network';
UPDATE network SET name = 'Core Essential' WHERE carrier_id = 22 AND network_id = 43 and name = 'Core Network';
UPDATE network SET name = 'Choice' WHERE carrier_id = 22 AND network_id = 44 and name = 'Choice Network';
UPDATE network SET name = 'Navigate' WHERE carrier_id = 22 AND network_id = 45 and name = 'Navigate1';

INSERT INTO network (name, tier, type, carrier_id) VALUES ('Choice Plus', 'TIER_2_NARROW', 'PPO', 22);
INSERT INTO network (name, tier, type, carrier_id) VALUES ('NonDiff PPO', 'TIER_2_NARROW', 'PPO', 22);
INSERT INTO network (name, tier, type, carrier_id) VALUES ('Options PPO', 'TIER_2_NARROW', 'PPO', 22);

INSERT INTO network (name, tier, type, carrier_id) VALUES ('Select HSA', 'TIER_1_FULL', 'HSA', 22);
INSERT INTO network (name, tier, type, carrier_id) VALUES ('Choice HSA', 'TIER_1_FULL', 'HSA', 22);
INSERT INTO network (name, tier, type, carrier_id) VALUES ('Choice Plus HSA', 'TIER_2_NARROW', 'HSA', 22);
INSERT INTO network (name, tier, type, carrier_id) VALUES ('Core Essential HSA', 'TIER_2_NARROW', 'HSA', 22);
INSERT INTO network (name, tier, type, carrier_id) VALUES ('Navigate HSA', 'TIER_3_NARROW_SPECIALTY', 'HSA', 22);
INSERT INTO network (name, tier, type, carrier_id) VALUES ('Options PPO HSA', 'TIER_3_NARROW_SPECIALTY', 'HSA', 22);

UPDATE benefit_name SET name='IP_PER_OCCURENCE_DEDUCTIBLE', display_name='IP Per-Occurrence Ded' WHERE benefit_name_id = 457;