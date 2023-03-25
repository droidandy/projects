<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys\DataSync\Command;

use AppBundle\Import\Adapter\Sothebys\DataSync\Command\GetOfficeDelta;

class GetOfficeDeltaTest extends AbstractCommandTest
{
    protected function getCommand()
    {
        return new GetOfficeDelta();
    }

    protected function getExpectedPath()
    {
        return 'offices/delta';
    }

    protected function getExpectedPathParams()
    {
        return [];
    }

    protected function getExpectedQueryParams()
    {
        return ['since', 'brandCode', 'countryCode', 'limit'];
    }
}
