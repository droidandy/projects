<?php

namespace AppBundle\Import\Adapter\Realogy\Command;

class GetCompanyDelta extends AbstractGetDeltaCommand
{
    public function getPath()
    {
        return 'companies/delta';
    }
}
