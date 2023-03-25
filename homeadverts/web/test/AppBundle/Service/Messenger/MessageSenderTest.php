<?php

namespace AppBundle\Tests\Service;

use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\UserTrait;
use Test\Utils\Traits\RoomTrait;
use Test\Utils\Traits\MessageTrait;
use Test\Utils\Traits\GoogleLocationTrait;

class MessageSenderTest extends AbstractTestCase
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

    public function testSendMessageToUser()
    {
        $user = $this->newUserPersistent();
        $userTo = $this->newUserPersistent();
        $room = $this
            ->getContainer()
            ->get('app.room_finder')
            ->loadRoomForUsers($user, $userTo);
        $text = $this->faker->text;

        $message = $this
            ->getContainer()
            ->get('app.message_sender')
            ->newMessage($user, $room, $text);

        $this->assertTrue($message->room->isPrivate);
        $this->assertEquals(2, $message->room->users->count());
    }

    public function testReadMessageSingle()
    {
        $sender = $this
            ->getContainer()
            ->get('app.message_sender');

        $user = $this->newUserPersistent();
        $userTo = $this->newUserPersistent();
        $room = $this->newRoomPersistent([
            $user,
            $userTo,
        ]);
        $message = $sender->newMessage($user, $room, $this->faker->text);

        $this->em->refresh($message);

        $this->assertEquals(2, $message->readers->count());
        $this->assertEquals($user, $message->user);



        $this->assertEquals(2, count($message->readers));
        $this->assertFalse($message->isReadByAll());
    }

    public function testReadMessageTwiceStatusStaysSame()
    {
        $sender = $this
            ->getContainer()
            ->get('app.message_sender');

        $user = $this->newUserPersistent();
        $userTo = $this->newUserPersistent();
        $room = $this->newRoomPersistent([
            $user,
            $userTo,
        ]);
        $message = $sender->newMessage($user, $room, $this->faker->text);

        $this->em->refresh($message);

        $readersBefore = $message->getUnreadUsers();

        $this
            ->getContainer()
            ->get('app.message_sender')
            ->readMessage($message, $userTo);

        $this
            ->getContainer()
            ->get('app.message_sender')
            ->readMessage($message, $userTo);

        $this->em->refresh($message);

        $readersAfter = $message->getUnreadUsers();

        $this->assertEquals(1, count($readersBefore));
        $this->assertEquals(0, count($readersAfter));
    }

    public function testReadMessageBoth()
    {
        $sender = $this
            ->getContainer()
            ->get('app.message_sender');

        $user = $this->newUserPersistent();
        $userTo = $this->newUserPersistent();
        $room = $this->newRoomPersistent([
            $user,
            $userTo,
        ]);
        $message = $sender->newMessage($user, $room, $this->faker->text);

        $reader = $sender->readMessage($message, $user);

        $readerTo = $sender->readMessage($message, $userTo);

        $this->em->refresh($message);

        $this->assertEquals($reader->message, $message);
        $this->assertEquals($reader->user, $user);
        $this->assertEquals($readerTo->message, $message);
        $this->assertEquals($readerTo->user, $userTo);

        $this->assertEquals(2, count($message->readers));
        $this->assertTrue($message->isReadByAll());
    }

}
