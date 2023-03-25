<?php

namespace AppBundle\Event;

use AppBundle\Import\Normalizer\User\NormalisedUser;
use AppBundle\Entity\User\User;
use Symfony\Component\EventDispatcher\Event;

class UserEvent extends Event
{
    /**
     * @var User
     */
    private $user;
    /**
     * @var NormalisedUser
     */
    private $normalisedUser;

    /**
     * UserEvent constructor.
     *
     * @param User           $user
     * @param NormalisedUser $normalisedUser
     */
    public function __construct(User $user, NormalisedUser $normalisedUser)
    {
        $this->user = $user;
        $this->normalisedUser = $normalisedUser;
    }

    /**
     * @return User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @return NormalisedUser
     */
    public function getNormalisedUser()
    {
        return $this->normalisedUser;
    }
}
