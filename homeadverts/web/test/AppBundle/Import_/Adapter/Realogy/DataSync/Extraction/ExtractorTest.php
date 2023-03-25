<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys\DataSync\Extraction;

use AppBundle\Entity\ImportJob;
use AppBundle\Entity\ImportJobRepository;
use AppBundle\Import\Adapter\Sothebys\DataSync\Extraction\ExtractionStrategyInterface;
use AppBundle\Import\Adapter\Sothebys\DataSync\Extraction\Extractor;
use AppBundle\Import\Wellcomemat\PrecachedWellcomematFeed;
use Doctrine\ORM\EntityManager;
use Test\Utils\Traits\DateTrait;

class ExtractorTest extends \PHPUnit_Framework_TestCase
{
    use DateTrait;
    /**
     * @var Extractor
     */
    private $extractor;
    /**
     * @var ImportJob
     */
    private $importJob;
    /**
     * @var ImportJobRepository
     */
    private $importJobRepo;
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var PrecachedWellcomematFeed
     */
    private $wellcomematFeed;
    /**
     * @var callable
     */
    private $strategyAssertion = null;

    protected function setUp()
    {
        $this->importJob = $this->getImportJob();
        $this->importJobRepo = $this->getImportJobRepo();
        $this->em = $this->getEm();
        $this->wellcomematFeed = $this->getWellcomematFeed();

        $this->extractor = new Extractor(
            $this->importJobRepo,
            function ($strategy, ImportJob $importJob) {
                $strategyAssertion = $this->strategyAssertion;
                $strategyAssertion($strategy, $importJob);

                return new StrategyMock();
            },
            $this->em,
            $this->wellcomematFeed
        );
    }

    /**
     * @dataProvider entityProvider
     */
    public function testStrategyActiveForced($entity)
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $importJob */
        $importJob = $this->importJob;
        $importJob
            ->expects($this->never())
            ->method('getDateAdded')
        ;
        $importJob
            ->expects($this->once())
            ->method('getMethod')
            ->willReturn('datasync:active')
        ;
        $importJob
            ->expects($this->once())
            ->method(
                'Users' == $entity ? 'setUserTotalNotify' : 'setTotalNotify'
            )
            ->with(10)
        ;
        $this->assertVideosPrecached($entity);

        /** @var \PHPUnit_Framework_MockObject_MockObject $importJobRepo */
        $importJobRepo = $this->importJobRepo;
        $importJobRepo
            ->expects($this->never())
            ->method('getPreviousImportJob')
        ;
        $importJobRepo
            ->expects($this->never())
            ->method('getLastImportJobByMethod')
        ;

        $this->strategyAssertion = function ($strategy, ImportJob $_) {
            $this->assertEquals('active', $strategy);
        };

