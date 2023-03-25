<?php

namespace AppBundle\Entity\Property;

use AppBundle\Entity\Traits\IdTrait;
use AppBundle\Entity\Traits\MetadataTrait;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="property_video_3d")
 */
class PropertyVideo3d
{
    use IdTrait;
    use MetadataTrait;

    /**
     * @ORM\ManyToOne(targetEntity="Property", inversedBy="videos3d")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    public $property;

    /**
     * @ORM\Column(type="smallint", options={"unsigned":true})
     */
    public $sort = 0;

    /**
     * // @todo: the field is always empty in db.
     *
     * @ORM\Column(type="smallint", options={"unsigned":true}, nullable=true)
     */
    public $type;

    /**
     * @ORM\Column(type="string", length=512)
     */
    public $url;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    public $reference;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    public $thumbnailUrl;

    /**
     * @ORM\Column(type="smallint", options={"unsigned":true}, nullable=true)
     */
    public $width;

    /**
     * @ORM\Column(type="smallint", options={"unsigned":true}, nullable=true)
     */
    public $height;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    public $caption;
}
