<?php

namespace Test\AppBundle\Entity\Social\Article\Integration;

use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\UserTrait;

class ArticleTest extends AbstractTestCase
{
    use UserTrait, ArticleTrait;

    /**
     * @var bool
     */
    protected $rollbackTransactions = true;

    public function testArticleMetaShouldReturnFalse()
    {
        // Add
        $user = $this->newUser();
        $article = $this->newArticlePersistent([
            'user' => $user,
        ]);

        // Verify
        $this->assertFalse($article->getMetadata()['facebook']);
        $this->assertFalse($article->getMetadata()['twitter']);
        $this->assertFalse($article->getMetadata()['linkedin']);

        // Clean
        $this->removeEntity($article);
        $this->removeEntity($user);
    }

    public function testArticleMetaShouldSetGetNull()
    {
        // Add
        $user = $this->newUser();
        $article = $this->newArticlePersistent([
            'user' => $user,
        ]);
        $article->setMetadata(null);
        $this->em->persist($article);
        $this->em->flush($article);

        // Verify
        $updatedArticle = $this->em
            ->getRepository('AppBundle:Social\Article')
            ->find($article->getId());

        $this->assertNull($updatedArticle->getMetadata());

        // Clean
        $this->removeEntity($article);
        $this->removeEntity($user);
    }
}