        $this->extractor->{'create'.$entity}($importJob);
    }

    /**
     * @dataProvider entityProvider
     */
    public function testStrategyDeltaForced($entity)
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $importJob */
        $importJob = $this->importJob;
        $importJob
            ->expects($this->never())
            ->method('getDateAdded')
        ;
        $importJob
            ->expects($this->once())
            ->method('getMethod')
            ->willReturn('datasync:delta')
        ;
        $importJob
            ->expects($this->once())
            ->method(
                'Users' == $entity ? 'setUserTotalNotify' : 'setTotalNotify'
            )
            ->with(10)
        ;
        $this->assertVideosPrecached($entity);

        /** @var \PHPUnit_Framework_MockObject_MockObject $importJobRepo */
        $importJobRepo = $this->importJobRepo;
        $importJobRepo
            ->expects($this->never())
            ->method('getPreviousImportJob')
        ;
        $importJobRepo
            ->expects($this->never())
            ->method('getLastImportJobByMethod')
        ;

        $this->strategyAssertion = function ($strategy, ImportJob $_) {
            $this->assertEquals('delta', $strategy);
        };

        $this->extractor->{'create'.$entity}($importJob);
    }

    /**
     * @dataProvider entityProvider
     */
    public function testStrategyActiveWhenNoActiveExist($entity)
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $importJob */
        $importJob = $this->importJob;
        $importJob
            ->expects($this->never())
            ->method('getDateAdded')
        ;
        $importJob
            ->expects($this->once())
            ->method('getMethod')
            ->willReturn(null)
        ;
        $importJob
            ->expects($this->once())
            ->method(
                'Users' == $entity ? 'setUserTotalNotify' : 'setTotalNotify'
            )
            ->with(10)
        ;
        $this->assertVideosPrecached($entity);

        /** @var \PHPUnit_Framework_MockObject_MockObject $importJobRepo */
        $importJobRepo = $this->importJobRepo;
        $importJobRepo
            ->expects($this->once())
            ->method('getLastImportJobByMethod')
            ->with('datasync:active', $this->importJob)
            ->willReturn(null)
        ;
        $importJobRepo
            ->expects($this->never())
            ->method('getPreviousImportJob')
        ;

        $this->strategyAssertion = function ($strategy, ImportJob $_) {
            $this->assertEquals('active', $strategy);
        };

        $this->extractor->{'create'.$entity}($importJob);
    }

    /**
     * @dataProvider entityProvider
     */
    public function testStrategyActiveWhenLastActiveMTE7Days($entity)
    {
        $interval = new \DateInterval('P7D');

        $currentDate = $this->getDate();
        $lastActiveDate = clone $currentDate;
        $lastActiveDate = $lastActiveDate->sub($interval);

        /** @var \PHPUnit_Framework_MockObject_MockObject $importJob */
        $importJob = $this->importJob;
        $importJob
            ->expects($this->any())
            ->method('getDateAdded')
            ->willReturn($currentDate)
        ;
        $importJob
            ->expects($this->once())
            ->method('getMethod')
            ->willReturn(null)
        ;
        $importJob
            ->expects($this->once())
            ->method(
                'Users' == $entity ? 'setUserTotalNotify' : 'setTotalNotify'
            )
            ->with(10)
        ;
        $this->assertVideosPrecached($entity);

        /** @var \PHPUnit_Framework_MockObject_MockObject $importJobRepo */
        $lastActiveImportJob = $this->getImportJob();
        $lastActiveImportJob
            ->expects($this->any())
            ->method('getDateAdded')
            ->willReturn($lastActiveDate)
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $importJobRepo */
        $importJobRepo = $this->importJobRepo;
        $importJobRepo
            ->expects($this->once())
            ->method('getLastImportJobByMethod')
            ->with('datasync:active', $this->importJob)
            ->willReturn($lastActiveImportJob)
        ;
        $importJobRepo
            ->expects($this->never())
            ->method('getPreviousImportJob')
        ;

        $this->strategyAssertion = function ($strategy, ImportJob $_) {
            $this->assertEquals('active', $strategy);
        };

        $this->extractor->{'create'.$entity}($importJob);
    }

    /**
     * @dataProvider entityProvider
     */
    public function testActiveStrategyWhenDifferenceBig($entity)
    {
        $lastActiveInterval = new \DateInterval('P6DT23H');
        $prevInterval = new \DateInterval('P8D');

        $currentDate = $this->getDate();
        $lastActiveDate = clone $currentDate;
        $lastActiveDate = $lastActiveDate->sub($lastActiveInterval);
        $prevDate = clone $currentDate;
        $prevDate = $prevDate->sub($prevInterval);

        /** @var \PHPUnit_Framework_MockObject_MockObject $em */
        $em = $this->em;
        $em
            ->expects($this->any())
            ->method('flush')
            ->with($this->importJob)
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $importJob */
        $importJob = $this->importJob;
        $importJob
            ->expects($this->any())
            ->method('getDateAdded')
            ->willReturn($currentDate)
        ;
        $importJob
            ->expects($this->once())
            ->method(
                'Users' == $entity ? 'setUserTotalNotify' : 'setTotalNotify'
            )
            ->with(10)
        ;
        $this->assertVideosPrecached($entity);

        /** @var \PHPUnit_Framework_MockObject_MockObject $importJobRepo */
        $lastActiveImportJob = $this->getImportJob();
        $lastActiveImportJob
            ->expects($this->any())
            ->method('getDateAdded')
            ->willReturn($lastActiveDate)
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $importJobRepo */
        $prevImportJob = $this->getImportJob();
        $prevImportJob
            ->expects($this->any())
            ->method('getDateAdded')
            ->willReturn($prevDate)
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $importJobRepo */
        $importJobRepo = $this->importJobRepo;
        $importJobRepo
            ->expects($this->once())
            ->method('getLastImportJobByMethod')
            ->with('datasync:active', $this->importJob)
            ->willReturn($lastActiveImportJob)
        ;
        $importJobRepo
            ->expects($this->once())
            ->method('getPreviousImportJob')
            ->with($this->importJob)
            ->willReturn($prevImportJob)
        ;

        $this->strategyAssertion = function ($strategy, ImportJob $_) {
            $this->assertEquals('active', $strategy);
        };

        $this->extractor->{'create'.$entity}($importJob);
    }

    /**
     * @dataProvider entityProvider
     */
    public function testDeltaStrategy($entity)
    {
        $lastActiveInterval = new \DateInterval('P6DT23H');
        $prevInterval = new \DateInterval('P6DT23H');

        $currentDate = $this->getDate();
        $lastActiveDate = clone $currentDate;
        $lastActiveDate = $lastActiveDate->sub($lastActiveInterval);
        $prevDate = clone $currentDate;
        $prevDate = $prevDate->sub($prevInterval);

        /** @var \PHPUnit_Framework_MockObject_MockObject $em */
        $em = $this->em;
        $em
            ->expects($this->any())
            ->method('flush')
            ->with($this->importJob)
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $importJob */
        $importJob = $this->importJob;
        $importJob
            ->expects($this->any())
            ->method('getDateAdded')
            ->willReturn($currentDate)
        ;
        $importJob
            ->expects($this->once())
            ->method(
                'Users' == $entity ? 'setUserTotalNotify' : 'setTotalNotify'
            )
            ->with(10)
        ;
        $this->assertVideosPrecached($entity);

        /** @var \PHPUnit_Framework_MockObject_MockObject $importJobRepo */
        $lastActiveImportJob = $this->getImportJob();
        $lastActiveImportJob
            ->expects($this->any())
            ->method('getDateAdded')
            ->willReturn($lastActiveDate)
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $importJobRepo */
        $prevImportJob = $this->getImportJob();
        $prevImportJob
            ->expects($this->any())
            ->method('getDateAdded')
            ->willReturn($prevDate)
        ;

        /** @var \PHPUnit_Framework_MockObject_MockObject $importJobRepo */
        $importJobRepo = $this->importJobRepo;
        $importJobRepo
            ->expects($this->once())
            ->method('getLastImportJobByMethod')
            ->with('datasync:active', $this->importJob)
            ->willReturn($lastActiveImportJob)
        ;
        $importJobRepo
            ->expects($this->any())
            ->method('getPreviousImportJob')
            ->with($this->importJob)
            ->willReturn($prevImportJob)
        ;

        $this->strategyAssertion = function ($strategy, ImportJob $_) {
            $this->assertEquals('delta', $strategy);
        };

        $this->extractor->{'create'.$entity}($importJob);
    }

    public function entityProvider()
    {
        return [
            ['Users'],
            ['Properties'],
        ];
    }

    private function getImportJob()
    {
        return $this
            ->getMockBuilder(ImportJob::class)
            ->disableOriginalConstructor()
            ->setMethods(['getDateAdded', 'getMethod', 'setUserTotalNotify', 'setTotalNotify'])
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

    private function getEm()
    {
        return $this
            ->getMockBuilder(EntityManager::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getWellcomematFeed()
    {
        return $this
            ->getMockBuilder(PrecachedWellcomematFeed::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function assertVideosPrecached($entity)
    {
        if ('Properties' == $entity) {
            /** @var \PHPUnit_Framework_MockObject_MockObject $wellcomematFeed */
            $wellcomematFeed = $this->wellcomematFeed;
            $wellcomematFeed
                ->expects($this->once())
                ->method('precacheVideos')
            ;
        }
    }
}

class StrategyMock implements ExtractionStrategyInterface
{
    public function createUsers(callable $totalCb = null)
    {
        $totalCb(10);
    }

    public function createProperties(callable $totalCb = null)
    {
        $totalCb(10);
    }
}
