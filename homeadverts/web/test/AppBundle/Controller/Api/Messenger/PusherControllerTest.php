<?php

namespace AppBundle\Tests\Controller\Communication;

use AppBundle\Service\Messenger\PusherService;
use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\UserTrait;

class PusherControllerTest extends AbstractWebTestCase
{
    use UserTrait;

    public function testAuthPresenceAction()
    {
        $user = $this->newUserPersistent();
        $this->logIn($user);

        $data = [
            'socket_id' => 12345.67890,
            'channel_name' => PusherService::getUserChannel($user),
        ];

        $this->client->request(
            'POST',
            $this->generateRoute('ha_pusher_auth_presence'),
            $data,
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content);

        $this->assertJson($content);
        $this->assertTrue(200 === $statusCode);
        $this->assertNotEmpty($result->auth);
        $this->assertNotEmpty($result->channel_data);
    }

    public function testAuthOnlineAction()
    {
        $user = $this->newUserPersistent();
        $this->logIn($user);

        $data = [
            'socket_id' => 12345.67890,
            'channel_name' => PusherService::PUSHER_CHANNEL_ONLINE,
        ];

        $this->client->request(
            'POST',
            $this->generateRoute('ha_pusher_auth_online'),
            $data,
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content);

        $this->assertJson($content);
        $this->assertTrue(200 === $statusCode);
        $this->assertNotEmpty($result->auth);
        $this->assertNotEmpty($result->channel_data);
    }

    public function testAuthPresenceActionFail()
    {
        $user = $this->newUserPersistent();
        $this->logIn($user);

        $channelName = 'wrong-channel-name-'.$user->getId();
        $data = [
            'socket_id' => 1234567890,
            'channel_name' => $channelName,
        ];

        $this->client->request(
            'POST',
            $this->generateRoute('ha_pusher_auth_presence'),
            $data,
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content);

        $this->assertJson($content);
        $this->assertTrue(403 === $statusCode);

        $errorMessage = sprintf('Invalid channel name for user id: %s', $user->getId());

        $this->assertEquals(403, $result->code);
        $this->assertEquals($errorMessage, $result->message);
    }

}
