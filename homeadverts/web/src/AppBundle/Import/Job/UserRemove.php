<?php

namespace AppBundle\Import\Job;

use AppBundle\Import\Queue\ImportContext;
use AppBundle\Import\Queue\ImportJobTracker;
use AppBundle\Import\Queue\QueueAdapterInterface;
use Doctrine\ORM\EntityManager;
use Symfony\Component\DependencyInjection\ContainerInterface;

class UserRemove extends AbstractImportJob
{
    /**
     * @param array              $args
     * @param ContainerInterface $container
     */
    protected function doRun($args, $container)
    {
        /** @var EntityManager $em */
        /** @var UserRemover $userRemover */
        /** @var ImportJobTracker $importJobTracker */
        /** @var ImportContext $importContext */
        /** @var QueueAdapterInterface $queueAdapter */
        $em = $container->get('em');
        $userRemover = $container->get('ha.import.user_remover');
        $importJobTracker = $container->get('ha.import.import_job_tracker');
        $importContext = $container->get('ha.import.import_context');
        $queueAdapter = $container->get('ha.import.queue_adapter');

        $queueAdapter->dequeueUserRemoval($importContext->getImportJob(), $this->job->payload['id']);
        $importJobTracker->extendLock();

        $this->log('Removing users for job {jobID}', ['jobID' => $importContext->getImportJob()->getId()]);
        if (
            !isset($args['ids_to_remove'])
            && !isset($args['refs_to_remove'])
            && !$importJobTracker->isUserRemovalEligible()
        ) {
            $this->log(
                'Removing users for job {jobID} is not eligible',
                ['jobID' => $importContext->getImportJob()->getId()]
            );

            return;
        }
        $importJobTracker->userRemovalStart();
        try {
            $userRemover->remove($importContext->getImportJob(), $args);
            $importJobTracker->userRemovalComplete();
        } catch (\Exception $e) {
            $importJobTracker->userRemovalFail($e->getMessage());
            $this->logger->error(
                sprintf(
                    'Exception caught %s %s %s',
                    $e->getCode(),
                    $e->getMessage(),
                    $e->getTraceAsString()
                )
            );
        }
        $em->persist($importContext->getImportJob());
        $em->flush();
    }
}
