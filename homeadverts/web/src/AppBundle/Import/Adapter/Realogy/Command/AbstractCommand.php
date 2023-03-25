<?php

namespace AppBundle\Import\Adapter\Realogy\Command;

abstract class AbstractCommand implements CommandInterface
{
    public function getPathParams()
    {
        return [];
    }

    public function getQueryParams()
    {
        return [];
    }
}
