<?php

namespace AppBundle\Event\Listener;

use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use AppBundle\Entity\Property\PropertyDescription;
use HTMLPurifier;

class DescriptionSaveListener
{
    protected $purifier;

    public function __construct(HTMLPurifier $purifier)
    {
        $this->purifier = $purifier;
    }

    public function prePersist(LifecycleEventArgs $event)
    {
        $entity = $event->getEntity();

        if ($entity instanceof PropertyDescription) {
            $this->cleanDescription($entity);
        }
    }

    public function preUpdate(PreUpdateEventArgs $event)
    {
        $entity = $event->getEntity();

        if ($entity instanceof PropertyDescription) {
            $this->cleanDescription($entity);
            $event->setNewValue('description', $entity->description);
        }
    }

    protected function cleanDescription(PropertyDescription $desc)
    {
        $desc->description = $this->purifier->purify($desc->description);
    }
}
