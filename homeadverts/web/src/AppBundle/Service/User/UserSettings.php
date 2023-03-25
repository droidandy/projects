<?php

namespace AppBundle\Service\User;

use Doctrine\ORM\EntityManager;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Form\FormInterface;
use AppBundle\Exception\InvalidDataException;
use AppBundle\Entity\User\User;

class UserSettings
{
    const SOCIAL_GOOGLE_URL = 'https://plus.google.com/';
    const SOCIAL_TWITTER_URL = 'https://twitter.com/';
    /**
     * @var EntityManager
     */
    private $em;

    /**
     * @var UserManager
     */
    private $userManager;

    /**
     * @var ValidatorInterface
     */
    private $validator;

    /**
     * @param UserManager        $userManager
     * @param EntityManager      $entityManager
     * @param ValidatorInterface $validator
     */
    public function __construct(
        UserManager $userManager,
        EntityManager $entityManager,
        ValidatorInterface $validator
    ) {
        $this->em = $entityManager;
        $this->userManager = $userManager;
        $this->validator = $validator;
    }

    /**
     * @param User   $user
     * @param string $constrains
     *
     * @throws InvalidDataException
     */
    public function validateAndPersistUser(User $user, $constrains)
    {
        $violations = $this->validator->validate($user, $constrains);

        if ($violations->count()) {
            throw new InvalidDataException($violations);
        }

        $this->em->persist($user);
        $this->em->flush($user);
    }

    /**
     * @param FormInterface $form
     * @param User          $user
     *
     * @return string
     */
    public function accountProfileContactCallback(FormInterface $form, User $user)
    {
        return 'account.profile.contact.success';
    }

    /**
     * @param FormInterface $form
     * @param User          $user
     *
     * @return string
     */
    public function accountProfileContactAgentCallback(FormInterface $form, User $user)
    {
        return 'account.profile.contact.success';
    }

    /**
     * @param FormInterface $form
     * @param User          $user
     *
     * @return string
     */
    public function accountSettingsEnquiriesCallback(FormInterface $form, User $user)
    {
        return 'account.settings.enquiries.success';
    }

    /**
     * @param FormInterface $form
     * @param User          $user
     *
     * @return string
     */
    public function profileImageCallback(FormInterface $form, User $user)
    {
        $this->userManager->replaceImage(
            $user,
            $form->get(User::IMAGE_PROFILE_MANUAL)->getViewData(),
            User::IMAGE_PROFILE_MANUAL
        );

        return 'Profile image has been changed';
    }

    /**
     * @param FormInterface $form
     * @param User          $user
     *
     * @return string
     */
    public function backgroundImageCallback(FormInterface $form, User $user)
    {
        $this->userManager->replaceImage(
            $user,
            $form->get(User::IMAGE_BACKGROUND)->getViewData(),
            User::IMAGE_BACKGROUND
        );

        return 'Background image has been changed';
    }

    /**
     * @param FormInterface $form
     * @param User          $user
     *
     * @return string
     */
    public function terminateAccountCallback(FormInterface $form, User $user)
    {
        $this->userManager->softDeleteUser($user);
        $this->userManager->logoutCurrentUser();
    }

    /**
     * @param FormInterface $form
     * @param User          $user
     *
     * @return string
     */
    public function fosUserChangePasswordCallback(FormInterface $form, User $user)
    {
        $this->userManager->updateUser($user);

        return 'account.settings.password.success';
    }
}
