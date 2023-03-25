<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20190602074131 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE import_job DROP FOREIGN KEY FK_6FB54078B6A263D9');
        $this->addSql('CREATE TABLE import_ledger (id INT AUTO_INCREMENT NOT NULL, type VARCHAR(255) NOT NULL, refId VARCHAR(255) NOT NULL, createdAt DATETIME NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ENGINE = InnoDB');
        $this->addSql('DROP TABLE import_property_history');
        $this->addSql('DROP TABLE property_import');
        $this->addSql('ALTER TABLE messenger_room DROP INDEX IDX_C2E9ADBB549213EC, ADD UNIQUE INDEX UNIQ_C2E9ADBB549213EC (property_id)');
        $this->addSql('ALTER TABLE messenger_room DROP INDEX IDX_C2E9ADBB7294869C, ADD UNIQUE INDEX UNIQ_C2E9ADBB7294869C (article_id)');
        $this->addSql('DROP INDEX hash_lookup_ij_idx ON import_job');
        $this->addSql('DROP INDEX IDX_6FB54078B6A263D9 ON import_job');
        $this->addSql('ALTER TABLE import_job DROP import_id, DROP url, DROP username, DROP password, DROP user_id, DROP franchise_id, DROP path, DROP type');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE import_property_history (propertyId INT NOT NULL, franchiseId INT DEFAULT NULL, userId INT DEFAULT NULL, sourceRef VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci, dateAdded DATETIME NOT NULL, INDEX sourceRef_idx (sourceRef, franchiseId), PRIMARY KEY(propertyId)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE property_import (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, franchise_id INT DEFAULT NULL, url VARCHAR(255) NOT NULL COLLATE utf8mb4_0900_ai_ci, dateAdded DATETIME NOT NULL, lastRun DATETIME DEFAULT NULL, username VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci, password VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci, source_name VARCHAR(255) NOT NULL COLLATE utf8mb4_0900_ai_ci, default_locale VARCHAR(255) DEFAULT \'en\' NOT NULL COLLATE utf8mb4_0900_ai_ci, default_area_unit VARCHAR(255) DEFAULT \'squareMeter\' NOT NULL COLLATE utf8mb4_0900_ai_ci, INDEX IDX_E339A161523CAB89 (franchise_id), INDEX IDX_E339A161A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE property_import ADD CONSTRAINT FK_E339A161523CAB89 FOREIGN KEY (franchise_id) REFERENCES franchise (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE property_import ADD CONSTRAINT FK_E339A161A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('DROP TABLE import_ledger');
        $this->addSql('ALTER TABLE import_job ADD import_id INT DEFAULT NULL, ADD url VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci, ADD username VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci, ADD password VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci, ADD user_id INT DEFAULT NULL, ADD franchise_id INT DEFAULT NULL, ADD path VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci, ADD type VARCHAR(32) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci');
        $this->addSql('ALTER TABLE import_job ADD CONSTRAINT FK_6FB54078B6A263D9 FOREIGN KEY (import_id) REFERENCES property_import (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX hash_lookup_ij_idx ON import_job (franchise_id, id)');
        $this->addSql('CREATE INDEX IDX_6FB54078B6A263D9 ON import_job (import_id)');
        $this->addSql('ALTER TABLE messenger_room DROP INDEX UNIQ_C2E9ADBB7294869C, ADD INDEX IDX_C2E9ADBB7294869C (article_id)');
        $this->addSql('ALTER TABLE messenger_room DROP INDEX UNIQ_C2E9ADBB549213EC, ADD INDEX IDX_C2E9ADBB549213EC (property_id)');
    }
}
