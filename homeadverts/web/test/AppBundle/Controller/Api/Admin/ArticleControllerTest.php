<?php

namespace Test\AppBundle\Controller\Api\Admin;

use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\TagTrait;
use Test\Utils\Traits\UserTrait;
use Test\AppBundle\AbstractWebTestCase;

class ArticleControllerTest extends AbstractWebTestCase
{
    use TagTrait, UserTrait, ArticleTrait;

    public function testTagAddAction()
    {
        // Add
        $admin = $this->newAdminPersistent();
        $article = $this->newArticlePersistent([
            'user' => $admin,
        ]);
        $tag = $this->newTagPersistent([
            'name' => $this->faker->md5,
            'user' => $article->getAuthor(),
            'private' => true,
        ]);

        $this->logIn($admin);

        // Test

        $this->client->request(
            'POST',
            $this->generateRoute('ha_admin_article_tag_add', [
                'token' => $article->getToken(),
            ]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode([
                'tag' => $tag->getName(),
            ])
        );

        // Verify
        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        $this->assertEquals(204, $statusCode);
        $this->assertEmpty($result);

        // Delete
        $this->em->remove($tag);
        $this->em->remove($article);
        $this->em->remove($admin);
        $this->em->flush();
    }

    public function testTagRemoveAction()
    {
        // Add
        $admin = $this->newAdminPersistent();
        $article = $this->newArticlePersistent([
            'user' => $admin,
        ]);
        $tag = $this->newTagPersistent([
            'name' => $this->faker->md5,
            'user' => $article->getAuthor(),
            'private' => true,
        ]);
        $article->addRawTag($tag, $article->getAuthor());
        $this->em->persist($article);
        $this->em->flush($article);

        $this->logIn($admin);

        $this->client->request(
            'POST',
            $this->generateRoute('ha_admin_article_tag_remove', [
                'token' => $article->getToken(),
            ]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode([
                'tag' => $tag->getName(),
            ])
        );

        // Verify
        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        $this->assertEquals(204, $statusCode);
        $this->assertEmpty($result);

        // Delete
        $this->em->remove($tag);
        $this->em->remove($article);
        $this->em->remove($admin);
        $this->em->flush();
    }

    public function testTagAddShouldThrowLogicExceptionAction()
    {
        // Add
        $admin = $this->newAdminPersistent();
        $article = $this->newArticlePersistent([
            'user' => $admin,
        ]);

        $this->logIn($admin);

        // Test
        $this->client->request(
            'POST',
            $this->generateRoute('ha_admin_article_tag_add', [
                'token' => $article->getToken(),
            ]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode([
                'tag' => 'missingTag',
            ])
        );

        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        $this->assertEquals(500, $statusCode);
        $this->assertEquals('missingTag doesn\'t exists', $result['message']);

        // Delete
        $this->em->remove($article);
        $this->em->remove($admin);
        $this->em->flush();
    }
}
