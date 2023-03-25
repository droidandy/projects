<?php

namespace Test\AppBundle\Controller\Api\Messenger;

use AppBundle\Entity\Messenger\Room;
use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\RoomTrait;
use Test\Utils\Traits\UserTrait;

class RoomControllerTest extends AbstractWebTestCase
{
    use UserTrait;
    use RoomTrait;

    /**
     * @var bool
     */
    protected $rollbackTransactions = true;

    public function testRoomGetActionSuccess()
    {
        $userA = $this->newUserPersistent();
        $userB = $this->newUserPersistent();
        $room = $this->newRoomPersistent([
            $userA, $userB
        ]);

        $this->logIn($userA);

        // Test
        $this->client->request(
            'GET',
            $this->generateRoute('ha_room_get', [
                'id' => $room->getId()
            ]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );
        $result = $this->getResponseResult();

        $this->assertNotNull($result['admin']);
        $this->assertEquals(Room::ROOM_TYPE_USER, $result['type']);
        $this->assertEquals(200, $this->getResponseStatusCode());
    }

    public function testRoomJoinUser()
    {
        $userA = $this->newUserPersistent();
        $userB = $this->newUserPersistent();

        $this->logIn($userA);

        // Test
        $this->client->request(
            'POST',
            $this->generateRoute('ha_room_join_user', [
                'id' => $userB->getId()
            ]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        $response = $this->client->getResponse();
        $statusCode = $response->getStatusCode();
        $parts = explode('/', $response->headers->get('location'));
        $id = array_pop($parts);

        $this->assertEquals(201, $statusCode);
        $this->assertNotNull($id);
    }

    public function testRoomGetMyActionSuccess()
    {
        $userA = $this->newUserPersistent();
        $userB = $this->newUserPersistent();
        $room = $this->newRoomPersistent([
            $userA, $userB
        ]);

        $this->logIn($userA);

        // Test
        $this->client->request(
            'GET',
            $this->generateRoute('ha_room_get_my'),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );
        $result = $this->getResponseResult();

        $this->assertEquals($room->getId(), $result[0]['id']);
        $this->assertNotNull(1, $result[0]['admin']);
        $this->assertEquals(200, $this->getResponseStatusCode());
    }

    public function testRoomGetMyUsersActionSuccess()
    {
        $userA = $this->newUserPersistent();
        $userB = $this->newUserPersistent();
        $this->newRoomPersistent([
            $userA, $userB
        ]);

        $this->em->refresh($userA);

        $this->logIn($userA);

        // Test
        $this->client->request(
            'GET',
            $this->generateRoute('ha_room_get_my_users'),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );
        $result = $this->getResponseResult();

        $this->assertEquals(2, count($result));
        $this->assertEquals(200, $this->getResponseStatusCode());
    }

}
