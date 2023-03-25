ALTER TABLE `rfp_quote_summary`
  ADD COLUMN `client_id` bigint(20) NOT NULL AFTER id,
  ADD FOREIGN KEY fk_rfp_summary_client_id(client_id) REFERENCES client(client_id);

ALTER TABLE `br_dev`.`rfp_quote_summary`
DROP FOREIGN KEY `fk_rfp_quote_id`;

ALTER TABLE `br_dev`.`rfp_quote_summary`
  DROP COLUMN `rfp_quote_id`,
  DROP INDEX `fk_rfp_quote_id` ;

ALTER TABLE `rfp_quote_summary` ADD UNIQUE (client_id);

ALTER TABLE rfp ADD CONSTRAINT uc_client_id_product UNIQUE (client_id, product);