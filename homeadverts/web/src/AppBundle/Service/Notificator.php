<?php

namespace AppBundle\Service;

use Doctrine\ORM\EntityManager;
use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Social\Article;
use AppBundle\Entity\Communication\Notification;
use AppBundle\Entity\User\User;

class Notificator
{
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var array
     */
    private $messages;

    /**
     * @param EntityManager $entityManager
     * @param array         $messages
     */
    public function __construct(EntityManager $entityManager, array $messages)
    {
        $this->em = $entityManager;
        $this->messages = $messages;
    }

    /**
     * @param User    $user
     * @param Article $article
     */
    public function articleLiked(User $user, Article $article)
    {
        $notification = new Notification();
        $notification->setOwner($article->getAuthor());
        $notification->setArticle($article);
        $notification->setUser($user);
        $notification->setType(Notification::TYPE_ARTICLE_LIKE_RECEIVED);

        $this->em->persist($notification);
    }

    /**
     * @param User    $user
     * @param Article $article
     */
    public function articleLikeRemoved(User $user, Article $article)
    {
        $notification = $this->em->getRepository('AppBundle\Entity\Communication\Notification')->findOneBy([
            'owner' => $article->getAuthor(),
            'article' => $article,
            'user' => $user,
            'type' => Notification::TYPE_ARTICLE_LIKE_RECEIVED,
        ]);

        if ($notification) {
            $this->em->remove($notification);
        }
    }

    /**
     * @param User     $user
     * @param Property $property
     */
    public function propertyLiked(User $user, Property $property)
    {
        $notification = new Notification();
        $notification->setOwner($property->getUser());
        $notification->setProperty($property);
        $notification->setUser($user);
        $notification->setType(Notification::TYPE_PROPERTY_LIKE_RECEIVED);

        $this->em->persist($notification);
    }

    /**
     * @param User     $user
     * @param Property $property
     */
    public function propertyLikeRemoved(User $user, Property $property)
    {
        $notification = $this->em->getRepository('AppBundle\Entity\Communication\Notification')->findOneBy([
            'owner' => $property->getUser(),
            'property' => $property,
            'user' => $user,
            'type' => Notification::TYPE_PROPERTY_LIKE_RECEIVED,
        ]);

        if ($notification) {
            $this->em->remove($notification);
        }
    }

    /**
     * @param User $user
     * @param User $following
     */
    public function userFollowingUser(User $user, User $following)
    {
        $notification = new Notification();
        $notification->setOwner($following);
        $notification->setUser($user);
        $notification->setType(Notification::TYPE_USER_FOLLOWER_RECEIVED);

        $this->em->persist($notification);
    }

    /**
     * @param User $user
     * @param User $following
     */
    public function userFollowingUserRemoved(User $user, User $following)
    {
        $notification = $this->em->getRepository('AppBundle\Entity\Communication\Notification')->findOneBy([
            'owner' => $following,
            'user' => $user,
            'type' => Notification::TYPE_USER_FOLLOWER_RECEIVED,
        ]);

        if ($notification) {
            $this->em->remove($notification);
        }
    }

    /**
     * @param Notification $notification
     *
     * @return string
     */
    public function getNotificationText(Notification $notification)
    {
        return $this->messages[$notification->getType()];
    }
}
