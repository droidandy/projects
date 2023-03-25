<?php

namespace Test\AppBundle\Controller;

use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyTypes;
use AppBundle\Elastic\Integration\Mapping\MappingInterface;
use AppBundle\Service\CurrencyManager;
use Doctrine\DBAL\Connection;
use Elasticsearch\Client;
use Symfony\Component\DomCrawler\Crawler;
use Symfony\Component\HttpFoundation\Session\Session;
use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\UserTrait;
use Test\Utils\Traits\LocationTrait;

class PropertySearchControllerTest extends AbstractWebTestCase
{
    use AddressTrait, LocationTrait, GoogleLocationTrait, UserTrait, PropertyTrait;

    const MLN = 1000000;

    /**
     * @var Connection
     */
    protected $conn;
    /**
     * @var Client
     */
    private $esClient;
    /**
     * @var Session
     */
    private $session;
    /**
     * @var MappingInterface[]
     */
    private $mappings;

    protected function setUp()
    {
        parent::setUp();

        $this->client->disableReboot();
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

        $this->session = $container->get('session');
        $this->esClient = $container->get('es_client');

        $this->conn = $this->em->getConnection();
        $this->conn->beginTransaction();

        $mappingFactory = $container->get('ha.es.mapping_factory');
        foreach (['user', 'property', 'article', 'category', 'tag'] as $type) {
            $this->mappings[] = $mapping = $mappingFactory->get($type);
            $mapping->apply();
        }
    }

    protected function tearDown()
    {
        $this->conn->rollBack();
        foreach ($this->mappings as $mapping) {
            $mapping->remove();
        }

        parent::tearDown();
    }

    public function testEmptyAtStart()
    {
        $this->createLocationsPersistent(
            'Manhattan',
            'New York',
            'California',
            'London',
            'Spain'
        );

        $this->assertPropertiesCountOnPage(0, 'for-sale', 'Manhattan');
        $this->assertPropertiesCountOnPage(0, 'to-rent', 'Manhattan');

        $this->assertPropertiesCountOnPage(0, 'for-sale', 'New York');
        $this->assertPropertiesCountOnPage(0, 'to-rent', 'New York');

        $this->assertPropertiesCountOnPage(0, 'for-sale', 'California');
        $this->assertPropertiesCountOnPage(0, 'to-rent', 'California');

        $this->assertPropertiesCountOnPage(0, 'for-sale', 'London');
        $this->assertPropertiesCountOnPage(0, 'to-rent', 'London');

        $this->assertPropertiesCountOnPage(0, 'for-sale', 'Spain');
        $this->assertPropertiesCountOnPage(0, 'to-rent', 'Spain');
    }

    public function testGetResultsAction()
    {
        $this->createLocationsPersistent(
            'Manhattan',
            'New York',
            'California',
            'London',
            'Spain'
        );

        $this->createPropertiesForSalePersistent(
            [
                'Manhattan' => 2,
                'New York' => 1,
            ]
        );
        $this->createPropertiesToRentPersistent(
            [
                'California' => 3,
                'London' => 1,
            ]
        );

        $this->esClient->indices()->refresh(['index' => 'test_properties']);

        $this->assertPropertiesCountOnPage(3, 'for-sale', 'Manhattan');
        $this->assertPropertiesCountOnPage(0, 'to-rent', 'Manhattan');

        $this->assertPropertiesCountOnPage(3, 'for-sale', 'New York');
        $this->assertPropertiesCountOnPage(0, 'to-rent', 'New York');

        $this->assertPropertiesCountOnPage(0, 'for-sale', 'California');
        $this->assertPropertiesCountOnPage(3, 'to-rent', 'California');

        $this->assertPropertiesCountOnPage(0, 'for-sale', 'London');
        $this->assertPropertiesCountOnPage(1, 'to-rent', 'London');

        $this->assertPropertiesCountOnPage(0, 'for-sale', 'Spain');
        $this->assertPropertiesCountOnPage(0, 'to-rent', 'Spain');
    }

