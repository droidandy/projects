<?php

namespace Test\AppBundle\Entity\Social\Article\Integration;

use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\TagTrait;
use Test\Utils\Traits\UserTrait;
use DateTime;

class ArticleRepositoryTest extends AbstractTestCase
{
    use TagTrait, UserTrait, ArticleTrait;

    /**
     * @var bool
     */
    protected $rollbackTransactions = true;

    public function testGetPublishedArticles()
    {
        $repo = $this->getContainer()->get('article_repo');

        // Add
        $user = $this->newUserPersistent();

        $tagA = $this->newRandomTagPersistent($user);
        $tagB = $this->newRandomTagPersistent($user);
        $tagC = $this->newRandomTagPersistent($user);

        $articles = [];
        // To be found
        for ($i = 0; $i < 10; ++$i) {
            $articles[] = $article = $this->newArticle([
                'user' => $user,
                'published_at' => new DateTime(),
                'tags' => [$tagA, $tagB],
            ]);
            $this->em->persist($article);
        }
        // Not to be found
        for ($i = 0; $i < 5; ++$i) {
            $articles[] = $article = $this->newArticle([
                'user' => $user,
                'published_at' => new DateTime(),
                'tags' => [$tagC],
            ]);
            $this->em->persist($article);
        }
        $this->em->flush($articles);

        // Verify
        $articles05 = $repo->getPublishedArticles(0, 5, [$tagA->getId()]);
        $this->assertEquals(5, count($articles05));

        $articles55 = $repo->getPublishedArticles(5, 5, [$tagB->getId()]);
        $this->assertEquals(5, count($articles55));

        $articles010 = $repo->getPublishedArticles(0, 10, [$tagA->getId(), $tagB->getId()]);
        $this->assertEquals(10, count($articles010));

        $articles1010 = $repo->getPublishedArticles(10, 10, [$tagA->getId(), $tagB->getId()]);
        $this->assertEquals(0, count($articles1010));

        $articlesEmpty = $repo->getPublishedArticles(0, 10, []);
        $this->assertEquals(10, count($articlesEmpty));

        // Remove
        foreach ($articles as $article) {
            $this->em->remove($article);
        }
        $this->em->remove($user);
        $this->em->remove($tagA);
        $this->em->remove($tagB);
        $this->em->remove($tagC);
        $this->em->flush();
    }
}
