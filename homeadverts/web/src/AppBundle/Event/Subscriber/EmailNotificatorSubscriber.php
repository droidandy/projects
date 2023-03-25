<?php

namespace AppBundle\Event\Subscriber;

use AppBundle\Event\ImportEvent;
use AppBundle\Service\Report\ImportReporter;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class EmailNotificatorSubscriber implements EventSubscriberInterface
{
    /**
     * @var ImportReporter
     */
    private $importReporter;

    public static function getSubscribedEvents()
    {
        return [
            ImportEvent::IMPORT_COMPLETED => ['onImportCompleted', -1024],
        ];
    }

    /**
     * EmailNotificatorSubscriber constructor.
     *
     * @param ImportReporter $importReporter
     */
    public function __construct(ImportReporter $importReporter)
    {
        $this->importReporter = $importReporter;
    }

    public function onImportCompleted(ImportEvent $importEvent)
    {
        $this->importReporter->sendSummary($importEvent->getImportContext());
    }
}
