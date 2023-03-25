<?php

namespace AppBundle\Controller\Messenger;

use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Social\Article;
use AppBundle\Entity\User\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;

class RoomController extends Controller
{
    /**
     * @param User $userTo
     *
     * @return RedirectResponse|Response
     */
    public function redirectPrivateUserRoomAction(User $userTo)
    {
        $roomFinder = $this->get('app.room_finder');
        $room = $roomFinder->findPrivateRoomForUser($this->getUser(), $userTo);

        if ($room) {
            $url = sprintf(
                '%s/room/%s',
                $this->getParameter('messenger_url'),
                $room->getId()
            );
        } else {
            $room = $roomFinder->loadRoomForUsers($this->getUser(), $userTo);

            $url = sprintf(
                '%s/room/%s?channel=1&name=%s',
                $this->getParameter('messenger_url'),
                $room->getId(),
                $room->getTitle()
            );
        }

        return $this->redirect($url);
    }

    /**
     * @param Property $property
     *
     * @return RedirectResponse|Response
     */
    public function redirectPublicPropertyRoomAction(Property $property)
    {
        $room = $this->get('app.room_finder')->loadRoomForProperty($property, $this->getUser());

        $url = sprintf(
            '%s/room/%s?channel=2&name=%s',
            $this->getParameter('messenger_url'),
            $room->getId(),
            $room->getTitle()
        );

        return $this->redirect($url);
    }

    /**
     * @param Article $article
     *
     * @return RedirectResponse|Response
     */
    public function redirectPublicArticleRoomAction(Article $article)
    {
        $room = $this->get('app.room_finder')->loadRoomForArticle($article, $this->getUser());

        $url = sprintf(
            '%s/room/%s?channel=2&name=%s',
            $this->getParameter('messenger_url'),
            $room->getId(),
            $room->getTitle()
        );

        return $this->redirect($url);
    }
}
