<?php

namespace Test\AppBundle\Import_\Media;

use AppBundle\Import\Media\LHToSIRMigrationPhotoComparisonStrategy;
use AppBundle\Entity\Property\PropertyPhoto;

class LHToSIRMigrationPhotoComparisonStrategyTest extends \PHPUnit_Framework_TestCase
{
    public function testIsEqual()
    {
        $strategy = new LHToSIRMigrationPhotoComparisonStrategy();

        $photo = new PropertyPhoto();
        $photo->setSourceUrl('http://photos.listhub.net/RFGSIR/CB9NRG/18?lm=20160916T074350');
        $stdPhoto = (object) [
            'index' => 18,
            'url' => 'http://anyurl.local',
        ];

        $this->assertTrue($strategy->isEqual($stdPhoto, $photo));

        $photo = new PropertyPhoto();
        $photo->setSourceUrl('http://anyurl.local');
        $stdPhoto = (object) [
            'index' => 18,
            'url' => 'http://anyurl.local',
        ];

        $this->assertTrue($strategy->isEqual($stdPhoto, $photo));

        $photo = new PropertyPhoto();
        $photo->setSourceUrl('http://photos.listhub.net/RFGSIR/CB9NRG/18?lm=20160916T074350');
        $stdPhoto = (object) [
            'index' => 17,
            'url' => 'http://anyurl.local',
        ];

        $this->assertFalse($strategy->isEqual($stdPhoto, $photo));
    }

    /**
     * @expectedException \RuntimeException
     */
    public function testIsEqualNotIndex()
    {
        $strategy = new LHToSIRMigrationPhotoComparisonStrategy();

        $photo = new PropertyPhoto();
        $photo->setSourceUrl('http://photos.listhub.net/RFGSIR/CB9NRG/NOT_INDEX?lm=20160916T074350');
        $stdPhoto = (object) [
            'index' => 18,
            'url' => 'http://anyurl.local',
        ];
        $strategy->isEqual($stdPhoto, $photo);
    }

    public function testIsEqualMisformedUrl()
    {
        $strategy = new LHToSIRMigrationPhotoComparisonStrategy();

        $photo = new PropertyPhoto();
        $photo->setSourceUrl('http://misformed.local');
        $stdPhoto = (object) [
            'index' => 18,
            'url' => 'http://anyurl.local',
        ];

        $this->assertFalse($strategy->isEqual($stdPhoto, $photo));
    }
}
