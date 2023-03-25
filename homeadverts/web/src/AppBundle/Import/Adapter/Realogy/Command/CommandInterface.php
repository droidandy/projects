<?php

namespace AppBundle\Import\Adapter\Realogy\Command;

interface CommandInterface
{
    const HTTP_METHOD = 'GET';

    public function getPath();

    public function getPathParams();

    public function getQueryParams();
}
