<?php

namespace AppBundle\Controller\Api\User;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Pusher\PusherException;

class PusherController extends Controller
{
    /**
     * Implementation of <a href="http://pusher.com/docs/authenticating_users">authenticating_users</a>
     * and <a href="http://pusher.com/docs/auth_signatures">authenticating_users</a>.
     *
     * Supported channels: Private channel="presence-user-{userId}"
     *
     * @param Request $request
     *
     * @return Response
     */
    public function authPresenceAction(Request $request): Response
    {
        $signature = $this
            ->container
            ->get('app.pusher')
            ->authorizeUser(
                $this->getUser(),
                $request->get('channel_name'),
                $request->get('socket_id')
            );

        $response = new Response();
        $response->setContent($signature);

        return $response;
    }

    /**
     * @param Request $request
     *
     * @throws PusherException
     *
     * @return Response
     */
    public function authOnlineAction(Request $request): Response
    {
        $user = $this->getUser();
        $signature = $this
            ->container
            ->get('app.pusher')
            ->authorizeOnline(
                $user,
                $request->get('socket_id')
            );

        $this->get('ha.user_manager')->setLastSeenNow($user);

        $response = new Response();
        $response->setContent($signature);

        return $response;
    }
}
