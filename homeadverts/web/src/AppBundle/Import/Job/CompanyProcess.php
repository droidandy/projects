<?php

namespace AppBundle\Import\Job;

use AppBundle\Entity\User\User;
use AppBundle\Import\Adapter\Realogy\ApiException;
use AppBundle\Import\Normalizer\Company\NormalisedCompanyInterface;
use AppBundle\Import\Normalizer\Company\NormalisedCompanyProxy;
use AppBundle\Import\Queue\QueueAdapterInterface;
use AppBundle\Import\User\CountResolver;
use AppBundle\Import\User\LinksToUserResolverInterface;
use Doctrine\ORM\EntityManager;
use Symfony\Component\DependencyInjection\ContainerInterface;

class CompanyProcess extends AbstractImportJob
{
    /**
     * @var NormalisedCompanyInterface
     */
    private $normalisedCompany;
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
        $this->em = $em = $app->get('em');
        $this->userImporter = $app->get('ha.import.user_importer');
        $this->importJobTracker = $app->get('ha.import.import_job_tracker');
        $this->importEventDispatcher = $app->get('ha.import.event_dispatcher');
        $this->importContext = $app->get('ha.import.import_context');
        $this->linkResolver = $app->get('ha.import.links_to_user_resolver');
        $this->countResolver = $app->get('ha.user.count_resolver');
        $this->lock = $app->get('ha.lock');
        /** @var QueueAdapterInterface $queueAdapter */
        $queueAdapter = $app->get('ha.import.queue_adapter');

        // todo: $this->job is missing on all Processing classes..
        $queueAdapter->dequeueCompanyProcessing(
            $this->importContext->getImportJob(),
            $args['jobID']
        );

        $this->importJobTracker->extendLock();

        /* @var NormalisedCompanyInterface $normalisedCompany */
        $this->normalisedCompany = $normalisedCompany = $app
            ->get('ha.import.normalised_entity_factory')
            ->createCompany($args)
        ;

        $this->lock->executeInLock(
            'company'.$normalisedCompany->getSourceRef(),
            60,
            60,
            function () use ($normalisedCompany, $em, $args) {
                $this->importJobTracker->tryCompanyImportStart();

                try {
                    if ($normalisedCompany instanceof NormalisedCompanyProxy) {
                        $normalisedCompany->initialize();
                    }
                } catch (ApiException $e) {
                    $this->importJobTracker->notifyCompanySkipped();
                    $this->importJobTracker->tryCompanyImportComplete();

                    if (404 != $e->getHttpCode()) {
                        throw $e;
                    }

                    $this->logger->warning(
                        sprintf(
                            'Finished. Company "%s" not found with response "%s"',
                            json_encode($args),
                            json_encode($e->getParsedResponse())
                        )
                    );

                    return;
                }

                $this->log('Importing company '.$normalisedCompany->getSourceRef());

                /** @var User $user */
                [$user, $isNew] = $this->userImporter->fetchUser($normalisedCompany);
                $isDeletedBeforeProcessing = $user->isDeleted();

                // force user id creation
                $em->flush();
                $this->importContext->onSuccess();

                $this->linkResolver->resolveLinksToCompany($user);
                $em->flush();

                if (
                    $isNew
                    || (
                        $isDeletedBeforeProcessing
                        && !$user->isDeleted()
                    )
                ) {
                    $this->countResolver->resolveCompany($user, CountResolver::CHAIN_MODE_ADD);
                } else {
                    $this->countResolver->resolveCompany($user, CountResolver::CHAIN_MODE_UPDATE);
                }

                $this->log('Finished.');
                $this->importJobTracker->tryCompanyImportComplete();
            },
            function () use ($normalisedCompany, $args) {
                $this->log(
                    sprintf(
                        'Failed to acquire lock %s on %s',
                        'company'.$normalisedCompany->getSourceRef(),
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
        $prefix = $this->normalisedCompany->getSourceRef() ? '['.$this->normalisedCompany->getSourceRef().'] ' : '';

        parent::log($prefix.$text);
    }
}
