<?php

namespace AppBundle\Import\Job;

use AppBundle\Import\Adapter\Realogy\Extraction\Extractor;
use AppBundle\Service\Import\Importer;
use AppBundle\Event\ImportEvent;
use AppBundle\Entity\Import\ImportJob;
use Symfony\Component\DependencyInjection\ContainerInterface;

class Deploy extends AbstractImportJob
{
    /**
     * @var ImportJob
     */
    private $importJob;
    /**
     * @var Extractor
     */
    private $extractor;

    protected function doRun($args, $container)
    {
        /**
         * @var ContainerInterface $container
         */
        $this->log(sprintf('Deployment job started %s', json_encode($args)));
        $this->em = $container->get('em');
        $this->importJob = $container->get('ha.importer')->findJob($args['jobID']);
        $this->extractor = $container->get('sothebys.datasync_extractor');
        $this->importEventDispatcher = $container->get('ha.import.event_dispatcher');
        $this->importContext = $container->get('ha.import.import_context');
        $this->importJobTracker = $container->get('ha.import.import_job_tracker');
        $this->lock = $container->get('ha.lock');

        [$lockTimeout, $waitTimeout] = $this->importJob->getLockTimeoutAndWaitTimeout();

        $lockValue = $this->lock->acquireLock(
            $this->importJob->getLockName(),
            $lockTimeout,
            $waitTimeout
        );

        if ($lockValue) {
            $this->importJobTracker->tryStart();
            $this->importJobTracker->setLockValue($lockValue);
            $this->produce($lockValue);
        } else {
            $this->importJobTracker->startAndDeny(
                sprintf(
                    'Failed to acquire import lock with lock_timeout="%s" and wait_timeout="%s". Concurrent import is running',
                    $lockTimeout,
                    $waitTimeout ?? 'NULL'
                )
            );
        }
    }

    private function produce($lockValue)
    {
        $this->importJobTracker->setStatusOn('extracting');
        $this->importEventDispatcher->dispatch(
            ImportEvent::EXTRACTING_STARTED,
            new ImportEvent($this->importContext)
        );

        try {
            $this->log(sprintf('Extracting companies'));
            $this->extractor->createCompanies($this->importJob);

            $this->log(sprintf('Extracting offices'));
            $this->extractor->createOffices($this->importJob);

            $this->log(sprintf('Extracting users'));
            $this->extractor->createUsers($this->importJob);

            $this->log(sprintf('Extracting properties'));
            $this->extractor->createProperties($this->importJob);

            $this->importJobTracker->setStatusDone('extracting');
            $this->importEventDispatcher->dispatch(
                ImportEvent::EXTRACTING_COMPLETED,
                new ImportEvent($this->importContext)
            );
        } catch (\Throwable $e) {
            $this->logger->critical(sprintf('Error during deployment "%s" %s',
                $e->getMessage(),
                $e->getTraceAsString())
            );

            $this->importJobTracker->setStatusFailed('extracting', $e->getMessage());
            $this->importEventDispatcher->dispatch(
                ImportEvent::EXTRACTING_COMPLETED,
                new ImportEvent($this->importContext)
            );

            $this->lock->releaseLock($this->importJob->getLockName(), $lockValue);
        }
    }
}
