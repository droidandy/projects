<?php

namespace AppBundle\Import\Email;

interface EmailsInUseListInterface
{
    public function isInUse(string $email): bool;

    public function addInUse(string $email): void;
}
