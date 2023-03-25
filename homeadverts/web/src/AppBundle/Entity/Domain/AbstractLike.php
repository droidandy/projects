<?php

namespace AppBundle\Entity\Domain;

use AppBundle\Entity\Property\PropertyLike;
use AppBundle\Entity\Social\ArticleLike;
use AppBundle\Entity\Traits\IdTrait;
use AppBundle\Entity\Traits\CreatedAtTrait;
use AppBundle\Entity\User\User;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use DateTime;

/**
 * @ORM\InheritanceType("SINGLE_TABLE")
 * @ORM\DiscriminatorColumn(name="type_name", type="string")
 * @ORM\DiscriminatorMap({
 *      "property"="AppBundle\Entity\Property\PropertyLike",
 *      "article"="AppBundle\Entity\Social\ArticleLike",
 * })
 * @ORM\Entity
 * @ORM\Table(name="ha_like")
 * @JMS\ExclusionPolicy("all")
 */
abstract class AbstractLike
{
    use IdTrait;
    use CreatedAtTrait;

    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User\User")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", nullable=false)
     * @JMS\Expose
     * @JMS\Type("AppBundle\Entity\User\User")
     * @JMS\Groups({"collection","details"})
     * @JMS\MaxDepth(2)
     * @JMS\ReadOnly()
     */
    protected $user;

    /**
     * @var PropertyLike|ArticleLike
     */
    protected $liked;

    public function __construct()
    {
        $this->createdAt = new DateTime();
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
    public function setUser($user)
    {
        $this->user = $user;
    }

    /**
     * @param mixed $mixed
     */
    public function setLiked($mixed)
    {
        $this->liked = $mixed;
    }

    /**
     * @return \AppBundle\Entity\Social\Article
     */
    public function getLiked()
    {
        return $this->liked;
    }
}
