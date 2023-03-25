<?php

namespace Test\AppBundle\Elastic\Location;

use AppBundle\Entity\Location\Location;
use AppBundle\Entity\Social\Article;
use AppBundle\Elastic\Integration\Mapping\MappingInterface;
use AppBundle\Geo\GeometryService;
use AppBundle\Elastic\Location\LocationRepo;
use AppBundle\Search\LocationFactory;
use Doctrine\DBAL\Connection;
use Elasticsearch\Client;
use AppBundle\Entity\User\User;
use Symfony\Component\Routing\RouterInterface;
use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\LocationTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\TagTrait;
use Test\Utils\Traits\UserTrait;

class LocationRepoIntegrationTest extends AbstractTestCase
{
    use ArticleTrait, PropertyTrait, UserTrait, AddressTrait, LocationTrait, GoogleLocationTrait, TagTrait;

    private $flush = true;
    /**
     * @var Client
     */
    private $esClient;
    /**
     * @var GeometryService
     */
    private $geometryService;
    /**
     * @var LocationRepo
     */
    private $locationRepo;
    /**
     * @var LocationFactory
     */
    private $locationFactory;
    /**
     * @var RouterInterface
     */
    private $router;
    /**
     * @var Connection
     */
    protected $conn;
    /**
     * @var MappingInterface[]
     */
    private $mappings;
    /**
     * @var User[]
     */
    private $testUsers;
    /**
     * @var Article
     */
    private $topArticle;

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

        $this->locationFactory = $this->getLocationFactory();
        $container->set('location_factory', $this->locationFactory);

        $this->router = $this->getRouter();
        $container->set('router', $this->router);

        $this->esClient = $container->get('es_client');
        $this->locationRepo = $container->get('ha.search.location_repo');

