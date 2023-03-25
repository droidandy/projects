<?php

namespace AppBundle\Entity\User;

use Doctrine\ORM\Mapping as ORM;
use DateTime;

/**
 * @ORM\Table(name="access_token")
 * @ORM\Entity()
 * @ORM\HasLifecycleCallbacks
 */
class AccessToken
{
    /**
     * @var int
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     * @ORM\Column(type="string")
     */
    protected $token;

    /**
     * @var string
     * @ORM\Column(type="string")
     */
    protected $type = 'removal';

    /**
     * @var DateTime
     * @ORM\Column(type="datetime")
     */
    protected $createdAt;

    /**
     * @var DateTime
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $consumedAt;

    /**
     * @var DateTime
     * @ORM\Column(type="datetime")
     */
    protected $expirationDate;

    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", onDelete="CASCADE")
     */
    protected $user;

    public function __construct(User $user)
    {
        // Set data for newly created tokens
        $expirationDate = new DateTime();
        $expirationDate->modify('+1 week');

        $this->setToken(hash('sha256', uniqid()));
        $this->setCreatedAt(new DateTime());
        $this->setExpirationDate($expirationDate);
        $this->setUser($user);
    }

    /**
     * Get id.
     *
     * @return string
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getToken()
    {
        return $this->token;
    }

    /**
     * @param mixed $token
     */
    public function setToken($token)
    {
        $this->token = $token;
    }

    /**
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param string $type
     */
    public function setType($type)
    {
        $this->type = $type;
    }

    /**
     * @return DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * @param DateTime $createdAt
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;
    }

    /**
     * @return DateTime
     */
    public function getConsumedAt()
    {
        return $this->consumedAt;
    }

    /**
     * @param DateTime $consumedAt
     */
    public function setConsumedAt($consumedAt)
    {
        $this->consumedAt = $consumedAt;
    }

    /**
     * @return mixed
     */
    public function getExpirationDate()
    {
        return $this->expirationDate;
    }

    /**
     * @param mixed $expirationDate
     */
    public function setExpirationDate($expirationDate)
    {
        $this->expirationDate = $expirationDate;
    }

    /**
     * @return User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @param User $user
     */
    public function setUser(User $user)
    {
        $this->user = $user;
    }
}
