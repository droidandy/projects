<?php

namespace AppBundle\Import\Adapter\Realogy\Command;

class GetOfficeDelta extends AbstractGetDeltaCommand
{
    public function getPath()
    {
        return 'offices/delta';
    }
}
