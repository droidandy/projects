SET FOREIGN_KEY_CHECKS=0;

INSERT IGNORE INTO broker (broker_id, name, broker_token) VALUES (2, 'Another FTP Brokerage', '22ee6f0e-c73c-42d2-9e92-914a7cdf5e2f');
INSERT IGNORE INTO broker (broker_id, name, broker_token) VALUES (1, 'Another FTP Brokerage FORBIDDEN', '12ee6f0e-c73c-42d2-9e92-914a7cdf5e1f');

INSERT IGNORE INTO client (client_id, client_name, broker_id) VALUES (1, 'testClient1', (SELECT broker_id FROM broker WHERE broker_token = '1ed74511-c44d-4d31-a841-cb062015bdbc'));
INSERT IGNORE INTO client (client_id, client_name, broker_id) VALUES (4, 'testClient4', (SELECT broker_id FROM broker WHERE broker_token = '1ed74511-c44d-4d31-a841-cb062015bdbc'));
INSERT IGNORE INTO client (client_id, client_name, broker_id) VALUES (5, 'testClient5', (SELECT broker_id FROM broker WHERE broker_token = '1ed74511-c44d-4d31-a841-cb062015bdbc'));
INSERT IGNORE INTO client (client_id, client_name, broker_id) VALUES (6, 'testClient6', (SELECT broker_id FROM broker WHERE broker_token = '1ed74511-c44d-4d31-a841-cb062015bdbc'));
INSERT IGNORE INTO client (client_id, client_name, broker_id) VALUES (3, 'testClient3', (SELECT broker_id FROM broker WHERE broker_token = '1ed74511-c44d-4d31-a841-cb062015bdbc'));
INSERT IGNORE INTO client (client_id, client_name, broker_id) VALUES (2, 'testClient FORBIDDEN', (SELECT broker_id FROM broker WHERE broker_token = '22ee6f0e-c73c-42d2-9e92-914a7cdf5e2f'));

COMMIT;

INSERT IGNORE INTO carrier (name, display_name) VALUES ('AETNA','Aetna');
INSERT IGNORE INTO carrier (name, display_name) VALUES ('AMERITAS','Ameritas');
INSERT IGNORE INTO carrier (name, display_name) VALUES ('ANTHEM_BLUE_CROSS','Anthem Blue Cross');
INSERT IGNORE INTO carrier (name, display_name) VALUES ('ASSURANT','Assurant');
INSERT IGNORE INTO carrier (name, display_name) VALUES ('BLUE_SHIELD','Blue Shield');
INSERT IGNORE INTO carrier (name, display_name) VALUES ('CIGNA','Cigna');
INSERT IGNORE INTO carrier (name, display_name) VALUES ('COLONIAL_LIFE','Colonial life');
INSERT IGNORE INTO carrier (name, display_name) VALUES ('DEARBORN_NATIONAL','Dearborn National');
INSERT IGNORE INTO carrier (name, display_name) VALUES ('DELTA_DENTAL','Delta Dental');
INSERT IGNORE INTO carrier (name, display_name) VALUES ('GUARDIAN','Guardian');
INSERT IGNORE INTO carrier (name, display_name) VALUES ('HARTFORD','Hartford');
INSERT IGNORE INTO carrier (name, display_name) VALUES ('HEALTHNET','Healthnet');
INSERT IGNORE INTO carrier (name, display_name) VALUES ('KAISER','Kaiser');
INSERT IGNORE INTO carrier (name, display_name) VALUES ('LINCOLN_FINANCIAL','Lincoln Financial');
INSERT IGNORE INTO carrier (name, display_name) VALUES ('METLIFE','MetLife');
INSERT IGNORE INTO carrier (name, display_name) VALUES ('PRINCIPAL_FINANCIAL_GROUP','Principal Financial Group');
INSERT IGNORE INTO carrier (name, display_name) VALUES ('PRUDENTIAL','Prudential');
INSERT IGNORE INTO carrier (name, display_name) VALUES ('RELIANCE_STANDARD','Reliance Standard');
INSERT IGNORE INTO carrier (name, display_name) VALUES ('SHARP_HEALTH_PLANS','Sharp Health Plans');
INSERT IGNORE INTO carrier (name, display_name) VALUES ('STANDARD','Standard');
INSERT IGNORE INTO carrier (name, display_name) VALUES ('SUN_LIFE','Sun Life');
INSERT IGNORE INTO carrier (name, display_name) VALUES ('UHC','United Health Care');
INSERT IGNORE INTO carrier (name, display_name) VALUES ('UNITED_CONCORDIA','United Concordia');
INSERT IGNORE INTO carrier (name, display_name) VALUES ('UNUM','Unum');

