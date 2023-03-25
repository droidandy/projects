<?php

namespace Test\AppBundle\Import_;

use AppBundle\Entity\User\UserRepository;
use AppBundle\Import\Email\ImportMailerInterface;
use AppBundle\Import\ExecutionTimeTracker;
use AppBundle\Import\ImportContext;
use AppBundle\Import\ImportReporter;
use AppBundle\Entity\ImportJob;
use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyRepository;

class ImportReporterTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    private $mailer;
    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    private $propertyRepo;
    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    private $userRepo;
    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    private $executionTimeTracker;
    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    private $importJob;
    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    private $importContext;
    /**
     * @var ImportReporter
     */
    private $importReporter;
    /**
     * @var \DateTime
     */
    private $dateAdded;

    protected function setUp()
    {
        $this->mailer = $this->getMailer();
        $this->propertyRepo = $this->getPropertyRepo();
        $this->userRepo = $this->getUserRepo();
        $this->executionTimeTracker = $this->getExecutionTimeTracker();

        $this->importJob = $this->getImportJob();
        $this->importContext = $this->getImportContext($this->importJob);

        $this->importReporter = $this->getImportReporter(
            $this->mailer,
            $this->propertyRepo,
            $this->userRepo,
            $this->executionTimeTracker
        );
    }

    public function testSendSummary()
    {
        $this
            ->propertyRepo
            ->expects($this->once())
            ->method('getSummary')
            ->willReturn([
                Property::STATUS_ACTIVE => 1000,
                Property::STATUS_INACTIVE => 100,
                Property::STATUS_INCOMPLETE => 50,
                Property::STATUS_INVALID => 0,
                Property::STATUS_DELETED => 100,
            ])
        ;
        $this
            ->userRepo
            ->expects($this->once())
            ->method('getSummary')
            ->willReturn([
                '0' => 100,
                '1' => 5,
            ])
        ;
        $this
            ->executionTimeTracker
            ->expects($this->once())
            ->method('getAggregatedStat')
            ->with($this->importJob)
            ->willReturn([
                'deploy_time' => 100,
                'extracting_time' => 100,
                'processing_time' => 100,
                'user_removal_time' => 100,
                'property_removal_time' => 100,
                'total_time' => 500,
            ])
        ;
        $this->importJob->setType('sothebys');
        $this->importJob->setDateAdded($this->getDateAdded());
        $this->importJob->setTotal(10000);
        $this->importJob->setProcessed(10000);
        $this->importJob->setUpdated(9000);
        $this->importJob->setAdded(0);
        $this->importJob->setSkipped(0);
        $this->importJob->setErrors(1000);
        $this->importJob->setErrorsBedroom(700);
        $this->importJob->setErrorsMetadata(200);
        $this->importJob->setErrorsAddress(0);
        $this->importJob->setErrorsPrice(0);
        $this->importJob->setErrorsPhotos(0);
        $this->importJob->setErrorsOther(100);
        $this->importJob->setRemoved(3000);
        $this->importJob->setUserTotal(1000);
        $this->importJob->setUserProcessed(1000);
        $this->importJob->setUserUpdated(900);
        $this->importJob->setUserAdded(0);
        $this->importJob->setUserSkipped(0);
        $this->importJob->setUserErrors(100);
        $this->importJob->setUserRemoved(150);

        $this
            ->mailer
            ->expects($this->once())
            ->method('send')
            ->with([
                'job_id' => null,
                'type' => 'sothebys',
                'date_added' => $this->getDateAdded()->format('c'),
                'time_summary' => [
                    'deploy_time' => 100,
                    'extracting_time' => 100,
                    'processing_time' => 100,
                    'user_removal_time' => 100,
                    'property_removal_time' => 100,
                    'total_time' => 500,
                ],
                'feed_summary' => [
                    'property' => [
                        'total' => 10000,
                        'processed' => 10000,
                        'updated' => 9000,
                        'added' => 0,
                        'skipped' => 0,
                        'errors' => [
                            'total' => 1000,
                            'bedroom' => 700,
                            'metadata' => 200,
                            'address' => 0,
                            'price' => 0,
                            'photos' => 0,
                            'other' => 100,
                        ],
                        'removed' => 3000,
                    ],
                    'user' => [
                        'total' => 1000,
                        'processed' => 1000,
                        'updated' => 900,
                        'added' => 0,
                        'skipped' => 0,
                        'errors' => 100,
                        'removed' => 150,
                    ],
                ],
                'db_summary' => [
                    'property' => [
                        'total' => 1250,
                        'active' => 1000,
                        'inactive' => 100,
                        'incomplete' => 50,
                        'invalid' => 0,
                        'soft_deleted' => 100,
                    ],
                    'user' => [
                        'total' => 105,
                        'active' => 100,
                        'soft_deleted' => 5,
                    ],
                ],
            ])
        ;

        $this->importReporter->sendSummary($this->importContext);
    }

    private function getDateAdded()
    {
        if (!$this->dateAdded) {
            $this->dateAdded = new \DateTime();
        }

        return $this->dateAdded;
    }

    private function getImportJob()
    {
        return $this
            ->getMockBuilder(ImportJob::class)
            ->disableOriginalConstructor()
            ->setMethods(null)
            ->getMock()
        ;
    }


    private function getImportContext($importJob)
    {
        return new ImportContext($importJob, null, $this->getImportObserverFactory());
    }

    private function getMailer()
    {
        return $this
            ->getMockBuilder(ImportMailerInterface::class)
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

    private function getUserRepo()
    {
        return $this
            ->getMockBuilder(UserRepository::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getExecutionTimeTracker()
    {
        return $this
            ->getMockBuilder(ExecutionTimeTracker::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getImportReporter($mailer, $propertyRepo, $userRepo, $executionTimeTracker)
    {
        return new ImportReporter($mailer, $propertyRepo, $userRepo, $executionTimeTracker);
    }

    private function getImportObserverFactory()
    {
        return function () {
            return $this->getImportObserver();
        };
    }

    private function getImportObserver()
    {
        return $this
            ->getMockBuilder(ImportObserverInterface::class)
            ->getMock()
            ;
    }
}
