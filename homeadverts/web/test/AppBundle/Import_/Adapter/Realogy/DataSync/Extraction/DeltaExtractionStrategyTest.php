<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys\DataSync\Extraction;

use AppBundle\Entity\ImportJob;
use AppBundle\Entity\ImportJobRepository;
use AppBundle\Import\Adapter\Sothebys\DataSync\DataSyncClient;
use AppBundle\Import\Adapter\Sothebys\DataSync\Extraction\DeltaExtractionStrategy;
use AppBundle\Import\Adapter\Sothebys\DataSync\Paginator;
use AppBundle\Import\Queue\QueueAdapterInterface;
use Test\Utils\Traits\DateTrait;

class DeltaExtractionStrategyTest extends \PHPUnit_Framework_TestCase
{
    use DateTrait;
    /**
     * @var DeltaExtractionStrategy
     */
    private $deltaExtractionStrategy;
    /**
     * @var ImportJob
     */
    private $importJob;
    /**
     * @var ImportJobRepository
     */
    private $importJobRepo;
    /**
     * @var DataSyncClient
     */
    private $dataSyncClient;
    /**
     * @var Paginator
     */
    private $paginator;
    /**
     * @var QueueAdapterInterface
     */
    private $queueAdapter;

    protected function setUp()
    {
        $this->importJob = $this->getImportJob();
        $this->importJobRepo = $this->getImportJobRepo();
        $this->dataSyncClient = $this->getDataSyncClient();
        $this->paginator = $this->getPaginator();
        $this->queueAdapter = $this->getQueueAdapter();

        $this->deltaExtractionStrategy = new DeltaExtractionStrategy(
            $this->importJob,
            $this->importJobRepo,
            $this->dataSyncClient,
            $this->queueAdapter
        );
    }

    public function testCreateUsers()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $importJobRepo */
        $importJobRepo = $this->importJobRepo;
        $importJobRepo
            ->expects($this->once())
            ->method('getPreviousImportJobStartAt')
            ->willReturn($this->getDate())
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $dataSyncClient */
        $dataSyncClient = $this->dataSyncClient;
        $dataSyncClient
            ->expects($this->once())
            ->method('getAgentDelta')
            ->with($this->getDate())
            ->willReturn($this->paginator)
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $paginator */
        $paginator = $this->paginator;
        $paginator
            ->expects($this->once())
            ->method('getIterator')
            ->willReturn(
                $this->getIterator()
            )
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $queueAdapter */
        $queueAdapter = $this->queueAdapter;
        $queueAdapter
            ->expects($this->exactly(3))
            ->method('enqueueUserProcessing')
            ->withConsecutive(
                [$this->importJob, [
                    'ref' => 'D693DE6E-2DE4-45EA-BA02-53944DF70C10',
                    'updated_at' => '2018-07-23T15:30:23.540',
                    'payload' => serialize(['a' => 1, 'b' => 2, 'c' => 3]),
                ]],
                [$this->importJob, [
                    'ref' => 'CA749633-0851-40A5-BDB6-499A08B8050A',
                    'updated_at' => '2018-07-23T15:30:24.010',
                    'payload' => null,
                ]],
                [$this->importJob, [
                    'ref' => 'E67D47D2-2EDF-4E4B-9139-D855A15D1F77',
                    'updated_at' => '2018-07-23T15:30:25.163',
                    'payload' => serialize(['d' => 4, 'e' => 5, 'f' => 6]),
                ]]
            )
        ;
        $queueAdapter
            ->expects($this->once())
            ->method('enqueueUserRemoval')
            ->with($this->importJob, [
                'refs_to_remove' => [
                    '12DB66CD-0C0A-4AE5-A14C-4E3082B04D52',
                    '5C460760-6EA4-4C4E-A57A-B26399638F8E',
                    'CDA79400-A541-4EC4-BE57-4AF07125016E',
                ],
            ])
        ;