COMMIT;

/* Table:network - HMO */
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='AETNA'), 'HMO', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='AETNA'), 'AVN HMO', 'HMO', 'TIER_2_NARROW');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='AETNA'), 'Deductible HMO', 'HMO', 'TIER_2_NARROW');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='AETNA'), 'Basic HMO', 'HMO', 'TIER_3_NARROW_SPECIALTY');

INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Traditional', 'HMO','TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Select +', 'HMO', 'TIER_2_NARROW');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Select', 'HMO', 'TIER_3_NARROW_SPECIALTY');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Priority Select', 'HMO', 'TIER_3_NARROW_SPECIALTY');

INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='BLUE_SHIELD'), 'Access + HMO', 'HMO', 'TIER_1_FULL');    
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='BLUE_SHIELD'), 'Access + HMO Savenet', 'HMO', 'TIER_2_NARROW');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='BLUE_SHIELD'), 'Local Access + HMO', 'HMO', 'TIER_3_NARROW_SPECIALTY');

INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='CIGNA'), 'Full Network', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='CIGNA'), 'Select Network', 'HMO', 'TIER_3_NARROW_SPECIALTY');    
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='CIGNA'), 'Value Network', 'HMO', 'TIER_3_NARROW_SPECIALTY');    

INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='HEALTHNET'), 'HMO', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='HEALTHNET'), 'EOA', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='HEALTHNET'), 'HMO Excelcare', 'HMO', 'TIER_2_NARROW');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='HEALTHNET'), 'EOA Excelcare', 'HMO', 'TIER_2_NARROW');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='HEALTHNET'), 'N.CA Smartcare', 'HMO', 'TIER_3_NARROW_SPECIALTY');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='HEALTHNET'), 'S.CA Smartcare', 'HMO', 'TIER_3_NARROW_SPECIALTY');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='HEALTHNET'), 'Salud SIMNSA Network',  'HMO', 'TIER_3_NARROW_SPECIALTY');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='HEALTHNET'), 'Salud CA Network',  'HMO', 'TIER_3_NARROW_SPECIALTY');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='HEALTHNET'), 'Salud HMO y Mas Mexico',  'HMO', 'TIER_3_NARROW_SPECIALTY');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='HEALTHNET'), 'Salud HMO y Mas San Diego',  'HMO', 'TIER_3_NARROW_SPECIALTY');

INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='UHC'), 'Signature', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='UHC'), 'Advantage', 'HMO', 'TIER_2_NARROW');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='UHC'), 'Alliance', 'HMO', 'TIER_3_NARROW_SPECIALTY');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='UHC'), 'Focus', 'HMO', 'TIER_3_NARROW_SPECIALTY');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='UHC'), 'Select Plus', 'PPO', 'TIER_2_NARROW');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='UHC'), 'Core', 'PPO', 'TIER_2_NARROW');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='UHC'), 'Select Plus HSA', 'HSA', 'TIER_2_NARROW');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='UHC'), 'Core HSA', 'HSA', 'TIER_2_NARROW');
   
/* Table:network - PPO */    
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='CIGNA'), 'Full Network', 'PPO', 'TIER_1_FULL');

INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Full Network', 'PPO', 'TIER_1_FULL');

INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Unlimited Rollover', 'PPO', 'TIER_1_FULL');

INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), '1x Rollover', 'PPO', 'TIER_1_FULL');

INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), '2x Rollover', 'PPO', 'TIER_1_FULL');

INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='HEALTHNET'), 'Full Network', 'PPO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='HEALTHNET'), 'Select Network', 'PPO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='HEALTHNET'), 'Choice Network', 'PPO', 'TIER_1_FULL');


INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='BLUE_SHIELD'), 'Select Network', 'PPO', 'TIER_1_FULL');

INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='UHC'), 'Select Network', 'PPO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='UHC'), 'Core Network', 'PPO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='UHC'), 'Choice Network', 'PPO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='UHC'), 'Navigate1', 'PPO', 'TIER_1_FULL');

/* Table:network - DENTAL */    
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Entire Network', 'DEPO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='CIGNA'), 'Entire Network', 'DEPO', 'TIER_1_FULL');

INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Entire Network', 'DPPO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='METLIFE'), 'Entire Network', 'DPPO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='PRINCIPAL_FINANCIAL_GROUP'), 'Entire Network', 'DPPO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='GUARDIAN'), 'Entire Network', 'DPPO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='CIGNA'), 'Entire Network', 'DPPO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='DELTA_DENTAL'), 'Entire Network', 'DPPO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='UNITED_CONCORDIA'), 'Entire Network', 'DPPO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='UHC'), 'Options PPO 20', 'DPPO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='UHC'), 'Options PPO 30', 'DPPO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='UHC'), 'Options PPO 15', 'DPPO', 'TIER_3_NARROW_SPECIALTY');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='UHC'), 'Options PPO 10', 'DPPO', 'TIER_3_NARROW_SPECIALTY');

INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Entire Network', 'DHMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='CIGNA'), 'Entire Network', 'DHMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='DELTA_DENTAL'), 'Entire Network', 'DHMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='GUARDIAN'), 'Entire Network', 'DHMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='METLIFE'), 'Entire Network', 'DHMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='PRINCIPAL_FINANCIAL_GROUP'), 'Entire Network', 'DHMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='UNITED_CONCORDIA'), 'Entire Network', 'DHMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='UHC'), 'Full Network', 'DHMO', 'TIER_1_FULL');

/* Table:network - VISION */  
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Entire Network', 'VISION', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='CIGNA'), 'Entire Network', 'VISION', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='GUARDIAN'), 'Entire Network', 'VISION', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='METLIFE'), 'Entire Network', 'VISION', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='PRINCIPAL_FINANCIAL_GROUP'), 'Entire Network', 'VISION', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='UHC'), 'Full Network', 'VISION', 'TIER_1_FULL');


/*Table:network - LIFE */    
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='GUARDIAN'), 'Entire Network', 'LIFE', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='PRINCIPAL_FINANCIAL_GROUP'), 'Entire Network', 'LIFE', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='METLIFE'), 'Entire Network', 'LIFE', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='CIGNA'), 'Entire Network', 'LIFE', 'TIER_1_FULL');

/*Table:network - VOLLIFE */  
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Entire Network', 'VOLLIFE', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='CIGNA'), 'Entire Network', 'VOLLIFE', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='GUARDIAN'), 'Entire Network', 'VOLLIFE', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='METLIFE'), 'Entire Network', 'VOLLIFE', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='PRINCIPAL_FINANCIAL_GROUP'), 'Entire Network', 'VOLLIFE', 'TIER_1_FULL');

/*Table:network - LTD */  
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Entire Network', 'LTD', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='CIGNA'), 'Entire Network', 'LTD', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='GUARDIAN'), 'Entire Network', 'LTD', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='METLIFE'), 'Entire Network', 'LTD', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='PRINCIPAL_FINANCIAL_GROUP'), 'Entire Network', 'LTD', 'TIER_1_FULL');

/*Table:network - STD */  
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Entire Network', 'STD', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='CIGNA'), 'Entire Network', 'STD', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='GUARDIAN'), 'Entire Network', 'STD', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='METLIFE'), 'Entire Network', 'STD', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='PRINCIPAL_FINANCIAL_GROUP'), 'Entire Network', 'STD', 'TIER_1_FULL');

/*Table:network - RX */
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='UHC'), 'Full Network', 'RX_HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='UHC'), 'Full Network', 'RX_PPO', 'TIER_1_FULL');

COMMIT;

