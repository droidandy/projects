<?php

namespace AppBundle\Controller\Api\User;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class BillingController extends Controller
{
    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function cardUpdateAction(Request $request)
    {
        $user = $this->getUser();
        $payload = json_decode($request->getContent(), true);
        $cc = [
            'billingAddress' => [
                'countryCodeAlpha2' => $payload['countryCodeAlpha2'],
                'postalCode' => $payload['postalCode'],
            ],
            'cardholderName' => $payload['cardholderName'],
            'number' => $payload['number'],
            'cvv' => $payload['cvv'],
            'expirationMonth' => $payload['expirationMonth'],
            'expirationYear' => $payload['expirationYear'],
        ];

        $this->get('ha_billing')->processCard($user, $cc);
        $this->get('em')->flush();

        return new JsonResponse();
    }

    /**
     * @return JsonResponse
     */
    public function userDowngradeAction()
    {
        $user = $this->getUser();
        $this->get('ha_billing')->demoteRole($user);

        $this->get('em')->persist($user);
        $this->get('em')->flush($user);

        return new JsonResponse();
    }
}
