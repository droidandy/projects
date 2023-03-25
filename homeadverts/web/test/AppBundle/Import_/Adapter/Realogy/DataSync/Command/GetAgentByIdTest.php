<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys\DataSync\Command;

use AppBundle\Import\Adapter\Sothebys\DataSync\Command\GetAgentById;

class GetAgentByIdTest extends AbstractCommandTest
{
    protected function getCommand()
    {
        return new GetAgentById();
    }

    protected function getExpectedPath()
    {
        return 'agents/{id}';
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
