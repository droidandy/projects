<?php

namespace AppBundle\Service\Messenger;

use AppBundle\Entity\Messenger\Room;
use AppBundle\Entity\Messenger\RoomRepository;
use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Social\Article;
use AppBundle\Entity\User\User;
use AppBundle\Service\User\UserManager;
use Doctrine\ORM\EntityManager;

class RoomFinder
{
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var RoomRepository
     */
    private $repository;
    /**
     * @var MessageSender
     */
    private $messageSender;
    /**
     * @var UserManager
     */
    private $userManager;

    /**
     * @param EntityManager $entityManager
     * @param MessageSender $messageSender
     * @param UserManager   $userManager
     */
    public function __construct(
        EntityManager $entityManager,
        MessageSender $messageSender,
        UserManager $userManager
    ) {
        $this->em = $entityManager;
        $this->repository = $this->em->getRepository(Room::class);
        $this->messageSender = $messageSender;
        $this->userManager = $userManager;
    }

    /**
     * @param User $user
     *
     * @return Room
     */
    public function createOnBoardingRoom(User $user): Room
    {
        if ($user->getEmail() === User::SERVICE_USER['email']) {
            throw new \LogicException('This operation can\'t be done for service user');
        }

        $serviceUser = $this->userManager->findUserByEmail(User::SERVICE_USER['email']);

        return $this->loadRoomForUsers($user, $serviceUser);
    }

    /**
     * @param User $user
     * @param User $userTo
     *
     * @return Room
     */
    public function loadRoomForUsers(User $user, User $userTo): Room
    {
        $room = $this->findPrivateRoomForUser($user, $userTo);

        if (!$room) {
            $room = new Room();
            $room->users->add($user);
            $room->users->add($userTo);

            $this->em->persist($room);
            $this->em->flush($room);
        }

        return $room;
    }

    /**
     * @param Article $article
     * @param User    $userToBeAdded
     *
     * @return Room
     */
    public function loadRoomForArticle(Article $article, User $userToBeAdded = null): Room
    {
        $room = $this->repository->findPublicRoomForArticle($article);

        if (!$room) {
            $room = new Room();
            $room->article = $article;
            $room->isPrivate = false;
            $room->users->add($article->getAuthor());
        }

        if ($userToBeAdded) {
            $this->addUserToRoom($room, $userToBeAdded);
        }

        $this->em->persist($room);
        $this->em->flush($room);

        return $room;
    }

    /**
     * @param Property $property
     * @param User     $userToBeAdded
     *
     * @return Room
     */
    public function loadRoomForProperty(Property $property, User $userToBeAdded = null): Room
    {
        $room = $this->repository->findPublicRoomForProperty($property);

        if (!$room) {
            $room = new Room();
            $room->property = $property;
            $room->isPrivate = false;
            $room->users->add($property->getUser());
        }

        if ($userToBeAdded) {
            $this->addUserToRoom($room, $userToBeAdded);
        }

        $this->em->persist($room);
        $this->em->flush($room);

        return $room;
    }

    /**
     * @param User $user
     *
     * @return array
     */
    public function getMyRooms(User $user): array
    {
        $rooms = $this->repository->findMyRooms($user);
        $roomsUnread = $this->repository->getUnreadMessagesSummaryForUser($user);

        foreach ($rooms as $room) {
            foreach ($roomsUnread as $unread) {
                if ($room->id === $unread['id']) {
                    $room->unread = $unread['total_unread'];
                }
            }

            $room->users->removeElement($user);
        }

        return $rooms;
    }

    /**
     * @param User $user
     * @param User $userTo
     *
     * @return Room|false
     */
    public function findPrivateRoomForUser(User $user, User $userTo)
    {
        $rooms = $this->repository->findPrivateRoomsForUsers($user, $userTo);

        if ($rooms) {
            return $rooms[0];
        }
    }

    /**
     * @param Room $room
     * @param User $user
     */
    public function addUserToRoom(Room $room, User $user)
    {
        $userExists = $room->users->contains($user);

        if (!$userExists) {
            $room->users->add($user);
        }
    }
}
