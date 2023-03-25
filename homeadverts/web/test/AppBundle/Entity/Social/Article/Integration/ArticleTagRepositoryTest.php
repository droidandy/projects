<?php

namespace Test\AppBundle\Entity\Social\Article\Integration;

use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\TagTrait;
use Test\Utils\Traits\UserTrait;
use DateTime;
use AppBundle\Entity\Social\Article;

class ArticleTagRepositoryTest extends AbstractTestCase
{
    use UserTrait;
    use ArticleTrait;
    use TagTrait;

    private $mappings = [];

    /**
     * @var bool
     */
    protected $rollbackTransactions = true;

    public function testGetTotal()
    {
        $repo = $this->getContainer()->get('article_repo_tag');

        // Add
        $user = $this->newUserPersistent();
        $tagA = $this->newRandomTagPersistent($user);

        $articles = [];
        for ($i = 0; $i < 10; ++$i) {
            $articleData = [
                'user' => $user,
                'published_at' => new DateTime(),
                'tags' => [$tagA],
            ];

            $articles[] = $article = $this->newArticle($articleData);
            $this->em->persist($article);
        }
        $this->em->flush($articles);

        $repo->setTag($tagA);

        $this->assertEquals(10, $repo->getTotal());
    }

    public function testGetFeatured()
    {
        $repo = $this->getContainer()->get('article_repo_tag');

        // Add
        $user = $this->newUserPersistent();
        $tagA = $this->newRandomTagPersistent($user);
        $tagB = $this->newRandomTagPersistent($user);
        $tagC = $this->newRandomTagPersistent($user);
        $tagD = $this->newRandomTagPersistent($user);
        $featured = $this->newTagPersistent([
            'name' => Article::SLOT_FEATURED,
            'user' => $user,
            'private' => true,
        ]);

        $articles = [];
        for ($i = 0; $i < 10; ++$i) {
            $articleData = [
                'user' => $user,
                'published_at' => new DateTime(),
            ];
            if ($i < 7) {
                $articleData['tags'] = [$featured, $tagA, $tagB, $tagC];
            } else {
                $articleData['tags'] = [$featured, $tagA, $tagB, $tagD];
            }

            $articles[] = $article = $this->newArticle($articleData);
            $this->em->persist($article);
        }
        $this->em->flush($articles);

        $repo->setTag($tagC);

        // Verify
        $this->assertCount(1, $repo->getFeatured(0));
        $this->assertCount(1, $repo->getFeatured(6));
        $this->assertCount(0, $repo->getFeatured(7));

        $repo->setTag($tagD);

        // Verify
        $this->assertCount(1, $repo->getFeatured(0));
        $this->assertCount(1, $repo->getFeatured(1));
        $this->assertCount(1, $repo->getFeatured(2));
        $this->assertCount(0, $repo->getFeatured(3));
    }

    public function testGetTeasers()
    {
        $repo = $this->getContainer()->get('article_repo_tag');

        // Add
        $user = $this->newUserPersistent();
        $tagA = $this->newRandomTagPersistent($user);
        $tagB = $this->newRandomTagPersistent($user);
        $tagC = $this->newRandomTagPersistent($user);
        $tagD = $this->newRandomTagPersistent($user);
        $tagE = $this->newRandomTagPersistent($user);
        $articles = [];

        // To be found
        for ($i = 0; $i < 10; ++$i) {
            $articles[] = $article = $this->newArticle([
                'user' => $user,
                'published_at' => new DateTime(),
                'tags' => [$tagA, $tagB, $tagC, $tagD],
            ]);
            $this->em->persist($article);
        }
        // Not to be found
        for ($i = 0; $i < 5; ++$i) {
            $articles[] = $article = $this->newArticle([
                'user' => $user,
                'published_at' => new DateTime(),
                'tags' => [$tagE],
            ]);
            $this->em->persist($article);
        }

        $this->em->flush($articles);

        $repo->setTag($tagC);

        // Verify
        $articles05 = $repo->getTeasers(0, 5);
        $this->assertEquals(5, count($articles05));

        $articles55 = $repo->getTeasers(5, 5);
        $this->assertEquals(5, count($articles55));

        $articles010 = $repo->getTeasers(0, 10);
        $this->assertEquals(10, count($articles010));

        $articles1010 = $repo->getTeasers(10, 10);
        $this->assertEquals(0, count($articles1010));
    }
}
