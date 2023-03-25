<?php

namespace Test\AppBundle\Service;

use AppBundle\Entity\User\AccessToken;
use AppBundle\Service\Email\Mailer;
use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\RoomTrait;
use Test\Utils\Traits\MessageTrait;
use Test\Utils\Traits\UserTrait;

class MailerTest extends AbstractWebTestCase
{
    use UserTrait;
    use MessageTrait;
    use RoomTrait;

    protected $rollbackTransactions = true;

    public function testNewPasswordAction()
    {
        $mailTo = $this->faker->email;
        $plainPassword = $this->faker->password;

        $this->getContainer()
            ->get('ha.mailer')
            ->sendNewPasswordEmail(
                $mailTo,
                $plainPassword
            );

        $this->issueRequest();
        $message = $this->getSwiftMailMessage();

        $this->assertEquals(
            $this->getContainer()->getParameter('email_noreply'),
            key($message->getFrom())
        );
        $this->assertEquals(
            $mailTo,
            key($message->getTo())
        );

        $this->assertNotFalse(0, strpos($message->getBody(), $mailTo));
        $this->assertNotFalse(0, strpos($message->getBody(), $plainPassword));
    }

    public function testSendNewAccountEmail()
    {
        $user = $this->newUserPersistent();
        $accessToken = new AccessToken($user);

        $this
            ->getContainer()
            ->get('ha.mailer')
            ->sendNewAccountEmail(
                $user,
                $accessToken
            );

        $this->issueRequest();
        $message = $this->getSwiftMailMessage();

        $this->assertEquals(
            $this->getContainer()->getParameter('email_noreply'),
            key($message->getFrom())
        );
        $this->assertEquals(
            $user->getEmail(),
            key($message->getTo())
        );

        $this->assertNotFalse(0, strpos($message->getBody(), $accessToken->getToken()));
    }

    public function testSendAccountTerminateEmail()
    {
        $user = $this->newUserPersistent();

        $this
            ->getContainer()
            ->get('ha.mailer')
            ->sendAccountTerminateEmail($user);

        $this->issueRequest();
        $message = $this->getSwiftMailMessage();

        $this->assertEquals(
            $this->getContainer()->getParameter('email_noreply'),
            key($message->getFrom())
        );
        $this->assertEquals(
            $user->getEmail(),
            key($message->getTo())
        );

        $this->assertNotFalse(0, strpos($message->getBody(), $user->getEmail()));
    }

    public function testSendMessageEmail()
    {
        $user = $this->newUserPersistent();
        $userTo = $this->newUserPersistent();
        $room = $this->newRoomPersistent([
            $user,
            $userTo,
        ]);
        $message = $this->newMessagePersistent($user, $room);

        $this
            ->getContainer()
            ->get('ha.mailer')
            ->sendMessageEmail($message, $userTo);

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

    }

    public function testSendBillingPlanUpgrade()
    {
        $user = $this->newUserPersistent();

        $this
            ->getContainer()
            ->get('ha.mailer')
            ->sendBillingPlanUpgrade($user);

        $this->issueRequest();
        $message = $this->getSwiftMailMessage();

        $this->assertEquals(
            $this->getContainer()->getParameter('email_noreply'),
            key($message->getFrom())
        );
        $this->assertEquals($user->getEmail(), key($message->getTo()));
        $this->assertEquals(Mailer::MAIL_BILLING_UPGRADE, $message->getSubject());
        $this->assertGreaterThan(0, strpos($message->getBody(), $user->getEmail()));
    }

    public function testSendBillingPlanDowngrade()
    {
        $user = $this->newUserPersistent();

        $this
            ->getContainer()
            ->get('ha.mailer')
            ->sendBillingPlanDowngrade($user);

        $this->issueRequest();
        $message = $this->getSwiftMailMessage();

        $this->assertEquals(
            $this->getContainer()->getParameter('email_noreply'),
            key($message->getFrom())
        );
        $this->assertEquals($user->getEmail(), key($message->getTo()));
        $this->assertEquals(Mailer::MAIL_BILLING_DOWNGRADE, $message->getSubject());
        $this->assertGreaterThan(0, strpos($message->getBody(), $user->getEmail()));
    }

    public function testSendDatabaseReportEmail()
    {
        $emailsToNotify = $this->getContainer()->getParameter('email_report_recipients');

        $this
            ->getContainer()
            ->get('ha.mailer')
            ->sendDatabaseReportEmail();

        $this->issueRequest();
        $message = $this->getSwiftMailMessage();

        $this->assertEquals(
            $this->getContainer()->getParameter('email_noreply'),
            key($message->getFrom())
        );

        $this->assertEquals(count($emailsToNotify), count($message->getTo()));
        $this->assertEquals(Mailer::MAIL_DATABASE_SUMMARY, $message->getSubject());

        $this->assertGreaterThan(0, strpos($message->getBody(), 'Ledger'));
        $this->assertGreaterThan(0, strpos($message->getBody(), 'Companies'));
        $this->assertGreaterThan(0, strpos($message->getBody(), 'Offices'));
        $this->assertGreaterThan(0, strpos($message->getBody(), 'Users'));
        $this->assertGreaterThan(0, strpos($message->getBody(), 'Properties'));
    }
}
