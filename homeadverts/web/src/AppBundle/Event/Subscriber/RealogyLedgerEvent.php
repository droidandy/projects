<?php

namespace AppBundle\Event\Subscriber;

use AppBundle\Event\LedgerEvent;
use AppBundle\Service\Import\LedgerService;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class RealogyLedgerEvent implements EventSubscriberInterface
{
    /**
     * @var LedgerService
     */
    private $ledger;

    /**
     * @param LedgerService $ledger
     */
    public function __construct(LedgerService $ledger)
    {
        $this->ledger = $ledger;
    }

    public static function getSubscribedEvents()
    {
        return [
            LedgerEvent::LEDGER_UPDATE => 'onLedgerUpdateEvent',
        ];
    }

    public function onLedgerUpdateEvent(LedgerEvent $event)
    {
        $this->ledger->updateFromEvent($event);
    }
}
