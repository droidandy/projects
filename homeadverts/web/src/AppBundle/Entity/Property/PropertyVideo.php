<?php

namespace AppBundle\Entity\Property;

use AppBundle\Entity\Traits\IdTrait;
use AppBundle\Entity\Traits\MetadataTrait;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

/**
 * @ORM\Entity
 * @ORM\Table(name="property_video")
 */
class PropertyVideo
{
    const TYPE_YOUTUBE = 'youtube';
    const TYPE_VIMEO = 'vimeo';
    const TYPE_WELCOMEMAT = 'wellcomemat';

    use MetadataTrait;
    use IdTrait;

    /**
     * @ORM\Column(type="string", length=512)
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details"})
     * @JMS\ReadOnly()
     */
    public $url;
    /**
     * @ORM\ManyToOne(targetEntity="Property", inversedBy="videos")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    public $property;
    /**
     * @ORM\Column(type="smallint", options={"unsigned":true})
     */
    public $sort = 0;
    /**
     * @ORM\Column(type="smallint", options={"unsigned":true}, nullable=true)
     */
    public $type;
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

    /**
     * @return int
     */
    public function getType()
    {
        $isWelcomemat = false !== strpos($this->url, 'wellcomemat');
        $isRackcdn = false !== strpos($this->url, 'rackcdn');

        if ($isWelcomemat || $isRackcdn) {
            return self::TYPE_WELCOMEMAT;
        } elseif (false !== strpos($this->url, 'youtube')) {
            return self::TYPE_YOUTUBE;
        }
    }

    /**
     * @return string
     */
    public function getVideoUrl()
    {
        $domain = $this->metadata['video']['http_url'];
        $video = $this->metadata['video'];

        if (isset($video['v720p'])) {
            return $domain.$video['v720p'];
        } elseif (isset($video['v480p'])) {
            return $domain.$video['v480p'];
        } elseif (isset($video['v360p'])) {
            return $domain.$video['v360p'];
        } elseif (isset($video['v270p'])) {
            return $domain.$video['v270p'];
        }

        return $this->url;
    }
}
