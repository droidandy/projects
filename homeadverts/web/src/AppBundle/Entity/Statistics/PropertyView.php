<?php

namespace AppBundle\Entity\Statistics;

use AppBundle\Entity\Domain\AbstractDisplayEvent;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="ha_statistics_property_view")
 * @ORM\HasLifecycleCallbacks()
 */
class PropertyView extends AbstractDisplayEvent
{
}
