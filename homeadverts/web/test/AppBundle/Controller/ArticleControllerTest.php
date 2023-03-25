<?php

namespace Test\AppBundle\Controller;

use AppBundle\Entity\Social\Article;
use AppBundle\Elastic\Integration\Mapping\MappingInterface;
use Doctrine\DBAL\Connection;
use AppBundle\Entity\User\User;
use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\FileTrait;
use Test\Utils\Traits\TagTrait;
use Test\Utils\Traits\UserTrait;

class ArticleControllerTest extends AbstractWebTestCase
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
     * @var MappingInterface[]
     */
    private $mappings;

    protected function setUp()
    {
        parent::setUp();
        $container = static::$kernel->getContainer();

        $this->conn = $this->em->getConnection();
        $this->conn->beginTransaction();

        $mappingFactory = $container->get('ha.es.mapping_factory');
        foreach (['user', 'property', 'article', 'tag'] as $type) {
            $this->mappings[] = $mapping = $mappingFactory->get($type);
            $mapping->apply();
        }

        $this->user = $this->newUserPersistent();
    }

    protected function tearDown()
    {
        $this->conn->rollBack();
        foreach ($this->mappings as $mapping) {
            $mapping->remove();
        }

        parent::tearDown();
    }

    public function testArticleImport()
    {
        $this->logIn($this->user);

        $this->client->request(
            'GET',
            $this->generateRoute('ha_article_new_import')
        );

        $response = $this->client->getResponse();
        $this->assertEquals(200, $response->getStatusCode());
    }

    public function testNewAction()
    {
        $this->logIn($this->user);

        $this->client->request(
            'POST',
            $this->generateRoute('ha_article_new')
        );

        $response = $this->client->getResponse();
        $parts = explode('/', $response->headers->get('location'));
        $token = array_pop($parts);

        $article = $this
            ->getContainer()
            ->get('em')
            ->getRepository('AppBundle\Entity\Social\Article')
            ->findOneBy([
                'token' => $token,
            ]);

        $this->assertEquals(302, $response->getStatusCode());
        $this->assertInstanceOf(Article::class, $article);
    }
}
