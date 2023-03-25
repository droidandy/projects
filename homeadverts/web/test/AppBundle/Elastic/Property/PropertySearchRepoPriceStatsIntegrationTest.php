<?php

namespace AppBundle\Elastic\Property;

use AppBundle\Entity\Property\Property;
use AppBundle\Elastic\Integration\Mapping\MappingInterface;
use AppBundle\Search\Market;
use Doctrine\DBAL\Connection;
use Elasticsearch\Client;
use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\LocationTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\UserTrait;

class PropertySearchRepoPriceStatsIntegrationTest extends AbstractTestCase
{
    use PropertyTrait, UserTrait, AddressTrait, LocationTrait, GoogleLocationTrait;

    /**
     * @var MappingInterface[]
     */
    private $mappings = [];
    /**
     * @var Connection
     */
    protected $conn;
    /**
     * @var Client
     */
    private $esClient;
    /**
     * @var PropertySearchRepo
     */
    private $propertySearchRepo;

    protected function setUp()
    {
        parent::setUp();

        $this->flush = false;

        $container = static::$kernel->getContainer();

        $this->conn = $this->em->getConnection();
        $this->conn->beginTransaction();

        $mappingFactory = $container->get('ha.es.mapping_factory');
        foreach (['user', 'property', 'article', 'category', 'tag'] as $type) {
            $this->mappings[] = $mapping = $mappingFactory->get($type);
            $mapping->apply();
        }

        $this->esClient = $container->get('es_client');
        $this->propertySearchRepo = $container->get('ha.property.property_search_repo');

        $this->createLocationsPersistent('Manhattan', 'Spain', 'California');
    }

    protected function tearDown()
    {
        $this->conn->rollBack();
        foreach ($this->mappings as $mapping) {
            $mapping->remove();
        }
    }

    public function testFindPriceStats()
    {
        $this->propertyDataGenerator = function () use (&$price) {
            return [
                'price' => 1000000,
            ];
        };
        $this->createPropertiesForSalePersistent([
            'Manhattan' => 5,
            'Spain' => 10,
            'California' => 15,
        ]);

        $this->propertyDataGenerator = function () use (&$price) {
            return [
                'price' => 2000000,
            ];
        };
        $this->createPropertiesToRentPersistent([
            'Manhattan' => 15,
            'Spain' => 5,
            'California' => 10,
        ]);

        $this->propertyDataGenerator = null;
        $this->em->flush();
        $this->esClient->indices()->refresh(['index' => 'test_properties']);
        $this->esClient->indices()->refresh(['index' => 'test_agents']);

        $priceStats = $this->propertySearchRepo->findPriceStats();

        $this->assertEquals(
            [
                'min_price' => 1000000,
                'max_price' => 2000000,
                'avg_price' => 1500000,
            ],
            $priceStats
        );
    }

    public function testFindPriceStatsFilteredByMarket()
    {
        $this->propertyDataGenerator = function () use (&$price) {
            return [
                'price' => 1000000,
            ];
        };
        $this->createPropertiesForSalePersistent([
            'Manhattan' => 5,
            'Spain' => 5,
            'California' => 5,
        ]);

        $this->propertyDataGenerator = function () use (&$price) {
            return [
                'price' => 2000000,
            ];
        };
        $this->createPropertiesToRentPersistent([
            'Manhattan' => 5,
            'Spain' => 5,
            'California' => 5,
        ]);

        $this->propertyDataGenerator = null;
        $this->em->flush();
        $this->esClient->indices()->refresh(['index' => 'test_properties']);
        $this->esClient->indices()->refresh(['index' => 'test_agents']);

        $priceStats = $this->propertySearchRepo->findPriceStats([
            'market' => Market::sale(),
        ]);

        $this->assertEquals(
            [
                'min_price' => 1000000,
                'max_price' => 1000000,
                'avg_price' => 1000000,
            ],
            $priceStats
        );

        $priceStats = $this->propertySearchRepo->findPriceStats([
            'market' => Market::rental(),
        ]);

        $this->assertEquals(
            [
                'min_price' => 2000000,
                'max_price' => 2000000,
                'avg_price' => 2000000,
            ],
            $priceStats
        );
    }