/* Table:benefit_name */
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (28,'ADVANCED_RADIOLOGY','Advanced Radiology');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (29,'EMERGENCY_ROOM','Emergency Room');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (30,'AMBULANCE','Ambulance');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (31,'RX_MAIL_ORDER','Rx Mail Order');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (32,'SPECIALIST','Specialist');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (33,'RX_PREFERRED','Rx Preferred');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (34,'RX_SPECIALTY','Rx Specialty');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (35,'FAMILY_OOP_LIMIT','Family OOP Limit');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (36,'PREVENTIVE_CARE','Preventive Care');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (37,'SKILLED_NURSING','Skilled Nursing');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (38,'URGENT_CARE','Urgent Care');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (39,'CO_INSURANCE','Co-insurance');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (40,'RX_NON_PREFERRED','Rx Non-Preferred');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (41,'RX_GENERIC','Rx Generic');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (42,'OUTPATIENT_FACILITY','Outpatient Facility');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (43,'INDIVIDUAL_DEDUCTIBLE','Individual Deductible');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (44,'OUTPATIENT_SURGERY','Outpatient Surgery');
/*INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (45,'RX_FAMILY_DEDUCTIBLE','Rx Family Deductible');*/
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (46,'LAB_X_RAY','Lab/X-Ray');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (47,'PCP','PCP');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (48,'CHIROPRACTIC_CARE','Chiropractic Care');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (49,'INDIVIDUAL_OOP_LIMIT','Individual OOP Limit');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (50,'INPATIENT_HOSPITAL','Inpatient Hospital');
/*INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (51,'RX_INDIVIDUAL_DEDUCTIBLE','Rx Individual Deductible');*/
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (52,'FAMILY_DEDUCTIBLE','Family Deductible');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (53,'PHYSICAL_THERAPY','Physical Therapy');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (54,'SELF_REFERRED','Self Referred');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (55,'EE_HRA_FUND','EE HRA Fund');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (56,'FAM_HRA_FUND','FAM HRA Fund'); 
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (455,'DEDUCTIBLE_TYPE','Deductible Type'); 
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (456,'COMBINE_MED_RX_DEDUCTIBLE','Combine Med/Rx Deductible'); 
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (457,'IP_PER-OCCURENCE_DEDUCTIBLE','IP Per-Occurrence Ded6'); 
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (458,'IP_COPAY_MAX','Inpatient Copay Max'); 
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (459,'IP_COPAY_TYPE','Inpatient Copay Type'); 

/* Dental:DPPO,DEPO */
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (100,'CALENDAR_YEAR_MAXIMUM', 'Calendar Year Maximum');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (101,'CALENDAR_YEAR_DEDUCTIBLE','Calendar Year Deductible');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (102,'DENTAL_INDIVIDUAL','Individual');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (103,'DENTAL_FAMILY','Family');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (104,'WAIVED_FOR_PREVENTIVE','Waived for Preventive');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (105,'CLASS_1_PREVENTIVE','Class 1 - Preventive');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (106,'CLASS_2_BASIC','Class II - Basic');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (107,'CLASS_3_MAJOR','Class III - Major');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (108,'CLASS_4_ORTHODONTIA','Class IV - Orthodontia');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (109,'ORTHODONTIA_LIFETIME_MAX','Orthodontia Lifetime Max');
/*INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (110,'DENTAL_OUT_OF_NETWORK_REIMBURSEMENT','Dental Out of Network Reimbursement');*/
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (111,'IMPLANT_COVERAGE','Implant Coverage');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (112,'ORTHO_ELIGIBILITY','Ortho Eligibility');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (113,'REIMBURSEMENT_SCHEDULE','Dental Reimbursement Schedule');

