<?php

namespace Test\AppBundle\Entity\Integration;

use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\LocationTrait;
use Test\Utils\Traits\UserTrait;
use AppBundle\Service\LocationService;

class LocationServiceTest extends AbstractTestCase
{
    use UserTrait;
    use GoogleLocationTrait;
    use LocationTrait;

    /**
     * @var LocationService
     */
    private $locationService;

    protected function setUp()
    {
        parent::setUp();

        $this->locationService = $this->getContainer()->get('ha_location.service');
    }

    protected function tearDown()
    {
        unset($this->locationService);

        parent::tearDown();
    }

    /**
     * A user has n followed location, +m got added. Now the user has n+m followed locations;.
     */
    public function testNFollowedLocationsMAdded()
    {
        $em = $this->em;

        // Add
        $locationA = $this->newLocationPersistent();
        $locationB = $this->newLocationPersistent();
        $locationC = $this->newLocationPersistent();
        $user = $this->newUserPersistent();

        // Run: follow location A
        $this->locationService->followLocation($user, $locationA);
        $em->flush();

        // Verify
        $em->refresh($user);
        $this->assertEquals(1, $user->getFollowedLocationsCount());
        $this->assertTrue($user->isLocationFollowed($locationA));

        // Run: follow location B,C
        $this->locationService->followLocation($user, $locationB);
        $this->locationService->followLocation($user, $locationC);
        $em->flush();

        // Verify
        $em->refresh($user);
        $this->assertEquals(3, $user->getFollowedLocationsCount());
        $this->assertTrue($user->isLocationFollowed($locationA));
        $this->assertTrue($user->isLocationFollowed($locationB));
        $this->assertTrue($user->isLocationFollowed($locationC));
    }

    /**
     * Second addition of the already followed location doesn't change amount of followed locations;.
     */
    public function testDuplicatedFollowingThrowsUniqueConstraintViolationException()
    {
        $this->expectException(UniqueConstraintViolationException::class);

        $em = $this->em;

        // Add
        $locationA = $this->newLocationPersistent();
        $user = $this->newUserPersistent();

        // Run: follow location A
        $this->locationService->followLocation($user, $locationA);
        $em->flush();

        // Verify
        $em->refresh($user);
        $this->assertEquals(1, $user->getFollowedLocationsCount());
        $this->assertTrue($user->isLocationFollowed($locationA));

        // Run: follow location A throws the error
        $this->locationService->followLocation($user, $locationA);
        $em->flush();
    }

    /**
     * A user has n followed location, -m got removed. Now the user has n-m followed locations;.
     */
    public function testNFollowedLocationsMRemoved()
    {
        $em = $this->em;

        // Add
        $locationA = $this->newLocationPersistent();
        $locationB = $this->newLocationPersistent();
        $locationC = $this->newLocationPersistent();
        $user = $this->newUserPersistent();

        // Run: follow location A, B, C
        $this->locationService->followLocation($user, $locationA);
        $followedLocationB = $this->locationService->followLocation($user, $locationB);
        $this->locationService->followLocation($user, $locationC);
        $em->flush();

        // Verify
        $em->refresh($user);
        $this->assertEquals(3, $user->getFollowedLocationsCount());
        $this->assertTrue($user->isLocationFollowed($locationA));
        $this->assertTrue($user->isLocationFollowed($locationB));
        $this->assertTrue($user->isLocationFollowed($locationC));

        // Run: remove follower location
        $this->em->remove($followedLocationB);
        $em->flush();

        // Verify
        $em->refresh($user);
        $this->assertEquals(2, $user->getFollowedLocationsCount());
        $this->assertTrue($user->isLocationFollowed($locationA));
        $this->assertFalse($user->isLocationFollowed($locationB));
        $this->assertTrue($user->isLocationFollowed($locationC));
    }

    /**
     * Removal of the location not being followed doesn't change amount of followed locations;.
     */
    public function testRemovedLocationDoesNotChangeFollowedAmount()
    {
        $em = $this->em;

        // Add
        $locationA = $this->newLocationPersistent();
        $locationB = $this->newLocationPersistent();
        $locationC = $this->newLocationPersistent();
        $user = $this->newUserPersistent();

        // Run: follow location A
        $this->locationService->followLocation($user, $locationA);
        $this->locationService->followLocation($user, $locationB);
        $em->flush();

        // Verify
        $em->refresh($user);
        $this->assertEquals(2, $user->getFollowedLocationsCount());
        $this->assertTrue($user->isLocationFollowed($locationA));
        $this->assertTrue($user->isLocationFollowed($locationB));
        $this->assertFalse($user->isLocationFollowed($locationC));

        // Run: remove location C
        $this->em->remove($locationC);
        $em->flush();

        // Verify
        $em->refresh($user);
        $this->assertEquals(2, $user->getFollowedLocationsCount());
        $this->assertTrue($user->isLocationFollowed($locationA));
        $this->assertTrue($user->isLocationFollowed($locationB));
    }
}
