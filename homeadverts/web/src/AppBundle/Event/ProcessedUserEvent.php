<?php

namespace AppBundle\Event;

use AppBundle\Import\Normalizer\User\NormalisedUser;
use AppBundle\Entity\User\User;

class ProcessedUserEvent extends UserEvent
{
    private $errors;

    public function __construct(User $user, NormalisedUser $normalisedUser, $errors = [])
    {
        parent::__construct($user, $normalisedUser);
        $this->errors = $errors;
    }

    /**
     * @return array
     */
    public function getErrors()
    {
        return $this->errors;
    }
}
