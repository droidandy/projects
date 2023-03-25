<?php

namespace AppBundle\Import\Queue;

use AppBundle\Entity\Import\ImportJobRepository;
use AppBundle\Entity\Import\ImportJob;
use AppBundle\Import\Adapter\Realogy\Extraction\ImportObserver;
use Symfony\Component\DependencyInjection\ContainerInterface;

class ImportContextFactory
{
    /**
     * @var ImportJobRepository
     */
    private $importJobRepo;
    /**
     * @var ContainerInterface
     */
    private $container;

    /**
     * @param ImportJobRepository $importJobRepo
     * @param ContainerInterface  $container
     */
    public function __construct(
        ImportJobRepository $importJobRepo,
        ContainerInterface $container
    ) {
        $this->importJobRepo = $importJobRepo;
        $this->container = $container;
    }

    /**
     * @param $importJobId
     *
     * @return ImportContext
     */
    public function createFromImportJobId($importJobId)
    {
        /**
         * @var ImportJob $importJob
         */
        $importJob = $this->importJobRepo->find($importJobId);

        if (!$importJob) {
            throw new \RuntimeException('Unable to find ImportJob with id '.$importJobId);
        }
        $isMethodAllowed = in_array($importJob->getMethod(), [
            ImportJob::DATA_SYNC_ACTIVE,
            ImportJob::DATA_SYNC_DELTA,
            ImportJob::DATA_SYNC_FAILED,
        ]);

        if (!$isMethodAllowed) {
            throw new \RuntimeException('No ImportObserver defined yet for other methods');
        }

        $container = $this->container;

        $importObserverFactory = function (ImportContext $importContext) use ($container) {
            return new ImportObserver(
                $container->get('ha.import.import_job_tracker'),
                $container->get('ha.import.event_dispatcher'),
                $container->get('ha.importer'),
                $importContext
            );
        };

        return new ImportContext(
            $importJob,
            $importObserverFactory
        );
    }
}
