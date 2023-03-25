<?php

namespace Test\Utils\Traits;

use AppBundle\Entity\Messenger\Room;
use AppBundle\Entity\User\User;

trait RoomTrait
{
    /**
     * @param User[] $users
     * @return Room
     */
    public function newRoom(array $users)
    {
        $room = new Room();
        $room->users = $users;

        return $room;
    }

    /**
     * @param array $users
     * @return Room
     */
    protected function newRoomPersistent(array $users)
    {
        $room = $this->newRoom($users);

        $this->em->persist($room);
        $this->em->flush($room);

        return $room;
    }
}
