<?php

namespace Test\AppBundle\Elastic\Location\View;

use AppBundle\Entity\Embeddable\Coords;
use AppBundle\Entity\Location\Location;
use AppBundle\Elastic\Integration\Collection\AggregationResults;
use AppBundle\Elastic\Integration\Collection\SearchResults;
use AppBundle\Elastic\Location\View\LocationAggregateView;
use AppBundle\Search\Market;
use AppBundle\Search\UserType;
use Symfony\Component\Routing\RouterInterface;

class LocationAggregateViewTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var array
     */
    private $locationData = [];
    /**
     * @var SearchResults
     */
    private $propertySearchResults;
    /**
     * @var SearchResults
     */
    private $agentSearchResults;

    protected function setUp()
    {
        $this->propertySearchResults = $this->getSearchResults();
        $this->propertySearchResults
            ->expects($this->once())
            ->method('getAggregations')
            ->willReturnCallback(function () {
                return $this->getPropertyAggregation();
            })
        ;

        $this->agentSearchResults = $this->getSearchResults();
        $this->agentSearchResults
            ->expects($this->once())
            ->method('getAggregations')
            ->willReturnCallback(function () {
                return $this->getAgentAggregation();
            })
        ;
    }

    public function testInvoke()
    {
        $locationData = $this->locationData = [
            1 => [
                'name' => 'place1',
                'coords' => [
                    'lat' => 0.5,
                    'lon' => 100.0,
                ],
                'property_aggregation' => [
                    'sale' => 5,
                    'rent' => 6,
                ],
                'agent_aggregation' => 117,
            ],
            2 => [
                'name' => 'place2',
                'coords' => [
                    'lat' => 0.5,
                    'lon' => 100.0,
                ],
                'property_aggregation' => [
                    'sale' => 0,
                    'rent' => 23,
                ],
                'agent_aggregation' => 22,
            ],
            3 => [
                'name' => 'London',
                'coords' => [
                    'lat' => 0.5,
                    'lon' => 100.0,
                ],
                'property_aggregation' => [
                    'sale' => 15,
                    'rent' => 61,
                ],
                'agent_aggregation' => 57,
            ],
        ];
        $locations = [];

        foreach ($locationData as $locationIndex => $location) {
            $locations[] = $this->getLocation($locationIndex, $location);
        }

        $router = $this->getRouter();
        $router
            ->expects($this->exactly(4 * count($this->locationData)))
            ->method('generate')
            ->withConsecutive(
                ...$this->generateRouterParams($locationData)
            )
            ->willReturnOnConsecutiveCalls(
                ...$this->generateRouterReturns($locationData)
            )
        ;

        $locationAggregateView = $this->getLocationAggregateView($router);
        $viewOutput = $locationAggregateView(
            [
                'property' => $this->propertySearchResults,
                'agent' => $this->agentSearchResults,
            ],
            [
                'locations' => $locations,
            ]
        );

        $this->assertEquals($this->generateExpectedOutput(), $viewOutput);
    }

    private function getRouter()
    {
        return $this->getMockBuilder(RouterInterface::class)
            ->getMock()
        ;
    }

    private function getLocationAggregateView($router)
    {
        return new LocationAggregateView($router);
    }

    private function getLocation($locationId, $locationData)
    {
        $location = $this
            ->getMockBuilder(Location::class)
            ->setConstructorArgs(
                [
                    'abc',
                    new Coords($locationData['coords']['lat'], $locationData['coords']['lon']),
                    100,
                    'USA',
                    [],
                    null,
                    null,
                    'query',
                    $locationData['name'],
                    strtolower($locationData['name']),
                    'en_US',
                    [],
                    1,
                ]
            )
            ->setMethods(['getId'])
            ->getMock()
        ;
        $location
            ->method('getId')
            ->willReturn($locationId)
        ;

        return $location;
    }

    private function getSearchResults()
    {
        return $this
            ->getMockBuilder(SearchResults::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getPropertyAggregation()
    {
        $aggregationTemplate = [
            'doc_count' => 0,
            'rental_terms' => [
                'buckets' => [
                    [
                        'key' => false,
                        'key_as_string' => 'false',
                        'doc_count' => 0,
                    ],
                    [
                        'key' => true,
                        'key_as_string' => 'true',
                        'doc_count' => 0,
                    ],
                ],
            ],
        ];
        $aggregations = [];

        foreach ($this->locationData as $location) {
            $propertyAggregation = $location['property_aggregation'];
            $aggregation = $aggregationTemplate;

            $aggregation['doc_count'] = $propertyAggregation['sale'] + $propertyAggregation['rent'];
            $aggregation['rental_terms']['buckets'][0]['doc_count'] = $propertyAggregation['sale'];
            $aggregation['rental_terms']['buckets'][1]['doc_count'] = $propertyAggregation['rent'];

            $aggregations[$location['name'].'_filter'] = $aggregation;
        }

        return new AggregationResults($aggregations);
    }

    private function getAgentAggregation()
    {
        $aggregations = [];
        foreach ($this->locationData as $location) {
            $aggregations[$location['name'].'_filter'] = [
                'doc_count' => $location['agent_aggregation'],
            ];
        }

        return new AggregationResults($aggregations);
    }

    private function generateRouterParams(array $locationData = [])
    {
        $paramTemplate = [
            '%route_name%',
            [
                'id' => -1,
                'slug' => '%pace_slug%',
            ],
            true,
        ];
        $params = [];

        foreach ($locationData as $locationIndex => $location) {
            foreach (array_fill(0, 4, $paramTemplate) as $i => $param) {
                switch ($i) {
                    case 0:
                    case 3:
                        $param[0] = 'search_results';
                        $param[1]['market'] = Market::sale(); break;
                    case 1:
                        $param[0] = 'search_results';
                        $param[1]['market'] = Market::rental(); break;
                    case 2:
                        $param[0] = 'ha_directory_location';
                        $param[1]['user_type'] = new UserType(UserType::AGENT); break;
                }
                $param[1]['id'] = $locationIndex;
                $param[1]['slug'] = strtolower($location['name']);

                $params[] = $param;
            }
        }

        return $params;
    }

    private function generateRouterReturns(array $locationData = [])
    {
        $routes = [];

        foreach ($locationData as $_) {
            $routes = array_merge($routes, [
                'url_search_property_sale',
                'url_search_property_rent',
                'url_ha_directory_location',
                'url_search_property_sale',
            ]);
        }

        return $routes;
    }

    private function generateExpectedOutput()
    {
        $itemTemplate = [
            'title' => '%place_name%',
            'properties' => [
                'sale' => [
                    'total' => 0,
                    'url' => 'url_search_property_sale',
                ],
                'rent' => [
                    'total' => 0,
                    'url' => 'url_search_property_rent',
                ],
            ],
            'agents' => [
                'total' => 0,
                'url' => 'url_ha_directory_location',
            ],
            'url' => 'url_search_property_sale',
        ];
        $output = [
            'items' => [],
            'total' => count($this->locationData),
        ];

        foreach ($this->locationData as $location) {
            $item = $itemTemplate;

            $item['title'] = $location['name'];
            $item['properties']['sale']['total'] = $location['property_aggregation']['sale'];
            $item['properties']['rent']['total'] = $location['property_aggregation']['rent'];
            $item['agents']['total'] = $location['agent_aggregation'];

            $output['items'][] = $item;
        }

        return $output;
    }
}
