<?php

namespace Test\AppBundle\Elastic\Integration\Query;

use AppBundle\Entity\Embeddable\Coords;
use AppBundle\Entity\Location\Location;
use AppBundle\Elastic\Integration\Query\BoundLocationQueryStrategy;

class BoundLocationQueryStrategyTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var BoundLocationQueryStrategy
     */
    private $boundStrategy;

    protected function setUp()
    {
        $this->boundStrategy = new BoundLocationQueryStrategy();
    }

    public function testLocationQueryGeoJson()
    {
        $location = $this->getLocation(
            'place',
            [
                'type' => 'Polygon',
                'coordinates' => [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]],
            ],
            [
                'lat' => 0.5,
                'lon' => 100.0,
            ]
        );

        $query = $this->boundStrategy->locationQuery('field1', $location);

        $this->assertEquals([
            'geo_shape' => [
                'field1' => [
                    'shape' => [
                        'type' => 'polygon',
                        'coordinates' => [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]],
                    ],
                ],
            ],
        ], $query);
    }

    public function testLocationQueryCircle()
    {
        $location = $this->getLocation(
            'place',
            null,
            [
                'lat' => 0.5,
                'lon' => 100.0,
            ]
        );

        $query = $this->boundStrategy->locationQuery('field1', $location);

        $this->assertEquals([
            'geo_shape' => [
                'field1' => [
                    'shape' => [
                        'type' => 'circle',
                        'coordinates' => [100.0, 0.5],
                        'radius' => '100m',
                    ],
                ],
            ],
        ], $query);
    }

    public function testLocationQueryLondon()
    {
        $location = $this->getLocation(
            'London',
            [
                'type' => 'Polygon',
                'coordinates' => [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]],
            ],
            [
                'lat' => 0.5,
                'lon' => 100.0,
            ]
        );

        $query = $this->boundStrategy->locationQuery('field1', $location);

        $this->assertEquals([
            'geo_shape' => [
                'field1' => [
                    'shape' => [
                        'type' => 'circle',
                        'coordinates' => [100.0, 0.5],
                        'radius' => '100m',
                    ],
                ],
            ],
        ], $query);
    }

    public function testLocationQueryCountry()
    {
        $location = $this->getLocation(
            'United States',
            [
                'type' => 'Polygon',
                'coordinates' => [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]],
            ],
            [
                'lat' => 0.5,
                'lon' => 100.0,
            ],
            ['country']
        );

        $query = $this->boundStrategy->locationQuery('field1', $location);

        $this->assertEquals([
            'term' => [
                'country' => 'US',
            ],
        ], $query);
    }

    private function getLocation($name, $geoJson, $coords, $types = [])
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
            1
        );
        $location->geoJson = $geoJson;

        return $location;
    }
}
