<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys\DataSync\Command;

use AppBundle\Import\Adapter\Sothebys\DataSync\Command\GetActiveAgents;

class GetActiveAgentsTest extends AbstractCommandTest
{
    protected function getCommand()
    {
        return new GetActiveAgents();
    }

    protected function getExpectedPath()
    {
        return 'agents/active';
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
