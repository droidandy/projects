<?php

namespace AppBundle\Service\Import;

use AppBundle\Entity\Import\ImportJob;
use AppBundle\Entity\Property\Property;
use AppBundle\Event\ImportEvent;
use AppBundle\Import\Queue\ImportJobTracker;
use AppBundle\Import\Queue\ResqueQueueAdapter;
use Doctrine\ORM\EntityManager;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

class ImporterFailedProperty
{
    /**
     * @var ContainerInterface
     */
    private $container;
    /**
     * @var ResqueQueueAdapter
     */
    private $queueAdapter;
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var EventDispatcherInterface
     */
    private $importEventDispatcher;

    /**
     * @param ContainerInterface $container
     */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        $this->em = $container->get('em');
        $this->queueAdapter = $container->get('ha.import.queue_adapter');
        $this->importEventDispatcher = $container->get('ha.import.event_dispatcher');
    }

    public function import()
    {
        $properties = $this->em
            ->getRepository(Property::class)
            ->getIncompleteAndInactive();

        $job = $this->newJob(count($properties));

        $importContextFactory = $this->container->get('ha.import.import_context_factory');
        $context = $importContextFactory->createFromImportJobId($job->getId());
        $this->container->set('ha.import.import_context', $context);

        $importJobTracker = $this->container->get('ha.import.import_job_tracker');
        $importJobTracker->setStatusOn('extracting');

        // Set Lock
        $lockValue = $this->setLock($job, $importJobTracker);

        $this->importEventDispatcher->dispatch(
            ImportEvent::EXTRACTING_STARTED,
            new ImportEvent($context)
        );

        foreach ($properties as $property) {
            $item = [
                'ref' => $property['sourceGuid'],
                'updated_at' => $property['dateUpdated']->format('Y-m-d H:i:s'),
            ];
            $this->queueAdapter->enqueuePropertyProcessing($job, $item);
        }

        $importJobTracker->setStatusDone('extracting');
        $this->importEventDispatcher->dispatch(
            ImportEvent::EXTRACTING_COMPLETED,
            new ImportEvent($context)
        );

        $this
            ->container
            ->get('ha.lock')
            ->releaseLock($job->getLockName(), $lockValue);
    }

    /**
     * @param ImportJob $job
     * @param ImportJobTracker $importJobTracker
     * @return bool|string
     */
    private function setLock(ImportJob $job, ImportJobTracker $importJobTracker)
    {
        [$lockTimeout, $waitTimeout] = $job->getLockTimeoutAndWaitTimeout();

        $lockValue = $this
            ->container
            ->get('ha.lock')
            ->acquireLock(
                $job->getLockName(),
                $lockTimeout,
                $waitTimeout
            );
        $importJobTracker->tryStart();
        $importJobTracker->setLockValue($lockValue);

        return $lockValue;
    }

    /**
     * @param int $totalProperties
     * @return ImportJob
     */
    private function newJob(int $totalProperties): ImportJob
    {
        $job = new ImportJob();
        $job->setMethod('datasync:failed');
        $job->setTotal($totalProperties);

        $this->em->persist($job);
        $this->em->flush($job);

        return $job;
    }
}
