<?php

namespace Test\AppBundle\Controller\Api;

use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\UserTrait;
use DateTime;

class NotificationControllerTest extends AbstractWebTestCase
{
    use UserTrait;

    public function testReadAll()
    {
        $readAt = new DateTime();

        // Add
        $user = $this->newUserPersistent();
        $this->logIn($user);

        // Test
        $this->client->request(
            'POST',
            $this->generateRoute('ha_notification_read_all'),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode([
                'timestamp' => $readAt->getTimestamp(),
            ])
        );

        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        // Validate
        $this->assertEquals(200, $statusCode);
        $this->assertEmpty($result);

        // Remove
        $this->em->remove($user);
        $this->em->flush();
    }
}
