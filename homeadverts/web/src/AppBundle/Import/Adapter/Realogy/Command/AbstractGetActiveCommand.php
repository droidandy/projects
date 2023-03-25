<?php

namespace AppBundle\Import\Adapter\Realogy\Command;

abstract class AbstractGetActiveCommand extends AbstractCommand
{
    public function getQueryParams()
    {
        return ['brandCode', 'countryCode'];
    }
}
