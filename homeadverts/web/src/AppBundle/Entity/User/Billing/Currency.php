<?php

namespace AppBundle\Entity\User\Billing;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="currency")
 */
class Currency
{
    /**
     * @ORM\Id
     * @ORM\Column(type="string", length=3)
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $name;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $symbol;

    /**
     * @ORM\Column(type="string", length=2, name="decimal_seperator")
     */
    protected $decimalSeperator;

    /**
     * @ORM\Column(type="string", length=2, name="thousands_seperator")
     */
    protected $thousandsSeperator;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    protected $rate;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    protected $display;
}