    public function testFindPriceStatsFilteredByMarketAndLocation()
    {
        $this->propertyDataGenerator = function () use (&$price) {
            return [
                'price' => 1000000,
            ];
        };
        $this->createPropertiesForSalePersistent([
            'Manhattan' => 5,
        ]);

        $this->propertyDataGenerator = function () use (&$price) {
            return [
                'price' => 2000000,
            ];
        };
        $this->createPropertiesForSalePersistent([
            'Spain' => 5,
        ]);

        $this->propertyDataGenerator = function () use (&$price) {
            return [
                'price' => 3000000,
            ];
        };
        $this->createPropertiesToRentPersistent([
            'California' => 5,
        ]);

        $this->propertyDataGenerator = null;
        $this->em->flush();
        $this->esClient->indices()->refresh(['index' => 'test_properties']);
        $this->esClient->indices()->refresh(['index' => 'test_agents']);

        $priceStats = $this->propertySearchRepo->findPriceStats([
            'market' => Market::sale(),
            'location' => $this->getLocation('Manhattan'),
        ]);

        $this->assertEquals(
            [
                'min_price' => 1000000,
                'max_price' => 1000000,
                'avg_price' => 1000000,
            ],
            $priceStats
        );

        $priceStats = $this->propertySearchRepo->findPriceStats([
            'market' => Market::sale(),
            'location' => $this->getLocation('Spain'),
        ]);

        $this->assertEquals(
            [
                'min_price' => 2000000,
                'max_price' => 2000000,
                'avg_price' => 2000000,
            ],
            $priceStats
        );

        $priceStats = $this->propertySearchRepo->findPriceStats([
            'market' => Market::rental(),
            'location' => $this->getLocation('California'),
        ]);

        $this->assertEquals(
            [
                'min_price' => 3000000,
                'max_price' => 3000000,
                'avg_price' => 3000000,
            ],
            $priceStats
        );
    }

    public function testFindPriceStatsFilteredByMarketAndFeatured()
    {
        $this->propertyDataGenerator = function () use (&$price) {
            return [
                'price' => 1000000,
                'featured' => true,
            ];
        };
        $this->createPropertiesForSalePersistent([
            'Manhattan' => 5,
            'Spain' => 5,
            'California' => 5,
        ]);

        $this->propertyDataGenerator = function () use (&$price) {
            return [
                'price' => 2000000,
                'featured' => null,
            ];
        };
        $this->createPropertiesForSalePersistent([
            'Manhattan' => 5,
            'Spain' => 5,
            'California' => 5,
        ]);

        $this->propertyDataGenerator = null;
        $this->em->flush();
        $this->esClient->indices()->refresh(['index' => 'test_properties']);
        $this->esClient->indices()->refresh(['index' => 'test_agents']);

        $priceStats = $this->propertySearchRepo->findPriceStats([
            'market' => Market::sale(),
            'featured' => true,
        ]);

        $this->assertEquals(
            [
                'min_price' => 1000000,
                'max_price' => 1000000,
                'avg_price' => 1000000,
            ],
            $priceStats
        );
    }

    public function testFindPriceStatsRedundantFiltersIgnored()
    {
        $this->propertyDataGenerator = function () use (&$price) {
            return [
                'price' => 1000000,
                'videos' => true,
            ];
        };
        $this->createPropertiesForSalePersistent([
            'Manhattan' => 5,
            'Spain' => 5,
            'California' => 5,
        ]);

        $this->propertyDataGenerator = function () use (&$price) {
            return [
                'price' => 2000000,
                'videos' => false,
            ];
        };
        $this->createPropertiesForSalePersistent([
            'Manhattan' => 5,
            'Spain' => 5,
            'California' => 5,
        ]);

        $this->propertyDataGenerator = null;
        $this->em->flush();
        $this->esClient->indices()->refresh(['index' => 'test_properties']);
        $this->esClient->indices()->refresh(['index' => 'test_agents']);

        $priceStats = $this->propertySearchRepo->findPriceStats([
            'market' => Market::sale(),
            'media' => Property::MEDIA_VIDEO,
        ]);

        $this->assertEquals(
            [
                'min_price' => 1000000,
                'max_price' => 2000000,
                'avg_price' => 1500000,
            ],
            $priceStats
        );
    }
}
