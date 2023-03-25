<?php

namespace AppBundle\Import\Job;

/**
 * An interface for Jobs in php-resque.
 */
interface ResqueJobInterface
{
    public function perform();
}
