<?php

namespace AppBundle\Entity\Traits;

use DateTime;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

trait UpdatedAtTrait
{
    /**
     * @var DateTime
     * @JMS\Expose
     * @JMS\Type("DateTime")
     * @JMS\Groups({"details"})
     * @ORM\Column(type="datetime")
     */
    protected $updatedAt;

    /**
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    /**
     * @param \DateTime $updatedAt
     */
    public function setUpdatedAt(DateTime $updatedAt)
    {
        $this->updatedAt = $updatedAt;
    }

    /**
     * @ORM\PrePersist
     * @ORM\PreUpdate
     */
    public function setUpdatedAtNow()
    {
        $this->updatedAt = new DateTime();
    }
}
