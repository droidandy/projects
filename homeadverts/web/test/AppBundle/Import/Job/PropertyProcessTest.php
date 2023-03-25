<?php

namespace Test\AppBundle\Import\Job;

use AppBundle\Entity\Import\ImportJob;
use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyTypes;
use AppBundle\Import\Job\Process;

use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\ImportJobTrait;
use VCR\VCR;

class PropertyProcessTest extends AbstractWebTestCase
{
    use ImportJobTrait;

    protected $rollbackTransactions = true;

    protected function setUp()
    {
        parent::setUp();
        VCR::configure()
            ->setCassettePath('test/fixtures/vcr/realogy/')
            ->enableRequestMatchers(array('method', 'url', 'host'));

        VCR::turnOn();
    }

    protected function tearDown()
    {
        parent::tearDown();
        VCR::turnOff();
    }

    public function testDoRun()
    {
        VCR::insertCassette('property.yml');

        $job = $this->newImportJobPersistent(ImportJob::DATA_SYNC_ACTIVE);
        $app = $this->getContainer();
        $args = [
            'ref' => '3825c93d-a508-4397-8fbd-42adf1ef65f7',
            'updated_at' => '2019-05-14T15:30:25.200',
            'jobID' => $job->getId(),
        ];
        $userProcess = new Process($app);
        $userProcess->run($args, $app);

        $property = $this
            ->em
            ->getRepository(Property::class)
            ->findOneBy([
                'sourceGuid' => $args['ref']
            ]);

        $this->em->refresh($property);

        $this->assertEquals($property->sourceGuid, $args['ref']);

        $this->assertEquals($property->mlsRef, 'NJSO111680');
        $this->assertEquals($property->sourceUrl, 'https://www.sothebysrealty.com/id/8b8s3h');

        $this->assertEquals($property->sourceRef, '3yd-RFGSIR-8B8S3H');
        $this->assertEquals($property->userSourceRef, '3cab3867-c748-42a7-8667-e9d28cf3c342');
        $this->assertEquals($property->userSourceRefType, 'guid');
        $this->assertEquals($property->companySourceRef, '6ce08919-381f-43b7-886e-1db67f3ad3c7');
        $this->assertEquals($property->companySourceRefType, 'guid');

        $this->assertEquals($property->name, 'Neat-as-a-Pin Woods Edge Colonial');
        $this->assertEquals($property->status, Property::STATUS_INCOMPLETE);
        $this->assertEquals($property->availability, Property::AVAILABILITY_FOR_SALE);
        $this->assertEquals($property->type, PropertyTypes::DETACHED);
        $this->assertEquals($property->rental, false);
        $this->assertEquals($property->deletedAt, false);

        $this->assertEquals(35, count($property->getPhotos()));
        $this->assertNotEmpty($property->getPrimaryPhoto()->url);

        $this->assertEquals($property->bedrooms, 3);
        $this->assertEquals($property->bathrooms, 2);
        $this->assertEquals($property->halfBathrooms, 1);
        $this->assertEquals($property->threeQuarterBathrooms, null);
        $this->assertEquals($property->price, 574000);
        $this->assertEquals($property->currency, 'USD');
        $this->assertEquals($property->plotArea, 728.44);
    }

    public function testDoRunMissingFields()
    {
        VCR::insertCassette('property-bedrooms.yml');

        $job = $this->newImportJobPersistent(ImportJob::DATA_SYNC_ACTIVE);
        $app = $this->getContainer();
        $args = [
            'ref' => '1e31b7ff-38dd-431b-a77b-e0a2f14b3241',
            'updated_at' => '2019-05-14T15:30:25.200',
            'jobID' => $job->getId(),
        ];
        $userProcess = new Process($app);
        $userProcess->run($args, $app);

        $property = $this
            ->em
            ->getRepository(Property::class)
            ->findOneBy([
                'sourceGuid' => $args['ref']
            ]);

        $this->em->refresh($property);

        $this->assertEquals($property->sourceGuid, $args['ref']);

        $this->assertEquals(null, $property->bedrooms);
        $this->assertEquals(null, $property->bathrooms);
        $this->assertEquals(null, $property->halfBathrooms);
        $this->assertEquals(null, $property->grossLivingArea);
        $this->assertEquals(null, $property->grossLivingAreaUnit);
        $this->assertEquals(null, $property->yearBuilt);
        $this->assertEquals(null, $property->room);
        $this->assertEquals(null, $property->plotAreaUnit);

        $this->assertEquals(6677.32, $property->plotArea);
        $this->assertEquals(549900, $property->price);

        $this->assertEquals(Property::STATUS_INCOMPLETE, $property->status);
        $this->assertEquals(100, $property->availability);
        $this->assertEquals(100, $property->type);
    }
}
