<?php

namespace Test\AppBundle\Entity\Social\Article\Integration;

use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\TagTrait;
use Test\Utils\Traits\UserTrait;
use DateTime;
use AppBundle\Entity\Social\Article;
use AppBundle\Entity\Social\Article\ArticleRecommendedRepository;

class ArticleRecommendedRepositoryTest extends AbstractTestCase
{
    use TagTrait, UserTrait, ArticleTrait;

    /** @var ArticleRecommendedRepository */
    private $articleRecommendedRepository;

    protected function setUp()
    {
        parent::setUp();

        $this->articleRecommendedRepository = $this->getContainer()->get('article_repo_recommended');
    }

    protected function tearDown()
    {
        unset($this->articleRecommendedRepository);

        parent::tearDown();
    }

    public function testGetFeatured()
    {
        // Add
        $user = $this->newUserPersistent();
        $recommended = $this->newTagPersistent([
            'name' => Article::SLOT_RECOMMENDED,
            'user' => $user,
            'private' => true,
        ]);
        $featured = $this->newTagPersistent([
            'name' => Article::SLOT_FEATURED,
            'user' => $user,
            'private' => true,
        ]);

        $articles = [];
        for ($i = 0; $i < 10; ++$i) {
            $articles[] = $article = $this->newArticle([
                'user' => $user,
                'published_at' => new DateTime(),
                'tags' => [$recommended, $featured],
            ]);
            $this->em->persist($article);
        }
        $this->em->flush($articles);
        $this->em->clear();

        // Verify
        $articles0 = $this->articleRecommendedRepository->getFeatured(0);
        $this->assertEquals(2, count($articles0[0]->getTags()));
        $this->assertEquals(1, count($articles0));

        $articles9 = $this->articleRecommendedRepository->getFeatured(9);
        $this->assertEquals(2, count($articles0[0]->getTags()));
        $this->assertEquals(1, count($articles9));

        $article11 = $this->articleRecommendedRepository->getFeatured(11);
        $this->assertEquals(0, count($article11));

        // Remove
        $this->removeEntities($articles);
        $this->removeEntities([
            $recommended,
            $featured,
            $user,
        ]);
    }

    public function testGetOrderedTeasers()
    {
        // Add
        $user = $this->newUserPersistent();
        $recommended = $this->newTagPersistent([
            'name' => Article::SLOT_RECOMMENDED,
            'user' => $user,
            'private' => true,
        ]);
        $tagA = $this->newRandomTagPersistent($user);

        $articles = [];
        for ($i = 0; $i < 15; ++$i) {
            $articles[] = $article = $this->newArticle([
                'user' => $user,
                'published_at' => new DateTime(),
                'tags' => [$recommended, $tagA],
            ]);
            $this->em->persist($article);
        }

        // Reassign dates
        $articles[0]->getTags()[0]->setCreatedAt((new DateTime())->modify('-24 hours'));
        $articles[1]->getTags()[0]->setCreatedAt((new DateTime())->modify('-12 hours'));
        $articles[2]->getTags()[0]->setCreatedAt((new DateTime())->modify('-1 hours'));
        $articles[7]->getTags()[0]->setCreatedAt((new DateTime())->modify('+1 hours'));
        $articles[8]->getTags()[0]->setCreatedAt((new DateTime())->modify('+12 hours'));
        $articles[9]->getTags()[0]->setCreatedAt((new DateTime())->modify('+24 hours'));
        $this->em->persist($articles[0]);
        $this->em->persist($articles[1]);
        $this->em->persist($articles[2]);
        $this->em->persist($articles[7]);
        $this->em->persist($articles[8]);
        $this->em->persist($articles[9]);

        $this->em->flush($articles);
        $this->em->clear();

        // Verify
        $article05 = $this->articleRecommendedRepository->getTeasers(0, 5);
        $this->assertEquals(5, count($article05));
        $this->assertEquals($articles[9]->getId(), $article05[0]->getId());
        $this->assertEquals($articles[8]->getId(), $article05[1]->getId());
        $this->assertEquals($articles[7]->getId(), $article05[2]->getId());

        $article55 = $this->articleRecommendedRepository->getTeasers(5, 5);
        $this->assertEquals(5, count($article55));

        $article105 = $this->articleRecommendedRepository->getTeasers(10, 5);
        $this->assertEquals(5, count($article105));
        $this->assertEquals($articles[2]->getId(), $article105[2]->getId());
        $this->assertEquals($articles[1]->getId(), $article105[3]->getId());
        $this->assertEquals($articles[0]->getId(), $article105[4]->getId());

        // Remove
        $this->removeEntities($articles);
        $this->removeEntities([
            $recommended,
            $tagA,
            $user,
        ]);
    }

    public function testGetTeasers()
    {
        // Add
        $user = $this->newUserPersistent();
        $recommended = $this->newTagPersistent([
            'name' => Article::SLOT_RECOMMENDED,
            'user' => $user,
            'private' => true,
        ]);
        $cover = $this->newTagPersistent([
            'name' => Article::SLOT_COVER,
            'user' => $user,
            'private' => true,
        ]);
        $tagA = $this->newRandomTagPersistent($user);
        $tagB = $this->newRandomTagPersistent($user);

        // To be found
        $articles = [];
        for ($i = 0; $i < 10; ++$i) {
            $articles[] = $article = $this->newArticle([
                'user' => $user,
                'published_at' => new DateTime(),
                'tags' => [$recommended, $tagA, $tagB],
            ]);
            $this->em->persist($article);
        }

        // Not to be found
        for ($i = 0; $i < 5; ++$i) {
            $articles[] = $article = $this->newArticle([
                'user' => $user,
                'published_at' => new DateTime(),
                'tags' => [$recommended, $cover, $tagB],
            ]);
            $this->em->persist($article);
        }

        $this->em->flush($articles);
        $this->em->clear();

        // Verify
        $articles05 = $this->articleRecommendedRepository->getTeasers(0, 5);
        $this->assertEquals(5, count($articles05));

        $articles55 = $this->articleRecommendedRepository->getTeasers(5, 5);
        $this->assertEquals(5, count($articles55));

        $articles010 = $this->articleRecommendedRepository->getTeasers(0, 10);
        $this->assertEquals(10, count($articles010));

        $articles1010 = $this->articleRecommendedRepository->getTeasers(10, 10);
        $this->assertEquals(0, count($articles1010));

        // Remove
        $this->removeEntities($articles);
        $this->removeEntities([
            $recommended,
            $cover,
            $tagA,
            $tagB,
            $user,
        ]);
    }
}
