<?php

namespace Test\AppBundle\Entity\Integration;

use AppBundle\Entity\Messenger\Room;
use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\UserTrait;
use Test\Utils\Traits\RoomTrait;
use Test\Utils\Traits\MessageTrait;

class RoomRepositoryTest extends AbstractTestCase
{
    use UserTrait;
    use MessageTrait;
    use RoomTrait;

    /**
     * @var bool
     */
    protected $rollbackTransactions = true;

    /**
     * Should return zero messages for a single room
     * when the last message was sent just now
     *
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function testGetUsersOfMyRooms()
    {
        $userA = $this->newUserPersistent();
        $userB = $this->newUserPersistent();
        $userC = $this->newUserPersistent();
        $userD = $this->newUserPersistent();
        $this->newRoomPersistent([
            $userA,
            $userD,
        ]);
        $this->newRoomPersistent([
            $userB,
            $userD,
        ]);
        $this->newRoomPersistent([
            $userC,
            $userD,
        ]);
        $this->em->refresh($userD);

        $users = $this->em->getRepository(Room::class)->getUsersOfMyRooms($userD);

        $this->assertEquals(4, count($users));
    }

    /**
     * Should return zero messages for a single room
     * when the last message was sent just now
     *
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function testGetUnreadMessagesSummaryForUser()
    {
        $sender = $this->getContainer()->get('app.message_sender');

        $userA = $this->newUserPersistent();
        $userB = $this->newUserPersistent();
        $userC = $this->newUserPersistent();
        $userD = $this->newUserPersistent();
        $roomA = $this->newRoomPersistent([
            $userA,
            $userD,
        ]);
        $roomB = $this->newRoomPersistent([
            $userB,
            $userD,
        ]);
        $roomC = $this->newRoomPersistent([
            $userC,
            $userD,
        ]);

        $sender->newMessage($userA, $roomA, $this->faker->text);
        $sender->newMessage($userA, $roomA, $this->faker->text);
        $sender->newMessage($userA, $roomA, $this->faker->text);
        $sender->newMessage($userA, $roomA, $this->faker->text);
        $sender->newMessage($userB, $roomB, $this->faker->text);
        $sender->newMessage($userB, $roomB, $this->faker->text);
        $sender->newMessage($userC, $roomC, $this->faker->text);
        $sender->newMessage($userC, $roomC, $this->faker->text);

        $messageA = $sender->newMessage($userA, $roomA, $this->faker->text);
        $messageB = $sender->newMessage($userA, $roomA, $this->faker->text);


        $sender->readMessage($messageA, $userD);
        $sender->readMessage($messageB, $userD);

        $result = $this->em
            ->getRepository(Room::class)
            ->getUnreadMessagesSummaryForUser($userD);

        $this->assertEquals($roomA->getId(), $result[0]['id']);
        $this->assertEquals($roomB->getId(), $result[1]['id']);
        $this->assertEquals($roomC->getId(), $result[2]['id']);
        $this->assertEquals(4, $result[0]['total_unread']);
        $this->assertEquals(2, $result[1]['total_unread']);
        $this->assertEquals(2, $result[2]['total_unread']);
    }
}
