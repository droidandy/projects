<?php

namespace AppBundle\Import\Adapter\Realogy\Command;

class GetActiveListings extends AbstractGetActiveCommand
{
    public function getPath()
    {
        return 'listings/active';
    }

    public function getQueryParams()
    {
        return array_merge(parent::getQueryParams(), ['type']);
    }
}
