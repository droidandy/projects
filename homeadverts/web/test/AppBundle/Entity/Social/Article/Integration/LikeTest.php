<?php

namespace Test\AppBundle\Entity\Social\Article\Integration;

use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\UserTrait;

class LikeTest extends AbstractTestCase
{
    use UserTrait, ArticleTrait;

    /**
     * @var bool
     */
    protected $rollbackTransactions = true;

    public function testAddTwoLikesFromTheSameUserAndRemoveThem()
    {
        $userRepository = $this->getContainer()->get('user_repo');
        $articleRepository = $this->em->getRepository('AppBundle:Social\Article');

        // Add
        $user = $this->newUser();
        $articleA = $this->newArticlePersistent([
            'user' => $user,
        ]);
        $articleB = $this->newArticlePersistent([
            'user' => $user,
        ]);
        $likeA = $this->newArticleLikePersistent($user, $articleA);
        $likeB = $this->newArticleLikePersistent($user, $articleB);

        // Flush doctrine
        $this->em->clear();

        // Verify A
        $updatedArticleA = $articleRepository->findOneBy([
            'token' => $articleA->getToken(),
        ]);
        $this->assertEquals(1, $updatedArticleA->likes->count());
        $this->assertEquals(
            $updatedArticleA->likes->first()->getUser()->getId(),
            $user->getId()
        );
        $this->assertTrue($userRepository->isLikedByUser($user, $articleA));

        // Verify B
        $updatedArticleB = $articleRepository->findOneBy([
            'token' => $articleB->getToken(),
        ]);
        $this->assertEquals(1, $updatedArticleB->likes->count());
        $this->assertEquals(
            $updatedArticleB->likes->first()->getUser()->getId(),
            $user->getId()
        );
        $this->assertTrue($userRepository->isLikedByUser($user, $articleB));

        // Remove
        $this->removeEntities([
            $likeA,
            $likeB,
        ]);

        // Verify Likes were removed
        $articleWithoutLike = $articleRepository->findOneBy([
            'token' => $updatedArticleA->getToken(),
        ]);
        $this->assertEquals(0, $articleWithoutLike->likes->count());
        $this->assertFalse($userRepository->isLikedByUser($user, $articleWithoutLike));

        $this->removeEntities([
            $updatedArticleA,
            $updatedArticleB,
            $user,
        ]);
    }
}
