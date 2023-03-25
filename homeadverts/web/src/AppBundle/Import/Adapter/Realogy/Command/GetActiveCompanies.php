<?php

namespace AppBundle\Import\Adapter\Realogy\Command;

class GetActiveCompanies extends AbstractGetActiveCommand
{
    public function getPath()
    {
        return 'companies/active';
    }
}
