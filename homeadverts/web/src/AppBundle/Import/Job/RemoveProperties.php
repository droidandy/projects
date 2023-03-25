<?php

namespace AppBundle\Import\Job;

use AppBundle\Import\Queue\ImportContext;
use AppBundle\Import\Queue\ImportJobTracker;
use Doctrine\ORM\EntityManager;
use AppBundle\Entity\Import\ImportJob;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Removes properties which have been removed from the XML file.
 */
class RemoveProperties extends AbstractImportJob
{
    /**
     * @param array              $args
     * @param ContainerInterface $app
     */
    public function doRun($args, $app)
    {
        /** @var PropertyRemover $remover */
        /** @var ImportContext $importContext */
        /** @var ImportJobTracker $importJobTracker */
        /** @var EntityManager $em */
        /** @var ImportJob $job */

        $remover = $app->get('app.import_property_remover');
        $helper = $app->get('ha.importer');
        $importContext = $app->get('ha.import.import_context');
        $importJobTracker = $app->get('ha.import.import_job_tracker');
        $em = $app->get('em');
        $job = $helper->find($args['jobID']);

        $this->log('Removing properties for job '.$args['jobID']);

        $importJobTracker->propertyRemovalStart();
        try {
            $total = count(iterator_to_array($remover->remove($job, $args)));
            $this->log('Removed '.$total.' properties');
            $job->setRemovedNotify($total);
            $importJobTracker->propertyRemovalComplete();
        } catch (\Exception $e) {
            $importJobTracker->propertyRemovalFail($e->getMessage());
            $this->logger->error(
                sprintf(
                    'Exception caught %s %s %s',
                    $e->getCode(),
                    $e->getMessage(),
                    $e->getTraceAsString()
                )
            );
        }

        $em->persist($job);
        $em->flush();

        $importJobTracker->tryComplete();
        $em->flush();
    }
}
