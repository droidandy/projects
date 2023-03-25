<?php

namespace Test\AppBundle\Controller\Api\Article;

use AppBundle\Entity\Social\Article;
use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\UserTrait;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\FileTrait;
use Test\Utils\Traits\TagTrait;

class ArticleControllerTest extends AbstractWebTestCase
{
    use TagTrait;
    use UserTrait;
    use ArticleTrait;
    use FileTrait;

    /**
     * @var bool
     */
    protected $rollbackTransactions = true;


    public function testGetArticle()
    {
        $user = $this->newWriterPersistent();
        $article = $this->newArticlePersistent([
            'user' => $user,
        ]);
        $this->logIn($user);

        $this->client->request(
            'GET',
            $this->generateRoute('ha_article_get', [
                'id' => $article->getId()
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

        $this->assertEquals($article->getId(), $result['id']);
        $this->assertEquals($article->getTitle(), $result['title']);
        $this->assertEquals($article->getIntro(), $result['intro']);
        $this->assertEquals(0, $result['likesCount']);
    }


    public function testImportAction()
    {
        $writer = $this->newWriterPersistent();
        $this->logIn($writer);

        $url = 'https://www.zillow.com/blog/historic-racial-injustices-housing-221898/';

        $this->client->request(
            'POST',
            $this->generateRoute('ha_article_import'),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode([
                'url' => $url,
            ])
        );

        $response = $this->client->getResponse();
        $location = $response->headers->get('Location');

        $this->assertEquals(201, $response->getStatusCode());
        $this->assertNotEmpty($location);
    }

    public function testArticleNew()
    {
        $writer = $this->newWriterPersistent();
        $this->logIn($writer);

        $this->client->request(
            'POST',
            $this->generateRoute('ha_article_new')
        );
        $response = $this->client->getResponse();
        $location = $response->headers->get('Location');

        $this->assertNotEmpty($location);
        $this->assertEquals(302, $response->getStatusCode());
    }

    public function testSaveActionSuccess()
    {
        $writer = $this->newWriterPersistent();
        $article = $this->newArticlePersistent([
            'user' => $writer,
        ]);
        $this->logIn($writer);

        $data = [
            'token' => $article->getToken(),
            'title' => $this->faker->title,
            'body' => $this->faker->text(500),
            'metadata' => [
                'facebook' => 1,
            ],
        ];
        $this->client->request(
            'PUT',
            $this->generateRoute('ha_article_save', [
                'token' => $article->getToken(),
            ]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode($data)
        );

        $response = $this->client->getResponse();
        $content = $response->getContent();
        $statusCode = $response->getStatusCode();
        $result = json_decode($content, true);

        $this->assertEquals(200, $statusCode);
        $this->assertEquals(0, $result['ERT']);
    }

    public function testSaveActionWithImages()
    {
        // Keep the kernel between requests
        $this->client->disableReboot();

        // Persist
        /** @var Article $article */
        $writer = $this->newWriterPersistent();
        $article = $this->newArticlePersistent([
            'user' => $writer,
        ]);
        $this->logIn($writer);

        $fileA = $this->newFilePersistent($writer);
        $fileB = $this->newFilePersistent($writer);
        $fileC = $this->newFilePersistent($writer);
        $fileD = $this->newFilePersistent($writer);
        $fileE = $this->newFilePersistent($writer);

        $data = $this->generateArticleData(
            $article->getToken(),
            [
                $fileA,
                $fileB,
                $fileC,
            ]
        );

        $this->client->request(
            'PUT',
            $this->generateRoute('ha_article_save', [
                'token' => $article->getToken(),
            ]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode($data)
        );

        $response = $this->client->getResponse();
        $content = $response->getContent();
        $result = json_decode($content, true);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals(3, $article->getImages()->count());

        $this->em->clear();

        $data = $this->generateArticleData(
            $article->getToken(),
            [
                $fileA,
                $fileB,
                $fileC,
                $fileD,
                $fileE,
            ]
        );

        $this->client->request(
            'PUT',
            $this->generateRoute('ha_article_save', [
                'token' => $article->getToken(),
            ]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode($data)
        );

        $updatedArticle = $this
            ->em
            ->getRepository('AppBundle:Social\Article')
            ->find($article->getId());

        $response = $this->client->getResponse();
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals(5, $updatedArticle->getImages()->count());
    }

    public function testSaveActionWithBadImages()
    {
        // Keep the kernel between requests
        $this->client->disableReboot();

        // Persist
        $writer = $this->newWriterPersistent();
        $article = $this->newArticlePersistent([
            'user' => $writer,
        ]);
        $this->logIn($writer);

        $data = $this->generateArticleData(
            $article->getToken(),
            []
        );
        $initialBody = $data['body'];
        $data['body'] = substr_replace(
            $initialBody,
            '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="/>',
            301,
            0
        );

        $this->client->request(
            'PUT',
            $this->generateRoute('ha_article_save', [
                'token' => $article->getToken(),
            ]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode($data)
        );

        $response = $this->client->getResponse();
        $this->assertEquals(400, $response->getStatusCode());

        $data['body'] = substr_replace(
            $initialBody,
            '<img src="http://localhost/image.png"/>',
            301,
            0
        );

        $this->client->request(
            'PUT',
            $this->generateRoute('ha_article_save', [
                'token' => $article->getToken(),
            ]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode($data)
        );

        $response = $this->client->getResponse();
        $this->assertEquals(400, $response->getStatusCode());
    }

    public function testPublishAction()
    {
        /** @var Article $article */
        /** @var Article $updatedArticle */
        $writer = $this->newWriterPersistent();
        $article = $this->newArticlePersistent([
            'user' => $writer,
        ]);
        $this->logIn($writer);

        $article->setTitle($this->faker->title);
        $article->setBody($this->faker->text());
        $this->em->persist($article);
        $this->em->flush($article);

        $this->client->request(
            'POST',
            $this->generateRoute('ha_article_publish', ['token' => $article->getToken()]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        $updatedArticle = $this->getContainer()->get('article_repo')->findOneByToken($article->getToken());

        $response = $this->client->getResponse();
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals($updatedArticle->getId(), $article->getId());
        $this->assertNotEmpty($updatedArticle->getPublishedAt());
    }

    public function testAnalyzeAction()
    {
        $html = file_get_contents($this->getFixturePath('/article/file4.html'));

        /** @var Article $article */
        /** @var Article $updatedArticle */
        $writer = $this->newWriterPersistent();
        $article = $this->newArticlePersistent([
            'body' => $html,
            'user' => $writer,
        ]);
        $this->logIn($writer);

        $this->client->request(
            'GET',
            $this->generateRoute('ha_article_analyse', ['token' => $article->getToken()]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        $response = $this->client->getResponse();
        $statusCode = $response->getStatusCode();

        $this->assertEquals(200, $statusCode);
    }

    public function testAnalyzeActionGuestRedirect()
    {
        $this->client->request(
            'GET',
            $this->generateRoute('ha_article_analyse', [
                'token' => $this->faker->randomLetter,
            ]),
            [],
            [],
            [
                'HTTP_X-XSRF-TOKEN' => $this->xsrf,
                'CONTENT_TYPE' => 'application/json',
            ]
        );

        $this->assertEquals(302, $this->getResponseStatusCode());
    }
}
