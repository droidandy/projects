USE `br_dev`;

/* Table:network - HMO */
INSERT INTO network (carrier_id, name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='AETNA'), 'HMO', 'HMO', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='AETNA'), 'AVN HMO', 'HMO', 'TIER_2_NARROW');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='AETNA'), 'Deductible HMO', 'HMO', 'TIER_2_NARROW');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='AETNA'), 'Basic HMO', 'HMO', 'TIER_3_NARROW_SPECIALTY');

INSERT INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Traditional', 'HMO','TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Select +', 'HMO', 'TIER_2_NARROW');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Select', 'HMO', 'TIER_3_NARROW_SPECIALTY');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Priority Select', 'HMO', 'TIER_3_NARROW_SPECIALTY');

INSERT INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='BLUE_SHIELD'), 'Access + HMO', 'HMO', 'TIER_1_FULL');    
INSERT INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='BLUE_SHIELD'), 'Access + HMO Savenet', 'HMO', 'TIER_2_NARROW');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='BLUE_SHIELD'), 'Local Access + HMO', 'HMO', 'TIER_3_NARROW_SPECIALTY');

INSERT INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='CIGNA'), 'Full Network', 'HMO', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='CIGNA'), 'Select Network', 'HMO', 'TIER_3_NARROW_SPECIALTY');    
INSERT INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='CIGNA'), 'Value Network', 'HMO', 'TIER_3_NARROW_SPECIALTY');    

INSERT INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='HEALTHNET'), 'HMO', 'HMO', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='HEALTHNET'), 'EOA', 'HMO', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='HEALTHNET'), 'HMO Excelcare', 'HMO', 'TIER_2_NARROW');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='HEALTHNET'), 'EOA Excelcare', 'HMO', 'TIER_2_NARROW');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='HEALTHNET'), 'N.CA Smartcare', 'HMO', 'TIER_3_NARROW_SPECIALTY');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='HEALTHNET'), 'S.CA Smartcare', 'HMO', 'TIER_3_NARROW_SPECIALTY');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='HEALTHNET'), 'Salud SIMNSA Network',  'HMO', 'TIER_3_NARROW_SPECIALTY');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='HEALTHNET'), 'Salud CA Network',  'HMO', 'TIER_3_NARROW_SPECIALTY');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='HEALTHNET'), 'Salud HMO y Mas Mexico',  'HMO', 'TIER_3_NARROW_SPECIALTY');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='HEALTHNET'), 'Salud HMO y Mas San Diego',  'HMO', 'TIER_3_NARROW_SPECIALTY');

INSERT INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='UHC'), 'Signature', 'HMO', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='UHC'), 'Advantage', 'HMO', 'TIER_2_NARROW');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='UHC'), 'Alliance', 'HMO', 'TIER_3_NARROW_SPECIALTY');

/* Table:network - PPO */
INSERT INTO network (carrier_id,name, type, tier) VALUES (
    (SELECT carrier_id FROM carrier WHERE name='CIGNA'), 'Full Network', 'PPO', 'TIER_1_FULL');

INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Full Network', 'PPO', 'TIER_1_FULL');

INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Unlimited Rollover', 'PPO', 'TIER_1_FULL');

INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), '1x Rollover', 'PPO', 'TIER_1_FULL');

INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), '2x Rollover', 'PPO', 'TIER_1_FULL');

INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='HEALTHNET'), 'Full Network', 'PPO', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='HEALTHNET'), 'Select Network', 'PPO', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='HEALTHNET'), 'Choice Network', 'PPO', 'TIER_1_FULL');


INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='BLUE_SHIELD'), 'Select Network', 'PPO', 'TIER_1_FULL');

INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='UHC'), 'Select Network', 'PPO', 'TIER_1_FULL');

/* Table:network - DENTAL */
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Entire Network', 'DEPO', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='CIGNA'), 'Entire Network', 'DEPO', 'TIER_1_FULL');

INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Entire Network', 'DPPO', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='METLIFE'), 'Entire Network', 'DPPO', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='PRINCIPAL_FINANCIAL_GROUP'), 'Entire Network', 'DPPO', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='GUARDIAN'), 'Entire Network', 'DPPO', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='CIGNA'), 'Entire Network', 'DPPO', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='DELTA_DENTAL'), 'Entire Network', 'DPPO', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='UNITED_CONCORDIA'), 'Entire Network', 'DPPO', 'TIER_1_FULL');

INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Entire Network', 'DHMO', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='CIGNA'), 'Entire Network', 'DHMO', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='DELTA_DENTAL'), 'Entire Network', 'DHMO', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='GUARDIAN'), 'Entire Network', 'DHMO', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='METLIFE'), 'Entire Network', 'DHMO', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='PRINCIPAL_FINANCIAL_GROUP'), 'Entire Network', 'DHMO', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='UNITED_CONCORDIA'), 'Entire Network', 'DHMO', 'TIER_1_FULL');

/* Table:network - VISION */  
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Entire Network', 'VISION', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='CIGNA'), 'Entire Network', 'VISION', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='GUARDIAN'), 'Entire Network', 'VISION', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='METLIFE'), 'Entire Network', 'VISION', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='PRINCIPAL_FINANCIAL_GROUP'), 'Entire Network', 'VISION', 'TIER_1_FULL');

/*Table:network - LIFE */    
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='GUARDIAN'), 'Entire Network', 'LIFE', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='PRINCIPAL_FINANCIAL_GROUP'), 'Entire Network', 'LIFE', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='METLIFE'), 'Entire Network', 'LIFE', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='CIGNA'), 'Entire Network', 'LIFE', 'TIER_1_FULL');

/*Table:network - VOLLIFE */  
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Entire Network', 'VOLLIFE', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='CIGNA'), 'Entire Network', 'VOLLIFE', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='GUARDIAN'), 'Entire Network', 'VOLLIFE', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='METLIFE'), 'Entire Network', 'VOLLIFE', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='PRINCIPAL_FINANCIAL_GROUP'), 'Entire Network', 'VOLLIFE', 'TIER_1_FULL');

/*Table:network - LTD */  
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Entire Network', 'LTD', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='CIGNA'), 'Entire Network', 'LTD', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='GUARDIAN'), 'Entire Network', 'LTD', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='METLIFE'), 'Entire Network', 'LTD', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='PRINCIPAL_FINANCIAL_GROUP'), 'Entire Network', 'LTD', 'TIER_1_FULL');

/*Table:network - STD */  
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='ANTHEM_BLUE_CROSS'), 'Entire Network', 'STD', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='CIGNA'), 'Entire Network', 'STD', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='GUARDIAN'), 'Entire Network', 'STD', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='METLIFE'), 'Entire Network', 'STD', 'TIER_1_FULL');
INSERT INTO network (carrier_id,name, type, tier) VALUES (
(SELECT carrier_id FROM carrier WHERE name='PRINCIPAL_FINANCIAL_GROUP'), 'Entire Network', 'STD', 'TIER_1_FULL');


