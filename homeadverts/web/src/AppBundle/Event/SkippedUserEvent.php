<?php

namespace AppBundle\Event;

use AppBundle\Import\Normalizer\User\NormalisedUser;
use AppBundle\Entity\User\User;

class SkippedUserEvent extends UserEvent
{
    private $msg;

    public function __construct(User $user, NormalisedUser $normalisedUser, $msg = null)
    {
        parent::__construct($user, $normalisedUser);
        $this->msg = $msg;
    }

    public function getMsg()
    {
        return $this->msg;
    }
}
