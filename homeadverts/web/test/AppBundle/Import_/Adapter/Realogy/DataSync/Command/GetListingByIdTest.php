<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys\DataSync\Command;

use AppBundle\Import\Adapter\Sothebys\DataSync\Command\GetListingById;

class GetListingByIdTest extends AbstractCommandTest
{
    protected function getCommand()
    {
        return new GetListingById();
    }

    protected function getExpectedPath()
    {
        return 'listings/{id}';
    }

    protected function getExpectedPathParams()
    {
        return ['id'];
    }

    protected function getExpectedQueryParams()
    {
        return [];
    }
}
