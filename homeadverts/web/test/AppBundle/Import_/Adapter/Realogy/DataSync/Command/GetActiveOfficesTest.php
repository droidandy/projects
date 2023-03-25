<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys\DataSync\Command;

use AppBundle\Import\Adapter\Sothebys\DataSync\Command\GetActiveOffices;

class GetActiveOfficesTest extends AbstractCommandTest
{
    protected function getCommand()
    {
        return new GetActiveOffices();
    }

    protected function getExpectedPath()
    {
        return 'offices/active';
    }

    protected function getExpectedPathParams()
    {
        return [];
    }

    protected function getExpectedQueryParams()
    {
        return ['brandCode', 'countryCode'];
    }
}
