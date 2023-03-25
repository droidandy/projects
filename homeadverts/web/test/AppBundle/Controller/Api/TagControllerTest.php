<?php

namespace Test\AppBundle\Controller\Api;

use AppBundle\Entity\Social\Tag;
use Cocur\Slugify\Slugify;
use Test\AppBundle\AbstractElasticWebTestCase;
use Test\Utils\Traits\TagTrait;
use Test\Utils\Traits\UserTrait;

class TagControllerTest extends AbstractElasticWebTestCase
{
    use UserTrait, TagTrait;

    /**
     * @var bool
     */
    protected $rollbackTransactions = true;

    public function testPostAction()
    {
        $slugify = Slugify::create();

        $user = $this->newUserPersistent();
        $this->logIn($user);

        $data = [
            'displayName' => $this->faker->sentence,
        ];

        $this->client->request(
            'POST',
            $this->generateRoute('ha_tag_post'),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode($data)
        );

        $tag = $this->em->getRepository(Tag::class)->findOneBy([
            'displayName' => $data['displayName']
        ]);

        // Verify
        $response = $this->client->getResponse();
        $statusCode = $response->getStatusCode();

        $this->assertEquals(201, $statusCode);
        $this->assertEquals($user, $tag->user);
        $this->assertEquals($data['displayName'], $tag->displayName);
        $this->assertEquals($slugify->slugify($data['displayName']), $tag->name);
    }

    public function testGetActionSuccess()
    {
        $user = $this->newUserPersistent();
        $tag = $this->newTagPersistent([
            'user' => $user,
        ]);

        $this->logIn($user);

        $this->client->request(
            'GET',
            $this->generateRoute('ha_tag_get', [
                'id' => $tag->getId(),
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
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        $this->assertEquals(200, $statusCode);
        $this->assertEquals($tag->getId(), $result['id']);
        $this->assertEquals($tag->name, $result['name']);
        $this->assertEquals($tag->displayName, $result['displayName']);
    }

    public function testGetCollectionActionSuccess()
    {
        $user = $this->newUserPersistent();
        $tag = $this->newTagPersistent([
            'user' => $user,
        ]);

        $this->logIn($user);

        $this->client->request(
            'GET',
            $this->generateRoute('ha_tag_collection', [
                'id' => $tag->getId(),
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
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        $this->assertEquals(200, $statusCode);
        $this->assertTrue(is_array($result));

    }

}
