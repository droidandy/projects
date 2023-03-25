<?php

namespace AppBundle\Service\Messenger;

use AppBundle\Elastic\Integration\Query\Criteria\Type\ArrayType;
use AppBundle\Entity\Messenger\Room;
use AppBundle\Entity\Messenger\RoomRepository;
use AppBundle\Entity\Messenger\Message;
use AppBundle\Entity\Messenger\Reader;
use AppBundle\Entity\User\User;
use Doctrine\ORM\EntityManager;

class MessageSender
{
    /**
     * @var PusherService
     */
    protected $pusherService;
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var RoomRepository
     */
    private $repository;

    /**
     * @param EntityManager $entityManager
     * @param PusherService $pusherService
     */
    public function __construct(EntityManager $entityManager, PusherService $pusherService)
    {
        $this->em = $entityManager;
        $this->repository = $this->em->getRepository(Room::class);
        $this->pusherService = $pusherService;
    }

    /**
     * @param User   $user
     * @param Room   $room
     * @param string $text
     *
     * @return Message
     */
    public function newMessage(User $user, Room $room, string $text): Message
    {
        $message = new Message();
        $message->user = $user;
        $message->room = $room;
        $message->text = $text;
        $this->em->persist($message);

        $this->createReaders($message);

        $this->em->flush();

        $this->readMessage($message, $user);

        return $message;
    }

    /**
     * @param Message $message
     * @return array
     */
    public function createReaders(Message $message): array
    {
        $readers = [];

        foreach ($message->room->users as $user) {
            $reader = new Reader();
            $reader->message = $message;
            $reader->user = $user;

            $this->em->persist($reader);

            $readers[] = $reader;
        }

        return $readers;
    }

    /**
     * @param Message $message
     * @param User    $user
     *
     * @return Reader
     */
    public function readMessage(Message $message, User $user): Reader
    {
        /** @var Reader $reader */
        $reader = $this->em->getRepository(Reader::class)->findOneBy([
            'message' => $message,
            'user' => $user,
        ]);
        $reader->setReadAtNow();

        $this->em->persist($reader);
        $this->em->flush($reader);

        $this->pusherService->updatePusherNewMessage($user, $message);

        return $reader;
    }
}
