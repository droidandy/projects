<?php

namespace AppBundle\Tests\Service;

use AppBundle\Service\Messenger\Messenger;
use AppBundle\Service\Messenger\PusherService;
use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\UserTrait;

class PusherServiceTest extends AbstractTestCase
{
    use UserTrait;

    protected $text = 'Hello App!';

    public function testSendMessage()
    {
        $response = $this
            ->getContainer()
            ->get('app.pusher')
            ->sendMessage(
                'testChannel',
                'chat',
                [$this->text]
            );

        $this->assertTrue($response);
    }

    public function testCheckMessage()
    {
        $this->markTestSkipped('Test case gets broken on CI server');

        $message = $this
            ->getContainer()
            ->get('app.pusher')
            ->getMessage();

        $this->assertEquals($message[0]['payload'], [$this->text]);
    }

    public function testAuthorizeUserOnPresenceChannel()
    {
        $user = $this->newUserPersistent();

        $signature = $this
            ->getContainer()
            ->get('app.pusher')
            ->authorizeUser(
                $user,
                PusherService::getUserChannel($user),
                '120.100'
            );

        $signatureAsArray = (array)json_decode($signature);
        $channelDataAsArray = (array)json_decode($signatureAsArray['channel_data']);

        $this->assertNotEmpty($signature);
        $this->assertEquals($user->getId(), $channelDataAsArray['user_id']);
        $this->assertTrue(is_object($channelDataAsArray['user_info']));
    }

    public function testAuthorizeUserException()
    {
        $user = $this->newUserPersistent();

        $this->setExpectedException(
            '\Symfony\Component\Security\Core\Exception\AccessDeniedException',
            sprintf('Invalid channel name for user id: %s', $user->getId())
        );
        $this
            ->getContainer()
            ->get('app.pusher')
            ->authorizeUser(
                $user,
                'Bad Channel name',
                120000
            );
    }
}
