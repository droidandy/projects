<?php

namespace AppBundle\Import\Adapter\Realogy\Extraction;

use AppBundle\Entity\Import\ImportJob;
use AppBundle\Entity\Property\PropertyRepository;
use AppBundle\Entity\User\UserRepository;
use AppBundle\Event\LedgerEvent;
use AppBundle\Import\Adapter\Realogy\DataSyncClient;
use AppBundle\Import\Queue\QueueAdapterInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

class ActiveExtractionStrategy implements ExtractionStrategyInterface
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
     * @var string
     */
    private $entityType;
    /**
     * @var EventDispatcherInterface
     */
    protected $importEventDispatcher;

    public function __construct(
        ImportJob $importJob,
        DataSyncClient $dataSyncClient,
        QueueAdapterInterface $queueAdapter,
        UserRepository $userRepo,
        PropertyRepository $propertyRepo,
        EventDispatcherInterface $importEventDispatcher
    ) {
        $this->importJob = $importJob;
        $this->dataSyncClient = $dataSyncClient;
        $this->queueAdapter = $queueAdapter;
        $this->userRepo = $userRepo;
        $this->propertyRepo = $propertyRepo;
        $this->importEventDispatcher = $importEventDispatcher;
    }

    public function createCompanies(
        callable $totalCb = null,
        callable $preExtractingCb = null,
        callable $postExtractingCb = null
    ) {
        $this->entityType = 'company';
        $this->createEntities(
            [$this->dataSyncClient, 'getActiveCompanies'],
            [$this->userRepo, 'getAllCompanyGuids'],
            [$this->queueAdapter, 'enqueueCompanyProcessing'],
            [$this->queueAdapter, 'enqueueCompanyRemoval'],

            $totalCb,
            $preExtractingCb,
            $postExtractingCb
        );
        $this->entityType = null;
    }

    public function createOffices(
        callable $totalCb = null,
        callable $preExtractingCb = null,
        callable $postExtractingCb = null
    ) {
        $this->entityType = 'office';
        $this->createEntities(
            [$this->dataSyncClient, 'getActiveOffices'],
            [$this->userRepo, 'getAllOfficeGuids'],
            [$this->queueAdapter, 'enqueueOfficeProcessing'],
            [$this->queueAdapter, 'enqueueOfficeRemoval'],
            $totalCb,
            $preExtractingCb,
            $postExtractingCb
        );
        $this->entityType = null;
    }

    public function createUsers(callable $totalCb = null)
    {
        $this->entityType = 'user';
        $this->createEntities(
            [$this->dataSyncClient, 'getActiveAgents'],
            [$this->userRepo, 'getAllGuids'],
            [$this->queueAdapter, 'enqueueUserProcessing'],
            [$this->queueAdapter, 'enqueueUserRemoval'],
            $totalCb
        );
        $this->entityType = null;
    }

    public function createProperties(callable $totalCb = null)
    {
        $this->entityType = 'property';
        $this->createEntities(
            [$this->dataSyncClient, 'getActiveListings'],
            [$this->propertyRepo, 'getAllGuids'],
            [$this->queueAdapter, 'enqueuePropertyProcessing'],
            [$this->queueAdapter, 'enqueuePropertyRemoval'],
            $totalCb
        );
        $this->entityType = null;
    }

    private function createEntities(
        callable $apiRequest,
        callable $fetch,
        callable $process,
        callable $remove,

        callable $totalCb = null,
        callable $preExtractingCb = null,
        callable $postExtractingCb = null
    ) {
        if ($preExtractingCb) {
            $preExtractingCb();
        }
        $entities = $apiRequest()->wait(true);
        list($entityGuids, $entityIds) = $fetch();

        $existingTotal = count($entityIds);
        $total = 0;

        foreach ($entities as $entity) {
            ++$total;
            $guid = strtolower($entity->entityId);
            $process($this->importJob, [
                'ref' => $guid,
                'updated_at' => $entity->lastUpdateOn,
            ]);
            if (isset($entityGuids[$guid])) {
                foreach ((array) $entityIds[$entityGuids[$guid]] as $entityGuid) {
                    unset($entityGuids[$entityGuid]);
                }
                unset($entityGuids[$guid]);
            }
        }
        if ($postExtractingCb) {
            $postExtractingCb();
        }
        if ($totalCb) {
            $totalCb($total);
        }

        $this->importEventDispatcher->dispatch(
            LedgerEvent::LEDGER_UPDATE,
            new LedgerEvent($this->entityType, $entities)
        );

        if (0 === $total) {
            throw new \RuntimeException(sprintf(
                '%s: No entity fetched from feed',
                $this->entityType
            ));
        }

        if ($existingTotal) {
            $deletionRatio = count(array_unique(array_values($entityGuids))) / $existingTotal;

            if ($deletionRatio > 0.9) {
                throw new \RuntimeException(sprintf(
                    '%s: Deletion ratio is too high "%s"',
                    $this->entityType,
                    $deletionRatio
                ));
            }
        }

        $remove($this->importJob, [
            'ids_to_remove' => array_unique(array_values($entityGuids)),
        ]);
    }
}
