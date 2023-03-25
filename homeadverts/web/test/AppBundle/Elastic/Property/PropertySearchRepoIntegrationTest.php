<?php

namespace AppBundle\Elastic\Property;

use AppBundle\Entity\Location\Location;
use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyTypes;
use AppBundle\Elastic\Integration\Mapping\MappingInterface;
use AppBundle\Geo\GeometryService;
use AppBundle\Service\CurrencyManager;
use AppBundle\Search\Market;
use Doctrine\DBAL\Connection;
use Elasticsearch\Client;
use Symfony\Component\Routing\RouterInterface;
use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\LocationTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\UserTrait;

class PropertySearchRepoIntegrationTest extends AbstractTestCase
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
     * @var GeometryService
     */
    private $geometryService;
    /**
     * @var PropertySearchRepo
     */
    private $propertySearchRepo;
    /**
     * @var RouterInterface
     */
    private $router;

    protected function setUp()
    {
        parent::setUp();

        $this->flush = false;

        $fixturesPath = $this->getFixturesPath();
        $container = static::$kernel->getContainer();

        // setting data for currency manager
        $cache = $container->get('cache');
        $cache->setNamespace(CurrencyManager::CACHE_NAMESPACE);
        $cache->save(CurrencyManager::CACHE_KEY.'-en', [
            'USD' => [
                'id' => 'USD',
                'name' => 'United States Dollar',
                'symbol' => '',
                'decimal_separator' => '.',
                'thousands_separator' => ',',
                'rate' => '1',
                'display' => '1',
            ],
            'EUR' => [
                'id' => 'EUR',
                'name' => 'Euro',
                'symbol' => '',
                'decimal_separator' => '.',
                'thousands_separator' => ',',
                'rate' => '0.918498',
                'display' => '1',
            ],
            'GBP' => [
                'id' => 'GBP',
                'name' => 'British Pound Sterling',
                'symbol' => '',
                'decimal_separator' => '.',
                'thousands_separator' => ',',
                'rate' => '0.657315',
                'display' => '1',
            ],
        ]);

        $this->conn = $this->em->getConnection();
        $this->conn->beginTransaction();

        $mappingFactory = $container->get('ha.es.mapping_factory');
        foreach (['user', 'property', 'article', 'category', 'tag'] as $type) {
            $this->mappings[] = $mapping = $mappingFactory->get($type);
            $mapping->apply();
        }

        $this->geometryService = $this->getGeometryService();
        $container->set('ha.geometry_service', $this->geometryService);

        $this->router = $this->getRouter();
        $container->set('router', $this->router);

        $this->esClient = $container->get('es_client');
        $this->propertySearchRepo = $container->get('ha.property.property_search_repo');

        $locations = $this->createLocationsPersistent('Manhattan', 'Spain', 'California');
        /** @var \PHPUnit_Framework_MockObject_MockObject $geometryService */
        $geometryService = $this->geometryService;
        $geometryService
            ->expects($this->any())
            ->method('getGeometry')
            ->willReturnCallback(function (Location $location) use ($fixturesPath) {
                switch ($location->getName()) {
                    case 'Manhattan, New York, NY, USA':
                        return json_decode(file_get_contents($fixturesPath.'geo/manhattan.geojson'), true);
                    case 'California, USA':
                        return json_decode(file_get_contents($fixturesPath.'geo/ca.geojson'), true);
                    case 'Spain':
                        return null;
                    default:
                        $this->fail('Unexpected input '.$location->getName());
                }
            })
        ;
        /** @var \PHPUnit_Framework_MockObject_MockObject $geometryService */
        $router = $this->router;
        $router
            ->expects($this->any())
            ->method('generate')
            ->willReturn('route_mock')
        ;
    }

    protected function tearDown()
    {
        $this->conn->rollBack();
        foreach ($this->mappings as $mapping) {
            $mapping->remove();
        }
    }

    public function testGetPropertiesForLocationBoundStrategy()
    {
        $this->_testGetPropertiesForLocation('bound');
    }

    public function testGetPropertiesForLocationPlaceIdStrategy()
    {
        $this->_testGetPropertiesForLocation('place_id');
    }

    public function _testGetPropertiesForLocation($strategy)
    {
        $this->setUpProperties();
        $this->em->flush();
        $this->esClient->indices()->refresh(['index' => 'test_properties']);
        $this->esClient->indices()->refresh(['index' => 'test_agents']);

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Manhattan'),
            Market::all(),
            [],
            1,
            $strategy
        );

        $this->assertEquals(20, $results['properties']->getTotal());
        $this->assertEquals(15, count($results['properties'])); // default per_page is 15

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Manhattan'),
            Market::all(),
            [],
            [
                'page' => 2,
                'per_page' => 10,
            ],
            $strategy
        );

        $this->assertEquals(20, $results['properties']->getTotal());
        $this->assertEquals(10, count($results['properties']));

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Manhattan'),
            Market::all(),
            [],
            [
                'page' => 3,
                'per_page' => 10,
            ],
            $strategy
        );

        $this->assertEquals(20, $results['properties']->getTotal());
        $this->assertEquals(0, count($results['properties']));

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Manhattan'),
            Market::sale(),
            [],
            1,
            $strategy
        );

        $this->assertEquals(5, $results['properties']->getTotal());
        $this->assertEquals(5, count($results['properties']));

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Manhattan'),
            Market::rental(),
            [],
            [
                'page' => 2,
                'per_page' => 10,
            ],
            $strategy
        );

        $this->assertEquals(15, $results['properties']->getTotal());
        $this->assertEquals(5, count($results['properties']));

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('California'),
            Market::all(),
            [],
            [
                'page' => 1,
                'per_page' => 50,
            ],
            $strategy
        );

        $this->assertEquals(32, $results['properties']->getTotal());
        $this->assertEquals(32, count($results['properties']));

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Spain'),
            Market::all(),
            [],
            [
                'page' => 1,
                'per_page' => 50,
            ],
            $strategy
        );

        $this->assertEquals(21, $results['properties']->getTotal());
        $this->assertEquals(21, count($results['properties']));

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            null,
            Market::all(),
            [],
            [
                'page' => 1,
                'per_page' => 50,
            ],
            $strategy
        );

        $this->assertEquals(73, $results['properties']->getTotal());
        $this->assertEquals(50, count($results['properties']));

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            null,
            Market::all(),
            [],
            [
                'page' => 2,
                'per_page' => 50,
            ],
            $strategy
        );

        $this->assertEquals(73, $results['properties']->getTotal());
        $this->assertEquals(23, count($results['properties']));
    }

    public function testBathsAndBedroomsFilter()
    {
        $this->propertyDataGenerator = function () {
            return [
                'bedrooms' => rand(5, 10),
                'bathrooms' => rand(3, 10),
            ];
        };
        $this->createPropertiesForSalePersistent([
            'Manhattan' => 15,
        ]);
        $this->createPropertiesToRentPersistent([
            'Manhattan' => 10,
        ]);
        $this->propertyDataGenerator = function () {
            return [
                'bedrooms' => rand(1, 4),
                'bathrooms' => rand(1, 2),
            ];
        };
        $this->createPropertiesForSalePersistent([
            'Manhattan' => 15,
        ]);
        $this->createPropertiesToRentPersistent([
            'Manhattan' => 20,
        ]);
        $this->propertyDataGenerator = null;

        $this->em->flush();
        $this->esClient->indices()->refresh(['index' => 'test_properties']);
        $this->esClient->indices()->refresh(['index' => 'test_agents']);

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Manhattan'),
            Market::sale(),
            [
                'bedrooms' => 5,
                'bathrooms' => 3,
            ],
            [
                'page' => 1,
                'per_page' => 50,
            ]
        );

        $this->assertEquals(15, $results['properties']->getTotal());
        $this->assertEquals(15, count($results['properties']));

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Manhattan'),
            Market::rental(),
            [
                'bedrooms' => 5,
                'bathrooms' => 3,
            ],
            [
                'page' => 1,
                'per_page' => 50,
            ]
        );

        $this->assertEquals(10, $results['properties']->getTotal());
        $this->assertEquals(10, count($results['properties']));

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Manhattan'),
            Market::all(),
            [
                'bedrooms' => 5,
            ],
            [
                'page' => 1,
                'per_page' => 50,
            ]
        );

        $this->assertEquals(25, $results['properties']->getTotal());
        $this->assertEquals(25, count($results['properties']));

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Manhattan'),
            Market::all(),
            [
                'bathrooms' => 3,
            ],
            [
                'page' => 1,
                'per_page' => 50,
            ]
        );

        $this->assertEquals(25, $results['properties']->getTotal());
        $this->assertEquals(25, count($results['properties']));
    }

    public function testSinceFilter()
    {
        $this->propertyDataGenerator = function () {
            $pattern = '-%s hours';

            return [
                'date_added' => new \DateTime(sprintf($pattern, rand(1, 45))),
            ];
        };

        $this->createPropertiesForSalePersistent([
            'Manhattan' => 15,
        ]);
        $this->createPropertiesToRentPersistent([
            'Manhattan' => 10,
        ]);

        $this->propertyDataGenerator = function () {
            $pattern = '-%s hours';

            return [
                'date_added' => new \DateTime(sprintf($pattern, rand(72, 96))),
            ];
        };

        $this->createPropertiesForSalePersistent([
            'Manhattan' => 15,
        ]);
        $this->createPropertiesToRentPersistent([
            'Manhattan' => 20,
        ]);

        $this->propertyDataGenerator = null;

        $this->em->flush();
        $this->esClient->indices()->refresh(['index' => 'test_properties']);
        $this->esClient->indices()->refresh(['index' => 'test_agents']);

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Manhattan'),
            Market::sale(),
            [
                'since' => '48 hrs',
            ],
            [
                'page' => 1,
                'per_page' => 50,
            ]
        );

        $this->assertEquals(15, $results['properties']->getTotal());
        $this->assertEquals(15, count($results['properties']));

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Manhattan'),
            Market::rental(),
            [
                'since' => '48 hrs',
            ],
            [
                'page' => 1,
                'per_page' => 50,
            ]
        );

        $this->assertEquals(10, $results['properties']->getTotal());
        $this->assertEquals(10, count($results['properties']));
    }

    public function testPriceFilter()
    {
        $this->propertyDataGenerator = function () {
            return [
                'price' => rand(10000000, 20000000),
            ];
        };

        $this->createPropertiesForSalePersistent([
            'Manhattan' => 15,
        ]);
        $this->createPropertiesToRentPersistent([
            'Manhattan' => 10,
        ]);

        $this->propertyDataGenerator = function () {
            return [
                'price' => rand(1000000, 10000000),
            ];
        };

        $this->createPropertiesForSalePersistent([
            'Manhattan' => 15,
        ]);
        $this->createPropertiesToRentPersistent([
            'Manhattan' => 20,
        ]);

        $this->propertyDataGenerator = function () {
            return [
                'price' => rand(20000000, 30000000),
            ];
        };

        $this->createPropertiesForSalePersistent([
            'Manhattan' => 15,
        ]);
        $this->createPropertiesToRentPersistent([
            'Manhattan' => 20,
        ]);

        $this->propertyDataGenerator = null;

        $this->em->flush();
        $this->esClient->indices()->refresh(['index' => 'test_properties']);
        $this->esClient->indices()->refresh(['index' => 'test_agents']);

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Manhattan'),
            Market::sale(),
            [
                'price' => [
                    'currency' => 'USD',
                    'from' => 10000000,
                    'to' => 20000000,
                ],
            ],
            [
                'page' => 1,
                'per_page' => 50,
            ]
        );

        $this->assertEquals(15, $results['properties']->getTotal());
        $this->assertEquals(15, count($results['properties']));

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Manhattan'),
            Market::rental(),
            [
                'price' => [
                    'currency' => 'USD',
                    'range' => '10000000:20000000',
                ],
            ],
            [
                'page' => 1,
                'per_page' => 50,
            ]
        );

        $this->assertEquals(10, $results['properties']->getTotal());
        $this->assertEquals(10, count($results['properties']));
    }

    public function testTypesFilter()
    {
        $this->propertyDataGenerator = function () {
            return [
                'type' => PropertyTypes::DETACHED,
            ];
        };

        $this->createPropertiesForSalePersistent([
            'Manhattan' => 5,
        ]);
        $this->createPropertiesToRentPersistent([
            'Manhattan' => 5,
        ]);

        $this->propertyDataGenerator = function () {
            return [
                'type' => PropertyTypes::APARTMENT,
            ];
        };

        $this->createPropertiesForSalePersistent([
            'Manhattan' => 6,
        ]);
        $this->createPropertiesToRentPersistent([
            'Manhattan' => 6,
        ]);

        $this->propertyDataGenerator = function () {
            return [
                'type' => PropertyTypes::FARM,
            ];
        };

        $this->createPropertiesForSalePersistent([
            'Manhattan' => 7,
        ]);
        $this->createPropertiesToRentPersistent([
            'Manhattan' => 7,
        ]);

        $this->propertyDataGenerator = function () {
            return [
                'type' => PropertyTypes::LAND,
            ];
        };

        $this->createPropertiesForSalePersistent([
            'Manhattan' => 8,
        ]);
        $this->createPropertiesToRentPersistent([
            'Manhattan' => 8,
        ]);

        $this->propertyDataGenerator = function () {
            return [
                'type' => PropertyTypes::SEMI_DETACHED,
            ];
        };

        $this->createPropertiesForSalePersistent([
            'Manhattan' => 9,
        ]);
        $this->createPropertiesToRentPersistent([
            'Manhattan' => 9,
        ]);

        $this->propertyDataGenerator = null;

        $this->em->flush();
        $this->esClient->indices()->refresh(['index' => 'test_properties']);
        $this->esClient->indices()->refresh(['index' => 'test_agents']);

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Manhattan'),
            Market::sale(),
            [
                'type' => PropertyTypes::DETACHED,
            ]
        );

        $this->assertEquals(5, $results['properties']->getTotal());
        $this->assertEquals(5, count($results['properties']));

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Manhattan'),
            Market::rental(),
            [
                'type' => PropertyTypes::DETACHED,
            ]
        );

        $this->assertEquals(5, $results['properties']->getTotal());
        $this->assertEquals(5, count($results['properties']));

        // Current form type doesn't support multiple type values
        /*$results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Manhattan'),
            Market::sale(),
            [
                'type' => [PropertyTypes::APARTMENT, PropertyTypes::FARM, PropertyTypes::LAND],
            ],
            [
                'page' => 1,
                'per_page' => 50
            ]
        );

        $this->assertEquals(21, $results['properties']->getTotal());
        $this->assertEquals(21, count($results['properties']));

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Manhattan'),
            Market::rental(),
            [
                'type' => [PropertyTypes::APARTMENT, PropertyTypes::FARM, PropertyTypes::LAND],
            ],
            [
                'page' => 1,
                'per_page' => 50
            ]
        );

        $this->assertEquals(21, $results['properties']->getTotal());
        $this->assertEquals(21, count($results['properties']));*/

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Manhattan'),
            Market::all(),
            [
                'type' => PropertyTypes::TOWNHOUSE,
            ]
        );

        $this->assertEquals(0, $results['properties']->getTotal());
        $this->assertEquals(0, count($results['properties']));
    }

    public function testFeaturedFilter()
    {
        $this->propertyDataGenerator = function () {
            return [
                'featured' => new \DateTime(),
            ];
        };

        $this->createPropertiesForSalePersistent([
            'Manhattan' => 15,
        ]);
        $this->createPropertiesToRentPersistent([
            'Manhattan' => 10,
        ]);

        $this->propertyDataGenerator = function () {
            return [
                'featured' => null,
            ];
        };

        $this->createPropertiesForSalePersistent([
            'Manhattan' => 15,
        ]);
        $this->createPropertiesToRentPersistent([
            'Manhattan' => 20,
        ]);

        $this->propertyDataGenerator = null;

        $this->em->flush();
        $this->esClient->indices()->refresh(['index' => 'test_properties']);
        $this->esClient->indices()->refresh(['index' => 'test_agents']);

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Manhattan'),
            Market::sale(),
            [
                'featured' => true,
            ],
            [
                'page' => 1,
                'per_page' => 50,
            ]
        );

        $this->assertEquals(15, $results['properties']->getTotal());
        $this->assertEquals(15, count($results['properties']));

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Manhattan'),
            Market::rental(),
            [
                'featured' => true,
            ],
            [
                'page' => 1,
                'per_page' => 50,
            ]
        );

        $this->assertEquals(10, $results['properties']->getTotal());
        $this->assertEquals(10, count($results['properties']));
    }

    public function testIdsFilter()
    {
        $propertySaleIds = $this->createPropertiesForSalePersistent([
            'Manhattan' => 15,
        ]);
        $propertyRentIds = $this->createPropertiesToRentPersistent([
            'Manhattan' => 10,
        ]);

        $this->em->flush();
        $this->esClient->indices()->refresh(['index' => 'test_properties']);
        $this->esClient->indices()->refresh(['index' => 'test_agents']);

        $propertySaleIds = array_map(
            function (Property $property) {
                return $property->getId();
            },
            $propertySaleIds
        );
        $propertyRentIds = array_map(
            function (Property $property) {
                return $property->getId();
            },
            $propertyRentIds
        );

        $propertySaleIdsQuery = array_slice($propertySaleIds, 0, 5);

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Manhattan'),
            Market::sale(),
            [
                'ids' => $propertySaleIdsQuery,
            ],
            [
                'page' => 1,
                'per_page' => 50,
            ]
        );

        $this->assertEquals(5, $results['properties']->getTotal());
        $this->assertEquals(5, count($results['properties']));
        foreach ($results['properties'] as $result) {
            $this->assertContains($result->getId(), $propertySaleIdsQuery);
        }

        $propertyRentIdsQuery = array_slice($propertyRentIds, 0, 5);

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Manhattan'),
            Market::rental(),
            [
                'ids' => $propertyRentIdsQuery,
            ],
            [
                'page' => 1,
                'per_page' => 50,
            ]
        );

        $this->assertEquals(5, $results['properties']->getTotal());
        $this->assertEquals(5, count($results['properties']));
        foreach ($results['properties'] as $result) {
            $this->assertContains($result->getId(), $propertyRentIdsQuery);
        }
    }

    public function testMediaFilter()
    {
        $this->propertyDataGenerator = function () {
            return [
                'videos' => true,
            ];
        };

        $this->createPropertiesForSalePersistent([
            'Manhattan' => 15,
        ]);
        $this->createPropertiesToRentPersistent([
            'Manhattan' => 10,
        ]);

        $this->propertyDataGenerator = function () {
            return [
                'videos' => false,
            ];
        };

        $this->createPropertiesForSalePersistent([
            'Manhattan' => 15,
        ]);
        $this->createPropertiesToRentPersistent([
            'Manhattan' => 20,
        ]);

        $this->propertyDataGenerator = null;

        $this->em->flush();
        $this->esClient->indices()->refresh(['index' => 'test_properties']);
        $this->esClient->indices()->refresh(['index' => 'test_agents']);

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Manhattan'),
            Market::sale(),
            [
                'media' => Property::MEDIA_VIDEO,
            ],
            [
                'page' => 1,
                'per_page' => 50,
            ]
        );

        $this->assertEquals(15, $results['properties']->getTotal());
        $this->assertEquals(15, count($results['properties']));

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Manhattan'),
            Market::rental(),
            [
                'media' => Property::MEDIA_VIDEO,
            ],
            [
                'page' => 1,
                'per_page' => 50,
            ]
        );

        $this->assertEquals(10, $results['properties']->getTotal());
        $this->assertEquals(10, count($results['properties']));
    }

    public function testSortByPriceFilter()
    {
        $price = 0;
        $this->propertyDataGenerator = function () use (&$price) {
            $price = $price + 1000000;

            return [
                'price' => $price,
            ];
        };

        $propertiesForSale = $this->createPropertiesForSalePersistent([
            'Manhattan' => 15,
        ]);
        $propertiesToRent = $this->createPropertiesToRentPersistent([
            'Manhattan' => 10,
        ]);

        $this->propertyDataGenerator = null;

        $this->em->flush();
        $this->esClient->indices()->refresh(['index' => 'test_properties']);
        $this->esClient->indices()->refresh(['index' => 'test_agents']);

        $propertiesForSale = array_reverse($propertiesForSale);
        $propertiesToRent = array_reverse($propertiesToRent);

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Manhattan'),
            Market::sale(),
            [
                'sort' => 'price:desc',
            ],
            [
                'page' => 1,
                'per_page' => 10,
            ]
        );

        $this->assertEquals(15, $results['properties']->getTotal());
        $this->assertEquals(10, count($results['properties']));
        $i = 0;
        foreach ($results['properties'] as $property) {
            $this->assertEquals($property->getId(), $propertiesForSale[$i++]->getId());
        }

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Manhattan'),
            Market::sale(),
            [
                'sort' => 'price:desc',
            ],
            [
                'page' => 2,
                'per_page' => 10,
            ]
        );

        $this->assertEquals(15, $results['properties']->getTotal());
        $this->assertEquals(5, count($results['properties']));
        $i = 10;
        foreach ($results['properties'] as $property) {
            $this->assertEquals($property->getId(), $propertiesForSale[$i++]->getId());
        }

        $results = $this->propertySearchRepo->findPropertiesByLocation(
            $this->getLocation('Manhattan'),
            Market::rental(),
            [
                'sort' => 'price:desc',
            ],
            [
                'page' => 1,
                'per_page' => 50,
            ]
        );

        $this->assertEquals(10, $results['properties']->getTotal());
        $this->assertEquals(10, count($results['properties']));
        $i = 0;
        foreach ($results['properties'] as $property) {
            $this->assertEquals($property->getId(), $propertiesToRent[$i++]->getId());
        }
    }

    private function setUpProperties()
    {
        $this->createPropertiesForSalePersistent([
            'Manhattan' => 5,
            'Spain' => 10,
            'California' => 15,
        ]);
        $this->createPropertiesToRentPersistent([
            'Manhattan' => 15,
            'Spain' => 11,
            'California' => 17,
        ]);
    }

    private function getGeometryService()
    {
        return $this
            ->getMockBuilder(GeometryService::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getRouter()
    {
        return $this
            ->getMockBuilder(RouterInterface::class)
            ->getMock()
        ;
    }
}
