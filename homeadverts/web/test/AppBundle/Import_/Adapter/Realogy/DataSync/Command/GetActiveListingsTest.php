<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys\DataSync\Command;

use AppBundle\Import\Adapter\Sothebys\DataSync\Command\GetActiveListings;

class GetActiveListingsTest extends AbstractCommandTest
{
    protected function getCommand()
    {
        return new GetActiveListings();
    }

    protected function getExpectedPath()
    {
        return 'listings/active';
    }

    protected function getExpectedPathParams()
    {
        return [];
    }

    protected function getExpectedQueryParams()
    {
        return ['brandCode', 'countryCode', 'type'];
    }
}
