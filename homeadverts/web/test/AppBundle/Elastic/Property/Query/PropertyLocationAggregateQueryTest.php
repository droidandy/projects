<?php

namespace Test\AppBundle\Elastic\Property\Query;

use AppBundle\Entity\Embeddable\Coords;
use AppBundle\Entity\Location\Location;
use AppBundle\Entity\Property\Property;
use AppBundle\Elastic\Property\Mapping\PropertyMapping;
use AppBundle\Elastic\Property\Query\PropertyLocationAggregateQuery;
use AppBundle\Elastic\Integration\Query\Criteria\CriteriaBuilderInterface;
use AppBundle\Elastic\Integration\Query\RequestFactoryInterface;
use AppBundle\Elastic\Integration\Query\RequestInterface;

class PropertyLocationAggregateQueryTest extends \PHPUnit_Framework_TestCase
{
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
            ->expects($this->once())
            ->method('add')
            ->with(
                'locations',
                'bound' == $strategy
                ? 'locations'
                : 'locations_simple'
            )
        ;

        $this->getPropertyLocationAggregateQuery($strategy)->configureCriteria($criteriaBuilder);
    }

    public function testBuildBound()
    {
        $this->_testBuild('bound', [
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
            [
                'geo_shape' => [
                    'location' => [
                        'shape' => [
                            'type' => 'circle',
                            'coordinates' => [100.0, 0.5],
                            'radius' => '100m',
                        ],
                    ],
                ],
            ],
            [
                'geo_shape' => [
                    'location' => [
                        'shape' => [
                            'type' => 'circle',
                            'coordinates' => [100.0, 0.5],
                            'radius' => '100m',
                        ],
                    ],
                ],
            ],
            [
                'term' => [
                    'country' => 'US',
                ],
            ],
        ]);
    }

    public function testBuildPlaceId()
    {
        $this->_testBuild('place_id', [
            [
                'term' => [
                    'googleLocations.placeId' => 'place_id_place1',
                ],
            ],
            [
                'term' => [
                    'googleLocations.placeId' => 'place_id_place2',
                ],
            ],
            [
                'term' => [
                    'googleLocations.placeId' => 'place_id_London',
                ],
            ],
            [
                'term' => [
                    'country' => 'US',
                ],
            ],
        ]);
    }

    private function _testBuild($strategy, $expectedFilters)
    {
        $locations = [];
        foreach (
            [
                [
                    1,
                    'place1',
                    [
                        'type' => 'Polygon',
                        'coordinates' => [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]],
                    ],
                    [
                        'lat' => 0.5,
                        'lon' => 100.0,
                    ],
                    'place_id_place1',
                ],
                [
                    2,
                    'place2',
                    null,
                    [
                        'lat' => 0.5,
                        'lon' => 100.0,
                    ],
                    'place_id_place2',
                ],
                [
                    3,
                    'London',
                    [
                        'type' => 'Polygon',
                        'coordinates' => [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]],
                    ],
                    [
                        'lat' => 0.5,
                        'lon' => 100.0,
                    ],
                    'place_id_London',
                ],
                [
                    4,
                    'United States',
                    [
                        'type' => 'Polygon',
                        'coordinates' => [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]],
                    ],
                    [
                        'lat' => 0.5,
                        'lon' => 100.0,
                    ],
                    'place_id_US',
                    ['country'],
                ],
            ]
            as $location
        ) {
            $locations[] = $this->getLocation(...$location);
        }

        $criteria = [
            'locations' => $locations,
        ];
        $request = $this->getRequest();
        $requestFactory = $this->getRequestFactory();
        $requestFactory
            ->expects($this->once())
            ->method('createRequest')
            ->with(
                [
                    'from' => 0,
                    'size' => 0,
                    'query' => [
                        'bool' => [
                            'filter' => [
                                'term' => [
                                    'status' => Property::STATUS_ACTIVE,
                                ],
                            ],
                            'must_not' => [
                                'exists' => [
                                    'field' => 'deletedAt',
                                ],
                            ],
                        ],
                    ],
                    'aggregations' => [
                        1 => [
                            'filter' => $expectedFilters[0],
                            'aggregations' => [
                                'rental' => [
                                    'terms' => [
                                        'field' => 'rental',
                                    ],
                                ],
                            ],
                        ],
                        2 => [
                            'filter' => $expectedFilters[1],
                            'aggregations' => [
                                'rental' => [
                                    'terms' => [
                                        'field' => 'rental',
                                    ],
                                ],
                            ],
                        ],
                        3 => [
                            'filter' => $expectedFilters[2],
                            'aggregations' => [
                                'rental' => [
                                    'terms' => [
                                        'field' => 'rental',
                                    ],
                                ],
                            ],
                        ],
                        4 => [
                            'filter' => $expectedFilters[3],
                            'aggregations' => [
                                'rental' => [
                                    'terms' => [
                                        'field' => 'rental',
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
                PropertyMapping::TYPE
            )
            ->willReturn($request)
        ;

        $query = $this->getPropertyLocationAggregateQuery($strategy);
        $request = $query->build($criteria, $requestFactory);

        $this->assertInstanceOf(RequestInterface::class, $request);
    }

    private function getPropertyLocationAggregateQuery($strategy)
    {
        return new PropertyLocationAggregateQuery($strategy);
    }

    private function getCriteriaBuilder()
    {
        return $this->getMockBuilder(CriteriaBuilderInterface::class)
            ->getMock()
        ;
    }

    private function getRequestFactory()
    {
        return $this->getMockBuilder(RequestFactoryInterface::class)
            ->getMock()
        ;
    }

    private function getRequest()
    {
        return $this->getMockBuilder(RequestInterface::class)
            ->getMock()
        ;
    }

    private function getLocation($id, $name, $geoJson, $coords, $placeId, $types = [])
    {
        $location = new Location(
            'abc',
            new Coords($coords['lat'], $coords['lon']),
            100,
            'US',
            $types,
            null,
            null,
            'query',
            $name,
            '',
            'en_US',
            [],
            $placeId
        );
        $location->geoJson = $geoJson;
        $location->setId($id);

        return $location;
    }
}
