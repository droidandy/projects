<?php

namespace Test\AppBundle\Controller\Api\Article;

use AppBundle\Entity\User\User;
use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\UserTrait;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\FileTrait;
use Test\Utils\Traits\TagTrait;

class ArticleTagControllerTest extends AbstractWebTestCase
{
    use TagTrait, UserTrait, ArticleTrait, FileTrait;

    /**
     * @var User
     */
    private $user;

    /**
     * @var bool
     */
    protected $rollbackTransactions = true;

    protected function setUp()
    {
        parent::setUp();
        $this->user = $this->newUserPersistent();
    }

    protected function tearDown()
    {
        $this->em->remove($this->user);
        $this->em->flush();

        parent::tearDown();
    }

    public function testArticleAddTags()
    {
        $this->logIn($this->user);

        $article = $this->newArticlePersistent([
            'user' => $this->user,
        ]);
        $tagA = $this->newRandomTagPersistent($this->user);
        $tagB = $this->newRandomTagPersistent($this->user);

        $this->assertEquals(0, count($article->getTags()));

        $this->client->request(
            'POST',
            $this->generateRoute('ha_article_add_tags', [
                'token' => $article->getToken(),
            ]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode([
                'tag_ids' => [
                    $tagA->getId(),
                    $tagB->getId(),
                ],
            ])
        );

        $response = $this->client->getResponse();
        $statusCode = $response->getStatusCode();

        $this->assertEquals(204, $statusCode);
        $this->assertEquals(2, count($article->getTags()));
    }

    public function testArticleRemoveTags()
    {
        $this->logIn($this->user);

        $article = $this->newArticlePersistent([
            'user' => $this->user,
        ]);
        $tagA = $this->newRandomTagPersistent($this->user);
        $tagB = $this->newRandomTagPersistent($this->user);
        $article->addRawTag($tagA, $this->user);
        $article->addRawTag($tagB, $this->user);

        $this->em->persist($article);
        $this->em->flush();

        $this->assertEquals(2, count($article->getTags()));

        $this->client->request(
            'DELETE',
            $this->generateRoute('ha_article_remove_tags', [
                'token' => $article->getToken(),
            ]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode([
                'tag_ids' => [
                    $tagA->getId(),
                ],
            ])
        );

        $response = $this->client->getResponse();
        $statusCode = $response->getStatusCode();

        $this->assertEquals(204, $statusCode);
        $this->assertEquals(1, count($article->getTags()));
    }
}
