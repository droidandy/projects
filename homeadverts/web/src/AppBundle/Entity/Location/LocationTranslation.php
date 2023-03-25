<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="location_translation")
 */
class LocationTranslation
{
    /**
     * @ORM\Id
     * @ORM\Column(type="string", length=2, options={"fixed":true})
     */
    protected $country;

    /**
     * @ORM\Id
     * @ORM\Column(type="string", length=5)
     */
    protected $locale;

    /**
     * @ORM\Id
     * @ORM\Column(type="string")
     */
    protected $code;

    /**
     * @ORM\Id
     * @ORM\Column(type="string")
     */
    protected $type;

    /**
     * @ORM\Column(type="string")
     */
    protected $translation;
}
