<?php

namespace Test\AppBundle\Elastic\Article;

use AppBundle\Elastic\Integration\Mapping\MappingInterface;
use Doctrine\DBAL\Connection;
use Elasticsearch\Client;
use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\LocationTrait;
use Test\Utils\Traits\TagTrait;
use Test\Utils\Traits\UserTrait;
use AppBundle\Elastic\Article\ArticleSearchRepo;

class ArticleSearchRepoIntegrationTest extends AbstractTestCase
{
    use TagTrait;
    use ArticleTrait;
    use UserTrait;
    use AddressTrait;
    use GoogleLocationTrait;
    use LocationTrait;

    /**
     * @var MappingInterface[]
     */
    private $mappings = [];
    /**
     * @var Connection
     */
    protected $conn;
    /**
     * @var Client
     */
    private $esClient;
    /**
     * @var ArticleSearchRepo
     */
    private $articleSearchRepo;

    protected function setUp()
    {
        $this->markTestSkipped('to be fixed');

        parent::setUp();

        $this->flush = false;

        $container = static::$kernel->getContainer();

        $this->conn = $this->em->getConnection();
        $this->conn->beginTransaction();

        $mappingFactory = $container->get('ha.es.mapping_factory');
        foreach (['user', 'property', 'article', 'category', 'tag'] as $type) {
            $this->mappings[] = $mapping = $mappingFactory->get($type);
            $mapping->apply();
        }

        $this->esClient = $container->get('es_client');
        $this->articleSearchRepo = $container->get('ha.article.article_search_repo');
    }

    protected function tearDown()
    {
        $this->conn->rollBack();
        foreach ($this->mappings as $mapping) {
            $mapping->remove();
        }
    }

    public function testTermSearch()
    {
        $this->createArticlesWithSearchTermPersistent('search_term', [
            'title' => 5,
            'body' => 5,
            'author.name' => 5,
            'tags' => 5,
            'slug' => 5,
        ]);
        $this->createArticlesNonsearcheable(10);

        $this->em->flush();
        $this->esClient->indices()->refresh(['index' => 'test_properties']);
        $this->esClient->indices()->refresh(['index' => 'test_agents']);
        $this->esClient->indices()->refresh(['index' => 'test_articles']);

        $results = $this->articleSearchRepo->findArticlesByTerm('search_term', [], []);
        $results = $results['search_results'];
        $this->assertEquals(25, $results->getTotal());
        $this->assertEquals(15, count($results));

        $results = $this->articleSearchRepo->findArticlesByTerm('search_term', [], [
            'page' => 2,
            'per_page' => 10,
        ]);
        $results = $results['search_results'];
        $this->assertEquals(25, $results->getTotal());
        $this->assertEquals(10, count($results));

        $results = $this->articleSearchRepo->findArticlesByTerm('search_term', [], [
            'page' => 3,
            'per_page' => 10,
        ]);
        $results = $results['search_results'];
        $this->assertEquals(25, $results->getTotal());
        $this->assertEquals(5, count($results));

        $results = $this->articleSearchRepo->findArticlesByTerm('search_term', [], [
            'page' => 4,
            'per_page' => 10,
        ]);
        $results = $results['search_results'];
        $this->assertEquals(25, $results->getTotal());
        $this->assertEquals(0, count($results));
    }

    public function testSinceFilter()
    {
        $this->articleDataGenerator = function () {
            $pattern = '-%s hours';

            return [
                'published_at' => new \DateTime(sprintf($pattern, rand(1, 45))),
            ];
        };

        $this->createArticlesWithSearchTermPersistent('search_term', [
            'title' => 5,
            'body' => 5,
            'author.name' => 5,
            'tags' => 5,
            'slug' => 5,
        ]);
        $this->createArticlesNonsearcheable(10);

        $this->articleDataGenerator = function () {
            $pattern = '-%s hours';

            return [
                'published_at' => new \DateTime(sprintf($pattern, rand(49, 72))),
            ];
        };

        $this->createArticlesWithSearchTermPersistent('search_term', [
            'title' => 1,
            'body' => 1,
            'author.name' => 1,
            'tags' => 1,
            'slug' => 1,
        ]);
        $this->createArticlesNonsearcheable(10);

        $this->em->flush();
        $this->esClient->indices()->refresh(['index' => 'test_properties']);
        $this->esClient->indices()->refresh(['index' => 'test_agents']);
        $this->esClient->indices()->refresh(['index' => 'test_articles']);

        $results = $this->articleSearchRepo->findArticlesByTerm(
            'search_term',
            [
                'since' => '48 hrs',
            ],
            [
                'page' => 1,
                'per_page' => 50,
            ]
        );
        $results = $results['search_results'];
        $this->assertEquals(25, $results->getTotal());
        $this->assertEquals(25, count($results));
    }

    public function testSort()
    {
        $hourOffset = 12;
        $pattern = '-%s hours';
        $this->articleDataGenerator = function () use (&$hourOffset, $pattern) {
            return [
                'published_at' => new \DateTime(sprintf($pattern, $hourOffset++)),
            ];
        };

        $articles = $this->createArticlesWithSearchTermPersistent('search_term', [
            'title' => 5,
            'body' => 5,
            'author.name' => 5,
            'tags' => 5,
            'slug' => 5,
        ]);
        $this->createArticlesNonsearcheable(10);

        $this->em->flush();
        $this->esClient->indices()->refresh(['index' => 'test_properties']);
        $this->esClient->indices()->refresh(['index' => 'test_agents']);
        $this->esClient->indices()->refresh(['index' => 'test_articles']);

        $results = $this->articleSearchRepo->findArticlesByTerm(
            'search_term',
            [
                'sort' => 'publishedAt:asc',
            ],
            [
                'page' => 1,
                'per_page' => 50,
            ]
        );
        $results = $results['search_results'];
        $this->assertEquals(25, $results->getTotal());
        $this->assertEquals(25, count($results));
        $i = 24;
        foreach ($results as $article) {
            $this->assertEquals($articles[$i--]->getId(), $article->getId());
        }

        $results = $this->articleSearchRepo->findArticlesByTerm(
            'search_term',
            [
                'sort' => 'publishedAt:desc',
            ],
            [
                'page' => 1,
                'per_page' => 50,
            ]
        );
        $results = $results['search_results'];
        $this->assertEquals(25, $results->getTotal());
        $this->assertEquals(25, count($results));
        $i = 0;
        foreach ($results as $article) {
            $this->assertEquals($articles[$i++]->getId(), $article->getId());
        }
    }
}
