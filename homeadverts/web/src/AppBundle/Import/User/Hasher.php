<?php

namespace AppBundle\Import\User;

class Hasher
{
    public function hash($hashable)
    {
        return sha1($hashable->getValueToHash());
    }
}
