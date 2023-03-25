<?php

namespace AppBundle\Controller\User;

use AppBundle\Entity\User\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use AppBundle\Form\TerminateAccountFormType;

class UserController extends Controller
{
    /**
     * @param Request $request
     * @param string  $token
     *
     * @return RedirectResponse|Response
     */
    public function terminateByTokenAction(Request $request, $token)
    {
        $userManager = $this->get('ha.user_manager');
        $token = $userManager->getAccessToken($token, 'removal');

        if (!$token) {
            throw new AccessDeniedHttpException();
        }

        $form = $this->createForm(new TerminateAccountFormType());
        $form->handleRequest($request);

        if ($form->isValid()) {
            $this->get('ha.mailer')->sendAccountTerminateEmail($token->getUser());
            $userManager->setAccessTokenConsumed($token);
            $userManager->softDeleteUser($token->getUser());
            $userManager->logoutCurrentUser();

            return new RedirectResponse(
                $this->get('router')->generate('ha_homepage')
            );
        }

        return $this->render('AppBundle:user/security:terminate_account.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}
