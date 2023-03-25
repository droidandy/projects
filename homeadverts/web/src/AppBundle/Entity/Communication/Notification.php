<?php

namespace AppBundle\Entity\Communication;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use DateTime;
use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Social\Article;
use AppBundle\Entity\Traits\IdTrait;
use AppBundle\Entity\Traits\CreatedAtTrait;
use AppBundle\Entity\User\User;

/**
 * @ORM\HasLifecycleCallbacks()
 * @ORM\MappedSuperclass
 * @JMS\ExclusionPolicy("all")
 * @ORM\Table(name="ha_notification")
 * @ORM\Entity(repositoryClass="AppBundle\Entity\Communication\NotificationRepository")
 */
class Notification
{
    const TYPE_ARTICLE_LIKE_RECEIVED = 11;
    const TYPE_ARTICLE_COMMENT_RECEIVED = 12;
    const TYPE_PROPERTY_LIKE_RECEIVED = 21;
    const TYPE_PROPERTY_COMMENT_RECEIVED = 22;
    const TYPE_USER_FOLLOWER_RECEIVED = 31;

    use IdTrait;
    use CreatedAtTrait;

    /**
     * @var string
     * @ORM\Column(type="integer")
     * @JMS\Expose
     * @JMS\ReadOnly
     * @JMS\Type("integer")
     * @JMS\Groups({"collection","details"})
     */
    private $type;
    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User\User", inversedBy="notifications")
     * @ORM\JoinColumn(name="owner_id", referencedColumnName="id", onDelete="CASCADE")
     * @JMS\Type("AppBundle\Entity\User\User")
     * @JMS\Expose
     * @JMS\ReadOnly
     * @JMS\MaxDepth(1)
     * @JMS\Groups({"collection","details"})
     */
    private $owner;
    /**
     * @var Property
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Property\Property")
     * @ORM\JoinColumn(name="property_id", referencedColumnName="id", nullable=true, onDelete="CASCADE")
     * @JMS\Type("AppBundle\Entity\Property\Property")
     * @JMS\Expose
     * @JMS\ReadOnly
     * @JMS\MaxDepth(1)
     * @JMS\Groups({"collection","details"})
     */
    private $property;
    /**
     * @var Article
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Social\Article")
     * @ORM\JoinColumn(name="article_id", referencedColumnName="id", nullable=true, onDelete="CASCADE")
     * @JMS\Type("AppBundle\Entity\Social\Article")
     * @JMS\Expose
     * @JMS\ReadOnly
     * @JMS\MaxDepth(1)
     * @JMS\Groups({"collection","details"})
     */
    private $article;
    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User\User")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", nullable=true, onDelete="CASCADE")
     * @JMS\Type("AppBundle\Entity\User\User")
     * @JMS\Expose
     * @JMS\ReadOnly
     * @JMS\MaxDepth(1)
     * @JMS\Groups({"collection","details"})
     */
    private $user;
    /**
     * @var DateTime
     * @ORM\Column(type="datetime", nullable=true)
     * @JMS\Expose
     * @JMS\Readonly
     * @JMS\Type("DateTime")
     * @JMS\Groups({"collection","details"})
     */
    private $readAt;

    public function __construct()
    {
        $this->createdAt = new DateTime();
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
    public function getReadAt()
    {
        return $this->readAt;
    }

    public function setUnread()
    {
        $this->readAt = null;
    }

    public function setReadAtNow()
    {
        $this->readAt = new DateTime();
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

    /**
     * @return User
     */
    public function getOwner()
    {
        return $this->owner;
    }

    /**
     * @param User $owner
     */
    public function setOwner($owner)
    {
        $this->owner = $owner;
    }

    /**
     * @return Property
     */
    public function getProperty()
    {
        return $this->property;
    }

    /**
     * @param Property $property
     */
    public function setProperty(Property $property)
    {
        $this->property = $property;
    }

    /**
     * @return Article
     */
    public function getArticle()
    {
        return $this->article;
    }

    /**
     * @param Article $article
     */
    public function setArticle(Article $article)
    {
        $this->article = $article;
    }
}
