<?php

namespace Test\AppBundle\Controller;

use AppBundle\Entity\Social\Article;
use AppBundle\Elastic\Integration\Mapping\MappingInterface;
use Doctrine\DBAL\Connection;
use Elasticsearch\Client;
use AppBundle\Entity\User\User;
use Symfony\Component\HttpFoundation\Session\Session;
use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\FileTrait;
use Test\Utils\Traits\TagTrait;
use Test\Utils\Traits\UserTrait;

class ArticleControllerSearchTest extends AbstractWebTestCase
{
    use TagTrait, UserTrait, ArticleTrait, FileTrait;

    /**
     * @var User
     */
    private $user;
    /**
     * @var Connection
     */
    protected $conn;
    /**
     * @var Client
     */
    private $esClient;
    /**
     * @var Session
     */
    private $session;
    /**
     * @var MappingInterface[]
     */
    private $mappings;

    protected function setUp()
    {
        $this->markTestSkipped('to be fixed');

        parent::setUp();

        $this->flush = false;
        $this->client->disableReboot();
        $container = static::$kernel->getContainer();

        $this->session = $container->get('session');
        $this->esClient = $container->get('es_client');

        $this->conn = $this->em->getConnection();
        $this->conn->beginTransaction();

        $this->user = $this->newUserPersistent();

        $mappingFactory = $container->get('ha.es.mapping_factory');
        foreach (['user', 'property', 'article', 'tag'] as $type) {
            $this->mappings[] = $mapping = $mappingFactory->get($type);
            $mapping->apply();
        }
    }

    protected function tearDown()
    {
        $this->conn->rollBack();
        foreach ($this->mappings as $mapping) {
            $mapping->remove();
        }

        parent::tearDown();
    }

    public function testSearch()
    {
        $this->createArticlesWithSearchTermPersistent('search_term', [
            'title' => 5,
            'body' => 5,
            'author.name' => 5,
            'tags' => 5,
            'slug' => 5,
        ]);
        $this->createArticlesNonsearcheablePersistent(10);

        $this->em->flush();
        $this->esClient->indices()->refresh(['index' => 'test_articles']);

        $this->assertArticlesCountOnPage(15, 'search_term');
        $this->assertArticlesCountOnPage(10, 'search_term', ['p' => 2]);
        $this->assertArticlesCountOnPage(0, 'search_term', ['p' => 3]);
        $this->assertArticlesCountOnPage(25, 'search_term', ['p' => 2], false);
    }

    public function testSearchFilter()
    {
        $this->articleDataGenerator = function () {
            return [
                'published_at' => new \DateTime('now'),
            ];
        };
        $this->createArticlesWithSearchTermPersistent('search_term', [
            'title' => 1,
            'body' => 1,
            'author.name' => 1,
            'tags' => 1,
            'slug' => 1,
        ]);

        $this->articleDataGenerator = function () {
            return [
                'published_at' => new \DateTime('-36 hours'),
            ];
        };
        $this->createArticlesWithSearchTermPersistent('search_term', [
            'title' => 1,
            'body' => 1,
            'author.name' => 1,
            'tags' => 1,
            'slug' => 1,
        ]);

        $this->articleDataGenerator = function () {
            return [
                'published_at' => new \DateTime('-4 days'),
            ];
        };
        $this->createArticlesWithSearchTermPersistent('search_term', [
            'title' => 3,
            'body' => 3,
            'author.name' => 3,
            'tags' => 3,
            'slug' => 3,
        ]);

        $this->createArticlesNonsearcheablePersistent(10);

        $this->em->flush();
        $this->esClient->indices()->refresh(['index' => 'test_articles']);

        $this->assertArticlesCountOnPage(5, 'search_term', ['filters' => ['since' => '24hrs']]);
        $this->assertArticlesCountOnPage(10, 'search_term', ['filters' => ['since' => '3days']]);
        $this->assertArticlesCountOnPage(15, 'search_term', ['filters' => ['since' => '7days']]);
        $this->assertArticlesCountOnPage(10, 'search_term', ['filters' => ['since' => '7days'], 'p' => 2]);
        $this->assertArticlesCountOnPage(25, 'search_term', ['filters' => ['since' => '7days'], 'p' => 2], false);
    }

    public function testSearchSort()
    {
        $offset = 25;
        $this->articleDataGenerator = function () use (&$offset) {
            return [
                'published_at' => new \DateTime(sprintf('-%s hours', $offset--)),
            ];
        };
        $articles = $this->createArticlesWithSearchTermPersistent('search_term', [
            'title' => 5,
            'body' => 5,
            'author.name' => 5,
            'tags' => 5,
            'slug' => 5,
        ]);
        $articles = array_reverse($articles);

        $this->createArticlesNonsearcheablePersistent(10);

        $this->em->flush();
        $this->esClient->indices()->refresh(['index' => 'test_articles']);

        $this->assertArticlesCountAndOrderCorrect(15, $articles, 'search_term', ['filters' => ['sort' => 'publishedAt:desc']]);
        $this->assertArticlesCountAndOrderCorrect(10, $articles, 'search_term', ['filters' => ['sort' => 'publishedAt:desc'], 'p' => 2]);
        $this->assertArticlesCountAndOrderCorrect(25, $articles, 'search_term', ['filters' => ['sort' => 'publishedAt:desc'], 'p' => 2], false);
    }

    private function searchArticlesWith($searchTerm, $options = [], $ajax = true)
    {
        $route = $this->generateRoute('ha_article_search', [
            'term' => $searchTerm,
        ]);

        $crawler = $this->client->request('GET', $route, $options, [], [
            'HTTP_PAGINATION' => $ajax,
        ]);
        if ($this->session->isStarted()) {
            $this->session->save();
        }

        return $crawler;
    }

    private function assertArticlesCountOnPage($count, ...$query)
    {
        $this->searchArticlesWith(...$query);
        $response = $this->client->getResponse();
        $this->assertEquals(200, $response->getStatusCode(), $response->getContent());
        $this->assertEquals($count, $this->crawlerFilter('li article.story-card')->count());
    }

    private function assertArticlesCountAndOrderCorrect($count, $articles, $searchTerm, $options = [], $ajax = true)
    {
        $this->assertArticlesCountOnPage($count, $searchTerm, $options, $ajax);

        $articles = $this->sliceArticles($articles, $options, $ajax);
        $this->crawlerFilter('blog article.story-card')->each(function ($node, $i) use ($articles) {
            $this->assertEquals($articles[$i], trim($node->text()));
        });
    }

    private function sliceArticles($articles, $options, $ajax)
    {
        $page = isset($options['p']) ? $options['p'] : 1;
        if ($ajax) {
            $offset = 15 * ($page - 1);
            $size = 15;
        } else {
            $offset = 0;
            $size = 15 * $page;
        }

        return array_slice($articles, $offset, $size, true);
    }
}
