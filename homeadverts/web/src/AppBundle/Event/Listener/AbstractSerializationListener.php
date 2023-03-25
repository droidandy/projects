<?php

namespace AppBundle\Event\Listener;

use JMS\Serializer\EventDispatcher\EventSubscriberInterface;
use JMS\Serializer\EventDispatcher\ObjectEvent;

class AbstractSerializationListener implements EventSubscriberInterface
{
    public static function getSubscribedEvents()
    {
        return [
            array('event' => 'serializer.post_serialize', 'method' => 'onPostSerialize'),
        ];
    }

    /**
     * @param ObjectEvent $event
     *
     * @return bool
     */
    protected function doInjectionsFull(ObjectEvent $event): bool
    {
        $context = $event->getContext();

        if ($context->hasAttribute('groups')) {
            if (
                (in_array('message', $context->getAttribute('groups'))) ||
                (in_array('room', $context->getAttribute('groups')))
            ) {
                return false;
            }
        }

        return true;
    }
}
