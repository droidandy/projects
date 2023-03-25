<?php

namespace AppBundle\Entity\Domain;

use JMS\Serializer\Annotation as JMS;
use Doctrine\ORM\Mapping as ORM;
use AppBundle\Entity\Traits\IdTrait;

/**
 * @JMS\ExclusionPolicy("all")
 * @ORM\MappedSuperclass
 */
class AbstractStatisticsSummary
{
    use IdTrait;

    /**
     * @var int
     * @JMS\Expose
     * @JMS\Type("integer")
     * @JMS\Groups({"collection","details"})
     */
    protected $item;
    /**
     * @var int
     * @ORM\Column(type="integer")
     * @JMS\Expose
     * @JMS\Type("integer")
     * @JMS\Groups({"collection","details"})
     */
    protected $views = 0;
    /**
     * @var int
     * @ORM\Column(type="integer")
     * @JMS\Expose
     * @JMS\Type("integer")
     * @JMS\Groups({"collection","details"})
     */
    protected $impressions = 0;
    /**
     * @var int
     * @ORM\Column(type="integer")
     * @JMS\Expose
     * @JMS\Type("integer")
     * @JMS\Groups({"collection","details"})
     */
    protected $likes = 0;
    /**
     * @var int
     * @ORM\Column(type="integer")
     * @JMS\Expose
     * @JMS\Type("integer")
     * @JMS\Groups({"collection","details"})
     */
    protected $shares = 0;
    /**
     * @var \DateTime
     * @ORM\Column(type="date")
     * @JMS\Expose
     * @JMS\Type("DateTime")
     * @JMS\Groups({"collection","details"})
     */
    protected $date;

    /**
     * @return int
     */
    public function getViews()
    {
        return $this->views;
    }

    /**
     * @param int $views
     */
    public function setViews($views)
    {
        $this->views = $views;
    }

    /**
     * @return int
     */
    public function getImpressions()
    {
        return $this->impressions;
    }

    /**
     * @param int $impressions
     */
    public function setImpressions($impressions)
    {
        $this->impressions = $impressions;
    }

    /**
     * @param int $likes
     */
    public function setLikes($likes)
    {
        $this->likes = $likes;
    }

    /**
     * @return int
     */
    public function getShares()
    {
        return $this->shares;
    }

    /**
     * @param int $shares
     */
    public function setShares($shares)
    {
        $this->shares = $shares;
    }

    /**
     * @return \DateTime
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * @param \DateTime $date
     */
    public function setDate($date)
    {
        $this->date = $date;
    }

    /**
     * @return int
     */
    public function getItemId()
    {
        return $this->itemId;
    }

    /**
     * @param int $itemId
     */
    public function setItemId($itemId)
    {
        $this->itemId = $itemId;
    }
}