    public function testGetResultsActionPagination()
    {
        $this->createLocationsPersistent('Manhattan');

        $this->createPropertiesForSalePersistent(['Manhattan' => 16]);

        $this->esClient->indices()->refresh(['index' => 'test_properties']);

        $this->assertPropertiesCountOnPage(15, 'for-sale', 'Manhattan');
        $this->assertPropertiesCountOnPage(1, 'for-sale', 'Manhattan', ['p' => 2]);

        $this->createPropertiesToRentPersistent(['Manhattan' => 10]);

        $this->esClient->indices()->refresh(['index' => 'test_properties']);

        $this->assertPropertiesCountOnPage(10, 'to-rent', 'Manhattan');
        $this->assertPropertiesCountOnPage(0, 'to-rent', 'Manhattan', ['p' => 2]);
    }

    public function testGetResultsActionFiltering()
    {
        $this->createLocationsPersistent(
            'Manhattan',
            'New York',
            'California',
            'London',
            'Spain'
        );

        $this->_testGetResultsActionFilteringSale();
        $this->_testGetResultsActionFilteringRent();
    }

    private function _testGetResultsActionFilteringSale()
    {
        $this->createPropertiesForSalePersistent([
            'Manhattan' => [
                [
                    'type' => PropertyTypes::APARTMENT,
                    'status' => Property::STATUS_ACTIVE,
                    'videos' => true,
                    'bedrooms' => 5,
                    'bathrooms' => 5,
                    'price' => 10000000,
                    'featured' => false,
                    'period' => 'month',
                    'date_added' => '-1 month',
                ],
                [
                    'type' => PropertyTypes::APARTMENT,
                    'bedrooms' => 5,
                    'bathrooms' => 3,
                ],
                [
                    'bedrooms' => 10,
                    'bathrooms' => 8,
                ],
                [
                    'bedrooms' => 3,
                    'bathrooms' => 2,
                ],
            ],
            'New York' => [
                [
                    'bedrooms' => 5,
                    'bathrooms' => 3,
                ],
            ],
            'California' => [
                [
                    'type' => PropertyTypes::APARTMENT,
                ],
                [
                    'type' => PropertyTypes::APARTMENT,
                ],
                [
                    'type' => PropertyTypes::DETACHED,
                ],
            ],
            'London' => 1,
        ]);

        $this->esClient->indices()->refresh(['index' => 'test_properties']);

        $this->assertPropertiesCountOnPage(4, 'for-sale', 'Manhattan', [
            'bedrooms' => 5,
        ]);
        $this->assertPropertiesCountOnPage(1, 'for-sale', 'Manhattan', [
            'bedrooms' => 10,
        ]);

        $this->assertPropertiesCountOnPage(4, 'for-sale', 'New York', [
            'bedrooms' => 5,
            'bathrooms' => 2,
        ]);
        $this->assertPropertiesCountOnPage(2, 'for-sale', 'New York', [
            'bedrooms' => 5,
            'bathrooms' => 4,
        ]);

        $this->assertPropertiesCountOnPage(2, 'for-sale', 'California', [
            'type' => PropertyTypes::APARTMENT_SLUG,
        ]);
        $this->assertPropertiesCountOnPage(1, 'for-sale', 'California', [
            'type' => PropertyTypes::DETACHED_SLUG,
        ]);
        $this->assertPropertiesCountOnPage(0, 'for-sale', 'California', [
            'type' => PropertyTypes::TOWNHOUSE_SLUG,
        ]);
        $this->assertPropertiesCountOnPage(3, 'for-sale', 'California');

        $this->assertPropertiesCountOnPage(1, 'for-sale', 'London');
        $this->assertPropertiesCountOnPage(0, 'for-sale', 'Spain');
    }

