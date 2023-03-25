USE `br_dev`;
/**
 * SAMPLE DATA: Demo account and data to seed db for presentations 
 */

/* Table:broker - default test broker house */
INSERT INTO broker (name, zip, broker_token) VALUES ('My Brokerage', '92101', '11308fe18158f59803968a101b300212');

/* Table:users - default test user */
INSERT INTO users (name, broker_id, email, password, verified, role, admin, status) VALUES ('Jimson', 1, 'demo@benrevo.com', '7f904775b0e549492ad96da3cf3e1fc3', 1, 'Account Manager', 1, 'Approved');
INSERT INTO oauth_access_token (users_id, expires_in, access_token) VALUES (1, 36600, '0rtcr0qe17phv21v9e9ethp3mg');

/* Table:client*/
INSERT INTO client (broker_id, client_name, employee_count, image, effective_date, last_visited) VALUES (1, 'Atom Biotech', 65, 'o446sslg0otsb8ilen5s8eopoj_clientslogo1.png', '2016-05-01', '2016-05-29');
INSERT INTO client (broker_id, client_name, employee_count, image, effective_date, last_visited) VALUES (1, 'Express Lab', 78, 'e8v1l8qeb7vhu0fuuc2tv62mk2_clientslogo2.png', '2016-06-15', '2016-06-01');
INSERT INTO client (broker_id, client_name, employee_count, image, effective_date, last_visited) VALUES (1, 'PageMed', 89, 'ptkippbrub7leg28fha6q16sfl_clientslogo3.png', '2016-07-01', '2016-06-03');
INSERT INTO client (broker_id, client_name, employee_count, image, effective_date, last_visited) VALUES (1, 'Whitman', 115, 'rshjb8kv2pe23si6rkge4vhp97_clientslogo4.png', '2016-05-01', '2016-06-05');
INSERT INTO client (broker_id, client_name, employee_count, image, effective_date, last_visited) VALUES (1, 'Gold Business', 200, '7ag7j5sjmmgg7j25d713mml3t3_clientslogo5.png', '2016-05-15', '2016-06-10');
INSERT INTO client (broker_id, client_name, employee_count, image, effective_date, last_visited) VALUES (1, 'eALCHE', 91, 'hku7mj8el63tm559gcckadglvp_clientslogo6.png', '2016-04-15', '2016-06-10');

INSERT INTO census (client_id, tier1, tier2, tier3, tier4) 
VALUES (1, 100,100,100,100);
INSERT INTO census (client_id, tier1, tier2, tier3, tier4) 
VALUES (2, 110,110,100,110);
INSERT INTO census (client_id, tier1, tier2, tier3, tier4) 
VALUES (3, 50,25,25,15);
INSERT INTO census (client_id, tier1, tier2, tier3, tier4) 
VALUES (4, 130,130,130,130);
INSERT INTO census (client_id, tier1, tier2, tier3, tier4) 
VALUES (5, 140,140,140,140);