        $this->deltaExtractionStrategy->createUsers();
    }

    public function testCreateProperties()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $importJobRepo */
        $importJobRepo = $this->importJobRepo;
        $importJobRepo
            ->expects($this->once())
            ->method('getPreviousImportJobStartAt')
            ->willReturn($this->getDate())
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $dataSyncClient */
        $dataSyncClient = $this->dataSyncClient;
        $dataSyncClient
            ->expects($this->once())
            ->method('getListingDelta')
            ->with($this->getDate())
            ->willReturn($this->paginator)
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $paginator */
        $paginator = $this->paginator;
        $paginator
            ->expects($this->once())
            ->method('getIterator')
            ->willReturn(
                $this->getIterator()
            )
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $queueAdapter */
        $queueAdapter = $this->queueAdapter;
        $queueAdapter
            ->expects($this->exactly(3))
            ->method('enqueuePropertyProcessing')
            ->withConsecutive(
                [$this->importJob, [
                    'ref' => 'D693DE6E-2DE4-45EA-BA02-53944DF70C10',
                    'updated_at' => '2018-07-23T15:30:23.540',
                    'payload' => serialize(['a' => 1, 'b' => 2, 'c' => 3]),
                ]],
                [$this->importJob, [
                    'ref' => 'CA749633-0851-40A5-BDB6-499A08B8050A',
                    'updated_at' => '2018-07-23T15:30:24.010',
                    'payload' => null,
                ]],
                [$this->importJob, [
                    'ref' => 'E67D47D2-2EDF-4E4B-9139-D855A15D1F77',
                    'updated_at' => '2018-07-23T15:30:25.163',
                    'payload' => serialize(['d' => 4, 'e' => 5, 'f' => 6]),
                ]]
            )
        ;
        $queueAdapter
            ->expects($this->once())
            ->method('enqueuePropertyRemoval')
            ->with($this->importJob, [
                'refs_to_remove' => [
                    '12DB66CD-0C0A-4AE5-A14C-4E3082B04D52',
                    '5C460760-6EA4-4C4E-A57A-B26399638F8E',
                    'CDA79400-A541-4EC4-BE57-4AF07125016E',
                ],
            ])
        ;

        $this->deltaExtractionStrategy->createProperties();
    }

    private function getImportJob()
    {
        return $this
            ->getMockBuilder(ImportJob::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getImportJobRepo()
    {
        return $this
            ->getMockBuilder(ImportJobRepository::class)
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

    private function getPaginator()
    {
        return $this
            ->getMockBuilder(Paginator::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getIterator()
    {
        yield (object) [
            'data' => [
                (object) [
                    'action' => 'Delete',
                    'id' => '12DB66CD-0C0A-4AE5-A14C-4E3082B04D52',
                    'lastUpdateOn' => '2018-07-23T15:30:20.917',
                ],
                (object) [
                    'action' => 'Delete',
                    'id' => '5C460760-6EA4-4C4E-A57A-B26399638F8E',
                    'lastUpdateOn' => '2018-07-23T15:30:20.930',
                ],
                (object) [
                    'action' => 'Upsert',
                    'id' => 'D693DE6E-2DE4-45EA-BA02-53944DF70C10',
                    'lastUpdateOn' => '2018-07-23T15:30:23.540',
                    'entityDetail' => [
                        'a' => 1,
                        'b' => 2,
                        'c' => 3,
                    ],
                ],
            ],
        ];
        yield (object) [
            'data' => [
                (object) [
                    'action' => 'Delete',
                    'id' => 'CDA79400-A541-4EC4-BE57-4AF07125016E',
                    'lastUpdateOn' => '2018-07-23T15:30:20.900',
                ],
                (object) [
                    'action' => 'Upsert',
                    'id' => 'CA749633-0851-40A5-BDB6-499A08B8050A',
                    'lastUpdateOn' => '2018-07-23T15:30:24.010',
                ],
                (object) [
                    'action' => 'Upsert',
                    'id' => 'E67D47D2-2EDF-4E4B-9139-D855A15D1F77',
                    'lastUpdateOn' => '2018-07-23T15:30:25.163',
                    'entityDetail' => [
                        'd' => 4,
                        'e' => 5,
                        'f' => 6,
                    ],
                ],
            ],
        ];
    }

    private function getQueueAdapter()
    {
        return $this
            ->getMockBuilder(QueueAdapterInterface::class)
            ->getMock()
        ;
    }
}