    private function _testGetResultsActionFilteringRent()
    {
        $users = $this->createUsersPersistent(3);
        $this->createPropertiesToRentPersistent([
            'London' => [
                [
                    'user' => $users[0],
                    'status' => Property::STATUS_ACTIVE,
                    'videos' => true,
                    'price' => 10 * self::MLN,
                    'featured' => false,
                    'period' => 'month',
                    'date_added' => 'now',
                ],
                [
                    'user' => $users[0],
                    'status' => Property::STATUS_ACTIVE,
                    'videos' => false,
                    'price' => 20 * self::MLN,
                    'featured' => true,
                    'period' => 'month',
                    'date_added' => 'now',
                ],
                [
                    'user' => $users[1],
                    'status' => Property::STATUS_ACTIVE,
                    'videos' => true,
                    'price' => 35 * self::MLN,
                    'featured' => true,
                    'period' => 'week',
                    'date_added' => '-1 month',
                ],
                [
                    'user' => $users[1],
                    'status' => Property::STATUS_ACTIVE,
                    'videos' => true,
                    'price' => 25 * self::MLN,
                    'featured' => true,
                    'period' => 'month',
                    'date_added' => 'now',
                ],
                [
                    'user' => $users[1],
                    'status' => Property::STATUS_ACTIVE,
                    'videos' => false,
                    'price' => 55 * self::MLN,
                    'featured' => true,
                    'period' => 'month',
                    'date_added' => 'now',
                ],
                [
                    'user' => $users[2],
                    'status' => Property::STATUS_INACTIVE,
                    'videos' => false,
                    'price' => 7 * self::MLN,
                    'featured' => false,
                    'period' => 'month',
                    'date_added' => 'now',
                ],
                [
                    'user' => $users[2],
                    'status' => Property::STATUS_INCOMPLETE,
                    'videos' => false,
                    'price' => 10 * self::MLN,
                    'featured' => false,
                    'period' => 'month',
                    'date_added' => 'now',
                ],
            ],
        ]);

        $this->esClient->indices()->refresh(['index' => 'test_properties']);

        $this->assertPropertiesCountOnPage(5, 'to-rent', 'London');
        $this->assertPropertiesCountOnPage(1, 'to-rent', 'London', [
            'featured' => true,
            'period' => 'week',
        ]);
        $this->assertPropertiesCountOnPage(2, 'to-rent', 'London', [
            'user' => $users[0]->getId(),
            'since' => '2017-08-25',
        ]);
        $this->assertPropertiesCountOnPage(2, 'to-rent', 'London', [
            'price' => [
                'currency' => 'USD',
                'from' => '20000000',
                'to' => '40000000',
            ],
            'media' => Property::MEDIA_VIDEO,
        ]);
    }

    public function testGetResultsActionTilesCorrect()
    {
        $this->createLocationsPersistent('New York');
        $properties = $this->createPropertiesForSalePersistent([
            'New York' => [
                [
                    'id' => 1,
                    'price_hidden' => true,
                    'address_hidden' => true,
                ],
                [
                    'id' => 2,
                    'price_hidden' => false,
                    'address_hidden' => false,
                ],
                [
                    'id' => 3,
                    'price_hidden' => false,
                    'address_hidden' => true,
                    'source' => 'listhub',
                    'source_ref' => 'listhub_source_ref_3',
                ],
                [
                    'id' => 4,
                    'price_hidden' => false,
                    'address_hidden' => true,
                    'source' => 'listhub',
                    'source_ref' => 'listhub_source_ref_4',
                ],
                [
                    'id' => 5,
                    'price_hidden' => false,
                    'address_hidden' => false,
                    'source' => 'listhub',
                    'source_ref' => 'listhub_source_ref_5',
                ],
                [
                    'id' => 6,
                    'videos' => true,
                    'price_hidden' => false,
                    'address_hidden' => false,
                ],
                [
                    'id' => 7,
                    'videos' => true,
                    'price_hidden' => false,
                    'address_hidden' => false,
                ],
            ],
        ]);
        $propertyIds = array_map(
            function ($property) {
                return $property->getId();
            },
            $properties
        );

        $this->esClient->indices()->refresh(['index' => 'test_properties']);

        $this->searchPropertiesIn('for-sale', 'New York');
        $this->assertPropertiesIdsOnPage(...$propertyIds);
        $this->assertPropertiesListhubSourceRefsOnPage([
            $propertyIds[2] => 'listhub_source_ref_3',
            $propertyIds[3] => 'listhub_source_ref_4',
            $propertyIds[4] => 'listhub_source_ref_5',
        ]);
        $this->assertPropertiesWithVideoIcon($propertyIds[5], $propertyIds[6]);
        $this->assertPropertiesWithPriceHidden($propertyIds[0]);
        $this->assertPropertiesWithAddressHidden(
            array_combine($propertyIds, $properties),
            $propertyIds,
            [$propertyIds[0], $propertyIds[2], $propertyIds[3]]
        );
    }

