<?php

namespace AppBundle\Entity\Traits;

use Doctrine\ORM\Mapping as ORM;

trait ShareCountTrait
{
    /**
     * @var int
     * @ORM\Column(type="integer")
     */
    protected $shareCount = 0;

    /**
     * @return int
     */
    public function getShareCount()
    {
        return $this->shareCount;
    }

    /**
     * @param int $shareCount
     */
    public function setShareCount($shareCount)
    {
        $this->shareCount = $shareCount;
    }
}
