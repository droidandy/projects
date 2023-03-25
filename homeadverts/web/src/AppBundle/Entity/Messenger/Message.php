<?php

namespace AppBundle\Entity\Messenger;

use AppBundle\Entity\Storage\File;
use AppBundle\Entity\Traits\CreatedAtTrait;
use AppBundle\Entity\Traits\UpdatedAtTrait;
use AppBundle\Entity\User\User;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;
use AppBundle\Entity\Traits\IdTrait;
use DateTime;

/**
 * @ORM\HasLifecycleCallbacks()
 * @ORM\MappedSuperclass
 * @JMS\ExclusionPolicy("all")
 * @ORM\Table(name="messenger_message")
 * @ORM\Entity(repositoryClass="AppBundle\Entity\Messenger\MessageRepository")
 */
class Message
{
    use IdTrait;
    use CreatedAtTrait;
    use UpdatedAtTrait;

    /**
     * @var string
     * @Assert\NotNull()
     * @ORM\Column(type="text")
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details","message","room"})
     */
    public $text;
    /**
     * @var User
     * @Assert\NotNull()
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User\User")
     * @JMS\Type("AppBundle\Entity\User\User")
     * @JMS\Expose
     * @JMS\ReadOnly
     * @JMS\MaxDepth(2)
     * @JMS\Groups({"collection","details","message"})
     */
    public $user;
    /**
     * @var Room
     * @Assert\NotNull()
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Messenger\Room", inversedBy="messages")
     * @JMS\Type("AppBundle\Entity\Messenger\Room")
     * @JMS\Expose
     * @JMS\MaxDepth(1)
     * @JMS\Groups({"collection","details"})
     */
    public $room;
    /**
     * @var Reader[]|ArrayCollection<Reader>
     * @ORM\OneToMany(targetEntity="Reader", mappedBy="message")
     * @JMS\Type("ArrayCollection<AppBundle\Entity\Messenger\Reader>")
     * @JMS\ReadOnly
     * @JMS\Expose
     * @JMS\MaxDepth(5)
     * @JMS\Groups({"collection","details","message"})
     */
    public $readers;
    /**
     * @var File[]|ArrayCollection<File>
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\Storage\File", mappedBy="message")
     * @JMS\Type("ArrayCollection<AppBundle\Entity\Storage\File>")
     * @JMS\ReadOnly
     * @JMS\Expose
     * @JMS\MaxDepth(2)
     * @JMS\Groups({"collection","details","message"})
     */
    public $files;
    /**
     * @var DateTime
     * @ORM\Column(type="datetime", nullable=true)
     * @JMS\ReadOnly
     * @JMS\Expose
     * @JMS\Type("DateTime")
     * @JMS\Groups({"collection","details","message"})
     */
    public $notifiedAt;

    /**
     * @JMS\Type("int")
     * @JMS\Expose
     * @JMS\Groups({"collection","details","message"})
     * @JMS\VirtualProperty()
     * @JMS\SerializedName("isReadByAll")
     */
    public function isReadByAll()
    {
        $total = 0;

        foreach ($this->readers as $reader) {
            if ($reader->readAt !== NULL) {
                $total++;
            }
        }
        return $total === $this->room->users->count();
    }

    /**
     * @return User[]
     */
    public function getUnreadUsers(): array
    {
        $users = [];

        foreach ($this->readers as $reader) {
            if ($reader->readAt === NULL) {
                $users[] = $reader->user;
            }
        }

        return $users;
    }

    public function __construct()
    {
        if (!$this->readers) {
            $this->readers = new ArrayCollection();
        }
    }
}
