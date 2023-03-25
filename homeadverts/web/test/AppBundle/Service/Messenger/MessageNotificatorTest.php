<?php

namespace AppBundle\Tests\Service;

use Test\AppBundle\AbstractWebTestCase;
use DateTime;
use Test\Utils\Traits\UserTrait;
use Test\Utils\Traits\RoomTrait;
use Test\Utils\Traits\MessageTrait;

class MessageNotificatorTest extends AbstractWebTestCase
{
    use UserTrait;
    use MessageTrait;
    use RoomTrait;

    /**
     * @var bool
     */
    protected $rollbackTransactions = true;

    public function testSendNotificationsForUnreadMessages()
    {
        $sender = $this
            ->getContainer()
            ->get('app.message_sender');

        $dateMinusA = new DateTime();
        $dateMinusA->modify('-55 minutes');

        $user = $this->newUserPersistent();
        $userTo = $this->newUserPersistent();
        $room = $this->newRoomPersistent([
            $user,
            $userTo,
        ]);
        $message = $sender->newMessage($user, $room, $this->faker->text);

        // Date minus one hour
        $message->setCreatedAt($dateMinusA);
        $this->em->persist($message);
        $this->em->flush();

        // Verify "notifiedAt" WAS NOT set and users weren't notified this case
        $this->assertNull($message->notifiedAt);

        // Update cached objects in doctrine
        $this->em->refresh($message);

        $this
            ->getContainer()
            ->get('app.message_notificator')
            ->sendNotificationsForUnreadMessages();

        $this->issueRequest();

        $emailMessage = $this->getSwiftMailMessage();

        $this->assertEquals(
            $this->getContainer()->getParameter('email_noreply'),
            key($emailMessage->getFrom())
        );
        $this->assertEquals(
            $userTo->getMessageEmail(),
            key($emailMessage->getTo())
        );

        $this->assertNotFalse(0, strpos($emailMessage->getBody(), $message->text));
        $this->assertNotFalse(0, strpos($emailMessage->getBody(), $message->user->name));


        // Update cached objects in doctrine
        $this->em->refresh($message);

        // Verify "notifiedAt" WAS SET
        $this->assertNotNull($message->notifiedAt);
    }

}
