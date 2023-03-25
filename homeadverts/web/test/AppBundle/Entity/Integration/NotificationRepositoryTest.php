<?php

namespace Test\AppBundle\Entity\Integration;

use Test\AppBundle\AbstractTestCase;
use Test\Utils\Traits\ArticleTrait;
use Test\Utils\Traits\UserTrait;
use DateTime;

class NotificationRepositoryTest extends AbstractTestCase
{
    use UserTrait;
    use ArticleTrait;

    /**
     * @var bool
     */
    protected $rollbackTransactions = true;

    /**
     * Future date does mark past notification as read.
     *
     * @covers \NotificationRepository::markNotificationsAsRead
     */
    public function testNotificationReadDateAfter()
    {
        $dateReadAt = (new DateTime())->modify('+1 minutes');
        $container = $this->getContainer();
        $repository = $container->get('notification_repo');

        // Add
        $userA = $this->newUserPersistent();
        $userB = $this->newUserPersistent();
        $articleB = $this->newArticlePersistent([
            'user' => $userB,
        ]);
        $container->get('ha_notificator')->articleLiked($userA, $articleB);
        $this->em->flush();

        // Run
        $repository->markNotificationsAsRead($userB, $dateReadAt);

        // Verify
        $notificationsB = $repository->findOneBy([
            'owner' => $userB,
        ]);

        $this->em->refresh($notificationsB);

        $this->assertEquals(
            $dateReadAt->format('Y-m-d H:i:s'),
            $notificationsB->getReadAt()->format('Y-m-d H:i:s')
        );

        // Remove
        $this->em->remove($userA);
        $this->em->remove($userB);
        $this->em->flush();
    }

    /**
     * Past date does not mark further notification as read.
     *
     * @covers \NotificationRepository::markNotificationsAsRead
     */
    public function testNotificationReadDateBefore()
    {
        $dateReadAt = (new DateTime())->modify('-1 minutes');
        $container = $this->getContainer();
        $repository = $container->get('notification_repo');

        // Add
        $userA = $this->newUserPersistent();
        $userB = $this->newUserPersistent();
        $articleB = $this->newArticlePersistent([
            'user' => $userB,
        ]);
        $container->get('ha_notificator')->articleLiked($userA, $articleB);
        $this->em->flush();

        // Run
        $repository->markNotificationsAsRead($userB, $dateReadAt);

        // Verify
        $notificationsB = $repository->findOneBy([
            'owner' => $userB,
        ]);
        $this->em->refresh($notificationsB);
        $this->assertEquals(
            null,
            $notificationsB->getReadAt()
        );

        // Remove
        $this->em->remove($userA);
        $this->em->remove($userB);
        $this->em->flush();
    }

    /**
     * Several notifications exist for different users,
     * markAll change only the ones belong to a user but not others.
     *
     * @covers \NotificationRepository::markNotificationsAsRead
     */
    public function testNotificationReadManyNotificationForManyUsers()
    {
        $dateReadAt = (new DateTime())->modify('+1 minutes');
        $container = $this->getContainer();
        $repository = $container->get('notification_repo');

        // Add
        $userA = $this->newUserPersistent();
        $userB = $this->newUserPersistent();
        $articleA1 = $this->newArticlePersistent([
            'user' => $userA,
        ]);
        $articleA2 = $this->newArticlePersistent([
            'user' => $userA,
        ]);
        $articleB = $this->newArticlePersistent([
            'user' => $userB,
        ]);
        $container->get('ha_notificator')->articleLiked($userA, $articleB);
        $container->get('ha_notificator')->articleLiked($userB, $articleA1);
        $this->em->flush();

        // Run: Mark notifications for user A as read
        $repository->markNotificationsAsRead($userA, $dateReadAt);

        $container->get('ha_notificator')->articleLiked($userB, $articleA2);
        $this->em->flush();

        // Verify
        $notificationsA = $repository->findBy(
            ['owner' => $userA],
            ['readAt' => 'asc']
        );
        $notificationsB = $repository->findBy([
            'owner' => $userB,
        ]);
        $this->em->refresh($notificationsA[0]);
        $this->em->refresh($notificationsA[1]);
        $this->em->refresh($notificationsB[0]);

        $this->assertEquals(2, count($notificationsA));
        $this->assertEquals(1, count($notificationsB));

        $this->assertEquals(null, $notificationsA[0]->getReadAt());
        $this->assertEquals(
            $dateReadAt->format('Y-m-d H:i:s'),
            $notificationsA[1]->getReadAt()->format('Y-m-d H:i:s')
        );

        // Remove
        $this->em->remove($userA);
        $this->em->remove($userB);
        $this->em->flush();
    }

    /**
     * markAll works when no notification exist.
     *
     * @covers \NotificationRepository::markNotificationsAsRead
     */
    public function testNotificationReadNothingToMarkAsRead()
    {
        $dateReadAt = (new DateTime())->modify('+1 minutes');
        $container = $this->getContainer();
        $repository = $container->get('notification_repo');

        // Add
        $userA = $this->newUserPersistent();

        // Run
        $repository->markNotificationsAsRead($userA, $dateReadAt);
        $this->em->flush();

        // Verify
        $notificationsA = $repository->findOneBy([
            'owner' => $userA,
        ]);
        $this->assertNull($notificationsA);

        // Remove
        $this->em->remove($userA);
        $this->em->flush();
    }

    /**
     * Should return zero if there are no notifications in DB.
     *
     * @covers \NotificationRepository::getNotificationUnreadQty
     */
    public function testZeroNotifications()
    {
        $container = $this->getContainer();

        // Add
        $user = $this->newUserPersistent();

        // Test
        $total = $container->get('notification_repo')->getNotificationUnreadQty($user);

        // Verify
        $this->assertEquals(0, $total);

        // Remove
        $this->em->remove($user);
        $this->em->flush();
    }

    /**
     * Should return one if there is only one notifications in DB.
     *
     * @covers \NotificationRepository::getNotificationUnreadQty
     */
    public function testOneNotificationReturnOneUnread()
    {
        $container = $this->getContainer();

        // Add
        $userA = $this->newUserPersistent();
        $userB = $this->newUserPersistent();
        $articleB = $this->newArticlePersistent([
            'user' => $userB,
        ]);
        $container->get('ha_notificator')->articleLiked($userA, $articleB);
        $this->em->flush();

        // TestgetNotificationUnreadQtyForUser
        $total = $container->get('notification_repo')->getNotificationUnreadQty($userB);

        // Verify
        $this->assertEquals(1, $total);

        // Remove
        $this->em->remove($userA);
        $this->em->remove($userB);
        $this->em->flush();
    }

    /**
     * Should return zero if there is only one notifications in DB and its marked as read.
     *
     * @covers \NotificationRepository::getNotificationUnreadQty
     */
    public function testOneNotificationReturnsZeroUnread()
    {
        $dateReadAt = (new DateTime())->modify('+1 minutes');
        $container = $this->getContainer();
        $repository = $container->get('notification_repo');

        // Add
        $userA = $this->newUserPersistent();
        $userB = $this->newUserPersistent();
        $articleB = $this->newArticlePersistent([
            'user' => $userB,
        ]);
        $container->get('ha_notificator')->articleLiked($userA, $articleB);

        // Test
        $repository->markNotificationsAsRead($userB, $dateReadAt);
        $total = $repository->getNotificationUnreadQty($userB);

        // Verify
        $this->assertEquals(0, $total);

        // Remove
        $this->em->remove($userA);
        $this->em->remove($userB);
        $this->em->flush();
    }
}
