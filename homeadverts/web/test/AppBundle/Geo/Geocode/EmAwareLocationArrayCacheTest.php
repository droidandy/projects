<?php

namespace Test\AppBundle\Geo\Geocode;

use AppBundle\Geo\Geocode\EmAwareLocationArrayCache;
use Doctrine\ORM\EntityManager;
use Test\Utils\Traits\GoogleLocationTrait;

class EmAwareLocationArrayCacheTest extends \PHPUnit_Framework_TestCase
{
    use GoogleLocationTrait;

    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var EmAwareLocationArrayCache
     */
    private $locationCache;

    protected function setUp()
    {
        $this->em = $this->getEm();
        $this->locationCache = new EmAwareLocationArrayCache($this->em);
    }

    public function testHasAdd()
    {
        foreach ([1, 2, 3, 4, 5] as $id) {
            $placeId = 'place_id_'.$id;
            $this->assertFalse(
                $this->locationCache->has($placeId)
            );
            $this->assertNull(
                $this->locationCache->get($placeId)
            );

            $googleLocation = $this->newGoogleLocation([
                'place_id' => $placeId,
            ]);
            $this->locationCache->add($googleLocation);

            $this->assertTrue(
                $this->locationCache->has($googleLocation->getPlaceId())
            );
            $this->assertSame(
                $googleLocation,
                $this->locationCache->get($googleLocation->getPlaceId())
            );
        }
    }

    public function testPurge()
    {
        $nonPurgeLocations = [];
        foreach ([
            [
                'place_id' => 1,
                'types' => ['locality', 'political'],
            ],
            [
                'place_id' => 2,
                'types' => ['locality', 'political'],
            ],
            [
                'place_id' => 3,
                'types' => ['country', 'political'],
            ],
            [
                'place_id' => 4,
                'types' => ['administrative_area_level_1', 'political'],
            ],
            [
                'place_id' => 5,
                'types' => ['postal_code'],
            ],
        ] as $location) {
            $nonPurgeLocations[] = $this->newGoogleLocation($location);
        }

        $purgeLocations = [];
        foreach ([
            [
                'place_id' => 6,
                'types' => ['street_address', 'political'],
            ],
            [
                'place_id' => 7,
                'types' => ['route', 'political'],
            ],
            [
                'place_id' => 8,
                'types' => ['administrative_area_level_4', 'political'],
            ],
            [
                'place_id' => 9,
                'types' => ['neighborhood', 'political'],
            ],
            [
                'place_id' => 10,
                'types' => ['point_of_interest'],
            ],
        ] as $location) {
            $purgeLocations[] = $this->newGoogleLocation($location);
        }

        /** @var \PHPUnit_Framework_MockObject_MockObject $em */
        $em = $this->em;
        $em
            ->expects($this->exactly(count($purgeLocations)))
            ->method('detach')
            ->withConsecutive(...$purgeLocations)
        ;

        $allLocations = array_merge($nonPurgeLocations, $purgeLocations);
        foreach ($allLocations as $location) {
            $this->locationCache->add($location);
        }

        foreach ($allLocations as $location) {
            $this->assertTrue(
                $this->locationCache->has($location->getPlaceId())
            );
        }

        $this->locationCache->release($allLocations);
        $this->locationCache->purge();

        foreach ($nonPurgeLocations as $nonPurgeLocation) {
            $this->assertTrue(
                $this->locationCache->has($nonPurgeLocation->getPlaceId())
            );
        }
        foreach ($purgeLocations as $purgeLocation) {
            $this->assertFalse(
                $this->locationCache->has($purgeLocation->getPlaceId())
            );
        }
    }

    public function testPurgeEmpty()
    {
        /** @var \PHPUnit_Framework_MockObject_MockObject $em */
        $em = $this->em;
        $em
            ->expects($this->never())
            ->method('detach')
        ;

        $this->locationCache->purge();
    }

    private function getEm()
    {
        return $this
            ->getMockBuilder(EntityManager::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }
}
