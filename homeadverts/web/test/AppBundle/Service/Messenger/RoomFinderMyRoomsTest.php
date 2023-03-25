<?php

namespace AppBundle\Tests\Service;

use AppBundle\Entity\User\User;
use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\UserTrait;
use Test\Utils\Traits\RoomTrait;
use Test\Utils\Traits\MessageTrait;
use Test\Utils\Traits\GoogleLocationTrait;

class RoomFinderMyRoomsTest extends AbstractTestCase
{
    use UserTrait;
    use MessageTrait;
    use RoomTrait;
    use ArticleTrait;
    use PropertyTrait;
    use GoogleLocationTrait;
    use AddressTrait;

    /**
     * @var bool
     */
    protected $rollbackTransactions = true;

    public function testGetMyRoomsWithUnreadTotalInjected()
    {
        $sender = $this
            ->getContainer()
            ->get('app.message_sender');
        $finder = $this
            ->getContainer()
            ->get('app.room_finder');

        $userA = $this->newUserPersistent();
        $userB = $this->newUserPersistent();
        $room = $this->newRoomPersistent([
            $userA, $userB
        ]);

        $sender->newMessage($userA, $room, $this->faker->text);
        $sender->newMessage($userA, $room, $this->faker->text);

        $roomsA = $finder->getMyRooms($userA);
        $this->assertEquals(1, count($roomsA));
        $this->assertEquals(1, $roomsA[0]->users->count());
        $this->assertEquals(0, $roomsA[0]->unread);

        $this->em->clear();
        $userB = $this->em->getRepository(User::class)->find($userB->id);

        $roomsB = $finder->getMyRooms($userB);
        $this->assertEquals(1, count($roomsB));
        $this->assertEquals(1, $roomsB[0]->users->count());
        $this->assertEquals(2, $roomsB[0]->unread);
    }

}
