<?php

namespace Test\AppBundle\Controller\Api\Article;

use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\LocationTrait;
use Test\Utils\Traits\UserTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\TagTrait;

class PropertyControllerTest extends AbstractWebTestCase
{
    use TagTrait;
    use UserTrait;
    use LocationTrait;
    use GoogleLocationTrait;
    use AddressTrait;
    use PropertyTrait;

    /**
     * @var bool
     */
    protected $rollbackTransactions = true;


    public function testGet()
    {
        $user = $this->newWriterPersistent();
        $property = $this->newPropertyPersistent([
            'user' => $user,
        ]);

        $this->logIn($user);

        $this->client->request(
            'GET',
            $this->generateRoute('ha_property_get', [
                'id' => $property->getId()
            ]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );


        $response = $this->client->getResponse();
        $content = $response->getContent();
        $result = json_decode($content, true);

        $this->assertEquals($property->getId(), $result['id']);
        $this->assertEquals($property->getTitle(), $result['title']);
        $this->assertEquals($property->getIntro(), $result['intro']);
        $this->assertEquals(0, $result['likesCount']);
    }
}
