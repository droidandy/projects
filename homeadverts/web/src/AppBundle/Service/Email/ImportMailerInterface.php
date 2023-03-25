<?php

namespace AppBundle\Service\Email;

use AppBundle\Import\Queue\ImportContext;

interface ImportMailerInterface
{
    /**
     * @param array $summary
     */
    public function send($summary, ImportContext $importContext);
}
