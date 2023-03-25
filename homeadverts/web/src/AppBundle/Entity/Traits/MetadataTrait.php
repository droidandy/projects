<?php

namespace AppBundle\Entity\Traits;

use Doctrine\ORM\Mapping as ORM;

trait MetadataTrait
{
    /**
     * @var array
     * @ORM\Column(type="array", nullable=true)
     */
    public $metadata;

    /**
     * @return array
     */
    public function getMetadata()
    {
        return $this->metadata;
    }

    /**
     * @param array $metadata
     */
    public function setMetadata(array $metadata = null)
    {
        $this->metadata = $metadata;
    }

    /**
     * @param string $key
     *
     * @return mixed
     */
    public function getMetaValue($key)
    {
        if (isset($this->metadata[$key])) {
            return $this->metadata[$key];
        }
    }

    /**
     * @param string $key
     * @param mixed  $value
     */
    public function setMetaValue($key, $value)
    {
        $this->metadata[$key] = $value;
    }
}
