<?php

namespace AppBundle\Import\User;

use AppBundle\Import\Normalizer\User\NormalisedUser;

interface UserReceiverInterface
{
    /**
     * @param NormalisedUser[] $users
     *
     * @return mixed
     */
    public function receive(array $users = []);
}
