<?php

namespace AppBundle\Entity\Messenger;

use AppBundle\Entity\Traits\CreatedAtTrait;
use AppBundle\Entity\Traits\IdTrait;
use AppBundle\Entity\User\User;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;

use DateTime;

/**
 * @ORM\HasLifecycleCallbacks()
 * @ORM\MappedSuperclass
 * @JMS\ExclusionPolicy("all")
 * @ORM\Entity()
 * @ORM\Table(name="messenger_read",
 *    uniqueConstraints={
 *        @ORM\UniqueConstraint(
 *          name="reader_unique",
 *          columns={"message_id", "user_id"}
 *       )
 *    }
 * )
 */
class Reader
{
    use IdTrait;
    use CreatedAtTrait;

    /**
     * @var Message
     * @Assert\NotNull()
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Messenger\Message", inversedBy="readers")
     */
    public $message;
    /**
     * @var User
     * @Assert\NotNull()
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User\User")
     * @JMS\Type("AppBundle\Entity\User\User")
     * @JMS\Expose
     * @JMS\ReadOnly
     * @JMS\MaxDepth(4)
     * @JMS\Groups({"collection","details","message"})
     */
    public $user;
    /**
     * @var DateTime
     * @ORM\Column(type="datetime", nullable=true)
     * @JMS\ReadOnly
     * @JMS\Expose
     * @JMS\Type("DateTime")
     * @JMS\Groups({"collection","details","message"})
     */
    public $readAt;

    public function setReadAtNow()
    {
        $this->readAt = new DateTime();
    }
}
