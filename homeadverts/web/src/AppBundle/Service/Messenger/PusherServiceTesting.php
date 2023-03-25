<?php

namespace AppBundle\Service\Messenger;

class PusherServiceTesting extends PusherService
{
    /**
     * @var array
     */
    public static $message = [];

    /**
     * @return array
     */
    public function getMessage()
    {
        return self::$message;
    }

    /**
     * @param string $channel
     * @param string $event
     * @param array  $message
     * @param null   $socketId
     */
    public function sendMessage(
        string $channel,
        string $event,
        array $message
    ) {
        self::$message[] = array(
            'channel' => $channel,
            'event' => $event,
            'payload' => $message,
        );

        return true;
    }
}
