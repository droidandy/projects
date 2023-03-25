<?php

namespace AppBundle\Entity\User;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use AppBundle\Entity\Traits\CreatedAtTrait;
use AppBundle\Entity\Traits\IdTrait;
use AppBundle\Entity\Traits\UpdatedAtTrait;

/**
 * @ORM\Entity
 * @ORM\Table(name="user_relation")
 * @ORM\HasLifecycleCallbacks
 * @JMS\ExclusionPolicy("all")
 */
class Relation
{
    use IdTrait, CreatedAtTrait, UpdatedAtTrait;

    const TYPE_ROLE = 'role';
    const TYPE_DIVISION = 'division';

    /**
     * @var User
     * @ORM\ManyToOne(
     *     targetEntity="AppBundle\Entity\User\User",
     *     inversedBy="relation"
     * )
     * @ORM\JoinColumn(nullable=false, unique=false)
     */
    private $child;
    /**
     * @var User
     * @ORM\ManyToOne(
     *     targetEntity="AppBundle\Entity\User\User"
     * )
     * @ORM\JoinColumn(nullable=false, unique=false)
     */
    private $parent;
    /**
     * @var string
     * @ORM\Column(type="string", length=50)
     */
    private $type;
    /**
     * @var string
     * @ORM\Column(type="string", length=50, nullable=true)
     */
    private $role;
    /**
     * @var string
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $roleName;
    /**
     * @var array
     * @ORM\Column(type="json_array", nullable=true)
     */
    private $roleMetadata;
    /**
     * @var string
     * @ORM\Column(type="string", length=50, nullable=true)
     */
    private $division;
    /**
     * @var string
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $divisionName;
    /**
     * @var bool
     * @ORM\Column(type="boolean")
     */
    private $isPublic = true;

    /**
     * @var \DateTime
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $deletedAt;

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setId(int $id)
    {
        $this->id = $id;
    }

    /**
     * @return User
     */
    public function getChild(): User
    {
        return $this->child;
    }

    /**
     * @param User $child
     */
    public function setChild(User $child)
    {
        $this->child = $child;
    }

    /**
     * @return User
     */
    public function getParent(): User
    {
        return $this->parent;
    }

    /**
     * @param User $parent
     */
    public function setParent(User $parent)
    {
        $this->parent = $parent;
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
     * @return string
     */
    public function getRole(): string
    {
        return $this->role;
    }

    /**
     * @param string $role
     */
    public function setRole(string $role)
    {
        $this->role = $role;
    }

    /**
     * @return string
     */
    public function getRoleName(): string
    {
        return $this->roleName;
    }

    /**
     * @param string $roleName
     */
    public function setRoleName(string $roleName)
    {
        $this->roleName = $roleName;
    }

    /**
     * @return array
     */
    public function getRoleMetadata(): array
    {
        return $this->roleMetadata;
    }

    /**
     * @param array $roleMetadata
     */
    public function setRoleMetadata(array $roleMetadata)
    {
        $this->roleMetadata = $roleMetadata;
    }

    /**
     * @return string
     */
    public function getDivision(): string
    {
        return $this->division;
    }

    /**
     * @param string $division
     */
    public function setDivision(string $division)
    {
        $this->division = $division;
    }

    /**
     * @return string
     */
    public function getDivisionName(): string
    {
        return $this->divisionName;
    }

    /**
     * @param string $divisionName
     */
    public function setDivisionName(string $divisionName)
    {
        $this->divisionName = $divisionName;
    }

    /**
     * @return bool
     */
    public function isIsPublic(): bool
    {
        return $this->isPublic;
    }

    /**
     * @param bool $isPublic
     */
    public function setIsPublic(bool $isPublic)
    {
        $this->isPublic = $isPublic;
    }

    /**
     * @return mixed
     */
    public function getDeletedAt()
    {
        return $this->deletedAt;
    }

    /**
     * @param mixed $deletedAt
     */
    public function setDeletedAt($deletedAt)
    {
        $this->deletedAt = $deletedAt;
    }

    public function setDeletedAtNow()
    {
        if (!$this->deletedAt) {
            $this->deletedAt = new \DateTime();
        }
    }
}
