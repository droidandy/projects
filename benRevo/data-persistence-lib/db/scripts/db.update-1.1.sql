UPDATE network SET type='HSA' WHERE network_id = 47 AND carrier_id = 6;
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='CIGNA'), 'Full Network', 'RX_HMO', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='CIGNA'), 'Full Network', 'RX_PPO', 'TIER_1_FULL');