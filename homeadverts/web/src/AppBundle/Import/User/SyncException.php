<?php

namespace AppBundle\Import\User;

use Throwable;

class SyncException extends \Exception
{
    private $messages;

    public function __construct($messages, $message = '', $code = 0, Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);

        $this->messages = $messages;
    }

    public function getMessages()
    {
        return $this->messages;
    }
}
