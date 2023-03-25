<?php

namespace Test\AppBundle\Entity\Integration;

use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\UserTrait;
use AppBundle\Entity\Communication\Notification;
use AppBundle\Service\Notificator;

class NotificatorTest extends AbstractTestCase
{
    use UserTrait;
    use ArticleTrait;
    use PropertyTrait;
    use GoogleLocationTrait;
    use AddressTrait;
    /**
     * @var bool
     */
    protected $rollbackTransactions = true;
    /**
     * @var Notificator
     */
    private $notificator;

    protected function setUp()
    {
        parent::setUp();

        $this->notificator = $this->getContainer()->get('ha_notificator');
    }

    protected function tearDown()
    {
        unset($this->notificator);

        parent::tearDown();
    }

    /**
     * @covers \Notificator::articleLiked()
     * @covers \Notificator::articleLikeRemoved()
     */
    public function testArticleLikeAddRemove()
    {
        // Add
        $user = $this->newUserPersistent();
        $userA = $this->newUserPersistent();
        $articleA = $this->newArticlePersistent([
            'user' => $userA,
        ]);

        // Test: add notification
        $this->notificator->articleLiked($user, $articleA);
        $this->em->flush();

        // Verify
        $notifications = $this->em->getRepository('AppBundle\Entity\Communication\Notification')->findBy([
            'owner' => $userA,
            'article' => $articleA,
            'user' => $user,
            'type' => Notification::TYPE_ARTICLE_LIKE_RECEIVED,
        ]);

        $this->assertEquals(1, count($notifications));

        // Test: remove notification
        $this->notificator->articleLikeRemoved($user, $articleA);
        $this->em->flush();

        // Verify
        $notifications = $this->em->getRepository('AppBundle\Entity\Communication\Notification')->findBy([
            'owner' => $userA,
            'article' => $articleA,
            'user' => $user,
            'type' => Notification::TYPE_ARTICLE_LIKE_RECEIVED,
        ]);

        $this->assertEquals(0, count($notifications));

        // Remove
        $this->em->remove($userA);
        $this->em->remove($user);
        $this->em->flush();
    }


    /**
     * @covers \Notificator::userFollowingUser()
     * @covers \Notificator::userFollowingUserRemoved()
     */
    public function testUserFollowingUserAddRemove()
    {
        // Add
        $user = $this->newUserPersistent();
        $userA = $this->newUserPersistent();

        // Test: add notification
        $this->notificator->userFollowingUser($user, $userA);
        $this->em->flush();

        // Verify
        $notifications = $this->em->getRepository('AppBundle\Entity\Communication\Notification')->findBy([
            'owner' => $userA,
            'user' => $user,
            'type' => Notification::TYPE_USER_FOLLOWER_RECEIVED,
        ]);
        $this->assertEquals(1, count($notifications));

        // Test: remove notification
        $this->notificator->userFollowingUserRemoved($user, $userA);
        $this->em->flush();

        // Verify
        $notifications = $this->em->getRepository('AppBundle\Entity\Communication\Notification')->findBy([
            'owner' => $userA,
            'user' => $user,
            'type' => Notification::TYPE_USER_FOLLOWER_RECEIVED,
        ]);

        $this->assertEquals(0, count($notifications));

        // Remove
        $this->em->remove($userA);
        $this->em->remove($user);
        $this->em->flush();
    }

    /**
     * @covers \Notificator::propertyLiked()
     * @covers \Notificator::propertyLikeRemoved()
     */
    public function testPropertyLikeAddRemove()
    {
        // Add
        $userA = $this->newUserPersistent();
        $userB = $this->newUserPersistent();
        $property = $this->newPropertyPersistent([
            'user' => $userB,
        ]);

        // Test
        $this->notificator->propertyLiked($userA, $property);
        $this->em->flush();

        // Test: add notification
        $notifications = $this->em->getRepository('AppBundle\Entity\Communication\Notification')->findBy([
            'owner' => $property->getUser(),
            'user' => $userA,
            'type' => Notification::TYPE_PROPERTY_LIKE_RECEIVED,
        ]);
        $this->assertEquals(1, count($notifications));

        // Test: remove notification
        $this->notificator->propertyLikeRemoved($userA, $property);
        $this->em->flush();

        // Verify
        $notifications = $this->em->getRepository('AppBundle\Entity\Communication\Notification')->findBy([
            'owner' => $property->getUser(),
            'user' => $userA,
            'type' => Notification::TYPE_PROPERTY_LIKE_RECEIVED,
        ]);

        $this->assertEquals(0, count($notifications));

        // Remove
        $this->em->remove($property);
        $this->em->remove($userA);
        $this->em->remove($userB);
        $this->em->flush();
    }


}
