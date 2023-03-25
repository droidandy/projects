<?php

namespace AppBundle\Controller\Api\User;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use AppBundle\Entity\User\User;

class UserSettingsController extends Controller
{
    /**
     * @param string $service
     *
     * @return JsonResponse
     */
    public function socialDisconnectAction($service)
    {
        /** @var User $user */
        $user = $this->getUser();
        $user->disconnectFromSocialService($service);

        $this->get('ha.user_manager')->updateUser(
            $user,
            true
        );

        return new JsonResponse();
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function settingsPostAction(Request $request)
    {
        $payload = json_decode($request->getContent(), true);
        $user = $this->getUser();

        $user->setSettings($payload);

        $this->get('ha.user_settings')->validateAndPersistUser(
            $this->getUser(),
            'settings'
        );

        return new JsonResponse();
    }

    /**
     * @param Request $request
     *
     * @return Response
     */
    public function bioPostAction(Request $request)
    {
        $payload = json_decode($request->getContent(), true);
        $user = $this->getUser();

        $user->setName($payload['name']);
        $user->setBio($payload['bio']);

        $this->get('ha.user_settings')->validateAndPersistUser(
            $user,
            'bio'
        );

        return new JsonResponse();
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function changeCurrencyAction(Request $request)
    {
        $payload = json_decode($request->getContent(), true);

        $this->container
            ->get('ha.currency.manager')
            ->setCurrency($payload['currency']);

        return new JsonResponse();
    }
}
