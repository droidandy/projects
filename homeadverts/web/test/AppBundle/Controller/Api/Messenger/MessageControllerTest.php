<?php

namespace Test\AppBundle\Controller\Messenger;

use AppBundle\Entity\Messenger\Message;
use AppBundle\Entity\Messenger\Reader;
use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\RoomTrait;
use Test\Utils\Traits\UserTrait;

class MessageControllerTest extends AbstractWebTestCase
{
    use UserTrait;
    use RoomTrait;

    public function testPostActionSuccess()
    {
        $this->markTestSkipped('skipped in favour of direct messaging ha_message_user_post');

        $userA = $this->newUserPersistent();
        $userB = $this->newUserPersistent();
        $room = $this->newRoomPersistent([
            $userA, $userB
        ]);
        $this->logIn($userA);

        $data = [
            'text' => $this->faker->text(400),
            'room' => [
                'id' => $room->getId(),
            ],
        ];

        // Test
        $this->client->request(
            'POST',
            $this->generateRoute('ha_message_post'),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode($data)
        );

        // Verify
        $response = $this->client->getResponse();
        $parts = explode('/', $response->headers->get('location'));
        $id = array_pop($parts);
        $result = $this->getResponseResult();

        $message = $this
            ->em
            ->getRepository(Message::class)
            ->findOneBy(['id' => $id]);


        $this->assertEquals(201, $response->getStatusCode());
        $this->assertEmpty($result);
        $this->assertNotEmpty($response->headers->get('location'));
        $this->assertEquals($userA->getId(), $message->user->getId());
        $this->assertEquals($room->getId(), $message->rooom->getId());
        $this->assertEquals($data['text'], $message->text);
    }

    public function testMessageUserActionSuccess()
    {
        $roomFinder = $this->getContainer()->get('app.room_finder');
        $userA = $this->newUserPersistent();
        $userB = $this->newUserPersistent();
        $room = $roomFinder->loadRoomForUsers($userA, $userB);

        $this->logIn($userA);

        $data = [
            'text' => $this->faker->text(400),
        ];

        // Test
        $this->client->request(
            'POST',
            $this->generateRoute('ha_message_new', [
                'id' => $room->getId()
            ]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode($data)
        );

        // Verify
        $response = $this->client->getResponse();

        $this->assertEquals(200, $response->getStatusCode());
    }

    public function testMessageUserReadActionSuccess()
    {
        $roomFinder = $this->getContainer()->get('app.room_finder');
        $userA = $this->newUserPersistent();
        $userB = $this->newUserPersistent();
        $room = $roomFinder->loadRoomForUsers($userA, $userB);

        $this->logIn($userB);

        $message = $this
            ->getContainer()
            ->get('app.message_sender')
            ->newMessage(
                $userA,
                $room,
                $this->faker->text
            );

        $this->em->refresh($message);

        $readersBefore = $message->getUnreadUsers();

        // Test
        $this->client->request(
            'POST',
            $this->generateRoute('ha_message_id_read', [
                'id' => $message->getId()
            ]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        $readersAfter = $message->getUnreadUsers();

        // Verify
        $response = $this->client->getResponse();
        $result = $this->getResponseResult();

        $this->assertEquals(1, count($readersBefore));
        $this->assertEquals(0, count($readersAfter));
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEmpty($result);
    }
}
