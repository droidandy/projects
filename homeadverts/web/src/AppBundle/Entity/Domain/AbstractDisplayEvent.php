<?php

namespace AppBundle\Entity\Domain;

use AppBundle\Entity\Traits\IdTrait;
use AppBundle\Entity\Traits\CreatedAtTrait;
use AppBundle\Entity\Traits\MetadataTrait;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\MappedSuperclass
 */
class AbstractDisplayEvent
{
    const SESSION_SALT = '933a50adaf37e5f444f620179d767cb5'; //md5

    const SOURCE_COLLECTION = 1;
    const SOURCE_DETAILS = 2;
    const SOURCE_MAP = 3;

    const EVENT_VIEW = 'view';
    const EVENT_IMPRESSION = 'impression';

    use IdTrait;
    use MetadataTrait;
    use CreatedAtTrait;

    /**
     * @var int
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $userId;
    /**
     * @var int
     * @ORM\Column(type="integer")
     */
    protected $itemId;
    /**
     * @var string
     * @ORM\Column(type="string")
     */
    protected $ip;
    /**
     * @var string
     * @ORM\Column(type="string")
     */
    protected $sessionId;
    /**
     * @var string
     * @ORM\Column(type="string")
     */
    protected $source;

    /**
     * @return mixed
     */
    public function getUserId()
    {
        return $this->userId;
    }

    /**
     * @param mixed $userId
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
    }

    /**
     * @return mixed
     */
    public function getItemId()
    {
        return $this->itemId;
    }

    /**
     * @param mixed $itemId
     */
    public function setItemId($itemId)
    {
        $this->itemId = $itemId;
    }

    /**
     * @return string
     */
    public function getIp()
    {
        return $this->ip;
    }

    /**
     * @param string $ip
     */
    public function setIp($ip)
    {
        $this->ip = $ip;
    }

    /**
     * @return string
     */
    public function getSessionId()
    {
        return $this->sessionId;
    }

    /**
     * @param string $sessionId
     */
    public function setSessionId($sessionId)
    {
        $this->sessionId = $sessionId;
    }

    /**
     * @return string
     */
    public function getSource()
    {
        return $this->source;
    }

    /**
     * @param string $source
     */
    public function setSource($source)
    {
        $this->source = $source;
    }
}
