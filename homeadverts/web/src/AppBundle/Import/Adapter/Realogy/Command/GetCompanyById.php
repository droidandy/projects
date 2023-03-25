<?php

namespace AppBundle\Import\Adapter\Realogy\Command;

class GetCompanyById extends AbstractGetByIdCommand
{
    public function getPath()
    {
        return 'companies/{id}';
    }
}
