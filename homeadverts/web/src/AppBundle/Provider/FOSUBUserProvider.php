<?php

namespace AppBundle\Provider;

use HWI\Bundle\OAuthBundle\OAuth\Response\UserResponseInterface;
use HWI\Bundle\OAuthBundle\Security\Core\User\FOSUBUserProvider as BaseFOSUBUserProvider;
use Symfony\Component\Security\Core\User\UserInterface;
use AppBundle\Entity\User\User;
use AppBundle\Service\User\UserManager;

class FOSUBUserProvider extends BaseFOSUBUserProvider
{
    /**
     * @var UserManager
     */
    protected $userManager;

    /**
     * @param UserManager $userManager
     * @param array       $properties
     */
    public function __construct(UserManager $userManager, array $properties)
    {
        parent::__construct($userManager, $properties);
    }

    /**
     * @param UserInterface         $user
     * @param UserResponseInterface $response
     *
     * @return UserInterface $user
     */
    public function connect(UserInterface $user, UserResponseInterface $response)
    {
        /** @var User $user */
        /** @var User $previousUser */
        $previousUser = $this->userManager->findUserByOauthResponse($response);
        $networkName = $response->getResourceOwner()->getName();

        if ($previousUser) {
            $previousUser->unsetTokenData($response);
            $this->userManager->updateUser($previousUser);
        }

        // We connect current user
        $user->setTokenData($response);
        // Set Autoshare ON
        $user->setAutoshare(
            $networkName,
            true
        );
        $this->userManager->updateUser($user);

        return $user;
    }

    /**
     * @param UserResponseInterface $response
     *
     * @return UserInterface|User
     */
    public function loadUserByOAuthUserResponse(UserResponseInterface $response)
    {
        /** @var User $user */
        /** @var User $previousUser */
        $user = $this->userManager->findUserByOauthResponse($response);

        if (null === $user) {
            // Make sure this user does not exist by email
            $user = $this->userManager->findUserByThroughEnabled($response->getEmail());

            if ($user) {
                $user = $this->connect($user, $response);
            } else {
                $user = $this->userManager->createUser();
                $user->setTokenData($response);
                $user->setUsername($response->getUsername());
                $user->setEmail($response->getEmail());
                $user->setName($response->getRealname());
                $user->setPassword('');
                $user->setEnabled(true);
            }

            $this->userManager->replaceImageFromPath(
                $user,
                $response->getProfilePicture(),
                User::IMAGE_PROFILE
            );

            $this->userManager->updateUser($user);

            return $user;
        }

        //update access token
        $user->setTokenData($response);
        $this->userManager->updateUser($user);

        return $user;
    }
}