/* Dental:DHMO */
/*Preventive & Diagnostic Services*/
/*INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (120,'DENTAL_OFFICE_VISIT','Office Visit');*/
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (121,'ORAL_EXAMINATION','Oral Examination');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (122,'ADULT_PROPHY','Adult Prophylaxis (Cleaning)');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (123,'CHILD_PROPHY','Child Prophylaxis (Cleaning)');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (124,'SILVER_FILL_1_SURFACE','Silver Filling One Surface');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (125,'WHITE_FILL_1_SURFACE_ANTERIOR','White Filling One Surface Anterior');
/*INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (126,'COMPOSITE_BACK_TOOTH','Composite (tooth colored) Back Tooth');*/
/*Endodontic Services*/
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (127,'MOLAR_ROOT_CANAL','Molar Root Canal');
/*Periodontic Services*/
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (128,'PERIO_MAINTAINANCE','Perio Maintainance');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (129,'SIMPLE_EXTRACTION_ERUPTED_TOOTH','Simple Extraction of Erupted Tooth');
/*Orthodontia Services*/
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (135,'ORTHO_SERVICES_CHILDREN','Orthodontia Services Children');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (136,'ORTHO_SERVICES_ADULTS','Orthodontia Services Adults');

/*
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (130,'OSSEOUS_SURGERY_PER_QUAD','Osseous Surgery (per quad)');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (131,'SCALING_ROOT_PLANNING','Scaling/Root Planing (per quad)');
*/
/* Fixed Prosthodontic Services
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (132,'CROWN_PORCELAIN','Crown (porcelain w/metal)'); 
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (133,'CROWN_FULL_CAST','Crown (full cast metal)');
 */
/* Removable Prosthodontic Services
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (134,'COMPLETE_DENTURE','Complete Denture (upper or lower)');
 */
/* Orthodontia Services
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (137,'ORTHO_SERVICES_RETENTION_FEES','Orthodontia Services Retention Fees Child(ren) or Adult');
*/
/* END - Table:benefit_name */

/* Vision */
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (200,'EXAMS_FREQUENCY','Exams Frequency');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (201,'LENSES_FREQUENCY','Lenses Frequency');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (202,'FRAMES_FREQUENCY','Frames Frequency');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (203,'EXAM_COPAY','Exam Copay');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (204,'MATERIALS_COPAY','Materials Copay');

INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (205,'CONTACTS_FREQUENCY','Contacts Frequency');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (206,'FRAME_ALLOWANCE','Frame Allowance');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (207,'CONTACTS_ALLOWANCE','Contacts Allowance');
/*
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (208,'TRIFOCAL_LENS','Trifocal Lens');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (209,'LENTICULAR_LENSES','Lenticular Lenses');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (210,'CONTACTS_ELECTIVE','Contacts Elective');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (211,'CONTACTS_THERAPEUTIC','Contacts Therapeutic');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (212,'FRAMES','Frames');
*/
/* Life AD&D
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (300,'BENEFIT_CLASS_1','Benefit Class 1');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (301,'BENEFIT_CLASS_2','Benefit Class 2');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (302,'AGE_REDUCTION','Age Reduction');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (303,'PORTABILITY','Portability');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (304,'CONVERSION','Conversion');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (305,'DEATH_BENEFIT','Death Benefit');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (306,'DISMEMBERMENT_BENEFIT','Dismemberment Benefit');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (307,'COMA_BENEFIT','Coma Benefit');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (308,'PARALYSIS_BENEFIT','Paralysis Benefit');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (309,'AGE_REDUCTION_2','Age Reduction 2');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (310,'AGE_REDUCTION_3','Age Reduction 3');
*/

/* Vol Life AD&D
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (350,'EMPL_BENEFIT','Employee Benefit');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (351,'EMPL_GURANTEE_ISSUE','Employee Guarantee Issue');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (352,'EMPL_AGE_REDUCTION','Employee Age Reduction');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (353,'SPOUCE_BENEFIT','Spouse Benefit');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (354,'SPOUCE_GURANTEE_ISSUE','Spouse Guarantee Issue');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (355,'CHILDREN_BENEFIT','Children Benefit');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (356,'CHILDREN_GURANTEE_ISSUE','Children Guarantee Issue');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (357,'VOL_EMPL_BENEFIT','Voluntary Employee Benefit');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (358,'VOL_EMPL_GURANTEE_ISSUE','Voluntary Employee Guarantee Issue');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (359,'VOL_SPOUCE_BENEFIT','Voluntary Spouse Benefit');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (360,'VOL_SPOUCE_GURANTEE_ISSUE','Voluntary Spouse Guarantee Issue');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (361,'VOL_CHILDREN_BENEFIT','Voluntary Children Benefit');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (362,'VOL_CHILDREN_GURANTEE_ISSUE','Voluntary Children Guarantee Issue');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (363,'VOL_CHILDREN_AGE_REDUCTION','Voluntary Children Age Reduction');
*/
/* Benefit: LTD
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (400,'LTD_BENEFIT','LTD Benefit');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (401,'LTD_MONTHLY_MAX','LTD Monthly Max');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (402,'LTD_ELIMINATION','LTD Elimination');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (403,'LTD_BENEFIT_PERIOD','LTD Max Benefit Period');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (404,'LTD_PRE_EXISTING_LIMITS','LTD Pre-existing Limits');
*/

