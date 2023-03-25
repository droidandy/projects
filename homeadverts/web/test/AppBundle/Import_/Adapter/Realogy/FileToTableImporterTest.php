<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys;

use AppBundle\Import\Adapter\Sothebys\FileToTableImporter;
use Doctrine\DBAL\Connection;
use Monolog\Logger;

class FileToTableImporterTest extends \PHPUnit_Framework_TestCase
{
    public function testImportByMapping()
    {
        $conn = $this
            ->getMockBuilder(Connection::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
        $conn
            ->expects($this->exactly(4))
            ->method('exec')
            ->withConsecutive(
                [sprintf(FileToTableImporter::TRUNCATE_TEMPLATE, 'sir_office')],
                [sprintf(FileToTableImporter::LOAD_DATA_TEMPLATE, 'some_folder/SirOffice.txt', 'sir_office')],
                [sprintf(FileToTableImporter::TRUNCATE_TEMPLATE, 'sir_agent')],
                [sprintf(FileToTableImporter::LOAD_DATA_TEMPLATE, 'some_folder/SirAgent.txt', 'sir_agent')]
            )
        ;
        $logger = $this
            ->getMockBuilder(Logger::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
        $logger
            ->expects($this->exactly(4))
            ->method('info')
        ;
        $importer = new FileToTableImporter($conn, $logger);
        $importer->importByMapping('some_folder', [
            'sir_office' => 'SirOffice.txt',
            'sir_agent' => 'SirAgent.txt',
        ]);
    }
}
