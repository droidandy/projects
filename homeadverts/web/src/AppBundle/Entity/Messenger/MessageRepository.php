<?php

namespace AppBundle\Entity\Messenger;

use AppBundle\Entity\User\User;
use Doctrine\ORM\EntityRepository;
use DateTime;

class MessageRepository extends EntityRepository
{
    /**
     * @return DateTime
     */
    public static function getTerminalUnreadDateBefore()
    {
        $date = new DateTime();
        $date->modify('-15 minutes');

        return $date;
    }

    /**
     * @return Message[]
     */
    public function getLastUnreadMessagesInAllRooms()
    {
        $messageIds = [];
        $messageSQL = sprintf('
            SELECT m.*
            FROM messenger_room AS r
            INNER JOIN messenger_message AS m
            ON m.id = (
                SELECT id
                FROM messenger_message AS m2
                WHERE m2.room_id = r.id
                AND m2.notifiedAt IS NULL
                AND m2.createdAt <= "%s"
                ORDER BY createdAt DESC
                LIMIT 1
            )
        ', self::getTerminalUnreadDateBefore()->format('Y-m-d H:i:s'));

        $em = $this->getEntityManager();
        $stmt = $em->getConnection()->prepare($messageSQL);
        $stmt->execute();
        $rows = $stmt->fetchAll();

        foreach ($rows as $row) {
            $messageIds[] = $row['id'];
        }

        return $this
            ->getEntityManager()
            ->createQueryBuilder()
            ->select('m')
            ->from('AppBundle\Entity\Messenger\Message', 'm')
            ->where('m.id IN (:messageIds)')->setParameter('messageIds', $messageIds)
            ->getQuery()
            ->execute();
    }
}
