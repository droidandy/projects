<?php

namespace AppBundle\Entity\Messenger;

use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Social\Article;
use Doctrine\ORM\EntityRepository;
use AppBundle\Entity\User\User;

class RoomRepository extends EntityRepository
{
    /**
     * @param User $user
     *
     * @return mixed
     */
    public function findMyRooms(User $user): array
    {
        $qb = $this
            ->getEntityManager()
            ->createQueryBuilder();

        return $qb->select('r')
            ->from('AppBundle\Entity\Messenger\Room', 'r')
            ->innerJoin('r.users', 'u')
            ->where('u.id IN (:userIds)')->setParameter('userIds', $user->getId())
            ->getQuery()
            ->execute();
    }

    /**
     * @param User $user
     *
     * @return mixed
     */
    public function getUsersOfMyRooms(User $user): array
    {
        $roomIds = [];

        foreach ($user->rooms as $room) {
            $roomIds[] = $room->id;
        }

        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('user')
            ->distinct()
            ->from(User::class, 'user')
            ->innerJoin('user.rooms', 'rooms')
            ->where('rooms.id IN (:roomIds)')->setParameter('roomIds', $roomIds)
            ->getQuery()
            ->execute();
    }

    public function getUnreadMessagesSummaryForUser(User $user)
    {
        $qb = $this
            ->getEntityManager()
            ->createQueryBuilder();

        return $qb->select('COUNT(r) as total_unread, room.id')
            ->from(Room::class, 'room')
            ->innerJoin('room.messages', 'm')
            ->innerJoin('m.readers', 'r')
            ->where('r.user IN (:userIds)')->setParameter('userIds', $user)
            ->andWhere('r.readAt IS NULL')
            ->groupBy('room.id')
            ->getQuery()
            ->execute();
    }

    /**
     * @param User $user
     * @param User $userTo
     *
     * @return array
     */
    public function findPrivateRoomsForUsers(User $user, User $userTo): array
    {
        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('r')
            ->from('AppBundle\Entity\Messenger\Room', 'r')
            ->innerJoin('r.users', 'u')
            ->innerJoin('r.users', 'uTo')
            ->where('u.id = :user')->setParameter('user', $user)
            ->andWhere('uTo.id = :userTo')->setParameter('userTo', $userTo)
            ->andWhere('r.isPrivate = 1')
            ->getQuery()
            ->execute();
    }

    /**
     * @param Article $article
     *
     * @return Room
     */
    public function findPublicRoomForArticle(Article $article)
    {
        $rooms = $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('r')
            ->from('AppBundle\Entity\Messenger\Room', 'r')
            ->andWhere('r.isPrivate = 0')
            ->andWhere('r.article = :article')->setParameter('article', $article)
            ->getQuery()
            ->execute();

        if (count($rooms)) {
            return $rooms[0];
        }
    }

    /**
     * @param Property $property
     *
     * @return Room
     */
    public function findPublicRoomForProperty(Property $property)
    {
        $rooms = $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('r')
            ->from('AppBundle\Entity\Messenger\Room', 'r')
            ->andWhere('r.isPrivate = 0')
            ->andWhere('r.property = :property')->setParameter('property', $property)
            ->getQuery()
            ->execute();

        if (count($rooms)) {
            return $rooms[0];
        }
    }
}
