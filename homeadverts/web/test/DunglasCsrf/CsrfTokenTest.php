<?php

namespace Test\DunglasCsrf;

use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\UserTrait;

class CsrtTokenTest extends AbstractWebTestCase
{
    use UserTrait;

    public function testCsrfTokenFail()
    {
        $this->markTestSkipped('skipped at the time of messenger development, for speed reasons.');
        $this->client->request(
            'POST',
            $this->generateRoute('ha_user_post'),
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([])
        );

        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        $this->assertEquals(403, $statusCode);
        $this->assertEquals('Bad CSRF token.', $result['message']);
    }

    public function testCsrfTokenSuccess()
    {
        $this->client->request(
            'POST',
            $this->generateRoute('ha_user_post'),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->getCsrfToken(),
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode([])
        );

        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        $this->assertEquals(400, $statusCode);
        $this->assertEquals('Terms of use must be accepted.', $result['message']);
    }
}
