<?php

namespace AppBundle\Entity\Property;

use AppBundle\Entity\Domain\AbstractLike;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

/**
 * @ORM\Entity
 * @ORM\AssociationOverrides({
 *      @ORM\AssociationOverride(name="liked",
 *          joinColumns=@ORM\JoinColumn(name="property_id", referencedColumnName="id", nullable=true, onDelete="CASCADE")
 *      )
 * })
 * @JMS\ExclusionPolicy("all")
 */
class PropertyLike extends AbstractLike
{
    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Property\Property", inversedBy="likes")
     */
    protected $liked;
}
