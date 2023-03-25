<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys\DataSync\Command;

use AppBundle\Import\Adapter\Sothebys\DataSync\Command\GetListingDelta;

class GetListingDeltaTest extends AbstractCommandTest
{
    protected function getCommand()
    {
        return new GetListingDelta();
    }

    protected function getExpectedPath()
    {
        return 'listings/delta';
    }

    protected function getExpectedPathParams()
    {
        return [];
    }

    protected function getExpectedQueryParams()
    {
        return ['since', 'brandCode', 'countryCode', 'limit', 'type'];
    }
}
