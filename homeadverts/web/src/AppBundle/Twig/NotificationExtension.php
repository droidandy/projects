<?php

namespace AppBundle\Twig;

use Twig_Extension;
use AppBundle\Entity\User\User;
use AppBundle\Entity\Communication\NotificationRepository;
use AppBundle\Entity\Communication\Notification;
use AppBundle\Service\Notificator;
use AppBundle\Service\PropertyService;

class NotificationExtension extends Twig_Extension
{
    /**
     * @var Notificator
     */
    protected $notificator;
    /**
     * @var NotificationRepository
     */
    protected $notificationRepository;

    /**
     * @param PropertyService $notificator
     * @param array           $notifications
     */
    public function __construct(
        Notificator $notificator,
        NotificationRepository $notificationRepository
    ) {
        $this->notificator = $notificator;
        $this->notificationRepository = $notificationRepository;
    }

    /**
     * @return array
     */
    public function getFilters()
    {
        return array(
            new \Twig_SimpleFilter('notification_text', array($this, 'notificationText')),
            new \Twig_SimpleFilter('notification_unread_qty', array($this, 'getNotificationUnreadQty')),
        );
    }

    /**
     * @param Notification $notification
     *
     * @return string
     */
    public function notificationText(Notification $notification)
    {
        return $this->notificator->getNotificationText($notification);
    }

    /**
     * @param User $user
     *
     * @return int
     */
    public function getNotificationUnreadQty(User $user)
    {
        return $this->notificationRepository->getNotificationUnreadQty($user);
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'notification_extension';
    }
}