    private function searchPropertiesIn($market, $locationName, $options = [])
    {
        $location = $this->getLocation($locationName);

        $route = $this->generateRoute('search_results', [
            'market' => $market,
            'id' => $location->getId(),
            'slug' => $location->getSlug(),
        ]);

        $crawler = $this->client->request('GET', $route, $options, [], [
            'HTTP_PAGINATION' => true,
        ]);
        if ($this->session->isStarted()) {
            $this->session->save();
        }

        return $crawler;
    }

    private function assertPropertiesCountOnPage($count, ...$query)
    {
        $this->searchPropertiesIn(...$query);
        $response = $this->client->getResponse();
        $this->assertEquals(200, $response->getStatusCode(), $response->getContent());
        $this->assertEquals($count, $this->crawlerFilter('li.property-list-item')->count());
    }

    private function assertPropertiesIdsOnPage(...$ids)
    {
        $this->crawlerFilter('.property-list-item')->each(function ($node) use (&$ids) {
            $key = array_search($node->attr('data-property-id'), $ids);
            $this->assertNotFalse($key);
            unset($ids[$key]);
        });

        $this->assertEmpty($ids);
    }

    private function assertPropertiesListhubSourceRefsOnPage($idToSourceRefMap)
    {
        foreach ($idToSourceRefMap as $id => $sourceRef) {
            $node = $this->crawlerFilter('.property-list-item[data-property-id='.$id.']')->first();
            // upper case doesn't get preserved in attribute name
            $this->assertEquals($sourceRef, $node->attr('data-listhub-sourceref'));
        }
    }

    private function assertPropertiesWithVideoIcon(...$ids)
    {
        $this->assertEquals(2, $this->crawlerFilter('.play-video')->count());
        $this->crawlerFilter('.property-list-item')->each(function (Crawler $node) use (&$ids) {
            if ($node->filter('.play-video')->count() > 0) {
                $key = array_search($node->attr('data-property-id'), $ids);
                $this->assertNotFalse($key);
                unset($ids[$key]);
            }
        });

        $this->assertEmpty($ids);
    }

    private function assertPropertiesWithPriceHidden(...$ids)
    {
        $this
            ->crawlerFilter('.property-list-item:contains(Price On Application)')
            ->each(function ($node) use (&$ids) {
                $key = array_search($node->attr('data-property-id'), $ids);
                $this->assertNotFalse($key);
                unset($ids[$key]);
            })
        ;

        $this->assertEmpty($ids);
    }

    private function assertPropertiesWithAddressHidden($propertiesByIds, $ids, $hiddenAddressIds)
    {
        $this
            ->crawlerFilter('.property-list-item')
            ->each(function ($node) use (&$propertiesByIds, $ids, $hiddenAddressIds) {
                $key = array_search($node->attr('data-property-id'), $ids);
                $key = $ids[$key];

                $this->assertNotFalse($key);

                if (in_array($key, $hiddenAddressIds)) {
                    $address = $propertiesByIds[$key]->getAddress()->getPublicAddress(',');
                } else {
                    $address = $propertiesByIds[$key]->getAddress()->getFullAddress(',');
                }
                $this->assertEquals(
                    trim($node->filter('.address')->first()->text()),
                    $address
                );

                unset($propertiesByIds[$key]);
            })
        ;

        $this->assertEmpty($propertiesByIds);
    }
}
