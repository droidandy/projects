<?php

namespace Test\AppBundle\Import_\Media;

use AppBundle\Import\Media\ImageCleaner;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Statement;

class ImageCleanerTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    protected $conn;
    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    private $stmt;
    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    private $imageCleaner;

    protected function setUp()
    {
        $this->conn = $this->getConnection();
        $this->stmt = $this->getStatement();
        $this->imageCleaner = $this->getImageCleaner($this->conn);
    }

    public function testRemovePropertyPhotos()
    {
        $propertyId = 1;
        $this
            ->stmt
            ->expects($this->exactly(4))
            ->method('fetchColumn')
            ->willReturnOnConsecutiveCalls('url1', 'url2', 'url3', false)
        ;
        $this
            ->conn
            ->expects($this->once())
            ->method('executeQuery')
            ->with(ImageCleaner::GET_IMAGES_SQL, [
                'property_id' => $propertyId,
            ])
            ->willReturn($this->stmt)
        ;
        $this
            ->imageCleaner
            ->expects($this->once())
            ->method('scheduleRemoval')
            ->with($propertyId, ['url1', 'url2', 'url3'])
        ;

        $this->imageCleaner->cleanPropertyPhotos($propertyId);
    }

    public function testRemovePropertyPhotosWithNoResults()
    {
        $propertyId = 1;
        $this
            ->stmt
            ->expects($this->once())
            ->method('fetchColumn')
            ->willReturn(false)
        ;
        $this
            ->conn
            ->expects($this->once())
            ->method('executeQuery')
            ->with(ImageCleaner::GET_IMAGES_SQL, [
                'property_id' => $propertyId,
            ])
            ->willReturn($this->stmt)
        ;
        $this
            ->imageCleaner
            ->expects($this->never())
            ->method('scheduleRemoval')
        ;

        $this->imageCleaner->cleanPropertyPhotos($propertyId);
    }

    private function getConnection()
    {
        return $this
            ->getMockBuilder(Connection::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getStatement()
    {
        return $this
            ->getMockBuilder(Statement::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getImageCleaner($conn)
    {
        return $this
            ->getMockBuilder(ImageCleaner::class)
            ->setConstructorArgs([$conn])
            ->setMethods(['scheduleRemoval'])
            ->getMock()
        ;
    }
}
