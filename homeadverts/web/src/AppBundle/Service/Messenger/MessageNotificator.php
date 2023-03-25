<?php

namespace AppBundle\Service\Messenger;

use AppBundle\Entity\Messenger\Message;
use AppBundle\Entity\Messenger\MessageRepository;
use AppBundle\Entity\User\User;
use AppBundle\Service\Email\Mailer;
use Doctrine\ORM\EntityManager;
use DateTime;

class MessageNotificator
{
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var MessageRepository
     */
    private $repository;
    /**
     * @var Mailer
     */
    private $mailer;

    /**
     * @param EntityManager $entityManager
     * @param Mailer        $mailer
     */
    public function __construct(EntityManager $entityManager, Mailer $mailer)
    {
        $this->em = $entityManager;
        $this->repository = $this->em->getRepository(Message::class);
        $this->mailer = $mailer;
    }

    public function sendNotificationsForUnreadMessages()
    {
        $messages = $this->repository->getLastUnreadMessagesInAllRooms();

        foreach ($messages as $message) {
            foreach ($message->readers as $reader) {
                if ($reader->readAt === NULL) {
                    $this->mailer->sendMessageEmail($message, $reader->user);
                }
            }

            $message->notifiedAt = new DateTime();
            $this->em->persist($message);
        }

        $this->em->flush($messages);
    }
}