        $locations = $this->createLocationsPersistent('Manhattan', 'California', 'Spain');
        /** @var \PHPUnit_Framework_MockObject_MockObject $locationFactory */
        $locationFactory = $this->locationFactory;
        $locationFactory
            ->expects($this->once())
            ->method('getLocationsFromPredictions')
            ->with('location_term')
            ->willReturn($locations)
        ;
        /** @var \PHPUnit_Framework_MockObject_MockObject $geometryService */
        $geometryService = $this->geometryService;
        $geometryService
            ->expects($this->any())
            ->method('warmupGeometries')
            ->with($locations)
        ;
        $geometryService
            ->expects($this->any())
            ->method('getGeometry')
            ->withConsecutive(
                [$locations[0]],
                [$locations[1]],
                [$locations[2]]
            )->willReturnCallback(function (Location $location) use ($fixturesPath) {
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

        $startTime = microtime(true);
        $this->setUpProperties();
        $this->setUpAgents();
        $this->testUsers = $this->createUsersPersistent([[
            'name' => '111location_term111',
            'company_name' => 'location_term',
            'property_count' => 10,
        ]]);

        $this->createCategoriesWithTermPersistent(3, 'location_term', true);
        $this->createCategoriesNonsearchablePersistent(5);

        // create tag for articles
        $this->createTagsPersistent([[
            [
                'displayName' => 'location_term article_tag',
            ],
        ]]);
        $this->createTagsWithTermPersistent(3, 'location_term', true);
        $this->createTagsNonsearchablePersistent(5);
        // make article most relevant
        $this->topArticle = $this->createArticlesPersistent([[
            [
                'title' => 'location_term location_term location_term',
                'subtitle' => 'location_term',
                'description' => 'location_term',
                'tags' => ['location_term article_tag'],
                'body' => 'location_term',
                'token' => 'location_term',
                'user' => [
                    'name' => 'location_term',
                    'companyName' => 'location_term',
                ],
            ],
        ]])[0];
        $this->createArticlesWithSearchTermPersistent('location_term', [
            'title' => 5,
            'body' => 5,
            'author.name' => 5,
            'tags' => 5,
            'slug' => 5,
        ]);
        $this->createArticlesNonsearcheable(10);
        $this->em->flush();
        $this->esClient->indices()->refresh(['index' => 'test_properties']);
        $this->esClient->indices()->refresh(['index' => 'test_agents']);
        $this->esClient->indices()->refresh(['index' => 'test_articles']);
    }

    protected function tearDown()
    {
        $this->conn->rollBack();
        foreach ($this->mappings as $mapping) {
            $mapping->remove();
        }
        parent::tearDown();
    }

    public function testAggregationsForLocationBoundStrategy()
    {
        $response = $this->locationRepo->findAggregationsPerLocation('location_term', 'bound');

        $this->assertResponseCorrect($response);
    }

    public function testAggregationsForLocationPlaceIdStrategy()
    {
        $response = $this->locationRepo->findAggregationsPerLocation('location_term', 'place_id');

        $this->assertResponseCorrect($response);
    }

    public function assertResponseCorrect($response)
    {
        $this->assertEquals([
            'id' => [
                'items' => [],
                'total' => 0,
            ],
            'mls' => [
                'items' => [],
                'total' => 0,
            ],
            'zip' => [
                'items' => [],
                'total' => 0,
            ],
            'ref' => [
                'items' => [],
                'total' => 0,
            ],
            'agent' => [
                'items' => [
                    [
                        'id' => (string) $this->testUsers[0]->getId(),
                        'title' => '111location_term111, location_term',
                        'properties' => 10,
                        'url' => 'route_mock',
                    ],
                ],
                'total' => 7, // 1 special and 6 from articles stubs
            ],
            'article' => [
                'items' => [
                    [
                        'id' => $this->topArticle->getId(),
                        'title' => 'location_term location_term location_term',
                        'url' => 'route_mock',
                    ],
                ],
                'total' => 26,
            ],
            'category' => [
                'items' => [
                    [
                        'display_name' => 'location_term location_term location_term location_term 1',
                    ],
                    [
                        'display_name' => 'location_term location_term location_term 2',
                    ],
                    [
                        'display_name' => 'location_term location_term 3',
                    ],
                ],
                'total' => 3,
            ],
            'tag' => [
                'items' => [
                    [
                        'display_name' => 'location_term location_term location_term location_term 1',
                    ],
                    [
                        'display_name' => 'location_term location_term location_term 2',
                    ],
                    [
                        'display_name' => 'location_term location_term 3',
                    ],
                ],
                'total' => 4,
            ],
            'location' => [
                'items' => [
                    [
                        'title' => 'Manhattan, New York, NY, USA',
                        'properties' => [
                            'sale' => [
                                'total' => 5,
                                'url' => 'route_mock',
                            ],
                            'rent' => [
                                'total' => 15,
                                'url' => 'route_mock',
                            ],
                        ],
                        'agents' => [
                            'total' => 1,
                            'url' => 'route_mock',
                        ],
                        'url' => 'route_mock',
                    ],
                    [
                        'title' => 'California, USA',
                        'properties' => [
                            'sale' => [
                                'total' => 15,
                                'url' => 'route_mock',
                            ],
                            'rent' => [
                                'total' => 17,
                                'url' => 'route_mock',
                            ],
                        ],
                        'agents' => [
                            'total' => 3,
                            'url' => 'route_mock',
                        ],
                        'url' => 'route_mock',
                    ],
                    [
                        'title' => 'Spain',
                        'properties' => [
                            'sale' => [
                                'total' => 10,
                                'url' => 'route_mock',
                            ],
                            'rent' => [
                                'total' => 11,
                                'url' => 'route_mock',
                            ],
                        ],
                        'agents' => [
                            'total' => 2,
                            'url' => 'route_mock',
                        ],
                        'url' => 'route_mock',
                    ],
                ],
                'total' => 3,
            ],
        ], $response);
    }

    private function getGeometryService()
    {
        return $this
            ->getMockBuilder(GeometryService::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getLocationFactory()
    {
        return $this
            ->getMockBuilder(LocationFactory::class)
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

    private function setUpProperties()
    {
        $this->createPropertiesForSalePersistent([
            'Manhattan' => 5,
            'California' => 15,
            'Spain' => 10,
        ]);
        $this->createPropertiesToRentPersistent([
            'Manhattan' => 15,
            'California' => 17,
            'Spain' => 11,
        ]);
    }

    private function setUpAgents()
    {
        $this->createUsersByLocationsPersistent([
            'Manhattan' => 1,
            'California' => 3,
            'Spain' => 2,
        ]);
    }
}
