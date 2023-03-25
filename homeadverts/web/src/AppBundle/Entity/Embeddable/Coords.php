<?php

namespace AppBundle\Entity\Embeddable;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Embeddable
 */
class Coords
{
    /**
     * @ORM\Column(type="float", nullable=true)
     */
    protected $latitude;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    protected $longitude;

    /**
     * Constructor.
     *
     * @param float $latitude
     * @param float $longitude
     */
    public function __construct($latitude = null, $longitude = null)
    {
        $this->latitude = !is_null($latitude) ? (float) $latitude : null;
        $this->longitude = !is_null($longitude) ? (float) $longitude : null;
    }

    public function getLatitude()
    {
        return $this->latitude;
    }

    public function getLongitude()
    {
        return $this->longitude;
    }

    public function __toString()
    {
        return $this->latitude.','.$this->longitude;
    }
}
