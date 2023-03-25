<?php

namespace AppBundle\Entity\Location;

use AppBundle\Entity\Traits\IdTrait;
use JMS\Serializer\Annotation as JMS;
use Doctrine\ORM\Mapping as ORM;
use DateTime;
use AppBundle\Entity\User\User;
use AppBundle\Entity\Traits\CreatedAtTrait;
use AppBundle\Entity\Traits\UpdatedAtTrait;

/**
 * @ORM\Entity
 * @ORM\Table(name="location_followed",
 *    uniqueConstraints={
 *        @ORM\UniqueConstraint(name="location_user_unique",
 *            columns={"location_id", "user_id"})
 *    }
 * )
 * @JMS\ExclusionPolicy("all")
 */
class FollowedLocation
{
    use IdTrait;
    use CreatedAtTrait;
    use UpdatedAtTrait;

    /**
     * @var Location
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Location\Location")
     * @ORM\JoinColumn(name="location_id", referencedColumnName="id", nullable=false)
     */
    private $location;

    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User\User", inversedBy="followedLocations")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", nullable=false)
     */
    private $user;

    /**
     * {@inheritdoc}
     */
    public function __construct()
    {
        $this->createdAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    /**
     * @return \AppBundle\Entity\Location\Location
     */
    public function getLocation()
    {
        return $this->location;
    }

    /**
     * @param \AppBundle\Entity\Location\Location $location
     */
    public function setLocation($location)
    {
        $this->location = $location;
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
}
