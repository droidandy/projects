<?php

namespace AppBundle\Entity\Property;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="property_description")
 */
class PropertyDescription
{
    /**
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="Property", inversedBy="descriptions")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    public $property;
    /**
     * @ORM\Id
     * @ORM\Column(type="string", length=50)
     */
    public $locale = 'en';
    /**
     * @ORM\Column(type="text")
     */
    public $description;

    /**
     * @return mixed
     */
    public function getProperty()
    {
        return $this->property;
    }

    /**
     * @param mixed $property
     *
     * @return self
     */
    public function setProperty(Property $property)
    {
        $this->property = $property;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getLocale()
    {
        return $this->locale;
    }

    /**
     * @return mixed
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param mixed $description
     *
     * @return self
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }
}
