<?php

namespace AppBundle\Import\Adapter\Realogy\Command;

class GetAgentDelta extends AbstractGetDeltaCommand
{
    public function getPath()
    {
        return 'agents/delta';
    }
}
