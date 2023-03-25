<?php

namespace AppBundle\Entity\Property;

use AppBundle\Entity\Traits\IdTrait;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

/**
 * @ORM\Entity
 * @ORM\Table(name="property_photo")
 */
class PropertyPhoto
{
    use IdTrait;

    /**
     * @ORM\ManyToOne(targetEntity="Property", inversedBy="photos")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    public $property;

    /**
     * @ORM\Column(type="smallint", options={"unsigned":true})
     */
    public $sort = 0;

    /**
     * @ORM\Column(type="string", length=512)
     * @JMS\Type("string")
     * @JMS\Expose
     * @JMS\ReadOnly
     * @JMS\Groups({"collection","details","message"})
     */
    public $url;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    public $sourceUrl;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    public $modified;

    /**
     * @ORM\Column(type="smallint", options={"unsigned":true}, nullable=true)
     */
    public $width;

    /**
     * @ORM\Column(type="smallint", options={"unsigned":true}, nullable=true)
     */
    public $height;

    /**
     * @ORM\Column(type="string", length=32, nullable=true)
     */
    public $hash;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return Property
     */
    public function getProperty()
    {
        return $this->property;
    }

    /**
     * @param Property $property
     *
     * @return self
     */
    public function setProperty(Property $property = null)
    {
        $this->property = $property;

        return $this;
    }

    /**
     * @return int
     */
    public function getSort()
    {
        return $this->sort;
    }

    /**
     * @param int $sort
     *
     * @return self
     */
    public function setSort($sort)
    {
        $this->sort = $sort;

        return $this;
    }

    /**
     * @return string
     */
    public function getUrl()
    {
        return $this->url;
    }

    /**
     * @param string $url
     *
     * @return self
     */
    public function setUrl($url)
    {
        $this->url = $url;

        return $this;
    }

    /**
     * @return string
     */
    public function getSourceUrl()
    {
        return $this->sourceUrl;
    }

    /**
     * @param string $sourceUrl
     *
     * @return self
     */
    public function setSourceUrl($sourceUrl)
    {
        $this->sourceUrl = $sourceUrl;

        return $this;
    }

    /**
     * @return string
     */
    public function getModified()
    {
        return $this->modified;
    }

    /**
     * @param string $modified
     *
     * @return self
     */
    public function setModified($modified)
    {
        $this->modified = $modified;

        return $this;
    }

    /**
     * Set the hash and image size based on a file.
     *
     * @param string $file
     *
     * @return self
     */
    public function setFile($file)
    {
        if (file_exists($file) && is_file($file)) {
            list($this->width, $this->height) = getimagesize($file);
            $this->hash = md5_file($file);
        }

        return $this;
    }

    /**
     * @return int
     */
    public function getWidth()
    {
        return $this->width;
    }

    /**
     * @return int
     */
    public function getHeight()
    {
        return $this->height;
    }

    /**
     * @return mixed
     */
    public function getHash()
    {
        return $this->hash;
    }

    /**
     * @param mixed $hash
     */
    public function setHash($hash)
    {
        $this->hash = $hash;
    }
}
