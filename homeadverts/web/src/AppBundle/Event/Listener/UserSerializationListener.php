<?php

namespace AppBundle\Event\Listener;

use AppBundle\Entity\User\User;
use AppBundle\Service\File\ImageHelper;
use JMS\Serializer\EventDispatcher\ObjectEvent;
use JMS\Serializer\JsonSerializationVisitor;
use JMS\Serializer\VisitorInterface;
use Symfony\Component\Routing\Router;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class UserSerializationListener extends AbstractSerializationListener
{
    /**
     * @var Router
     */
    protected $router;
    /**
     * @var TokenStorageInterface
     */
    protected $tokenStorage;
    /**
     * @var ImageHelper
     */
    protected $imageHelper;

    /**
     * @param Router $router
     * @param TokenStorageInterface $tokenStorage
     * @param ImageHelper $imageHelper
     */
    public function __construct(
        Router $router,
        TokenStorageInterface $tokenStorage,
        ImageHelper $imageHelper
    )
    {
        $this->router = $router;
        $this->tokenStorage = $tokenStorage;
        $this->imageHelper = $imageHelper;
    }

    public function onPostSerialize(ObjectEvent $event)
    {
        /** @var JsonSerializationVisitor $visitor */
        $user = $event->getObject();
        $visitor = $event->getContext()->getVisitor();

        if ($user instanceof User) {
            if ($this->doInjectionsFull($event)) {
                $this->injectFull($visitor, $user);
            }

            $visitor->addData('thumbnail', [
                'xs' => $this->imageHelper->userProfileImage($user, User::PROFILE_PHOTO_SMALL),
                's' => $this->imageHelper->userProfileImage($user, User::PROFILE_PHOTO),
            ]);
        }
    }

    public function injectFull(JsonSerializationVisitor $visitor, User $user)
    {
        /** @var User $me */

        $me = $this->tokenStorage->getToken()->getUser();
        $isFollowing = false;

        if ($me instanceof User) {
            $isFollowing = $me->isUserFollowing($user);
        }

        $counters = [
            'followings' => $user->followings->count(),
            'followers' => $user->followers->count(),
            'properties' => $user->getPropertiesCount(),
            'articles' => $user->getArticleCount(),
        ];
        $links = [
            'followers' => $this->router->generate('ha_user_followers', [
                'id' => $user->getId(),
                'slug' => $user->slug(),
            ]),
            'followings' => $this->router->generate('ha_user_followings', [
                'id' => $user->getId(),
                'slug' => $user->slug(),
            ]),
            'properties' => $this->router->generate('ha_user_properties', [
                'id' => $user->getId(),
                'slug' => $user->slug(),
            ]),
            'articles' => $this->router->generate('ha_user_articles', [
                'id' => $user->getId(),
                'slug' => $user->slug(),
            ]),
            'profile' => $this->router->generate('ha_user_profile', [
                'id' => $user->getId(),
                'slug' => $user->slug(),
            ]),
            'message' => $this->router->generate('ha_room_user_redirect', [
                'id' => $user->getId(),
            ]),
        ];
        $visitor->addData('url', [
            'details' => $this->router->generate('ha_user_profile', [
                'id' => $user->getId(),
                'slug' => $user->slug(),
            ], Router::ABSOLUTE_URL),
            'follow' => $this->router->generate('ha_user_follow', [
                'id' => $user->getId(),
            ], Router::ABSOLUTE_URL),
        ]);
        $visitor->addData('links', $links);
        $visitor->addData('counters', $counters);
        $visitor->addData('isFollowing', $isFollowing);
    }
}
