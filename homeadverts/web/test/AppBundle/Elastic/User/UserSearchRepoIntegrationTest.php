<?php

namespace Test\AppBundle\Elastic\User;

use AppBundle\Entity\Location\Location;
use AppBundle\Elastic\Integration\Mapping\MappingInterface;
use AppBundle\Geo\GeometryService;
use Doctrine\DBAL\Connection;
use Elasticsearch\Client;
use Symfony\Component\Routing\RouterInterface;
use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\LocationTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\UserTrait;
use AppBundle\Elastic\User\UserSearchRepo;

class UserSearchRepoIntegrationTest extends AbstractTestCase
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
     * @var UserSearchRepo
     */
    private $userSearchRepo;
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
        $this->userSearchRepo = $container->get('ha.user.user_search_repo');

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
        /** @var \PHPUnit_Framework_MockObject_MockObject $router */
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

    public function testLocationFilterBoundStrategy()
    {
        $this->_testLocationFilter('bound');
    }

    public function testLocationFilterPlaceIdStrategy()
    {
        $this->_testLocationFilter('place_id');
    }

    public function _testLocationFilter($strategy)
    {
        $this->createUsersByLocationsPersistent([
            'Manhattan' => 15,
            'California' => 6,
            'Spain' => 10,
        ]);
        $this->em->flush();
        $this->esClient->indices()->refresh(['index' => 'test_properties']);
        $this->esClient->indices()->refresh(['index' => 'test_agents']);

        $results = $this->userSearchRepo->findAgentsByLocation(
            $this->getLocation('Manhattan'),
            [],
            1,
            $strategy
        );
        $this->assertEquals(15, $results['agents']->getTotal());
        $this->assertEquals(15, count($results['agents']));

        $results = $this->userSearchRepo->findAgentsByLocation(
            $this->getLocation('Manhattan'),
            [],
            [
                'page' => 2,
                'per_page' => 10,
            ],
            $strategy
        );
        $this->assertEquals(15, $results['agents']->getTotal());
        $this->assertEquals(5, count($results['agents']));

        $results = $this->userSearchRepo->findAgentsByLocation(
            $this->getLocation('Manhattan'),
            [],
            [
                'page' => 3,
                'per_page' => 10,
            ],
            $strategy
        );

        $this->assertEquals(15, $results['agents']->getTotal());
        $this->assertEquals(0, count($results['agents']));

        $results = $this->userSearchRepo->findAgentsByLocation(
            $this->getLocation('California'),
            [],
            1,
            $strategy
        );

        $this->assertEquals(6, $results['agents']->getTotal());
        $this->assertEquals(6, count($results['agents']));

        $results = $this->userSearchRepo->findAgentsByLocation(
            $this->getLocation('California'),
            [],
            [
                'page' => 2,
                'per_page' => 10,
            ],
            $strategy
        );
        $this->assertEquals(6, $results['agents']->getTotal());
        $this->assertEquals(0, count($results['agents']));

        $results = $this->userSearchRepo->findAgentsByLocation(
            $this->getLocation('Spain'),
            [],
            [
                'page' => 1,
                'per_page' => 5,
            ],
            $strategy
        );

        $this->assertEquals(10, $results['agents']->getTotal());
        $this->assertEquals(5, count($results['agents']));

        $results = $this->userSearchRepo->findAgentsByLocation(
            $this->getLocation('Spain'),
            [],
            [
                'page' => 2,
                'per_page' => 5,
            ],
            $strategy
        );

        $this->assertEquals(10, $results['agents']->getTotal());
        $this->assertEquals(5, count($results['agents']));

        $results = $this->userSearchRepo->findAgentsByLocation(
            $this->getLocation('Spain'),
            [],
            [
                'page' => 3,
                'per_page' => 5,
            ],
            $strategy
        );

        $this->assertEquals(10, $results['agents']->getTotal());
        $this->assertEquals(0, count($results['agents']));
    }

    public function testLanguageFilter()
    {
        $this->userDataGenerator = function () {
            return [
                'primary_language' => 'en',
                'spoken_languages' => ['fr'],
            ];
        };

        $this->createUsersByLocationsPersistent([
            'Manhattan' => 15,
        ]);

        $this->userDataGenerator = function () {
            return [
                'primary_language' => 'de',
                'spoken_languages' => ['es'],
            ];
        };

        $this->createUsersByLocationsPersistent([
            'Manhattan' => 10,
        ]);
        $this->em->flush();
        $this->esClient->indices()->refresh(['index' => 'test_properties']);
        $this->esClient->indices()->refresh(['index' => 'test_agents']);

        $results = $this->userSearchRepo->findAgentsByLocation(
            $this->getLocation('Manhattan'),
            [
                'language' => 'en',
            ],
            [
                'page' => 1,
                'per_page' => 50,
            ]
        );
        $this->assertEquals(15, $results['agents']->getTotal());
        $this->assertEquals(15, count($results['agents']));

        $results = $this->userSearchRepo->findAgentsByLocation(
            $this->getLocation('Manhattan'),
            [
                'language' => 'fr',
            ],
            [
                'page' => 1,
                'per_page' => 50,
            ]
        );
        $this->assertEquals(15, $results['agents']->getTotal());
        $this->assertEquals(15, count($results['agents']));

        $results = $this->userSearchRepo->findAgentsByLocation(
            $this->getLocation('Manhattan'),
            [
                'language' => 'de',
            ],
            [
                'page' => 1,
                'per_page' => 50,
            ]
        );
        $this->assertEquals(10, $results['agents']->getTotal());
        $this->assertEquals(10, count($results['agents']));

        $results = $this->userSearchRepo->findAgentsByLocation(
            $this->getLocation('Manhattan'),
            [
                'language' => 'es',
            ],
            [
                'page' => 1,
                'per_page' => 50,
            ]
        );
        $this->assertEquals(10, $results['agents']->getTotal());
        $this->assertEquals(10, count($results['agents']));
    }

    public function testWithoutPropertiesFilter()
    {
        $this->userDataGenerator = function () {
            return [
                'property_count' => 0,
            ];
        };

        $this->createUsersByLocationsPersistent([
            'Manhattan' => 15,
        ]);

        $this->userDataGenerator = function () {
            return [
                'property_count' => 1,
            ];
        };

        $this->createUsersByLocationsPersistent([
            'Manhattan' => 10,
        ]);
        $this->em->flush();
        $this->esClient->indices()->refresh(['index' => 'test_properties']);
        $this->esClient->indices()->refresh(['index' => 'test_agents']);

        $results = $this->userSearchRepo->findAgentsByLocation(
            $this->getLocation('Manhattan'),
            [
                'with_properties' => false,
            ],
            [
                'page' => 1,
                'per_page' => 50,
            ]
        );
        $this->assertEquals(25, $results['agents']->getTotal());
        $this->assertEquals(25, count($results['agents']));

        $results = $this->userSearchRepo->findAgentsByLocation(
            $this->getLocation('Manhattan'),
            [
                'with_properties' => true,
            ],
            [
                'page' => 1,
                'per_page' => 50,
            ]
        );
        $this->assertEquals(10, $results['agents']->getTotal());
        $this->assertEquals(10, count($results['agents']));
    }

    public function testSortFilter()
    {
        $firstLetters = chunk_split('ABCDEFGHIJ', 1, '');
        $i = 0;
        $this->userDataGenerator = function () use (&$i, $firstLetters) {
            return [
                'name' => sprintf('%sadya Hrenova', $firstLetters[$i++]),
            ];
        };

        $this->createUsersByLocationsPersistent([
            'Manhattan' => 10,
        ]);

        $this->em->flush();
        $this->esClient->indices()->refresh(['index' => 'test_properties']);
        $this->esClient->indices()->refresh(['index' => 'test_agents']);

        $results = $this->userSearchRepo->findAgentsByLocation(
            $this->getLocation('Manhattan'),
            [
                'sort' => 'name:asc',
            ]
        );
        $this->assertEquals(10, $results['agents']->getTotal());
        $this->assertEquals(10, count($results['agents']));

        $i = 0;
        foreach ($results['agents'] as $user) {
            $this->assertEquals(sprintf('%sadya Hrenova', $firstLetters[$i++]), $user->getName());
        }

        $results = $this->userSearchRepo->findAgentsByLocation(
            $this->getLocation('Manhattan'),
            [
                'sort' => 'name:desc',
            ]
        );
        $this->assertEquals(10, $results['agents']->getTotal());
        $this->assertEquals(10, count($results['agents']));

        $i = 9;
        foreach ($results['agents'] as $user) {
            $this->assertEquals(sprintf('%sadya Hrenova', $firstLetters[$i--]), $user->getName());
        }
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