/* Benefit: STD
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (450,'STD_BENEFIT','STD Benefit');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (451,'STD_MONTHLY_MAX','STD Monthly Max');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (452,'STD_ELIMINATION','STD Elimination');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (453,'STD_BENEFIT_PERIOD','STD Max Benefit Period');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (454,'STD_PRE_EXISTING_LIMITS','STD Pre-existing Limits');
*/

/* Benefits: Rx */
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (500,'MAIL_ORDER','Mail Order');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (501,'RX_INDIVIDUAL_DEDUCTIBLE','Rx Individual Deductible');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (502,'RX_FAMILY_DEDUCTIBLE','Rx Family Deductible');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (503,'MEMBER_COPAY_TIER_1','Member Copay Tier 1');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (504,'MEMBER_COPAY_TIER_2','Member Copay Tier 2');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (505,'MEMBER_COPAY_TIER_3','Member Copay Tier 3');
INSERT IGNORE INTO benefit_name (benefit_name_id,name,display_name) VALUES (506,'MEMBER_COPAY_TIER_4','Member Copay Tier 4');

COMMIT;

/* Anthem Networks */
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Lumenos HSA', 'HSA', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'HSA Traditional PPO Network', 'PPO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Healthy Support HSA Traditional', 'HSA', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Premier Plus PPO', 'PPO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Premier PPO', 'PPO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Classic PPO', 'PPO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Elements Choice PPO', 'PPO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Healthy Support PPO', 'PPO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'EPO - Prudent Buyer Exclusive', '', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Classic PPO Select PPO', 'PPO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Elements Choice Select PPO', 'PPO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Healthy Support Select PPO', 'PPO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Healthy Support HSA Select', 'PPO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Premier HMO - Traditional Network', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Classic HMO - Traditional Network', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Value HMO Per Day - Traditional Network', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Value HMO Coinsurance - Traditional Network', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Value Deductible - Traditional Network', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Elements Choice HMO - Traditional Network', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Healthy Support HMO - Traditional Network', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Premier HMO - Select Network', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Classic HMO - Select Network', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Value HMO Per Day - Select Network', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Value HMO Coinsurance - Select Network', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Value Deductible - Select Network', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Elements Choice HMO - Select Network', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Healthy Support HMO - Select Network', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Premier HMO - Vivity Network', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Classic HMO - Vivity Network', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Value HMO Per Day - Vivity Network', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Healthy Support HMO - Vivity Network', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Premier HMO - Priority Select Network', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Classic HMO - Priority Select Network', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Value HMO Per Day - Priority Select Network', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Value HMO Coinsurance - Priority Select Network', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Value Deductible - Priority Select Network', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Elements Choice HMO - Priority Select Network', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Healthy Support HMO - Priority Select Network', 'HMO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'BC Exclusive PPO (non-CA resident)', 'PPO', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Blue View Vision Voluntary', 'Vision', 'TIER_1_FULL');
INSERT IGNORE INTO network (carrier_id, name, type, tier) VALUES ((SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Blue View Vision Employer Paid', 'Vision', 'TIER_1_FULL');

COMMIT;

/* RFP Carriers and the type of RFP Submission */
INSERT IGNORE INTO rfp_carrier (carrier_id, category) VALUES ((SELECT carrier_id FROM carrier WHERE display_name='United Health Care'),'MEDICAL');
INSERT IGNORE INTO rfp_carrier (carrier_id, category) VALUES ((SELECT carrier_id FROM carrier WHERE display_name='United Health Care'),'DENTAL');
INSERT IGNORE INTO rfp_carrier (carrier_id, category) VALUES ((SELECT carrier_id FROM carrier WHERE display_name='United Health Care'),'VISION');

COMMIT;

INSERT IGNORE INTO plan (plan_id, created, name, plan_type, updated, carrier_id)
VALUES(1,2016-02-01,'HMO','HMO', 2016-01-01, 22);

INSERT IGNORE INTO plan_name_by_network (pnn_id, cost, created, name, plan_type, updated, network_id, plan_id)
VALUES (1, 12, 2016-02-01, 'HMO', 'HMO', 2016-02-01, 1, 1);
COMMIT;

INSERT IGNORE INTO rfp_submission (rfp_submission_id, created, request_json, rfp_carrier_id, salesforce_id, updated, client_id, submitted_by, submitted_date, disqualification_reason) VALUES (876, null,null , 53, null, null, 1, null, null,null);
COMMIT;
INSERT IGNORE INTO rfp_quote_version(rfp_quote_version_id, rfp_submission_id) VALUES (799, 876);
COMMIT;
INSERT IGNORE INTO rfp_quote (rfp_quote_id, rfp_submission_id, rfp_quote_version_id, kaiser, quote_type, latest, disclaimer, updated, rating_tiers, s3_key, viewed) VALUES (771, 876, 799,null ,'STANDARD', 1, null, '2017-10-25 20:23:38', 4, null, 0);
COMMIT;
INSERT IGNORE INTO rfp_quote_option( rfp_quote_option_id, matches_orig_rfp_option, rfp_quote_option_name, rfp_quote_id, rfp_quote_version_id, final_selection) VALUES (2, 0, 'medical option', 771, 799, 1);
COMMIT;
INSERT IGNORE INTO rfp_quote_option( rfp_quote_option_id, matches_orig_rfp_option, rfp_quote_option_name, rfp_quote_id, rfp_quote_version_id, final_selection) VALUES (3, 0, 'medical option', 771, 799, 1);
COMMIT;

INSERT IGNORE INTO rider_meta
(rider_meta_id, rider_code, rider_description, category, type, selectable) VALUES
(1, 'Acupuncture 10', 'Acupuncture (10 Visits Per Year)', 'Acupuncture', 'PPO', 0);
COMMIT;
INSERT IGNORE INTO rider
(rider_id, tier1_rate, tier2_rate, tier3_rate, tier4_rate, rider_meta_id)
VALUES (1, null,null ,null , null, 1);
COMMIT;

INSERT IGNORE INTO rider_rfp_quote
(rider_rfp_quote_id, rider_id, rfp_quote_id) VALUES
(1, 1, 771);
COMMIT;

INSERT IGNORE INTO rfp_quote_network
(rfp_quote_network_id, a_la_carte, rfp_quote_option_name, network_id, rfp_quote_id, rfp_quote_version_id, rfp_quote_network_combination_id) VALUES
(1237, 1,'medical option' , 1, 771, 799,null );
COMMIT;
INSERT IGNORE INTO rfp_quote_option_network (rfp_quote_option_network_id, er_contribution_format, tier1_census, tier1_er_contribution, tier2_census, tier2_er_contribution, tier3_census, tier3_er_contribution, tier4_census, tier4_er_contribution, client_plan_id, rfp_quote_network_id, rfp_quote_option_id, rfp_quote_version_id, selected_quote_network_plan_id, selected_quote_network_rx_plan_id, tier1_ee_fund, tier2_ee_fund, tier3_ee_fund, tier4_ee_fund, out_of_state, administrative_fee_id, network_group)
VALUES (855, 'PERCENT', 10, 90, 15, 90, 20, 90, 25, 90, null, 1237, 2, 799, null,null , 12, 13, 14, 15, 0,null , null);
COMMIT;
SET FOREIGN_KEY_CHECKS=1;
