<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20190601181912 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE import_job DROP FOREIGN KEY FK_6FB54078399DE28F');
        $this->addSql('DROP TABLE import_agent');
        $this->addSql('DROP TABLE import_job_group');
        $this->addSql('DROP TABLE ProfilePhoto');
        $this->addSql('DROP INDEX IDX_6FB54078399DE28F ON import_job');
        $this->addSql('ALTER TABLE import_job DROP import_job_group_id');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE import_agent (id INT AUTO_INCREMENT NOT NULL, franchise_id INT DEFAULT NULL, sourceRef VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci, dateAdded DATETIME NOT NULL, name VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci, companyName VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci, email VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci, phone VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci, address VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci, url VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci, approvedAt DATETIME DEFAULT NULL, INDEX IDX_CBDE3353523CAB89 (franchise_id), INDEX sourceRef_idx (sourceRef), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE import_job_group (id INT AUTO_INCREMENT NOT NULL, createdAt DATETIME NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE ProfilePhoto (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL COLLATE utf8mb4_0900_ai_ci, path VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE import_agent ADD CONSTRAINT FK_CBDE3353523CAB89 FOREIGN KEY (franchise_id) REFERENCES franchise (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE import_job ADD import_job_group_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE import_job ADD CONSTRAINT FK_6FB54078399DE28F FOREIGN KEY (import_job_group_id) REFERENCES import_job_group (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_6FB54078399DE28F ON import_job (import_job_group_id)');
    }
}