/* Table:benefit_name */
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (28,'ADVANCED_RADIOLOGY','Advanced Radiology');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (29,'EMERGENCY_ROOM','Emergency Room');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (30,'AMBULANCE','Ambulance');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (31,'RX_MAIL_ORDER','Rx Mail Order');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (32,'SPECIALIST','Specialist');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (33,'RX_PREFERRED','Rx Preferred');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (34,'RX_SPECIALTY','Rx Specialty');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (35,'FAMILY_OOP_LIMIT','Family OOP Limit');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (36,'PREVENTIVE_CARE','Preventive Care');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (37,'SKILLED_NURSING','Skilled Nursing');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (38,'URGENT_CARE','Urgent Care');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (39,'CO_INSURANCE','Co-insurance');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (40,'RX_NON_PREFERRED','Rx Non-Preferred');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (41,'RX_GENERIC','Rx Generic');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (42,'OUTPATIENT_FACILITY','Outpatient Facility');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (43,'INDIVIDUAL_DEDUCTIBLE','Individual Deductible');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (44,'OUTPATIENT_SURGERY','Outpatient Surgery');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (45,'RX_FAMILY_DEDUCTIBLE','Rx Family Deductible');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (46,'LAB_X_RAY','Lab/X-Ray');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (47,'PCP','PCP');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (48,'CHIROPRACTIC_CARE','Chiropractic Care');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (49,'INDIVIDUAL_OOP_LIMIT','Individual OOP Limit');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (50,'INPATIENT_HOSPITAL','Inpatient Hospital');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (51,'RX_INDIVIDUAL_DEDUCTIBLE','Rx Individual Deductible');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (52,'FAMILY_DEDUCTIBLE','Family Deductible');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (53,'PHYSICAL_THERAPY','Physical Therapy');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (54,'SELF_REFERRED','Self Referred');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (55,'EE_HRA_FUND','EE HRA Fund');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (56,'FAM_HRA_FUND','FAM HRA Fund'); 

/* Dental:DPPO,DEPO */
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (100,'CALENDAR_YEAR_MAXIMUM', 'Calendar Year Maximum');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (101,'CALENDAR_YEAR_DEDUCTIBLE','Calendar Year Deductible');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (102,'DENTAL_INDIVIDUAL','Individual');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (103,'DENTAL_FAMILY','Family');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (104,'WAIVED_FOR_PREVENTIVE','Waived for Preventive?');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (105,'CLASS_1_PREVENTIVE','Class 1 - Preventive');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (106,'CLASS_2_BASIC','Class II - Basic');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (107,'CLASS_3_MAJOR','Class III - Major');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (108,'CLASS_4_ORTHODONTIA','Class IV - Orthodontia');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (109,'ORTHODONTIA_LIFETIME_MAX','Orthodontia Lifetime Max');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (110,'DENTAL_OUT_OF_NETWORK_REIMBURSEMENT','Out of Network Reimbursement');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (111,'IMPLANT_COVERAGE','Implant Coverage');

/* Dental:DHMO */
/*Preventive & Diagnostic Services*/
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (120,'DENTAL_OFFICE_VISIT','Office Visit'); 
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (121,'ORAL_EXAMINATION','Oral Examination'); 
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (122,'FULL_MOUTH_XRAY','Full Mouth X-rays'); 
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (123,'PROPHYLAXIS','Prophylaxis (Cleaning)'); 
/*Restorative Services*/
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (124,'AMALGAM','Amalgam (1 surface) primary/permanent'); 
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (125,'COMPOSITE_FRONT_TOOTH','Composite (tooth colored) Front Tooth'); 
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (126,'COMPOSITE_BACK_TOOTH','Composite (tooth colored) Back Tooth'); 
/*Endodontic Services*/
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (127,'ROOT_CANAL','Root Canal (3 Canals - Molar)'); 
/*Periodontic Services*/
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (128,'GINGIVECTOMY_PER_QUAD','Gingivectomy (per quad)'); 
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (129,'GINGIVECTOMY_PER_TOOTH','Gingivectomy (per tooth)'); 
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (130,'OSSEOUS_SURGERY_PER_QUAD','Osseous Surgery (per quad)'); 
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (131,'SCALING_ROOT_PLANNING','Scaling/Root Planing (per quad)'); 
/*Fixed Prosthodontic Services*/
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (132,'CROWN_PORCELAIN','Crown (porcelain w/metal)'); 
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (133,'CROWN_FULL_CAST','Crown (full cast metal)'); 
/*Removable Prosthodontic Services*/
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (134,'COMPLETE_DENTURE','Complete Denture (upper or lower)'); 
/*Orthodontia Services*/
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (135,'ORTHO_SERVICES_CHILDREN','Orthodontia Services Children'); 
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (136,'ORTHO_SERVICES_ADULTS','Orthodontia Services Adults'); 
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (137,'ORTHO_SERVICES_RETENTION_FEES','Orthodontia Services Retention Fees Child(ren) or Adult'); 
/* END - Table:benefit_name */

