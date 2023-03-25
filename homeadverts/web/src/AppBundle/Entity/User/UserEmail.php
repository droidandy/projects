<?php

namespace AppBundle\Entity\User;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use AppBundle\Entity\Traits\IdTrait;

/**
 * @ORM\Entity
 * @ORM\Table(name="user_email")
 * @JMS\ExclusionPolicy("all")
 */
class UserEmail
{
    use IdTrait;

    /**
     * @var User
     * @ORM\ManyToOne(
     *     targetEntity="AppBundle\Entity\User\User",
     *     inversedBy="emails"
     * )
     */
    public $user;
    /**
     * @var string
     * @ORM\Column(type="string", nullable=false)
     */
    public $email;
    /**
     * @var string
     * @ORM\Column(type="string", nullable=true)
     */
    public $title;
    /**
     * @var string
     * @ORM\Column(type="boolean")
     */
    public $isLead = false;
}
