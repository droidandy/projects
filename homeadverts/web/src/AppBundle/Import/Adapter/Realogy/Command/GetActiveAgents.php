<?php

namespace AppBundle\Import\Adapter\Realogy\Command;

class GetActiveAgents extends AbstractGetActiveCommand
{
    public function getPath()
    {
        return 'agents/active';
    }
}
