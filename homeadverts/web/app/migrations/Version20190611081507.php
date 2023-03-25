<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20190611081507 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649523CAB89');
        $this->addSql('ALTER TABLE user_source_ref DROP FOREIGN KEY FK_E2FCFD0E523CAB89');
        $this->addSql('DROP TABLE franchise');
        $this->addSql('DROP INDEX IDX_8D93D649523CAB89 ON user');
        $this->addSql('ALTER TABLE user DROP franchise_id, DROP emails, DROP listingAgent, DROP status, DROP mailSystem, DROP agentApplicationDate, DROP social_facebook, DROP social_twitter, DROP social_gplus, DROP social_linkedin, DROP social_pinterest, DROP social_youtube, DROP mailNewsletter, DROP emailGenerated, DROP source_modified_at');
        $this->addSql('DROP INDEX IDX_E2FCFD0E523CAB89 ON user_source_ref');
        $this->addSql('ALTER TABLE user_source_ref DROP franchise_id');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE franchise (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL COLLATE utf8mb4_0900_ai_ci, defaultProfileImage VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci, defaultCoverImage VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci, updated DATETIME DEFAULT NULL, preapproveAgents TINYINT(1) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user ADD franchise_id INT DEFAULT NULL, ADD listingAgent TINYINT(1) NOT NULL, ADD status SMALLINT NOT NULL, ADD mailSystem TINYINT(1) NOT NULL, ADD agentApplicationDate DATETIME DEFAULT NULL, ADD social_facebook VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci, ADD social_twitter VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci, ADD social_gplus VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci, ADD social_linkedin VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci, ADD social_pinterest VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci, ADD social_youtube VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci, ADD mailNewsletter TINYINT(1) NOT NULL, ADD emailGenerated TINYINT(1) NOT NULL, ADD source_modified_at VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649523CAB89 FOREIGN KEY (franchise_id) REFERENCES franchise (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_8D93D649523CAB89 ON user (franchise_id)');
        $this->addSql('ALTER TABLE user_source_ref ADD franchise_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE user_source_ref ADD CONSTRAINT FK_E2FCFD0E523CAB89 FOREIGN KEY (franchise_id) REFERENCES franchise (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_E2FCFD0E523CAB89 ON user_source_ref (franchise_id)');
    }
}
