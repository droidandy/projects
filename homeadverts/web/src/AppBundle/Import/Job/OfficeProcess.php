<?php

namespace AppBundle\Import\Job;

use AppBundle\Entity\User\User;
use AppBundle\Import\Adapter\Realogy\ApiException;
use AppBundle\Import\Normalizer\Office\NormalisedOfficeInterface;
use AppBundle\Import\Normalizer\Office\NormalisedOfficeProxy;
use AppBundle\Import\Queue\QueueAdapterInterface;
use AppBundle\Import\User\CountResolver;
use AppBundle\Import\User\LinksToUserResolverInterface;
use Doctrine\ORM\EntityManager;
use Symfony\Component\DependencyInjection\ContainerInterface;

class OfficeProcess extends AbstractImportJob
{
    /**
     * @var NormalisedOfficeInterface
     */
    private $normalisedOffice;
    /**
     * @var LinksToUserResolverInterface
     */
    private $linkResolver;
    /**
     * @var CountResolver
     */
    private $countResolver;

    /**
     * @param $args
     * @param ContainerInterface $app
     */
    protected function doRun($args, $app)
    {
        /* @var EntityManager $em */
        /* @var QueueAdapterInterface $queueAdapter */
        /* @var NormalisedOfficeInterface $normalisedOffice */

        $this->em = $em = $app->get('em');
        $this->userImporter = $app->get('ha.import.user_importer');
        $this->importJobTracker = $app->get('ha.import.import_job_tracker');
        $this->importEventDispatcher = $app->get('ha.import.event_dispatcher');
        $this->importContext = $app->get('ha.import.import_context');
        $this->linkResolver = $linkResolver = $app->get('ha.import.links_to_user_resolver');
        $this->countResolver = $linkResolver = $app->get('ha.user.count_resolver');
        $this->lock = $app->get('ha.lock');
        $queueAdapter = $app->get('ha.import.queue_adapter');

        $queueAdapter->dequeueOfficeProcessing(
            $this->importContext->getImportJob(),
            $args['jobID']
        );

        $this->importJobTracker->extendLock();
        $this->normalisedOffice = $normalisedOffice = $app
            ->get('ha.import.normalised_entity_factory')
            ->createOffice($args)
        ;

        $this->lock->executeInLock(
            'office'.$normalisedOffice->getSourceRef(),
            60,
            60,
            function () use ($normalisedOffice, $args, $em) {
                $this->importJobTracker->tryOfficeImportStart();

                try {
                    if ($normalisedOffice instanceof NormalisedOfficeProxy) {
                        $normalisedOffice->initialize();
                    }
                } catch (ApiException $e) {
                    $this->importJobTracker->notifyOfficeSkipped();
                    $this->importJobTracker->tryOfficeImportComplete();

                    if (404 != $e->getHttpCode()) {
                        throw $e;
                    }

                    $this->logger->warning(
                        sprintf(
                            'Finished. Office "%s" not found with response "%s"',
                            json_encode($args),
                            json_encode($e->getParsedResponse())
                        )
                    );

                    return;
                }

                $this->log('Importing office '.$normalisedOffice->getSourceRef());

                /** @var User $user */
                [$user, $isNew] = $this->userImporter->fetchUser($normalisedOffice);
                $isDeletedBeforeProcessing = $user->isDeleted();
                // force user id creation
                $em->flush();
                $this->importContext->onSuccess();

                $this->linkResolver->resolveLinksToOffice($user);
                $em->flush();

                if (
                    $isNew
                    || (
                        $isDeletedBeforeProcessing
                        && !$user->isDeleted()
                    )
                ) {
                    $this->countResolver->resolveOffice($user, CountResolver::CHAIN_MODE_ADD);
                } else {
                    $this->countResolver->resolveOffice($user, CountResolver::CHAIN_MODE_UPDATE);
                }

                $this->log('Finished.');
                $this->importJobTracker->tryOfficeImportComplete();
            },
            function () use ($normalisedOffice, $args) {
                $this->log(
                    sprintf(
                        'Failed to acquire lock %s on %s',
                        'office'.$normalisedOffice->getSourceRef(),
                        json_encode($args)
                    )
                );
            }
        );
    }

    public function getErrors()
    {
        return json_encode($this->errors);
    }

    public function countErrors()
    {
        $count = 0;

        foreach ($this->errors as $errors) {
            $count += count($errors);
        }

        return $count;
    }

    public function log($text, array $context = [])
    {
        $prefix = $this->normalisedOffice->getSourceRef() ? '['.$this->normalisedOffice->getSourceRef().'] ' : '';

        parent::log($prefix.$text);
    }
}
