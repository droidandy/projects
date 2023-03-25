<?php

namespace AppBundle\Controller\Api\Messenger;

use AppBundle\Controller\Api\ApiControllerTemplate;
use AppBundle\Entity\Messenger\Message;
use AppBundle\Entity\Messenger\Room;
use AppBundle\Entity\User\User;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Response;

class RoomController extends ApiControllerTemplate
{
    /**
     * @var string
     */
    protected $model = Room::class;

    /**
     * @param Room $room
     * @ParamConverter(
     *     converter="doctrine.orm",
     *     name="room",
     *     class="AppBundle\Entity\Messenger\Room"
     * )
     *
     * @return mixed
     */
    public function messagesAction(Room $room)
    {
        $collection = $this->get('em')
            ->getRepository(Message::class)
            ->findBy([
                'room' => $room,
            ]);

        return new Response($this->serializeEntity(
            $collection,
            ['message']
        ));
    }

    /**
     * @param User $userTo
     *
     * @return Response
     */
    public function joinUserRoomAction(User $userTo)
    {
        $roomFinder = $this->get('app.room_finder');
        $room = $roomFinder->findPrivateRoomForUser($this->getUser(), $userTo);

        if (!$room) {
            $room = $roomFinder->loadRoomForUsers($this->getUser(), $userTo);
        }

        $url = $this->generateUrl(
            'ha_room_get',
            ['id' => $room->getId()],
            true // absolute
        );

        $response = new Response();
        $response->setStatusCode(201);
        $response->headers->set('Location', $url);

        return $response;
    }

    /**
     * @return Response
     */
    public function getMyAction(): Response
    {
        $rooms = $this
            ->get('app.room_finder')
            ->getMyRooms($this->getUser());

        return new Response($this->serializeEntity(
            $rooms,
            ['room']
        ));
    }

    /**
     * @return Response
     */
    public function getMyUsersAction(): Response
    {
        $users = $this->get('em')
            ->getRepository(Room::class)
            ->getUsersOfMyRooms($this->getUser());

        return new Response($this->serializeEntity(
            $users,
            ['collection']
        ));
    }
}
