<?php

namespace AppBundle\Import\Adapter\Realogy\Command;

class GetAgentById extends AbstractGetByIdCommand
{
    public function getPath()
    {
        return 'agents/{id}';
    }
}
