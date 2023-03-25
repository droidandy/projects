<?php

namespace AppBundle\Entity\User;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use AppBundle\Entity\Traits\IdTrait;

/**
 * @ORM\Entity
 * @ORM\Table(name="user_team_profile")
 * @JMS\ExclusionPolicy("all")
 */
class TeamProfile
{
    use IdTrait;

    /**
     * @var User
     * @ORM\OneToOne(
     *     targetEntity="AppBundle\Entity\User\User",
     *     inversedBy="teamProfile"
     * )
     */
    private $user;

    /**
     * @return User
     */
    public function getUser(): User
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
