<?php

namespace AppBundle\Entity\Social;

use AppBundle\Entity\Domain\AbstractLike;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

/**
 * @ORM\Entity
 * @ORM\AssociationOverrides({
 *      @ORM\AssociationOverride(name="liked",
 *          joinColumns=@ORM\JoinColumn(name="article_id", referencedColumnName="id", nullable=true, onDelete="CASCADE")
 *      )
 * })
 * @JMS\ExclusionPolicy("all")
 */
class ArticleLike extends AbstractLike
{
    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Social\Article", inversedBy="likes")
     */
    protected $liked;
}
