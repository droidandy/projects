<?php

namespace AppBundle\Controller\User;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Form\FormView;
use Symfony\Component\Form\FormInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\Form;
use AppBundle\Entity\User\User;

class ProfileSettingsController extends Controller
{
    /**
     * @param Request $request
     *
     * @return RedirectResponse|Response
     */
    public function editAction(Request $request)
    {
        /** @var User $user */
        $user = $this->getUser();
        $type = $request->query->get('type');
        $redirect = $request->query->get('redirect');
        $form = null;

        if ($type) {
            $form = $this->createForm($type, $user);
            $form->handleRequest($request);

            if ($form->isValid() && $form->isSubmitted()) {
                $callback = str_replace('_', '', lcfirst(ucwords($type, '_'))).'Callback';
                $message = $this->get('ha.user_settings')->$callback(
                    $form,
                    $user
                );

                $em = $this->get('em');
                $em->persist($user);
                $em->flush($user);

                if ($message) {
                    $this->addFlash('success', $this->get('translator')->trans($message));
                }
                if ($redirect) {
                    return new RedirectResponse($redirect);
                }
            }
        }

        return $this->render('AppBundle::user/settings.html.twig', [
            'form_password' => $this->getFormView($form, 'fos_user_change_password'),
            'form_enquiries' => $this->getFormView($form, 'account_settings_enquiries'),
            'form_contact' => $this->getFormView($form, 'account_profile_contact_agent'),
            'form_account_removal' => $this->getFormView($form, 'terminate_account'),
        ]);
    }

    /**
     * @param Request $request
     *
     * @return RedirectResponse|Response
     */
    public function profileImagePostAction(Request $request)
    {
        $user = $this->getUser();
        $form = $this->createForm('profile_image', $user);
        $form->handleRequest($request);

        if ($form->isValid() && $form->isSubmitted()) {
            $this->get('ha.user_manager')->replaceImage(
                $user,
                $form->get(User::IMAGE_PROFILE_MANUAL)->getViewData(),
                User::IMAGE_PROFILE_MANUAL
            );

            $em = $this->get('em');
            $em->persist($user);
            $em->flush($user);

            return new JsonResponse(
                $this->get('ha.image_helper')->userProfileImage($user)
            );
        }

        return new JsonResponse(
            $this->getErrorMessages($form),
            Response::HTTP_BAD_REQUEST
        );
    }

    /**
     * @param Request $request
     *
     * @return RedirectResponse|Response
     */
    public function backgroundImagePostAction(Request $request)
    {
        /** @var User $user */
        $user = $this->getUser();
        $form = $this->createForm('background_image', $user);
        $form->handleRequest($request);

        if ($form->isValid() && $form->isSubmitted()) {
            $this->get('ha.user_manager')->replaceImage(
                $user,
                $form->get(User::IMAGE_BACKGROUND)->getViewData(),
                User::IMAGE_BACKGROUND
            );

            $em = $this->get('em');
            $em->persist($user);
            $em->flush($user);

            return new JsonResponse(
                $this->get('ha.image_helper')->userBackgroundImage($user)
            );
        }

        return new JsonResponse(
            $this->getErrorMessages($form),
            Response::HTTP_BAD_REQUEST
        );
    }

    /**
     * @param FormInterface|null $form
     * @param string             $formType
     *
     * @return FormView
     */
    private function getFormView($form, $formType)
    {
        if ($form && ($form->getName() == $formType)) {
            return $form->createView();
        }

        return $this->createForm(
            $formType,
            $this->getUser()
        )->createView();
    }

    /**
     * @param Form $form
     *
     * @return array
     */
    public function getErrorMessages(Form $form)
    {
        $errors = array();
        foreach ($form->getErrors(true, true) as $error) {
            $errors[] = $error->getMessage();
        }

        return $errors;
    }
}
