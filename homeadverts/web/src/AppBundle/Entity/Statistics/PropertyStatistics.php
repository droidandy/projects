<?php

namespace AppBundle\Entity\Statistics;

use AppBundle\Entity\Domain\AbstractStatisticsDaily;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="ha_statistics_property")
 */
class PropertyStatistics extends AbstractStatisticsDaily
{
}
