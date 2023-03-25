<?php

namespace AppBundle\Import\Job;

use AppBundle\Import\Queue\ImportContext;
use AppBundle\Import\Queue\ImportJobTracker;
use AppBundle\Import\Queue\QueueAdapterInterface;
use Doctrine\ORM\EntityManager;
use Symfony\Component\DependencyInjection\ContainerInterface;

class OfficeRemove extends AbstractImportJob
{
    /**
     * @param $args
     * @param ContainerInterface $container
     */
    protected function doRun($args, $container)
    {
        /** @var EntityManager $em */
        $em = $container->get('em');
        /** @var UserRemover $userRemover */
        $userRemover = $container->get('ha.import.user_remover');
        /** @var ImportJobTracker $importJobTracker */
        $importJobTracker = $container->get('ha.import.import_job_tracker');
        /** @var ImportContext $importContext */
        $importContext = $container->get('ha.import.import_context');
        /** @var QueueAdapterInterface $queueAdapter */
        $queueAdapter = $container->get('ha.import.queue_adapter');

        $queueAdapter->dequeueOfficeRemoval($importContext->getImportJob(), $this->job->payload['id']);

        $importJobTracker->extendLock();

        $this->log('Removing offices for job {jobID}', ['jobID' => $importContext->getImportJob()->getId()]);
        if (
            !isset($args['ids_to_remove'])
            && !isset($args['refs_to_remove'])
            && !$importJobTracker->isOfficeRemovalEligible()
        ) {
            $this->log(
                'Removing offices for job {jobID} is not eligible',
                ['jobID' => $importContext->getImportJob()->getId()]
            );

            return;
        }
        $importJobTracker->officeRemovalStart();
        try {
            $userRemover->remove($importContext->getImportJob(), $args, false, 'setOfficeRemovedNotify');
            $importJobTracker->officeRemovalComplete();
        } catch (\Exception $e) {
            $importJobTracker->officeRemovalFail($e->getMessage());
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
