<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys\DataSync\Command;

use AppBundle\Import\Adapter\Sothebys\DataSync\Command\GetOfficeById;

class GetOfficeByIdTest extends AbstractCommandTest
{
    protected function getCommand()
    {
        return new GetOfficeById();
    }

    protected function getExpectedPath()
    {
        return 'offices/{id}';
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
