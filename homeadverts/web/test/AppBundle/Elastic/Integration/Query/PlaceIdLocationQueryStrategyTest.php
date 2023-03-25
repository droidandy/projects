<?php

namespace Test\AppBundle\Elastic\Integration\Query;

use AppBundle\Entity\Embeddable\Coords;
use AppBundle\Entity\Location\Location;
use AppBundle\Elastic\Integration\Query\PlaceIdLocationQueryStrategy;

class PlaceIdLocationQueryStrategyTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var PlaceIdLocationQueryStrategy
     */
    private $placeIdStrategy;

    protected function setUp()
    {
        $this->placeIdStrategy = new PlaceIdLocationQueryStrategy();
    }

    public function testLocationQueryPlaceId()
    {
        $location = $this->getLocation(
            'place',
            'place_id_abc'
        );

        $query = $this->placeIdStrategy->locationQuery('googleLocations.placeId', $location);

        $this->assertEquals([
            'term' => [
                'googleLocations.placeId' => 'place_id_abc',
            ],
        ], $query);
    }

    public function testLocationQueryPlaceIdCountry()
    {
        $location = $this->getLocation(
            'Unites States',
            'place_id_abc',
            ['country']
        );

        $query = $this->placeIdStrategy->locationQuery('googleLocations.placeId', $location);

        $this->assertEquals([
            'term' => [
                'country' => 'US',
            ],
        ], $query);
    }

    private function getLocation($name, $placeId = 'place_id_1', $types = [])
    {
        $location = new Location(
            'abc',
            new Coords(0.5, 100.0),
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

        return $location;
    }
}
