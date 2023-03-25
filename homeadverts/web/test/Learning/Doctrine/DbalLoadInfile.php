<?php

namespace Learning\Doctrine;

use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class DbalLoadInfile extends KernelTestCase
{
    protected $conn;

    protected function setUp()
    {
        self::bootKernel();

        $this->conn = static::$kernel->getContainer()
            ->get('doctrine.dbal.sothebys_connection')
        ;
    }

    public function testLoadInfile()
    {
        $fileAddress = '/var/lib/mysql-files/SIRCodePropertyType.txt';
        $table = 'sir_code_property_type';
        $affectedRows = $this->conn->exec(sprintf(<<<SQL
        LOAD DATA INFILE '%s' IGNORE INTO TABLE %s
                FIELDS TERMINATED BY '|' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES
SQL
        , $fileAddress, $table));
        $this->assertEquals($affectedRows, count(file(__DIR__.'/fixtures/SIRCodePropertyType.txt')) - 1);
    }

    protected function tearDown()
    {
        $this->conn->exec('SET foreign_key_checks=0; TRUNCATE sir_code_property_type');
        parent::tearDown();
    }
}
