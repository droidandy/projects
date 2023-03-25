<?php

namespace AppBundle\Import\Adapter\Realogy\Command;

class GetActiveOffices extends AbstractGetActiveCommand
{
    public function getPath()
    {
        return 'offices/active';
    }
}
