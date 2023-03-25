<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

class Version20190503155034 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        $this->addSql(
            <<<SQL
                ALTER TABLE `property`
                    ADD `googleLocationsFullAddressStatus` VARCHAR(255) DEFAULT NULL,
                    ADD `googleLocationsFullAddressStatusCreatedAt` DATETIME DEFAULT NULL,
                    ADD `googleLocationsFullAddressStatusReport` JSON DEFAULT NULL COMMENT '(DC2Type:json_array)'
SQL
        );
        $this->addSql(
            <<<SQL
                ALTER TABLE `user`
                    ADD `googleLocationsFullAddressStatus` VARCHAR(255) DEFAULT NULL,
                    ADD `googleLocationsFullAddressStatusCreatedAt` DATETIME DEFAULT NULL,
                    ADD `googleLocationsFullAddressStatusReport` JSON DEFAULT NULL COMMENT '(DC2Type:json_array)'
SQL
        );
    }

    public function down(Schema $schema)
    {
        $this->addSql(
            <<<SQL
                ALTER TABLE `user`
                    DROP COLUMN `googleLocationsFullAddressStatus`,
                    DROP COLUMN `googleLocationsFullAddressStatusCreatedAt`,
                    DROP COLUMN `googleLocationsFullAddressStatusReport`
SQL
        );
        $this->addSql(
            <<<SQL
                ALTER TABLE `property`
                    DROP COLUMN `googleLocationsFullAddressStatus`,
                    DROP COLUMN `googleLocationsFullAddressStatusCreatedAt`,
                    DROP COLUMN `googleLocationsFullAddressStatusReport`
SQL
        );
    }
}