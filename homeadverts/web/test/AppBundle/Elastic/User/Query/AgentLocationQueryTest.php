<?php

namespace Test\AppBundle\Elastic\User\Query;

use AppBundle\Elastic\Integration\Query\RequestInterface;
use AppBundle\Elastic\User\Query\AgentLocationQuery;
use Test\AppBundle\Elastic\Integration\fixtures\Traits\QueryTrait;

class AgentLocationQueryTest extends \PHPUnit_Framework_TestCase
{
    use QueryTrait;

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
            ->expects($this->exactly(5))
            ->method('add')
            ->willReturnSelf()
            ->withConsecutive(
                ['language', 'language'],
                ['with_properties', 'boolean', [
                    '__default' => false,
                ]],
                ['sort', 'sort_bc'],
                ['limit', 'pagination'],
                'bound' == $strategy
                    ? ['location', 'location']
                    : ['location', 'location_simple']
            )
        ;

        $propertyLocationQuery = $this->getAgentLocationQuery($strategy);
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
            'language' => 'de',
            'with_properties' => true,
            'location' => [
                'shapeType' => 'polygon',
                'coordinates' => [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]],
                'country' => 'US',
                'isCountry' => false,
                'placeId' => 'place_id_1',
                'locality' => null,
            ],
            'sort' => ['name' => 'desc'],
        ];

        $expectedFilterQuery = [];
        if ('bound' == $strategy) {
            $expectedFilterQuery = array_merge($expectedFilterQuery, [
                [
                    'term' => [
                        'country' => 'US',
                    ],
                ],
                [
                    'geo_shape' => [
                        'location' => [
                            'shape' => [
                                'type' => 'polygon',
                                'coordinates' => [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]],
                            ],
                        ],
                    ],
                ],
            ]);
        } else {
            $expectedFilterQuery = array_merge($expectedFilterQuery, [
                [
                    'term' => [
                        'googleLocations.placeId' => 'place_id_1',
                    ],
                ],
            ]);
        }
        $expectedFilterQuery = array_merge($expectedFilterQuery, [
            [
                'bool' => [
                    'should' => [
                        [
                            'term' => ['spokenLanguages' => 'de'],
                        ],
                        [
                            'term' => ['primaryLanguage' => 'de'],
                        ],
                    ],
                ],
            ],
            [
                'range' => [
                    'propertyCount' => ['gt' => 0],
                ],
            ],
        ]);

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
                            'name' => 'desc',
                        ],
                    ],
                ]
            )
        ;

        $query = $this->getAgentLocationQuery($strategy);
        $query->build($criteria, $requestFactory);

        $this->assertInstanceOf(RequestInterface::class, $request);
    }

    public function testBuildCountryLocationAndRandomSortBound()
    {
        $this->_testBuildCountryLocationAndRandomSort('bound');
    }

    public function testBuildCountryLocationAndRandomSortPlaceId()
    {
        $this->_testBuildCountryLocationAndRandomSort('place_id');
    }

    private function _testBuildCountryLocationAndRandomSort($strategy)
    {
        $criteria = [
            'limit' => [
                'from' => 0,
                'size' => 15,
            ],
            'language' => null,
            'with_properties' => false,
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

        $query = $this->getAgentLocationQuery($strategy);
        $query->build($criteria, $requestFactory);

        $this->assertInstanceOf(RequestInterface::class, $request);
    }

    private function getAgentLocationQuery($strategy)
    {
        return new AgentLocationQuery($strategy);
    }
}
