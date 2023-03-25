<?php

namespace Test\AppBundle\Import_\Adapter\Sothebys\DataSync;

use AppBundle\Import\Adapter\Sothebys\DataSync\Command\CommandInterface;
use AppBundle\Import\Adapter\Sothebys\DataSync\Command\GetActiveAgents;
use AppBundle\Import\Adapter\Sothebys\DataSync\Command\GetActiveListings;
use AppBundle\Import\Adapter\Sothebys\DataSync\Command\GetActiveOffices;
use AppBundle\Import\Adapter\Sothebys\DataSync\Command\GetAgentById;
use AppBundle\Import\Adapter\Sothebys\DataSync\Command\GetAgentDelta;
use AppBundle\Import\Adapter\Sothebys\DataSync\Command\GetListingById;
use AppBundle\Import\Adapter\Sothebys\DataSync\Command\GetListingDelta;
use AppBundle\Import\Adapter\Sothebys\DataSync\Command\GetOfficeById;
use AppBundle\Import\Adapter\Sothebys\DataSync\Command\GetOfficeDelta;
use AppBundle\Import\Adapter\Sothebys\DataSync\DataSyncClient;
use Test\Utils\Traits\DateTrait;

class DataSyncClientTest extends \PHPUnit_Framework_TestCase
{
    use DateTrait;
    /**
     * @var DataSyncClient
     */
    private $dataSyncClient;
    /**
     * @var callable
     */
    private $assertionCallback;

    protected function setUp()
    {
        $this->dataSyncClient = new DataSyncClient(
            function (...$args) {
                $assertionCallback = $this->assertionCallback;

                return $assertionCallback(...$args);
            },
            function (...$args) {
                $assertionCallback = $this->assertionCallback;

                return $assertionCallback(...$args);
            }
        );
    }

    public function testGetActiveOffices()
    {
        $this->_testGetCollection('getActiveOffices', GetActiveOffices::class);
    }

    public function testGetActiveAgents()
    {
        $this->_testGetCollection('getActiveAgents', GetActiveAgents::class);
    }

    public function testGetActiveListings()
    {
        $this->_testGetCollection('getActiveListings', GetActiveListings::class);
    }

    private function _testGetCollection($method, $commandClass)
    {
        $this->assertionCallback = function (CommandInterface $command, $args) use ($commandClass) {
            $this->assertInstanceOf($commandClass, $command);
            $this->assertEquals(['countryCode' => 'US'], $args);

            return 'active';
        };

        $this->assertEquals('active', $this->dataSyncClient->{$method}(['countryCode' => 'US']));
    }

    public function testGetOfficeDelta()
    {
        $this->_testGetDelta('getOfficeDelta', GetOfficeDelta::class);
    }

    public function testGetAgentDelta()
    {
        $this->_testGetDelta('getAgentDelta', GetAgentDelta::class);
    }

    public function testGetListingDelta()
    {
        $this->_testGetDelta('getListingDelta', GetListingDelta::class);
    }

    private function _testGetDelta($method, $commandClass)
    {
        $this->assertionCallback = function (DataSyncClient $client, CommandInterface $command, $args) use ($commandClass) {
            $this->assertInstanceOf($commandClass, $command);
            $this->assertEquals(
                [
                    'since' => '2018-07-24T00:00:00.000Z',
                    'countryCode' => 'US',
                ],
                $args
            );

            return ['delta1', 'delta2', 'delta3'];
        };

        $this->assertEquals(
            ['delta1', 'delta2', 'delta3'],
            $this
                ->dataSyncClient
                ->{$method}(
                    $this->getDate('2018-07-24 03:00:00.000000+03:00'),
                    ['countryCode' => 'US']
                )
        );
    }

    public function testGetOfficeById()
    {
        $this->_testGetById('getOfficeById', GetOfficeById::class);
    }

    public function testGetAgentById()
    {
        $this->_testGetById('getAgentById', GetAgentById::class);
    }

    public function testGetListingById()
    {
        $this->_testGetById('getListingById', GetListingById::class);
    }

    private function _testGetById($method, $commandClass)
    {
        $this->assertionCallback = function (CommandInterface $command, $args) use ($commandClass) {
            $this->assertInstanceOf($commandClass, $command);
            $this->assertEquals(['id' => 1], $args);

            return 'get_by_id';
        };

        $this->assertEquals('get_by_id', $this->dataSyncClient->{$method}(1));
    }
}
