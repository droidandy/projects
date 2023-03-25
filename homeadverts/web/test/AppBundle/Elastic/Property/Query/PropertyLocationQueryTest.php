<?php

namespace Test\AppBundle\Elastic\Property\Query;

use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Property\PropertyTypes;
use AppBundle\Elastic\Integration\Query\RequestInterface;
use AppBundle\Elastic\Property\Query\PropertyLocationQuery;
use AppBundle\Search\Market;
use AppBundle\Service\User\AdjacencyRegistry;
use Test\AppBundle\Elastic\Integration\fixtures\Traits\QueryTrait;

class PropertyLocationQueryTest extends \PHPUnit_Framework_TestCase
{
    use QueryTrait;
    /**
     * @var AdjacencyRegistry
     */
    private $adjacencyRegistry;

    public function testConfigureCriteriaBound()
    {
        $this->_testConfigureCriteria('bound');
    }

    public function testConfigureCriteriaPlaceId()
    {
        $this->_testConfigureCriteria('place_id');
    }

    private function _testConfigureCriteria($strategy)
    {
        $criteriaBuilder = $this->getCriteriaBuilder();
        $criteriaBuilder
            ->expects($this->exactly(17))
            ->method('add')
            ->willReturnSelf()
            ->withConsecutive(
                ['type', 'property_type'],
                ['market', 'market'],
                ['user', 'integer'],
                ['status', 'property_status'],
                ['media', 'option', [
                    'options' => Property::getMediaTypes(),
                ]],
                ['bedrooms', 'integer', $this->assertBedroomsOptionsCorrect()],
                ['bathrooms', 'integer', $this->assertBathroomsOptionsCorrect()],
                ['price', 'price'],
                ['featured', 'boolean', [
                    '__default' => false,
                ]],
                ['ids', $this->assertIdsDefinitionCorrect()],
                ['sort', 'sort_bc'],
                ['period', 'string'],
                ['distance', 'distance'],
                ['since', 'date', $this->assertDateOptionsCorrect()],
                ['limit', 'pagination'],
                ['aggregations', $this->assertAggregationsDefinitionCorrect()],
                'bound' == $strategy
                    ? ['location', 'location']
                    : ['location', 'location_simple']
            )
        ;

        $propertyLocationQuery = $this->getPropertyLocationQuery($strategy);
        $propertyLocationQuery->configureCriteria($criteriaBuilder);
    }

    public function testBuildBound()
    {
        $this->_testBuild('bound');
    }

    public function testBuildPlaceId()
    {
        $this->_testBuild('place_id');
    }

    private function _testBuild($strategy)
    {
        $criteria = [
            'limit' => [
                'from' => 0,
                'size' => 15,
            ],
            'bedrooms' => 3,
            'bathrooms' => 3,
            'since' => new \DateTime('11-11-2011'),
            'price' => [
                'from' => 1,
                'to' => 10,
            ],
            'market' => Property::MARKET_ALL,
            'user' => 1,
            'status' => Property::STATUS_ACTIVE,
            'type' => PropertyTypes::DETACHED,
            'featured' => true,
            'period' => null,
            'ids' => ['1', '2', '3'],
            'location' => [
                'shapeType' => 'polygon',
                'coordinates' => [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]],
                'country' => 'US',
                'isCountry' => false,
                'placeId' => 'place_id_1',
                'locality' => null,
            ],
            'media' => Property::MEDIA_VIDEO,
            'sort' => ['price' => 'desc'],
            'aggregations' => [
                'min_price' => ['min' => ['field' => 'basePrice']],
                'max_price' => ['max' => ['field' => 'basePrice']],
                'avg_price' => ['avg' => ['field' => 'basePrice']],
            ],
        ];

