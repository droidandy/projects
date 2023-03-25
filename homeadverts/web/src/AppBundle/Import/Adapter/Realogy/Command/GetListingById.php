<?php

namespace AppBundle\Import\Adapter\Realogy\Command;

class GetListingById extends AbstractGetByIdCommand
{
    public function getPath()
    {
        return 'listings/{id}';
    }
}
