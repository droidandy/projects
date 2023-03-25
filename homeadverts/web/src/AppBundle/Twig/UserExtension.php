<?php

namespace AppBundle\Twig;

use Twig_Extension;
use AppBundle\Entity\User\User;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class UserExtension extends Twig_Extension
{
    /**
     * @var TokenStorageInterface
     */
    private $tokenStorage;

    /**
     * @param TokenStorageInterface $tokenStorage
     */
    public function __construct(TokenStorageInterface $tokenStorage)
    {
        $this->tokenStorage = $tokenStorage;
    }

    /**
     * {@inheritdoc}
     */
    public function getFunctions()
    {
        return array(
            'is_current_user' => new \Twig_Function_Method($this, 'isCurrentUser'),
        );
    }

    /**
     * @param User $user
     *
     * @return bool
     */
    public function isCurrentUser(User $user)
    {
        return $this->tokenStorage->getToken()->getUser() === $user;
    }

    /**
     * The extension name.
     *
     * @return string
     */
    public function getName()
    {
        return 'user_extension';
    }
}
