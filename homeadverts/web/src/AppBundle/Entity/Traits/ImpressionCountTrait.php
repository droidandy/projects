<?php

namespace AppBundle\Entity\Traits;

use Doctrine\ORM\Mapping as ORM;

trait ImpressionCountTrait
{
    /**
     * @var int
     * @ORM\Column(type="integer")
     */
    protected $impressionCount = 0;

    /**
     * @return int
     */
    public function getImpressionCount()
    {
        return $this->impressionCount;
    }

    /**
     * @param int $impressionCount
     */
    public function setImpressionCount($impressionCount)
    {
        $this->impressionCount = $impressionCount;
    }
}
