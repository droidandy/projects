<?php

namespace Test\AppBundle\Controller\Api;

use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\UserTrait;

class UserFollowControllerTest extends AbstractWebTestCase
{
    use UserTrait;

    public function testUserFollow()
    {
        // Add
        $userA = $this->newUserPersistent();
        $userB = $this->newUserPersistent();

        $this->logIn($userA);

        // Test
        $this->client->request(
            'POST',
            $this->generateRoute('ha_user_follow', [
                'id' => $userB->getId(),
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
        $this->em->refresh($userA);

        $this->assertEquals(200, $statusCode);
        $this->assertEmpty($result);

        $this->assertEquals(1, $userA->getFollowingsCount());
        $this->assertEquals(
            $userB->getId(),
            $userA->getFollowings()[0]->getId()
        );

        // Remove
        $this->em->remove($userB);
        $this->em->remove($userA);
        $this->em->flush();
    }

    public function testUserUnFollow()
    {
        // Add
        $userA = $this->newUserPersistent();
        $userB = $this->newUserPersistent();
        $userA->followUser($userB);
        $this->em->persist($userA);
        $this->em->flush($userA);

        $this->logIn($userA);

        // Test
        $this->client->request(
            'DELETE',
            $this->generateRoute('ha_user_unfollow', [
                'id' => $userB->getId(),
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

        $this->assertNotNull($result);
        $this->assertEmpty($result);

        // Validate
        $this->em->refresh($userA);

        $this->assertEquals(200, $statusCode);
        $this->assertEmpty($result);

        $this->assertEquals(0, $userA->getFollowingsCount());

        // Remove
        $this->em->remove($userB);
        $this->em->remove($userA);
        $this->em->flush();
    }

    public function testGuestFollowsUserFailsWithRedirect()
    {
        // Add
        $user = $this->newUserPersistent();
        $this->em->flush($user);

        // Test
        $this->client->request(
            'POST',
            $this->generateRoute('ha_user_follow', [
                'id' => $user->getId(),
            ]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        $result = $this->getResponseResult();

        $this->assertEquals(302, $this->getResponseStatusCode());
        $this->assertNull($result);
    }
}
