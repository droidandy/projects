<?php

namespace AppBundle\Service\Lock;

class LockValueGenerator
{
    public function getUniqueValue(): string
    {
        return uniqid('lock', true);
    }
}
