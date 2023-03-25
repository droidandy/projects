<?php

namespace AppBundle\Entity\Social;

use JMS\Serializer\Annotation as JMS;
use Doctrine\ORM\Mapping as ORM;
use DateTime;
use AppBundle\Entity\User\User;
use AppBundle\Entity\Traits\IdTrait;
use AppBundle\Entity\Traits\CreatedAtTrait;

/**
 * @ORM\Entity
 * @ORM\Table(name="ha_tag_followed",
 *    uniqueConstraints={
 *        @ORM\UniqueConstraint(name="tag_user_unique",
 *            columns={"tag_id", "user_id"})
 *    }
 * )
 * @JMS\ExclusionPolicy("all")
 */
class TagFollowed
{
    use IdTrait;
    use CreatedAtTrait;

    /**
     * @var Tag
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Social\Tag")
     * @ORM\JoinColumn(name="tag_id", referencedColumnName="id", nullable=false)
     */
    public $tag;

    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User\User", inversedBy="followedCategories")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", nullable=false)
     */
    public $user;

    /**
     * {@inheritdoc}
     */
    public function __construct()
    {
        $this->createdAt = new DateTime();
    }

}
