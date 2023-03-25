<?php

namespace AppBundle\Entity\Messenger;

use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Social\Article;
use AppBundle\Entity\User\User;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;
use AppBundle\Entity\Traits\CreatedAtTrait;
use AppBundle\Entity\Traits\UpdatedAtTrait;
use AppBundle\Entity\Traits\IdTrait;

/**
 * @ORM\HasLifecycleCallbacks()
 * @ORM\MappedSuperclass
 * @JMS\ExclusionPolicy("all")
 * @ORM\Table(name="messenger_room")
 * @ORM\Entity(repositoryClass="AppBundle\Entity\Messenger\RoomRepository")
 */
class Room
{
    CONST ROOM_TYPE_USER = 'user';
    CONST ROOM_TYPE_PROPERTY = 'property';
    CONST ROOM_TYPE_ARTICLE = 'article';

    use IdTrait;
    use CreatedAtTrait;
    use UpdatedAtTrait;

    /**
     * @var ArrayCollection<User>
     * @Assert\NotNull()
     * @ORM\ManyToMany(targetEntity="AppBundle\Entity\User\User", inversedBy="rooms")
     * @ORM\JoinTable(name="messenger_room_users")
     * @JMS\Expose
     * @JMS\ReadOnly
     * @JMS\MaxDepth(2)
     * @JMS\Groups({"room"})
     */
    public $users;
    /**
     * @var ArrayCollection<Message>
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\Messenger\Message", mappedBy="room")
     * @ORM\OrderBy({"createdAt"="ASC"})
     */
    public $messages;
    /**
     * @var Article
     * @ORM\OneToOne(targetEntity="AppBundle\Entity\Social\Article", inversedBy="room")
     * @JMS\Type("AppBundle\Entity\Social\Article")
     * @JMS\Expose
     * @JMS\ReadOnly
     * @JMS\MaxDepth(2)
     * @JMS\Groups({"details", "room"})
     */
    public $article;
    /**
     * @var Property
     * @ORM\OneToOne(targetEntity="AppBundle\Entity\Property\Property", inversedBy="room")
     * @JMS\Type("AppBundle\Entity\Property\Property")
     * @JMS\Expose
     * @JMS\ReadOnly
     * @JMS\MaxDepth(2)
     * @JMS\Groups({"details", "room"})
     */
    public $property;
    /**
     * @var integer
     * @JMS\Type("int")
     * @JMS\Expose
     * @JMS\ReadOnly
     * @JMS\MaxDepth(2)
     * @JMS\Groups({"details", "room"})
     */
    public $unread = 0;

    /**
     * @var bool
     * @ORM\Column(type="boolean")
     */
    public $isPrivate = true;

    public function __construct()
    {
        if (!$this->users) {
            $this->users = new ArrayCollection();
        }
    }

    /**
     * @var Message
     * @JMS\Type("AppBundle\Entity\Messenger\Message")
     * @JMS\Expose
     * @JMS\MaxDepth(1)
     * @JMS\Groups({"details", "room"})
     * @JMS\VirtualProperty()
     * @JMS\SerializedName("lastMessage")
     *
     * @return Message
     */
    public function getLastMessage()
    {
        if ($this->messages && $this->messages->count()) {
            return $this->messages->last();
        }
    }

    /**
     * @var string
     * @JMS\Type("string")
     * @JMS\Expose
     * @JMS\Groups({"details", "room"})
     * @JMS\VirtualProperty()
     * @JMS\SerializedName("type")
     *
     * @return string
     */
    public function getType(): string
    {
        if ($this->property) {
            return self::ROOM_TYPE_PROPERTY;
        }
        if ($this->article) {
            return self::ROOM_TYPE_ARTICLE;
        }

        return self::ROOM_TYPE_USER;
    }

    /**
     * @var User
     * @JMS\Type("AppBundle\Entity\User\User")
     * @JMS\Expose
     * @JMS\MaxDepth(3)
     * @JMS\Groups({"details", "room"})
     * @JMS\VirtualProperty()
     * @JMS\SerializedName("admin")
     *
     * @return User
     */
    public function getAdmin(): User
    {
        if ($this->article) {
            return $this->article->getAuthor();
        }
        if ($this->property) {
            return $this->property->getUser();
        }

        return $this->users->first();
    }

    /**
     * @var string
     * @JMS\Type("string")
     * @JMS\Expose
     * @JMS\Groups({"details", "room"})
     * @JMS\VirtualProperty()
     * @JMS\SerializedName("title")
     *
     * @return string
     */
    public function getTitle(User $user = null): string
    {
        if ($this->property) {
            return $this->property->getTitle();
        }
        if ($this->article) {
            return $this->article->getTitle();
        }
        if (!$user) {
            return $this->users->first()->name;
        }

        /**
         * @var User
         */
        foreach ($this->users as $u) {
            if ($u !== $user) {
                return $u->name;
            }
        }
    }
}
