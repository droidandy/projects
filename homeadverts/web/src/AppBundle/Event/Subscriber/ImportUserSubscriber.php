<?php

namespace AppBundle\Event\Subscriber;

use AppBundle\Import\Queue\ImportContext;
use AppBundle\Import\Normalizer\User\NormalisedUser;
use AppBundle\Event\ProcessedUserEvent;
use AppBundle\Event\SkippedUserEvent;
use Doctrine\ORM\EntityManager;
use AppBundle\Entity\Import\ImportUser;
use AppBundle\Entity\User\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

// todo: never used O_o ?
class ImportUserSubscriber implements EventSubscriberInterface
{
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var ImportContext
     */
    private $importContext;
    private $hasher;

    public static function getSubscribedEvents()
    {
        return [
            SkippedUserEvent::class => 'onSkippedUser',
            ProcessedUserEvent::class => 'onProcessedUser',
        ];
    }

    public function onSkippedUser(SkippedUserEvent $skippedUserEvent)
    {
        $this->addImportUser($skippedUserEvent->getUser(), $skippedUserEvent->getNormalisedUser(), null, true);
    }

    public function onProcessedUser(ProcessedUserEvent $processedUserEvent)
    {
        $this->addImportUser(
            $processedUserEvent->getUser(),
            $processedUserEvent->getNormalisedUser(),
            $processedUserEvent->getErrors()
        );
    }

    /**
     * @param User $user
     * @param NormalisedUser $normalisedUser
     * @param null $errors
     * @param bool $skipped
     */
    private function addImportUser(
        User $user,
        NormalisedUser $normalisedUser,
        $errors = null,
        $skipped = false
    ) {
        $importUser = new ImportUser();
        $importUser->job = $this->importContext->getImportJob();
        $importUser->user = $user->getId();
        $importUser->sourceRef = $user->sourceRef;
        $importUser->hash = $this->hasher->hash($normalisedUser);
        $importUser->date = new \DateTime();
        $importUser->errors = $errors;
        $importUser->skipped = $skipped;

        $this->em->persist($importUser);
    }
}
