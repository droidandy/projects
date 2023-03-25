<?php

namespace Test\AppBundle\Controller\Api;

use Test\AppBundle\AbstractElasticWebTestCase;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\FileTrait;
use Test\Utils\Traits\MessageTrait;
use Test\Utils\Traits\RoomTrait;
use Test\Utils\Traits\TagTrait;
use Test\Utils\Traits\UserTrait;

class AutocompleteControllerTest extends AbstractElasticWebTestCase
{
    use TagTrait;
    use UserTrait;
    use MessageTrait;
    use RoomTrait;
    use FileTrait;
    use ArticleTrait;

    /**
     * @var bool
     */
    protected $rollbackTransactions = true;

    public function testUserAction()
    {

        $user = $this->newUserPersistent();
        $this->logIn($user);

        $this->client->request(
            'GET',
            $this->generateRoute('ha_autocomplete_user'),
            [
                'term' => 'Adam'
            ],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        // Verify
        $response = $this->client->getResponse();
        $statusCode = $response->getStatusCode();

        // The most basic test to ensure endpoint is ON
        $this->assertEquals(200, $statusCode);
    }
}
