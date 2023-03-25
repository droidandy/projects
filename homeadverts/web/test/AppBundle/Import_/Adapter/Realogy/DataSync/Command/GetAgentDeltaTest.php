<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys\DataSync\Command;

use AppBundle\Import\Adapter\Sothebys\DataSync\Command\GetAgentDelta;

class GetAgentDeltaTest extends AbstractCommandTest
{
    protected function getCommand()
    {
        return new GetAgentDelta();
    }

    protected function getExpectedPath()
    {
        return 'agents/delta';
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
