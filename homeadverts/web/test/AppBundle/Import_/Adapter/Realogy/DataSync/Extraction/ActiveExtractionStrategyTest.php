<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys\DataSync\Extraction;

use AppBundle\Entity\ImportJob;
use AppBundle\Entity\Property\PropertyRepository;
use AppBundle\Entity\User\UserRepository;
use AppBundle\Import\Adapter\Sothebys\DataSync\DataSyncClient;
use AppBundle\Import\Adapter\Sothebys\DataSync\Extraction\ActiveExtractionStrategy;
use AppBundle\Import\Queue\QueueAdapterInterface;
use GuzzleHttp\Promise as P;

class ActiveExtractionStrategyTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var ImportJob
     */
    private $importJob;
    /**
     * @var DataSyncClient
     */
    private $dataSyncClient;
    /**
     * @var QueueAdapterInterface
     */
    private $queueAdapter;
    /**
     * @var UserRepository
     */
    private $userRepo;
    /**
     * @var PropertyRepository
     */
    private $propertyRepo;
    /**
     * @var ActiveExtractionStrategy
     */
    private $actveExtractionStrategy;

    protected function setUp()
    {
        $this->importJob = $this->getImportJob();
        $this->dataSyncClient = $this->getDataSyncClient();
        $this->queueAdapter = $this->getQueueAdapter();
        $this->userRepo = $this->getUserRepo();
        $this->propertyRepo = $this->getPropertyRepo();

        $this->actveExtractionStrategy = new ActiveExtractionStrategy(
            $this->importJob,
            $this->dataSyncClient,
            $this->queueAdapter,
            $this->userRepo,
            $this->propertyRepo
        );
    }

    public function testCreateUsers()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $dataSyncClient */
        $dataSyncClient = $this->dataSyncClient;
        $dataSyncClient
            ->expects($this->once())
            ->method('getActiveAgents')
            ->willReturn(P\promise_for([
                (object) [
                    'entityId' => 'aaa',
                    'lastUpdateOn' => '2018-03-15T23:00:25.020',
                ],
                (object) [
                    'entityId' => 'bbb',
                    'lastUpdateOn' => '2018-01-30T16:00:38.017',
                ],
                (object) [
                    'entityId' => 'ccc',
                    'lastUpdateOn' => '2018-06-28T13:30:31.603',
                ],
            ]))
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $userRepo */
        $userRepo = $this->userRepo;
        $userRepo
            ->expects($this->once())
            ->method('getAllGuids')
            ->willReturn([
                [
                    'aaa' => 1,
                    'ddd' => 5,
                    'eee' => 1,
                ],
                [
                    1 => ['aaa', 'eee'],
                    5 => 'ddd',
                ],
            ])
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $queueAdapter */
        $queueAdapter = $this->queueAdapter;
        $queueAdapter
            ->expects($this->exactly(3))
            ->method('enqueueUserProcessing')
            ->withConsecutive(
                [$this->importJob, [
                    'ref' => 'aaa',
                    'updated_at' => '2018-03-15T23:00:25.020',
                ]],
                [$this->importJob, [
                    'ref' => 'bbb',
                    'updated_at' => '2018-01-30T16:00:38.017',
                ]],
                [$this->importJob, [
                    'ref' => 'ccc',
                    'updated_at' => '2018-06-28T13:30:31.603',
                ]]
            )
        ;
        $queueAdapter
            ->expects($this->once())
            ->method('enqueueUserRemoval')
            ->with($this->importJob, [
                'ids_to_remove' => [5],
            ])
        ;

        $this->actveExtractionStrategy->createUsers();
    }

    public function testCreateProperties()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $dataSyncClient */
        $dataSyncClient = $this->dataSyncClient;
        $dataSyncClient
            ->expects($this->once())
            ->method('getActiveListings')
            ->willReturn(P\promise_for([
                (object) [
                    'entityId' => 'aaa',
                    'lastUpdateOn' => '2018-03-15T23:00:25.020',
                ],
                (object) [
                    'entityId' => 'bbb',
                    'lastUpdateOn' => '2018-01-30T16:00:38.017',
                ],
                (object) [
                    'entityId' => 'ccc',
                    'lastUpdateOn' => '2018-06-28T13:30:31.603',
                ],
            ]))
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $propertyRepo */
        $propertyRepo = $this->propertyRepo;
        $propertyRepo
            ->expects($this->once())
            ->method('getAllGuids')
            ->willReturn([
                [
                    'aaa' => 1,
                    'ddd' => 5,
                ],
                [
                    1 => 'aaa',
                    5 => 'ddd',
                ],
            ])
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $queueAdapter */
        $queueAdapter = $this->queueAdapter;
        $queueAdapter
            ->expects($this->exactly(3))
            ->method('enqueuePropertyProcessing')
            ->withConsecutive(
                [$this->importJob, [
                    'ref' => 'aaa',
                    'updated_at' => '2018-03-15T23:00:25.020',
                ]],
                [$this->importJob, [
                    'ref' => 'bbb',
                    'updated_at' => '2018-01-30T16:00:38.017',
                ]],
                [$this->importJob, [
                    'ref' => 'ccc',
                    'updated_at' => '2018-06-28T13:30:31.603',
                ]]
            )
        ;
        $queueAdapter
            ->expects($this->once())
            ->method('enqueuePropertyRemoval')
            ->with($this->importJob, [
                'ids_to_remove' => [5],
            ])
        ;

        $this->actveExtractionStrategy->createProperties();
    }

    private function getImportJob()
    {
        return $this
            ->getMockBuilder(ImportJob::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getDataSyncClient()
    {
        return $this
            ->getMockBuilder(DataSyncClient::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getQueueAdapter()
    {
        return $this
            ->getMockBuilder(QueueAdapterInterface::class)
            ->getMock()
        ;
    }

    private function getUserRepo()
    {
        return $this
            ->getMockBuilder(UserRepository::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getPropertyRepo()
    {
        return $this
            ->getMockBuilder(PropertyRepository::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }
}
