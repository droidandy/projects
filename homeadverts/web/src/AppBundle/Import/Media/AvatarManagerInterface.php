<?php

namespace AppBundle\Import\Media;

use AppBundle\Entity\User\User;

interface AvatarManagerInterface
{
    public function process(User $user);
}
