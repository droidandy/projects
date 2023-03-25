<?php

namespace AppBundle\Entity\User;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use AppBundle\Entity\Traits\IdTrait;

/**
 * @ORM\Entity
 * @ORM\Table(name="user_profile")
 * @JMS\ExclusionPolicy("all")
 */
class UserProfile
{
    use IdTrait;

    /**
     * @var User
     * @ORM\OneToOne(
     *     targetEntity="AppBundle\Entity\User\User",
     *     inversedBy="userProfile"
     * )
     */
    private $user;
    /**
     * @var string
     * @ORM\Column(type="string", length=50, nullable=true)
     */
    private $gender;
    /**
     * @var string
     * @ORM\Column(type="string", length=50, nullable=true)
     */
    private $title;

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

    /**
     * @return string
     */
    public function getGender(): string
    {
        return $this->gender;
    }

    /**
     * @param string $gender
     */
    public function setGender(string $gender)
    {
        $this->gender = $gender;
    }

    /**
     * @return string
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * @param string $title
     */
    public function setTitle(string $title)
    {
        $this->title = $title;
    }
}
