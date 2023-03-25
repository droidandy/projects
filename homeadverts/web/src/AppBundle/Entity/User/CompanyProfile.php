<?php

namespace AppBundle\Entity\User;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use AppBundle\Entity\Traits\IdTrait;

/**
 * @ORM\Entity
 * @ORM\Table(name="user_company_profile")
 * @JMS\ExclusionPolicy("all")
 */
class CompanyProfile
{
    use IdTrait;

    const TYPE_OFFICE = 'office';
    const TYPE_COMPANY = 'company';
    const TYPE_FRANCHISE = 'franchise';

    /**
     * @var User
     * @ORM\OneToOne(
     *     targetEntity="AppBundle\Entity\User\User",
     *     inversedBy="companyProfile"
     * )
     */
    private $user;

    /**
     * @var string
     * @ORM\Column(type="string", length=50, nullable=true)
     */
    private $type;

    /**
     * @var array
     * @ORM\Column(type="json_array", nullable=true)
     */
    private $openingHours;

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
    public function getType(): string
    {
        return $this->type;
    }

    /**
     * @param string $type
     */
    public function setType(string $type)
    {
        $this->type = $type;
    }

    /**
     * @return array
     */
    public function getOpeningHours(): array
    {
        return $this->openingHours;
    }

    /**
     * @param array $openingHours
     */
    public function setOpeningHours(array $openingHours)
    {
        $this->openingHours = $openingHours;
    }
}
