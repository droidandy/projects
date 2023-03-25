<?php

namespace Test\AppBundle\Entity\Integration;

use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\UserTrait;
use AppBundle\Entity\User\UserRepository;

class UserRepositoryTest extends AbstractTestCase
{
    use UserTrait;

    /**
     * @var bool
     */
    protected $rollbackTransactions = true;

    /**
     * @var UserRepository
     */
    private $repo;

    protected function setUp()
    {
        parent::setUp();

        $this->repo = $this->getContainer()->get('user_repo');
    }

    protected function tearDown()
    {
        unset($this->repo);

        parent::tearDown();
    }

    public function testGetUserFollowings()
    {
        // Add
        $userA = $this->newUser(); // 30 followings
        $userB = $this->newUser(); // 10 followings
        $userC = $this->newUser(); // 0 followings
        $userD = $this->newUser(); // 3 followings
        $users = [];

        for ($i = 0; $i < 20; ++$i) {
            $users[] = $user = $this->newUser();
            $userA->followUser($user);
            $this->em->persist($user);
        }
        for ($i = 0; $i < 10; ++$i) {
            $users[] = $user = $this->newUser();
            $userA->followUser($user); // unique one
            $userB->followUser($user); // followed by two
            $this->em->persist($user);
        }
        $userD->followUser($userA);
        $userD->followUser($userB);
        $userD->followUser($userC);

        $this->em->persist($userA);
        $this->em->persist($userB);
        $this->em->persist($userC);
        $this->em->persist($userD);
        $this->em->flush();

        // Verify UserA
        $userA02 = $this->repo->getUserFollowings($userA, 0, 2);
        $this->assertEquals(2, count($userA02));

        $userA24 = $this->repo->getUserFollowings($userA, 2, 4);
        $this->assertEquals(4, count($userA24));

        $userA64 = $this->repo->getUserFollowings($userA, 6, 14);
        $this->assertEquals(14, count($userA64));

        $userA20100 = $this->repo->getUserFollowings($userA, 20, 100);
        $this->assertEquals(10, count($userA20100));

        $this->assertEquals(30, $this->repo->getTotalUserFollowings($userA));

        // Verify UserB
        $userB05 = $this->repo->getUserFollowings($userB, 0, 5);
        $this->assertEquals(5, count($userB05));

        $userB55 = $this->repo->getUserFollowings($userB, 0, 5);
        $this->assertEquals(5, count($userB55));

        $this->assertEquals(10, $this->repo->getTotalUserFollowings($userB));

        // Verify UserC
        $userC0100 = $this->repo->getUserFollowings($userC, 0, 100);
        $this->assertEquals(0, count($userC0100));
        $this->assertEquals(0, $this->repo->getTotalUserFollowings($userC));

        // Verify UserD
        $userD0100 = $this->repo->getUserFollowings($userD, 0, 100);
        $this->assertEquals(3, count($userD0100));
        $this->assertEquals(3, $this->repo->getTotalUserFollowings($userD));

        // Remove
        foreach ($users as $user) {
            $this->em->remove($user);
        }
        $this->em->remove($userA);
        $this->em->remove($userB);
        $this->em->remove($userC);
        $this->em->remove($userD);
        $this->em->flush();
    }

    public function testGetUserFollowers()
    {
        // Add
        $userA = $this->newUser(); // 30 followers
        $userB = $this->newUser(); // 10 followers
        $userC = $this->newUser(); // 0 followers
        $userD = $this->newUser(); // 3 followers
        $users = [];

        for ($i = 0; $i < 20; ++$i) {
            $users[] = $user = $this->newUser();
            $user->followUser($userA);
            $this->em->persist($user);
        }
        for ($i = 0; $i < 10; ++$i) {
            $users[] = $user = $this->newUser();
            $user->followUser($userA);  // unique one
            $user->followUser($userB);  // follows two
            $this->em->persist($user);
        }
        $userA->followUser($userD);
        $userB->followUser($userD);
        $userC->followUser($userD);

        $this->em->persist($userA);
        $this->em->persist($userB);
        $this->em->persist($userC);
        $this->em->persist($userD);
        $this->em->flush();

        // Verify UserA
        $userA02 = $this->repo->getUserFollowers($userA, 0, 2);
        $this->assertEquals(2, count($userA02));

        $userA24 = $this->repo->getUserFollowers($userA, 2, 4);
        $this->assertEquals(4, count($userA24));

        $userA64 = $this->repo->getUserFollowers($userA, 6, 14);
        $this->assertEquals(14, count($userA64));

        $userA20100 = $this->repo->getUserFollowers($userA, 20, 100);
        $this->assertEquals(10, count($userA20100));

        $this->assertEquals(30, $this->repo->getTotalUserFollowers($userA));

        // Verify UserB
        $userB05 = $this->repo->getUserFollowers($userB, 0, 5);
        $this->assertEquals(5, count($userB05));

        $userB55 = $this->repo->getUserFollowers($userB, 0, 5);
        $this->assertEquals(5, count($userB55));

        $this->assertEquals(10, $this->repo->getTotalUserFollowers($userB));

        // Verify UserC
        $userC0100 = $this->repo->getUserFollowers($userC, 0, 100);
        $this->assertEquals(0, count($userC0100));
        $this->assertEquals(0, $this->repo->getTotalUserFollowers($userC));

        // Verify UserD
        $userD0100 = $this->repo->getUserFollowers($userD, 0, 100);
        $this->assertEquals(3, count($userD0100));
        $this->assertEquals(3, $this->repo->getTotalUserFollowers($userD));

        // Remove
        foreach ($users as $user) {
            $this->em->remove($user);
        }
        $this->em->remove($userA);
        $this->em->remove($userB);
        $this->em->remove($userC);
        $this->em->remove($userD);
        $this->em->flush();
    }
}
