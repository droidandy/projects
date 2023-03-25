<?php

namespace AppBundle\Entity\Embeddable;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Embeddable
 */
class Status
{
    public const MODE_UNDEFINED = null;
    public const MODE_ON = 1;
    public const MODE_DONE = 2;
    public const MODE_FAILED = 3;
    public const MODE_DENIED = 4;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $mode;
    /**
     * @ORM\Column(name="started_at", type="datetime", nullable=true)
     */
    private $startedAt;
    /**
     * @ORM\Column(name="finished_at", type="datetime", nullable=true)
     */
    private $finishedAt;
    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $error;

    /**
     * @return int|null
     */
    public function getMode()
    {
        return $this->mode;
    }

    /**
     * @return \DateTime|null
     */
    public function getStartedAt()
    {
        return $this->startedAt;
    }

    /**
     * @return \DateTime|null
     */
    public function getFinishedAt()
    {
        return $this->finishedAt;
    }

    /**
     * @return mixed
     */
    public function getError()
    {
        return $this->error;
    }

    public function setOn()
    {
        $this->mode = self::MODE_ON;
        $this->startedAt = new \DateTime();
    }

    public function setDone()
    {
        $this->mode = self::MODE_DONE;
        $this->finishedAt = new \DateTime();
    }

    /**
     * @param string $error
     */
    public function setFailed($error)
    {
        $this->mode = self::MODE_FAILED;
        $this->finishedAt = new \DateTime();
        $this->error = $error;
    }

    public function setDenied(string $reason): void
    {
        $this->mode = self::MODE_DENIED;
        $this->finishedAt = new \DateTime();
        $this->error = $reason;
    }

    public function isCompleted()
    {
        return in_array($this->mode, [self::MODE_DONE, self::MODE_FAILED]);
    }
}