/* Vision */
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (200,'EXAMS_FREQUENCY','Exams Frequency');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (201,'LENSES_FREQUENCY','Lenses Frequency');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (202,'FRAMES_FREQUENCY','Frames Frequency');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (203,'EXAM_COPAY','Exam Copay');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (204,'MATERIALS_COPAY','Materials Copay');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (205,'VISION_EXAM','Vision Exam');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (206,'SINGLE_VISION_LENS','Single Vision Lens');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (207,'BIFOCAL_LENS','Bifocal Lens');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (208,'TRIFOCAL_LENS','Trifocal Lens');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (209,'LENTICULAR_LENSES','Lenticular Lenses');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (210,'CONTACTS_ELECTIVE','Contacts Elective');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (211,'CONTACTS_THERAPEUTIC','Contacts Therapeutic');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (212,'FRAMES','Frames');

/* Life AD&D */
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (300,'BENEFIT_CLASS_1','Benefit Class 1');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (301,'BENEFIT_CLASS_2','Benefit Class 2');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (302,'AGE_REDUCTION','Age Reduction');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (303,'PORTABILITY','Portability');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (304,'CONVERSION','Conversion');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (305,'DEATH_BENEFIT','Death Benefit');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (306,'DISMEMBERMENT_BENEFIT','Dismemberment Benefit');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (307,'COMA_BENEFIT','Coma Benefit');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (308,'PARALYSIS_BENEFIT','Paralysis Benefit');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (309,'AGE_REDUCTION_2','Age Reduction 2');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (310,'AGE_REDUCTION_3','Age Reduction 3');

/* Vol Life AD&D */
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (350,'EMPL_BENEFIT','Employee Benefit');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (351,'EMPL_GURANTEE_ISSUE','Employee Guarantee Issue');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (352,'EMPL_AGE_REDUCTION','Employee Age Reduction');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (353,'SPOUCE_BENEFIT','Spouse Benefit');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (354,'SPOUCE_GURANTEE_ISSUE','Spouse Guarantee Issue');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (355,'CHILDREN_BENEFIT','Children Benefit');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (356,'CHILDREN_GURANTEE_ISSUE','Children Guarantee Issue');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (357,'VOL_EMPL_BENEFIT','Voluntary Employee Benefit');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (358,'VOL_EMPL_GURANTEE_ISSUE','Voluntary Employee Guarantee Issue');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (359,'VOL_SPOUCE_BENEFIT','Voluntary Spouse Benefit');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (360,'VOL_SPOUCE_GURANTEE_ISSUE','Voluntary Spouse Guarantee Issue');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (361,'VOL_CHILDREN_BENEFIT','Voluntary Children Benefit');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (362,'VOL_CHILDREN_GURANTEE_ISSUE','Voluntary Children Guarantee Issue');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (363,'VOL_CHILDREN_AGE_REDUCTION','Voluntary Children Age Reduction');

/* Benefit: LTD */
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (400,'LTD_BENEFIT','LTD Benefit');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (401,'LTD_MONTHLY_MAX','LTD Monthly Max');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (402,'LTD_ELIMINATION','LTD Elimination');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (403,'LTD_BENEFIT_PERIOD','LTD Max Benefit Period');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (404,'LTD_PRE_EXISTING_LIMITS','LTD Pre-existing Limits');

/* Benefit: STD */
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (450,'STD_BENEFIT','STD Benefit');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (451,'STD_MONTHLY_MAX','STD Monthly Max');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (452,'STD_ELIMINATION','STD Elimination');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (453,'STD_BENEFIT_PERIOD','STD Max Benefit Period');
INSERT INTO benefit_name (benefit_name_id,name,display_name) VALUES (454,'STD_PRE_EXISTING_LIMITS','STD Pre-existing Limits');