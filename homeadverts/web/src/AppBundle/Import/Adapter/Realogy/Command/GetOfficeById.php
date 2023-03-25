<?php

namespace AppBundle\Import\Adapter\Realogy\Command;

class GetOfficeById extends AbstractGetByIdCommand
{
    public function getPath()
    {
        return 'offices/{id}';
    }
}
