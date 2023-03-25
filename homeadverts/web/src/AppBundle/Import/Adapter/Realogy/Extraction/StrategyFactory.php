<?php

namespace AppBundle\Import\Adapter\Realogy\Extraction;

use AppBundle\Entity\Import\ImportJob;
use AppBundle\Entity\Import\ImportJobRepository;
use AppBundle\Entity\Property\PropertyRepository;
use AppBundle\Entity\User\UserRepository;
use AppBundle\Import\Adapter\Realogy\DataSyncClient;
use AppBundle\Import\Queue\QueueAdapterInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

class StrategyFactory
{
    /**
     * @var ImportJobRepository
     */
    private $importJobRepo;
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
     * @var EventDispatcherInterface
     */
    protected $importEventDispatcher;

    /**
     * @param ImportJobRepository      $importJobRepo
     * @param DataSyncClient           $dataSyncClient
     * @param QueueAdapterInterface    $queueAdapter
     * @param UserRepository           $userRepo
     * @param PropertyRepository       $propertyRepo
     * @param EventDispatcherInterface $importEventDispatcher
     */
    public function __construct(
        ImportJobRepository $importJobRepo,
        DataSyncClient $dataSyncClient,
        QueueAdapterInterface $queueAdapter,
        UserRepository $userRepo,
        PropertyRepository $propertyRepo,
        EventDispatcherInterface $importEventDispatcher
    ) {
        $this->importJobRepo = $importJobRepo;
        $this->dataSyncClient = $dataSyncClient;
        $this->queueAdapter = $queueAdapter;
        $this->userRepo = $userRepo;
        $this->propertyRepo = $propertyRepo;
        $this->importEventDispatcher = $importEventDispatcher;
    }

    /**
     * @param string    $strategy
     * @param ImportJob $importJob
     */
    public function __invoke($strategy, ImportJob $importJob)
    {
        switch ($strategy) {
            case 'delta':
                $importJob->setMethodNotify(ImportJob::DATA_SYNC_DELTA);

                return new DeltaExtractionStrategy(
                    $importJob,
                    $this->importJobRepo,
                    $this->dataSyncClient,
                    $this->queueAdapter
                );
            case 'active':
                $importJob->setMethodNotify(ImportJob::DATA_SYNC_ACTIVE);

                return new ActiveExtractionStrategy(
                    $importJob,
                    $this->dataSyncClient,
                    $this->queueAdapter,
                    $this->userRepo,
                    $this->propertyRepo,
                    $this->importEventDispatcher
                );
        }
    }
}
