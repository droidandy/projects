<?php

namespace AppBundle\Import\Adapter\Realogy\Command;

class GetListingDelta extends AbstractGetDeltaCommand
{
    public function getPath()
    {
        return 'listings/delta';
    }

    public function getQueryParams()
    {
        return array_merge(parent::getQueryParams(), ['type']);
    }
}
