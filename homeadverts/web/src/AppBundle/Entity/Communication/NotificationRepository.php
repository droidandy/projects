<?php

namespace AppBundle\Entity\Communication;

use Doctrine\ORM\EntityRepository;
use DateTime;
use AppBundle\Entity\User\User;

class NotificationRepository extends EntityRepository
{
    /**
     * @param User     $user
     * @param DateTime $date
     */
    public function markNotificationsAsRead(User $user, DateTime $date)
    {
        $qb = $this
            ->getEntityManager()
            ->createQueryBuilder();

        $qb
            ->update('AppBundle\Entity\Communication\Notification', 'n')
            ->where('n.owner = :owner')->setParameter('owner', $user)
            ->andWhere('n.createdAt < :date')->setParameter('date', $date)

            ->set('n.readAt', $qb->expr()->literal($date->format('Y-m-d H:i:s')))

            ->getQuery()
            ->execute()
        ;
    }

    /**
     * @param User $user
     *
     * @return int
     */
    public function getNotificationUnreadQty(User $user)
    {
        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('count(n.id)')
            ->from('AppBundle\Entity\Communication\Notification', 'n')
            ->where('n.owner = :user')->setParameter('user', $user)
            ->andWhere('n.readAt IS NULL')
            ->getQuery()
            ->getSingleScalarResult()
        ;
    }
}
