<?php

namespace AppBundle\Import\Adapter\Realogy\Command;

abstract class AbstractGetDeltaCommand extends AbstractCommand
{
    public function getQueryParams()
    {
        return ['since', 'brandCode', 'countryCode', 'limit'];
    }
}
