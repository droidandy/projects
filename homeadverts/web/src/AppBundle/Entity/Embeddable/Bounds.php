<?php

namespace AppBundle\Entity\Embeddable;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Embeddable
 */
class Bounds
{
    /**
     * This field is unused but prevents a current doctrine bug where
     * embeddables don't rehydrate properly if they only contain embeddables
     * themselves.
     *
     * @ORM\Column(type="string", length=1, nullable=true)
     */
    protected $ignore;

    /**
     * @ORM\Embedded(class="Coords")
     */
    protected $northeast;

    /**
     * @ORM\Embedded(class="Coords")
     */
    protected $southwest;

    /**
     * Constructor.
     *
     * @param Coords $northeast
     * @param Coords $southwest
     */
    public function __construct(Coords $northeast, Coords $southwest)
    {
        $this->northeast = $northeast;
        $this->southwest = $southwest;
    }

    public function getNortheast()
    {
        return $this->northeast;
    }

    public function getSouthwest()
    {
        return $this->southwest;
    }

    public function __toString()
    {
        return '['.$this->northeast.'], ['.$this->southwest.']';
    }
}
