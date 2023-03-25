<?php

namespace Test\AppBundle\Controller\Api;

use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\LocationTrait;
use Test\Utils\Traits\UserTrait;

class LocationControllerTest extends AbstractWebTestCase
{
    use UserTrait;
    use LocationTrait;
    use GoogleLocationTrait;

    public function testFollow()
    {
        $em = $this->em;

        // Add
        $user = $this->newUserPersistent();
        $location = $this->newLocationPersistent();
        $this->logIn($user);

        // Validate
        $this->assertEquals(false, $user->isLocationFollowed($location));

        $this->client->request(
            'POST',
            $this->generateRoute('ha_location_follow', [
                'id' => $location->getId(),
            ]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        // Validate
        $em->refresh($user);

        $this->assertEquals(200, $statusCode);
        $this->assertEmpty($result);

        $this->assertEquals(true, $user->isLocationFollowed($location));
        $this->assertEquals(1, $user->getFollowedLocationsCount());
        $this->assertEquals(
            $location->getId(),
            $user->getFollowedLocations()[0]->getLocation()->getId()
        );

        // Remove
        $em->remove($user);
        $em->flush();
    }

    public function testUnFollow()
    {
        $em = $this->em;

        // Add
        $location = $this->newLocationPersistent();
        $user = $this->newUserPersistent();
        $followedLocation = $this->getContainer()
            ->get('ha_location.service')
            ->followLocation($user, $location);

        $em->persist($followedLocation);
        $em->flush($followedLocation);

        // Validate
        $em->refresh($user);
        $this->assertEquals(true, $user->isLocationFollowed($location));
        $this->assertEquals(1, $user->getFollowedLocationsCount());
        $this->assertEquals(
            $location->getId(),
            $user->getFollowedLocations()[0]->getLocation()->getId()
        );

        $this->logIn($user);

        // Test
        $this->client->request(
            'DELETE',
            $this->generateRoute('ha_location_unfollow', [
                'id' => $location->getId(),
            ]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        // Validate
        $em->refresh($user);

        $this->assertEquals(200, $statusCode);
        $this->assertEmpty($result);
        $this->assertEquals(false, $user->isLocationFollowed($location));
        $this->assertEquals(0, $user->getFollowedLocationsCount());

        // Remove
        $em->remove($user);
        $em->flush();
    }
}
