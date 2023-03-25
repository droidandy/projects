<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20190625234331 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE ha_article DROP FOREIGN KEY FK_79F289671F55203D');
        $this->addSql('ALTER TABLE ha_topic_followed DROP FOREIGN KEY FK_7BAA9A421F55203D');
        $this->addSql('ALTER TABLE ha_topic_synonym DROP FOREIGN KEY FK_D5DFD621F55203D');
        $this->addSql('CREATE TABLE ha_tag_followed (id INT AUTO_INCREMENT NOT NULL, tag_id INT NOT NULL, user_id INT NOT NULL, createdAt DATETIME NOT NULL, INDEX IDX_65AA073BBAD26311 (tag_id), INDEX IDX_65AA073BA76ED395 (user_id), UNIQUE INDEX tag_user_unique (tag_id, user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE ha_tag_followed ADD CONSTRAINT FK_65AA073BBAD26311 FOREIGN KEY (tag_id) REFERENCES ha_tag (id)');
        $this->addSql('ALTER TABLE ha_tag_followed ADD CONSTRAINT FK_65AA073BA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('DROP TABLE ha_topic');
        $this->addSql('DROP TABLE ha_topic_followed');
        $this->addSql('DROP TABLE ha_topic_synonym');
        $this->addSql('ALTER TABLE ha_tag DROP FOREIGN KEY FK_9E91030C61220EA6');
        $this->addSql('DROP INDEX IDX_9E91030C61220EA6 ON ha_tag');
        $this->addSql('ALTER TABLE ha_tag CHANGE creator_id user_id INT NOT NULL');
        $this->addSql('ALTER TABLE ha_tag ADD CONSTRAINT FK_9E91030CA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('CREATE INDEX IDX_9E91030CA76ED395 ON ha_tag (user_id)');
        $this->addSql('ALTER TABLE ha_article_tag DROP FOREIGN KEY FK_9A40B6B94221246');
        $this->addSql('DROP INDEX IDX_9A40B6B94221246 ON ha_article_tag');
        $this->addSql('ALTER TABLE ha_article_tag CHANGE assigner_id user_id INT NOT NULL, CHANGE assignedat createdAt DATETIME NOT NULL');
        $this->addSql('ALTER TABLE ha_article_tag ADD CONSTRAINT FK_9A40B6BA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('CREATE INDEX IDX_9A40B6BA76ED395 ON ha_article_tag (user_id)');
        $this->addSql('DROP INDEX IDX_79F289671F55203D ON ha_article');
        $this->addSql('ALTER TABLE ha_article DROP topic_id');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE ha_topic (id INT AUTO_INCREMENT NOT NULL, creator_id INT NOT NULL, name VARCHAR(255) NOT NULL COLLATE utf8mb4_0900_ai_ci, createdAt DATETIME NOT NULL, INDEX IDX_ED57B01261220EA6 (creator_id), UNIQUE INDEX UNIQ_ED57B0125E237E06 (name), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE ha_topic_followed (id INT AUTO_INCREMENT NOT NULL, topic_id INT NOT NULL, user_id INT NOT NULL, createdAt DATETIME NOT NULL, INDEX IDX_7BAA9A421F55203D (topic_id), INDEX IDX_7BAA9A42A76ED395 (user_id), UNIQUE INDEX topic_user_unique (topic_id, user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE ha_topic_synonym (id INT AUTO_INCREMENT NOT NULL, topic_id INT NOT NULL, creator_id INT NOT NULL, displayName VARCHAR(255) NOT NULL COLLATE utf8mb4_0900_ai_ci, lang VARCHAR(255) NOT NULL COLLATE utf8mb4_0900_ai_ci, topic_default TINYINT(1) NOT NULL, createdAt DATETIME NOT NULL, INDEX IDX_D5DFD621F55203D (topic_id), INDEX IDX_D5DFD6261220EA6 (creator_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE ha_topic ADD CONSTRAINT FK_ED57B01261220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE ha_topic_followed ADD CONSTRAINT FK_7BAA9A421F55203D FOREIGN KEY (topic_id) REFERENCES ha_topic (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE ha_topic_followed ADD CONSTRAINT FK_7BAA9A42A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE ha_topic_synonym ADD CONSTRAINT FK_D5DFD621F55203D FOREIGN KEY (topic_id) REFERENCES ha_topic (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE ha_topic_synonym ADD CONSTRAINT FK_D5DFD6261220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('DROP TABLE ha_tag_followed');
        $this->addSql('ALTER TABLE ha_article ADD topic_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE ha_article ADD CONSTRAINT FK_79F289671F55203D FOREIGN KEY (topic_id) REFERENCES ha_topic (id) ON UPDATE NO ACTION ON DELETE SET NULL');
        $this->addSql('CREATE INDEX IDX_79F289671F55203D ON ha_article (topic_id)');
        $this->addSql('ALTER TABLE ha_article_tag DROP FOREIGN KEY FK_9A40B6BA76ED395');
        $this->addSql('DROP INDEX IDX_9A40B6BA76ED395 ON ha_article_tag');
        $this->addSql('ALTER TABLE ha_article_tag CHANGE user_id assigner_id INT NOT NULL, CHANGE createdat assignedAt DATETIME NOT NULL');
        $this->addSql('ALTER TABLE ha_article_tag ADD CONSTRAINT FK_9A40B6B94221246 FOREIGN KEY (assigner_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('CREATE INDEX IDX_9A40B6B94221246 ON ha_article_tag (assigner_id)');
        $this->addSql('ALTER TABLE ha_tag DROP FOREIGN KEY FK_9E91030CA76ED395');
        $this->addSql('DROP INDEX IDX_9E91030CA76ED395 ON ha_tag');
        $this->addSql('ALTER TABLE ha_tag CHANGE user_id creator_id INT NOT NULL');
        $this->addSql('ALTER TABLE ha_tag ADD CONSTRAINT FK_9E91030C61220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('CREATE INDEX IDX_9E91030C61220EA6 ON ha_tag (creator_id)');
    }
}
