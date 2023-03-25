<?php

namespace Test\AppBundle\Entity\Integration;

use AppBundle\Entity\Messenger\Message;
use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\UserTrait;
use Test\Utils\Traits\RoomTrait;
use Test\Utils\Traits\MessageTrait;
use DateTime;

class MessageRepositoryTest extends AbstractTestCase
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
    public function testFindZeroUnreadMessagesForSingleGroup()
    {
        $user = $this->newUserPersistent();
        $userTo = $this->newUserPersistent();
        $room = $this->newRoomPersistent([
            $user,
            $userTo,
        ]);
        $this->newMessagePersistent($user, $room);
        $this->newMessagePersistent($user, $room);


        $messages = $this->em
            ->getRepository(Message::class)
            ->getLastUnreadMessagesInAllRooms();

        $this->assertEquals(0, count($messages));
    }

    /**
     * Should return One message for a single room
     *
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function testFindOneUnreadMessagesForSingleGroup()
    {
        $dateMinusB = new DateTime();
        $dateMinusB->modify('-2 hour');
        $dateMinusA = new DateTime();
        $dateMinusA->modify('-55 minutes');

        $user = $this->newUserPersistent();
        $userTo = $this->newUserPersistent();
        $room = $this->newRoomPersistent([
            $user,
            $userTo,
        ]);
        $messageA = $this->newMessagePersistent($user, $room);
        $messageB = $this->newMessagePersistent($user, $room);

        // Date minus one hour
        $messageA->setCreatedAt($dateMinusA);
        $messageB->setCreatedAt($dateMinusB);
        $this->em->persist($messageA);
        $this->em->persist($messageB);
        $this->em->flush();

        $messages = $this->em
            ->getRepository(Message::class)
            ->getLastUnreadMessagesInAllRooms();

        $this->assertEquals(1, count($messages));
    }

    /**
     * Should return Two messages for Two rooms
     *
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function testFindTwoUnreadMessagesTwoRooms()
    {
        $dateMinusA = new DateTime();
        $dateMinusA->modify('-55 minutes');
        $dateMinusB = new DateTime();
        $dateMinusB->modify('-30 minutes');
        $dateMinusC = new DateTime();
        $dateMinusC->modify('-65 minutes');

        $userA = $this->newUserPersistent();
        $userB = $this->newUserPersistent();
        $userTo = $this->newUserPersistent();
        $roomA = $this->newRoomPersistent([
            $userA,
            $userTo,
        ]);
        $roomB = $this->newRoomPersistent([
            $userB,
            $userTo,
        ]);
        $messageA = $this->newMessagePersistent($userA, $roomA);
        $messageB = $this->newMessagePersistent($userB, $roomB);
        $messageC = $this->newMessagePersistent($userB, $roomB);

        // Change Dates
        $messageA->setCreatedAt($dateMinusA);
        $messageB->setCreatedAt($dateMinusB);
        $messageC->setCreatedAt($dateMinusC);
        $this->em->persist($messageA);
        $this->em->persist($messageB);
        $this->em->persist($messageC);
        $this->em->flush();

        $messages = $this->em
            ->getRepository(Message::class)
            ->getLastUnreadMessagesInAllRooms();

        $this->assertEquals(2, count($messages));
    }

}
