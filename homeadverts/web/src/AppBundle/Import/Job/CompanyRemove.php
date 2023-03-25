<?php

namespace AppBundle\Import\Job;

use AppBundle\Import\Queue\ImportContext;
use AppBundle\Import\Queue\ImportJobTracker;
use AppBundle\Import\Queue\QueueAdapterInterface;
use Doctrine\ORM\EntityManager;
use Symfony\Component\DependencyInjection\ContainerInterface;

class CompanyRemove extends AbstractImportJob
{
    /**
     * @param $args
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

        $queueAdapter->dequeueCompanyRemoval($importContext->getImportJob(), $this->job->payload['id']);

        $importJobTracker->extendLock();

        $this->log('Removing companies for job {jobID}', ['jobID' => $importContext->getImportJob()->getId()]);
        if (
            !isset($args['ids_to_remove'])
            && !isset($args['refs_to_remove'])
            && !$importJobTracker->isCompanyRemovalEligible()
        ) {
            $this->log(
                'Removing companies for job {jobID} is not eligible',
                ['jobID' => $importContext->getImportJob()->getId()]
            );

            return;
        }
        $importJobTracker->companyRemovalStart();
        try {
            $userRemover->remove($importContext->getImportJob(), $args, false, 'setCompanyRemovedNotify');
            $importJobTracker->companyRemovalComplete();
        } catch (\Exception $e) {
            $importJobTracker->companyRemovalFail($e->getMessage());
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
