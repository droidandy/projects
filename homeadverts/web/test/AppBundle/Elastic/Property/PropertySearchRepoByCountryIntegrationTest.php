<?php

namespace AppBundle\Elastic\Property;

use AppBundle\Entity\Property\Property;
use AppBundle\Elastic\Integration\Mapping\MappingInterface;
use Doctrine\DBAL\Connection;
use Elasticsearch\Client;
use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\LocationTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\UserTrait;

class PropertySearchRepoByCountryIntegrationTest extends AbstractTestCase
{
    use PropertyTrait, UserTrait, AddressTrait, LocationTrait;

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
    }

    protected function tearDown()
    {
        $this->conn->rollBack();
        foreach ($this->mappings as $mapping) {
            $mapping->remove();
        }
    }

    public function testByCountryAggregation()
    {
        $this->createPropertiesForSalePersistent([
            'Manhattan' => 10,
            'Los Angeles' => 15,
            'London' => 5,
            'Spain' => 11,
        ]);
        $this->createPropertiesToRentPersistent([
            'San Francisco' => 15,
            'New Delhi' => 1,
            'New South Wales' => 5,
        ]);

        $this->propertyDataGenerator = function () {
            return [
                'status' => Property::STATUS_INCOMPLETE,
            ];
        };
        $this->createPropertiesForSalePersistent([
            'Manhattan' => 10,
            'London' => 10,
            'Spain' => 10,
        ]);
        $this->createPropertiesToRentPersistent([
            'San Francisco' => 10,
            'New Delhi' => 10,
            'New South Wales' => 10,
        ]);

        $this->em->flush();
        $this->esClient->indices()->refresh(['index' => 'test_properties']);
        $this->esClient->indices()->refresh(['index' => 'test_agents']);

        $results = $this->propertySearchRepo->findPropertyCountByCountries();
        $this->assertEquals([
            'US' => 40,
            'GB' => 5,
            'ES' => 11,
            'IN' => 1,
            'AU' => 5,
        ], $results);

        $results = $this->propertySearchRepo->findPropertyCountByCountries(Property::MARKET_SALE);
        $this->assertEquals([
            'US' => 25,
            'GB' => 5,
            'ES' => 11,
        ], $results);

        $results = $this->propertySearchRepo->findPropertyCountByCountries(Property::MARKET_RENTAL);
        $this->assertEquals([
            'US' => 15,
            'IN' => 1,
            'AU' => 5,
        ], $results);
    }
}
