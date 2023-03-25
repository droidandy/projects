<?php

namespace AppBundle\Import\Adapter\Realogy\Command;

abstract class AbstractGetByIdCommand extends AbstractCommand
{
    public function getPathParams()
    {
        return ['id'];
    }
}
