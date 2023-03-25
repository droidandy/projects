<?php

namespace AppBundle\Entity\Statistics;

use AppBundle\Entity\Domain\AbstractDisplayEvent;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="ha_statistics_article_impression")
 * @ORM\HasLifecycleCallbacks()
 */
class ArticleImpression extends AbstractDisplayEvent
{
}
