<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20190612111114 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE user_team_profile (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, UNIQUE INDEX UNIQ_FEE2A73AA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_email (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, email VARCHAR(255) NOT NULL, title VARCHAR(255) DEFAULT NULL, isLead TINYINT(1) NOT NULL, INDEX IDX_550872CA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_company_profile (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, type VARCHAR(50) DEFAULT NULL, openingHours JSON DEFAULT NULL COMMENT \'(DC2Type:json_array)\', UNIQUE INDEX UNIQ_B3D9DC57A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_team_profile ADD CONSTRAINT FK_FEE2A73AA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_email ADD CONSTRAINT FK_550872CA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_company_profile ADD CONSTRAINT FK_B3D9DC57A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('DROP TABLE company_profile');
        $this->addSql('DROP TABLE profile_description');
        $this->addSql('DROP TABLE team_profile');
        $this->addSql('DROP TABLE unregistered_user');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE company_profile (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, type VARCHAR(50) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci, openingHours JSON DEFAULT NULL COMMENT \'(DC2Type:json_array)\', leadEmail VARCHAR(50) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci, UNIQUE INDEX UNIQ_A105B0D8A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE profile_description (user_id INT NOT NULL, locale VARCHAR(5) NOT NULL COLLATE utf8mb4_0900_ai_ci, type VARCHAR(30) NOT NULL COLLATE utf8mb4_0900_ai_ci, description LONGTEXT NOT NULL COLLATE utf8mb4_0900_ai_ci, translatedFrom VARCHAR(5) DEFAULT NULL COLLATE utf8mb4_0900_ai_ci, INDEX IDX_78F90658A76ED395 (user_id), PRIMARY KEY(user_id, locale, type)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE team_profile (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, UNIQUE INDEX UNIQ_7E2EDB38A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE unregistered_user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(255) NOT NULL COLLATE utf8mb4_0900_ai_ci, propertyCount INT NOT NULL, notified TINYINT(1) NOT NULL, UNIQUE INDEX UNIQ_1C7594DFE7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE company_profile ADD CONSTRAINT FK_A105B0D8A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE profile_description ADD CONSTRAINT FK_78F90658A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE team_profile ADD CONSTRAINT FK_7E2EDB38A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('DROP TABLE user_team_profile');
        $this->addSql('DROP TABLE user_email');
        $this->addSql('DROP TABLE user_company_profile');
    }
}
