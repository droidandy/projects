<?php

namespace AppBundle\Event\Subscriber;

use AppBundle\Entity\Import\ImportJobRepository;
use AppBundle\Import\Queue\ImportContext;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use AppBundle\Event\ProcessedUserEvent;
use AppBundle\Event\SkippedUserEvent;

// todo: never used O_o ?
class ImportJobStatusSubscriber implements EventSubscriberInterface
{
    /**
     * @var ImportContext
     */
    private $importContext;
    /**
     * @var ImportJobRepository
     */
    private $importJobRepo;

    /**
     * ImportJobStatusSubscriber constructor.
     *
     * @param ImportContext       $importContext
     * @param ImportJobRepository $importJobRepo
     */
    public function __construct(ImportContext $importContext, ImportJobRepository $importJobRepo)
    {
        $this->importContext = $importContext;
        $this->importJobRepo = $importJobRepo;
    }

    public static function getSubscribedEvents()
    {
        return [
            SkippedUserEvent::class => 'onSkippedUser',
            ProcessedUserEvent::class => 'onProcessedUser',
        ];
    }

    public function onSkippedUser(SkippedUserEvent $skippedUserEvent)
    {
        $importJob = $this->importContext->getImportJob();
        $this
            ->importJobRepo
            ->incrementUserProcessed(
                $importJob,
                0,
                1
            )
        ;

        $importJob->incrementUserSkipped();
        $importJob->incrementUserProcessed();
    }

    public function onProcessedUser(ProcessedUserEvent $processedUserEvent)
    {
        $importJob = $this->importContext->getImportJob();
        $this
            ->importJobRepo
            ->incrementUserProcessed(
                $importJob,
                count($processedUserEvent->getErrors()) ? 1 : 0,
                0
            )
        ;

        if (!empty($errors)) {
            $importJob->incrementUserErrors();
        }
        $importJob->incrementUserUpdated();
        $importJob->incrementUserProcessed();
    }
}
