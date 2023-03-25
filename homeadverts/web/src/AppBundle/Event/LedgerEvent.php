<?php

namespace AppBundle\Event;

use Symfony\Component\EventDispatcher\Event;

class LedgerEvent extends Event
{
    const LEDGER_UPDATE = 'ledger_update';

    /**
     * @var string
     */
    public $type;
    /**
     * @var array
     */
    public $collection = [];

    /**
     * @param string $type
     * @param array  $collection
     */
    public function __construct(string $type, array $collection)
    {
        $this->type = $type;
        $this->collection = $collection;
    }
}
