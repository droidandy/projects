<?php

namespace Test\Utils\Traits;

use AppBundle\Entity\Messenger\Room;
use AppBundle\Entity\Messenger\Message;
use AppBundle\Entity\User\User;

trait MessageTrait
{
    /**
     * @param User $user
     * @param Room $room
     * @return Message
     */
    public function newMessage(User $user, Room $room)
    {
        $message = new Message();
        $message->user = $user;
        $message->room = $room;
        $message->text = $this->faker->text;

        return $message;
    }

    /**
     * @param User $user
     * @param Room $room
     * @return Message
     */
    protected function newMessagePersistent(User $user, Room $room)
    {
        $message = $this->newMessage($user, $room);

        $this->em->persist($message);
        $this->em->flush($message);

        return $message;
    }
}
