<?php

namespace AppBundle\Import\Job;

use AppBundle\Import\Adapter\Realogy\ApiException;
use AppBundle\Import\Normalizer\User\NormalisedUserInterface;
use AppBundle\Import\Normalizer\User\NormalisedUserProxy;
use AppBundle\Import\Queue\QueueAdapterInterface;
use AppBundle\Import\User\CountResolver;
use AppBundle\Import\User\LinksToUserResolverInterface;
use AppBundle\Entity\User\User;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Downloads media associated to a property.
 */
class UserProcess extends AbstractImportJob
{
    /**
     * @var NormalisedUserInterface
     */
    private $normalisedUser;
    /**
     * @var LinksToUserResolverInterface
     */
    private $linkResolver;
    /**
     * @var CountResolver
     */
    private $countResolver;

    /**
     * @param array              $args
     * @param ContainerInterface $app
     */
    public function doRun($args, $app)
    {
        /* @var QueueAdapterInterface $queueAdapter */
        /* @var NormalisedUserInterface $normalisedUser */

        $this->em = $em = $app->get('em');
        $this->userImporter = $app->get('ha.import.user_importer');
        $this->importJobTracker = $app->get('ha.import.import_job_tracker');
        $this->importEventDispatcher = $app->get('ha.import.event_dispatcher');
        $this->importContext = $app->get('ha.import.import_context');
        $this->linkResolver = $app->get('ha.import.links_to_user_resolver');
        $this->countResolver = $countResolver = $app->get('ha.user.count_resolver');
        $this->lock = $app->get('ha.lock');
        $queueAdapter = $app->get('ha.import.queue_adapter');

        $queueAdapter->dequeueUserProcessing(
            $this->importContext->getImportJob(),
            $args['jobID']
        );
        $this->importJobTracker->extendLock();

        $this->normalisedUser = $normalisedUser = $app
            ->get('ha.import.normalised_entity_factory')
            ->createUser($args)
        ;

        $this->lock->executeInLock(
            'user'.$normalisedUser->getSourceRef(),
            60,
            60,
            function () use ($normalisedUser, $em, $countResolver, $args) {
                $this->importJobTracker->tryUserImportStart();

                try {
                    if ($normalisedUser instanceof NormalisedUserProxy) {
                        $normalisedUser->initialize();
                    }
                } catch (ApiException $e) {
                    $this->importJobTracker->notifyUserSkipped();
                    $this->importJobTracker->tryUserImportComplete();

                    if (404 != $e->getHttpCode()) {
                        throw $e;
                    }

                    $this->logger->warning(
                        sprintf(
                            'Finished. User "%s" not found with response "%s"',
                            json_encode($args),
                            json_encode($e->getParsedResponse())
                        )
                    );

                    return;
                }

                $this->log('Importing user '.$normalisedUser->getSourceRef());

                /** @var User $user */
                [$user, $isNew] = $this->userImporter->fetchUser($normalisedUser);
                $isDeletedBeforeProcessing = $user->isDeleted();

                // force user id creation
                $em->flush();
                $this->importContext->onSuccess();

                $this->linkResolver->resolveLinksToUser($user);
                $em->flush();
                $countResolver->resolveAgent($user);

                if (
                    $isNew
                    || (
                        $isDeletedBeforeProcessing
                        && !$user->isDeleted()
                    )
                ) {
                    $countResolver->onAgentAdded($user);
                }

                $this->log('Finished.');
                $this->importJobTracker->tryUserImportComplete();
            },
            function () use ($normalisedUser, $args) {
                $this->log(
                    sprintf(
                        'Failed to acquire lock %s on %s',
                        'user'.$normalisedUser->getSourceRef(),
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
        $prefix = $this->normalisedUser->getSourceRef() ? '['.$this->normalisedUser->getSourceRef().'] ' : '';

        parent::log($prefix.$text);
    }
}
