<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20190516094256 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE ha_file ADD message_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE ha_file ADD CONSTRAINT FK_F105B015537A1329 FOREIGN KEY (message_id) REFERENCES messenger_message (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_F105B015537A1329 ON ha_file (message_id)');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE ha_file DROP FOREIGN KEY FK_F105B015537A1329');
        $this->addSql('DROP INDEX UNIQ_F105B015537A1329 ON ha_file');
        $this->addSql('ALTER TABLE ha_file DROP message_id');
    }
}
