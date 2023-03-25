<?php

namespace AppBundle\Elastic\Location\Query\Criteria\Type;

use AppBundle\Entity\Location\Location;
use AppBundle\Geo\GeometryService;
use Test\Utils\Traits\LocationTrait;

class LocationsTypeTest extends \PHPUnit_Framework_TestCase
{
    use LocationTrait;

    /**
     * @var GeometryService
     */
    private $geometryService;
    /**
     * @var Location[]
     */
    private $locationObjects;

    protected function setUp()
    {
        $this->geometryService = $this->getGeometryService();
        $this->locationObjects = $this->createLocations('New York', 'San Francisco', 'Los Angeles');
    }

    public function testDefaults()
    {
        $this->markTestSkipped('broken');

        /** @var \PHPUnit_Framework_MockObject_MockObject $geometryService */
        $geometryService = $this->geometryService;
        $geometryService
            ->expects($this->any())
            ->method('getGeometry')
            ->withConsecutive(...array_map(function ($location) {
                return [$location];
            }, $this->locationObjects))
            ->willReturn([
                'type' => 'MultiPolygon',
                'coordinates' => [],
            ]);

        $locationsType = new LocationsType($geometryService);
        $defaults = $locationsType([]);

        $this->assertInternalType('callable', $defaults['__normalize']);

        $locations = $defaults['__normalize']($this->locationObjects);
        foreach ($locations as $location) {
            $this->assertEquals([
                'type' => 'MultiPolygon',
                'coordinates' => [],
            ], $location->geoJson);
        }

        $this->assertInternalType('callable', $defaults['__validate']);
        $this->assertTrue($defaults['__validate']($this->locationObjects));
    }

    private function getGeometryService()
    {
        return $this
            ->getMockBuilder(GeometryService::class)
            ->disableOriginalConstructor()
            ->getMock();
    }

    public function newGoogleLocation()
    {
    }

    public function getEntityManager()
    {
    }

    public function getFaker()
    {
    }
}
