<?php

namespace AppBundle\Import\Adapter\Realogy\Extraction;

use AppBundle\Entity\Import\ImportJob;
use AppBundle\Entity\Import\ImportJobRepository;
use AppBundle\Import\Adapter\Realogy\DataSyncClient;
use AppBundle\Import\Queue\QueueAdapterInterface;

class DeltaExtractionStrategy implements ExtractionStrategyInterface
{
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
     * @var QueueAdapterInterface
     */
    private $queueAdapter;
    /**
     * @var \DateTime|null
     */
    private $since;

    /**
     * DeltaExtractionStrategy constructor.
     *
     * @param ImportJob             $importJob
     * @param ImportJobRepository   $importJobRepo
     * @param DataSyncClient        $dataSyncClient
     * @param QueueAdapterInterface $queueAdapter
     */
    public function __construct(
        ImportJob $importJob,
        ImportJobRepository $importJobRepo,
        DataSyncClient $dataSyncClient,
        QueueAdapterInterface $queueAdapter
    ) {
        $this->importJob = $importJob;
        $this->importJobRepo = $importJobRepo;
        $this->dataSyncClient = $dataSyncClient;
        $this->queueAdapter = $queueAdapter;
    }

    public function createCompanies(
        callable $totalCb = null,
        callable $preExtractingCb = null,
        callable $postExtractingCb = null
    ) {
        $this->createEntities(
            [$this->dataSyncClient, 'getCompanyDelta'],
            [$this->queueAdapter, 'enqueueCompanyProcessing'],
            [$this->queueAdapter, 'enqueueCompanyRemoval'],
            $totalCb,
            $preExtractingCb,
            $postExtractingCb
        );
    }

    public function createOffices(
        callable $totalCb = null,
        callable $preExtractingCb = null,
        callable $postExtractingCb = null
    ) {
        $this->createEntities(
            [$this->dataSyncClient, 'getOfficeDelta'],
            [$this->queueAdapter, 'enqueueOfficeProcessing'],
            [$this->queueAdapter, 'enqueueOfficeRemoval'],
            $totalCb,
            $preExtractingCb,
            $postExtractingCb
        );
    }

    public function createUsers(callable $totalCb = null)
    {
        $this->createEntities(
            [$this->dataSyncClient, 'getAgentDelta'],
            [$this->queueAdapter, 'enqueueUserProcessing'],
            [$this->queueAdapter, 'enqueueUserRemoval'],
            $totalCb
        );
    }

    public function createProperties(callable $totalCb = null)
    {
        $this->createEntities(
            [$this->dataSyncClient, 'getListingDelta'],
            [$this->queueAdapter, 'enqueuePropertyProcessing'],
            [$this->queueAdapter, 'enqueuePropertyRemoval'],
            $totalCb
        );
    }

    private function createEntities(
        callable $apiRequest,
        callable $process,
        callable $remove,
        callable $totalCb = null,
        callable $preExtractingCb = null,
        callable $postExtractingCb = null
    ) {
        $this->setUpSince();

        $guidsToRemove = [];
        $total = 0;

        if ($preExtractingCb) {
            $preExtractingCb();
        }
        foreach ($apiRequest($this->since)->getIterator() as $page) {
            foreach ($page->data as $entityInfo) {
                if ('Delete' == $entityInfo->action) {
                    $guidsToRemove[] = $entityInfo->id;
                } elseif ('Upsert' == $entityInfo->action) {
                    ++$total;
                    $process($this->importJob, [
                        'ref' => $entityInfo->id,
                        'updated_at' => $entityInfo->lastUpdateOn,
                        'payload' => isset($entityInfo->entityDetail) ? serialize($entityInfo->entityDetail) : null,
                    ]);
                }
            }
        }
        if ($postExtractingCb) {
            $postExtractingCb();
        }
        if ($totalCb) {
            $totalCb($total);
        }

        $remove($this->importJob, [
            'refs_to_remove' => $guidsToRemove,
        ]);
    }

    private function setUpSince()
    {
        if (!$this->since) {
            $this->since = $this->importJobRepo->getPreviousImportJobStartAt($this->importJob);
            if (!$this->since) {
                throw new \RuntimeException('since is a mandatory parameter for Delta request');
            }
        }

        return $this->since;
    }
}
