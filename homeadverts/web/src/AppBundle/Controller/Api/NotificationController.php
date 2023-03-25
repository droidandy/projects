<?php

namespace AppBundle\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use DateTime;

class NotificationController extends Controller
{
    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function readAllAction(Request $request)
    {
        $payload = json_decode($request->getContent(), true);
        $readAt = new DateTime();
        $readAt->setTimestamp($payload['timestamp']);

        $this
            ->get('notification_repo')
            ->markNotificationsAsRead(
                $this->getUser(),
                $readAt
            );

        return new JsonResponse();
    }
}
