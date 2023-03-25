<?php

namespace AppBundle\Controller\User;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use HWI\Bundle\OAuthBundle\Controller\ConnectController;
use HWI\Bundle\OAuthBundle\Security\Core\Authentication\Token\OAuthToken;

class OauthController extends ConnectController
{
    /**
     * @return Response
     */
    public function completeAction()
    {
        return $this->redirect('/');
    }

    /**
     * @return Response
     */
    public function failureAction()
    {
        return $this->redirect('/');
    }

    // Overriding the original route to force users be redirect to the index page, always!
    // The original route and its settings is wat toooo complicated
    // More at HWI\Bundle\OAuthBundle\Controller\ConnectController:: redirectToServiceAction
    /**
     * @param Request $request
     * @param string  $service
     *
     * @return RedirectResponse
     */
    public function redirectToServiceAction(Request $request, $service)
    {
        $authorizationUrl = $this->container->get('hwi_oauth.security.oauth_utils')->getAuthorizationUrl($request, $service);

        // Check for a return path and store it before redirect
        if ($request->hasSession()) {
            // initialize the session for preventing SessionUnavailableException
            $session = $request->getSession();
            $session->start();

            foreach ($this->container->getParameter('hwi_oauth.firewall_names') as $providerKey) {
                $sessionKey = '_security.'.$providerKey.'.target_path';

                $session->set($sessionKey, $this->get('router')->generate('ha_homepage'));
            }
        }

        return $this->redirect($authorizationUrl);
    }

    /**
     * {@inheritdoc}
     *
     * @param Request $request the active request
     * @param string  $service name of the resource owner to connect to
     *
     * @throws \Exception
     *
     * @return Response
     *
     * @throws NotFoundHttpException if `connect` functionality was not enabled
     * @throws AccessDeniedException if no user is authenticated
     */
    public function connectServiceAction(Request $request, $service)
    {
        $connect = $this->container->getParameter('hwi_oauth.connect');
        if (!$connect) {
            throw new NotFoundHttpException();
        }

        // Get the data from the resource owner
        $resourceOwner = $this->getResourceOwnerByName($service);
        $session = $request->getSession();
        $key = $request->query->get('key', time());

        if ($resourceOwner->handles($request)) {
            $accessToken = $resourceOwner->getAccessToken(
                $request,
                $this->container->get('hwi_oauth.security.oauth_utils')->getServiceAuthUrl($request, $resourceOwner)
            );

            // save in session
            $session->set('_hwi_oauth.connect_confirmation.'.$key, $accessToken);
        } else {
            $accessToken = $session->get('_hwi_oauth.connect_confirmation.'.$key);
        }

        $userInformation = $resourceOwner->getUserInformation($accessToken);

        /** @var $currentToken OAuthToken */
        $currentToken = $this->getToken();
        $currentUser = $currentToken->getUser();

        $this->container->get('hwi_oauth.account.connector')->connect($currentUser, $userInformation);

        if ($currentToken instanceof OAuthToken) {
            // Update user token with new details
            $this->authenticateUser($request, $currentUser, $service, $currentToken->getRawToken(), false);
        }

        $this->addFlash(
            'success',
            'Connected with your user on '.ucfirst($service)
        );

        return $this->redirectToRoute('ha_account_settings');
    }
}
