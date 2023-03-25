<?php

namespace AppBundle\Entity\Traits;

use DateTime;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

trait CreatedAtTrait
{
    /**
     * @var DateTime
     * @ORM\Column(type="datetime")
     * @JMS\Expose
     * @JMS\Type("DateTime")
     * @JMS\Groups({"details"})
     */
    protected $createdAt;

    /**
     * @JMS\Type("int")
     * @JMS\Expose
     * @JMS\Groups({"collection","details","message","room"})
     * @JMS\VirtualProperty()
     * @JMS\SerializedName("timestamp")
     */
    public function getTimestamp()
    {
        return sprintf('%s%s', $this->createdAt->getTimestamp(), '000');
    }

    /**
     * @JMS\Type("string")
     * @JMS\VirtualProperty()
     * @JMS\SerializedName("createdAtFormatted")
     *
     * @return string
     */
    public function getCreatedAtFormatted()
    {
        return $this->createdAt->format('d M Y @H:i');
    }

    /**
     * @return DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * @param \DateTime $createdAt
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;
    }

    /**
     * @ORM\PrePersist
     */
    public function setCreatedAtNow()
    {
        if (!$this->createdAt) {
            $this->createdAt = new DateTime();
        }
    }
}
