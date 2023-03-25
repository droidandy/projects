<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys\DataSync\Command;

use AppBundle\Import\Adapter\Sothebys\DataSync\Command\CommandInterface;

abstract class AbstractCommandTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var CommandInterface
     */
    private $command;

    protected function setUp()
    {
        $this->command = $this->getCommand();
    }

    public function testPath()
    {
        $this->assertEquals($this->getExpectedPath(), $this->command->getPath());
    }

    public function testPathParams()
    {
        $this->assertEquals($this->getExpectedPathParams(), $this->command->getPathParams());
    }

    public function testQueryParams()
    {
        $this->assertEquals($this->getExpectedQueryParams(), $this->command->getQueryParams());
    }

    abstract protected function getCommand();

    abstract protected function getExpectedPath();

    abstract protected function getExpectedPathParams();

    abstract protected function getExpectedQueryParams();
}