        $expectedFilterQuery = [
            [
                'range' => [
                    'bedrooms' => [
                        'gte' => 3,
                    ],
                ],
            ],
            [
                'range' => [
                    'bathrooms' => [
                        'gte' => 3,
                    ],
                ],
            ],
            [
                'range' => [
                    'dateAdded' => [
                        'gte' => '2011-11-11T00:00:00+00:00',
                    ],
                ],
            ],
            [
                'range' => [
                    'basePrice' => [
                        'gte' => 1,
                        'lte' => 10,
                    ],
                ],
            ],
            [
                'bool' => [
                    'should' => [
                        [
                            'term' => [
                                'userID' => 1,
                            ],
                        ],
                        [
                            'terms' => [
                                'companyId.id' => [1, 2, 3],
                            ],
                        ],
                    ],
                ],
            ],
            [
                'term' => [
                    'status' => 100,
                ],
            ],
            [
                'term' => [
                    'type' => 100,
                ],
            ],
            [
                'term' => [
                    'featured' => true,
                ],
            ],
            [
                'ids' => [
                    'values' => ['1', '2', '3'],
                ],
            ],
        ];
        if ('bound' == $strategy) {
            $expectedFilterQuery[] = [
                'term' => [
                    'country' => 'US',
                ],
            ];
            $expectedFilterQuery[] = [
                'geo_shape' => [
                    'location' => [
                        'shape' => [
                            'type' => 'polygon',
                            'coordinates' => [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]],
                        ],
                    ],
                ],
            ];
        } else {
            $expectedFilterQuery[] = [
                'term' => [
                    'googleLocations.placeId' => 'place_id_1',
                ],
            ];
        }
        $expectedFilterQuery[] = [
            'exists' => [
                'field' => 'videos',
            ],
        ];

        $request = $this->getRequest();
        $requestFactory = $this->getRequestFactory();
        $requestFactory
            ->expects($this->once())
            ->method('createRequest')
            ->willReturn($request)
            ->with(
                [
                    'from' => 0,
                    'size' => 15,
                    'query' => [
                        'bool' => [
                            'filter' => $expectedFilterQuery,
                            'must_not' => [
                                'exists' => [
                                    'field' => 'deletedAt',
                                ],
                            ],
                        ],
                    ],
                    'sort' => [
                        [
                            'basePrice' => 'desc',
                        ],
                    ],
                    'aggregations' => [
                        'min_price' => ['min' => ['field' => 'basePrice']],
                        'max_price' => ['max' => ['field' => 'basePrice']],
                        'avg_price' => ['avg' => ['field' => 'basePrice']],
                    ],
                ]
            )
        ;

        $query = $this->getPropertyLocationQuery($strategy);
        /** @var \PHPUnit_Framework_MockObject_MockObject $adjacencyRegistry */
        $adjacencyRegistry = $this->adjacencyRegistry;
        $adjacencyRegistry
            ->expects($this->once())
            ->method('getAllChildIds')
            ->with(1)
            ->willReturn([2, 3])
        ;

        $query->build($criteria, $requestFactory);

        $this->assertInstanceOf(RequestInterface::class, $request);
    }

    public function testBuildCountryLocationBound()
    {
        $this->_testBuildCountryLocation('bound');
    }

    public function testBuildCountryLocationPlaceId()
    {
        $this->_testBuildCountryLocation('place_id');
    }

    public function _testBuildCountryLocation($strategy)
    {
        $criteria = [
            'price' => [
                'from' => null,
                'to' => null,
            ],
            'limit' => [
                'from' => 0,
                'size' => 15,
            ],
            'market' => Market::ALL,
            'media' => Property::MEDIA_3D,
            'location' => [
                'shapeType' => 'polygon',
                'coordinates' => [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]],
                'country' => 'US',
                'isCountry' => true,
                'placeId' => 'place_id_1',
                'locality' => null,
            ],
            'sort' => [
                'random' => true,
                'seed' => 1,
            ],
        ];
        foreach ([
             'bedrooms', 'bathrooms', 'since',
             'user', 'status', 'type',
             'featured', 'period', 'ids', 'aggregations',
            ] as $missingKey
        ) {
            $criteria[$missingKey] = null;
        }

        $request = $this->getRequest();
        $requestFactory = $this->getRequestFactory();
        $requestFactory
            ->expects($this->once())
            ->method('createRequest')
            ->willReturn($request)
            ->with(
                [
                    'from' => 0,
                    'size' => 15,
                    'query' => [
                        'function_score' => [
                            'query' => [
                                'bool' => [
                                    'filter' => [
                                        [
                                            'term' => [
                                                'country' => 'US',
                                            ],
                                        ],
                                        [
                                            'exists' => [
                                                'field' => 'videos3d',
                                            ],
                                        ],
                                    ],
                                    'must_not' => [
                                        'exists' => [
                                            'field' => 'deletedAt',
                                        ],
                                    ],
                                ],
                            ],
                            'random_score' => [
                                'seed' => $criteria['sort']['seed'],
                            ],
                        ],
                    ],
                ]
            )
        ;

        $query = $this->getPropertyLocationQuery($strategy);
        /** @var \PHPUnit_Framework_MockObject_MockObject $adjacencyRegistry */
        $adjacencyRegistry = $this->adjacencyRegistry;
        $adjacencyRegistry
            ->expects($this->never())
            ->method('getAllChildIds')
        ;

        $query->build($criteria, $requestFactory);

        $this->assertInstanceOf(RequestInterface::class, $request);
    }

    private function assertBedroomsOptionsCorrect()
    {
        return $this->assertPositiveValidationCorrect();
    }

    private function assertBathroomsOptionsCorrect()
    {
        return $this->assertPositiveValidationCorrect();
    }

    private function assertPositiveValidationCorrect()
    {
        return $this->callback(function ($options) {
            if (!isset($options['__validate']) || !is_callable($options['__validate'])) {
                return false;
            }

            if (
                $options['__validate'](-1) === true
                || $options['__validate'](1) === false
            ) {
                return false;
            }

            return true;
        });
    }

    private function assertIdsDefinitionCorrect()
    {
        return $this->callback(function ($definition) {
            if (!is_callable($definition)) {
                return false;
            }

            if ([
                '__default' => null,
                '__required' => false,
            ] !== $definition()) {
                return false;
            }

            return true;
        });
    }

    private function assertDateOptionsCorrect()
    {
        return $this->callback(function ($options) {
            if (!isset($options['__normalize']) || !is_callable($options['__normalize'])) {
                return false;
            }

            return true;
        });
    }

    private function assertAggregationsDefinitionCorrect()
    {
        return $this->callback(function ($definition) {
            if (!is_callable($definition)) {
                return false;
            }

            if ([
                '__default' => [
                    'min_price' => ['min' => ['field' => 'basePrice']],
                    'max_price' => ['max' => ['field' => 'basePrice']],
                    'avg_price' => ['avg' => ['field' => 'basePrice']],
                ],
                '__required' => false,
            ] !== $definition()) {
                return false;
            }

            return true;
        });
    }

    private function getPropertyLocationQuery($strategy)
    {
        $this->adjacencyRegistry = $this
            ->getMockBuilder(AdjacencyRegistry::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;

        return new PropertyLocationQuery($this->adjacencyRegistry, $strategy);
    }
}
