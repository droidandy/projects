<?php

namespace Test\AppBundle\Entity\Social\Article\Integration;

use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\TagTrait;
use Test\Utils\Traits\UserTrait;
use DateTime;
use AppBundle\Entity\Social\Article;

class ArticleStreamRepositoryTest extends AbstractTestCase
{
    use TagTrait, UserTrait, ArticleTrait;

    /**
     * @var bool
     */
    protected $rollbackTransactions = true;

    public function testGetFeatured()
    {
        $repo = $this->getContainer()->get('article_repo_stream');

        // Add
        $userA = $this->newUserPersistent();
        $userB = $this->newUserPersistent();
        $userB->followUser($userA);

        $this->em->persist($userB);
        $this->em->flush($userB);

        $featured = $this->newTagPersistent([
            'name' => Article::SLOT_FEATURED,
            'user' => $userA,
            'private' => true,
        ]);

        $articles = [];
        for ($i = 0; $i < 10; ++$i) {
            $articles[] = $article = $this->newArticle([
                'user' => $userA,
                'published_at' => new DateTime(),
                'tags' => [$featured],
            ]);
            $this->em->persist($article);
        }
        $this->em->flush($articles);
        $repo->setFollowingIds($userB);

        // Verify
        $articles0 = $repo->getFeatured(0);

        $this->assertEquals(1, count($articles0));

        $articles9 = $repo->getFeatured(9);
        $this->assertEquals(1, count($articles9));

        $article11 = $repo->getFeatured(11);
        $this->assertEquals(0, count($article11));

        foreach ($articles as $article) {
            $this->em->remove($article);
        }

        // Remove
        foreach ($articles as $article) {
            $this->em->remove($article);
        }
        $this->em->remove($userA);
        $this->em->remove($userB);
        $this->em->remove($featured);
        $this->em->flush();
    }

    public function testGetFeaturedWithinCategory()
    {
        $repo = $this->getContainer()->get('article_repo_stream');

        // Add
        $userA = $this->newUserPersistent();
        $userB = $this->newUserPersistent();
        $categoryTag = $this->newTagPersistent([
            'name' => $this->faker->md5,
            'user' => $userB,
            'private' => false,
        ]);

        $userB->followUser($userA);

        $this->em->persist($userB);
        $this->em->flush($userB);

        $featured = $this->newTagPersistent([
            'name' => Article::SLOT_FEATURED,
            'user' => $userA,
            'private' => true,
        ]);

        $articles = [];
        for ($i = 0; $i < 10; ++$i) {
            $articles[] = $article = $this->newArticle([
                'user' => $userA,
                'published_at' => new DateTime(),
                'tags' => [$featured, $categoryTag],
            ]);
            $this->em->persist($article);
        }
        $this->em->flush($articles);

        $repo->setFollowingIds($userB);
        $repo->setTags([$categoryTag]);

        // Verify
        $articles0 = $repo->getFeatured(0);
        $this->assertEquals($categoryTag->getId(), $articles0[0]->getPublicTags()[0]->id);
        $this->assertEquals(1, count($articles0));

        $articles9 = $repo->getFeatured(9);
        $this->assertEquals($categoryTag->getId(), $articles9[0]->getPublicTags()[0]->id);
        $this->assertEquals(1, count($articles9));

        $article11 = $repo->getFeatured(11);
        $this->assertEquals(0, count($article11));

        foreach ($articles as $article) {
            $this->em->remove($article);
        }

        // Remove
        foreach ($articles as $article) {
            $this->em->remove($article);
        }
        $this->em->remove($userA);
        $this->em->remove($userB);
        $this->em->remove($featured);
        $this->em->remove($categoryTag);
        $this->em->flush();
    }

    public function testGetArticles()
    {
        $repo = $this->getContainer()->get('article_repo_stream');

        // Add
        $userA = $this->newUserPersistent();
        $userB = $this->newUserPersistent();
        $userC = $this->newUserPersistent();
        $userB->followUser($userA);
        $userC->followUser($userB);

        $this->em->persist($userA);
        $this->em->persist($userB);
        $this->em->persist($userC);
        $this->em->flush();

        $articles = [];

        // To be found
        for ($i = 0; $i < 10; ++$i) {
            $articles[] = $article = $this->newArticle([
                'user' => $userA,
                'published_at' => new DateTime(),
            ]);
            $this->em->persist($article);
        }
        // Not to be found
        for ($i = 0; $i < 5; ++$i) {
            $articles[] = $article = $this->newArticle([
                'user' => $userC,
                'published_at' => new DateTime(),
            ]);
            $this->em->persist($article);
        }
        $this->em->flush($articles);
        $repo->setFollowingIds($userB);

        // Verify
        $articles05 = $repo->getTeasers(0, 5);
        $this->assertEquals(5, count($articles05));

        $articles55 = $repo->getTeasers(5, 5);
        $this->assertEquals(5, count($articles55));

        $articles010 = $repo->getTeasers(0, 10);
        $this->assertEquals(10, count($articles010));

        $articles1010 = $repo->getTeasers(10, 10);
        $this->assertEquals(0, count($articles1010));

        // Remove
        foreach ($articles as $article) {
            $this->em->remove($article);
        }
        $this->em->remove($userA);
        $this->em->remove($userB);
        $this->em->remove($userC);
        $this->em->flush();
    }

    public function testGetArticlesWithinCategory()
    {
        $repo = $this->getContainer()->get('article_repo_stream');

        // Add
        $userA = $this->newUserPersistent();
        $userB = $this->newUserPersistent();
        $userC = $this->newUserPersistent();
        $userB->followUser($userA);
        $userC->followUser($userB);
        $categoryTag = $this->newTagPersistent([
            'name' => $this->faker->md5,
            'user' => $userB,
            'private' => false,
        ]);

        $this->em->persist($userA);
        $this->em->persist($userB);
        $this->em->persist($userC);
        $this->em->flush();

        $articles = [];

        // To be found
        for ($i = 0; $i < 10; ++$i) {
            $articles[] = $article = $this->newArticle([
                'user' => $userA,
                'published_at' => new DateTime(),
                'tags' => [$categoryTag],
            ]);
            $this->em->persist($article);
        }
        // Not to be found
        for ($i = 0; $i < 5; ++$i) {
            $articles[] = $article = $this->newArticle([
                'user' => $userC,
                'published_at' => new DateTime(),
            ]);
            $this->em->persist($article);
        }
        $this->em->flush($articles);
        $repo->setFollowingIds($userB);
        $repo->setTags([$categoryTag]);

        // Verify
        $articles05 = $repo->getTeasers(0, 5);
        $this->assertEquals($categoryTag->getId(), $articles05[0]->getPublicTags()[0]->id);
        $this->assertEquals(5, count($articles05));

        $articles55 = $repo->getTeasers(5, 5);
        $this->assertEquals($categoryTag->getId(), $articles55[0]->getPublicTags()[0]->id);
        $this->assertEquals(5, count($articles55));

        $articles010 = $repo->getTeasers(0, 10);
        $this->assertEquals($categoryTag->getId(), $articles010[0]->getPublicTags()[0]->id);
        $this->assertEquals(10, count($articles010));

        $articles1010 = $repo->getTeasers(10, 10);
        $this->assertEquals(0, count($articles1010));

        // Remove
        foreach ($articles as $article) {
            $this->em->remove($article);
        }
        $this->em->remove($userA);
        $this->em->remove($userB);
        $this->em->remove($userC);
        $this->em->remove($categoryTag);
        $this->em->flush();
    }
}
