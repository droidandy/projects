<?php

namespace AppBundle\Entity\Social;

use AppBundle\Entity\Traits\CreatedAtTrait;
use AppBundle\Entity\Traits\IdTrait;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use Cocur\Slugify\Slugify;

/**
 * @ORM\Entity
 * @ORM\Table(name="ha_tag")
 * @ORM\Entity(repositoryClass="AppBundle\Entity\Social\TagRepository")
 * @JMS\ExclusionPolicy("all")
 */
class Tag
{
    use IdTrait;
    use CreatedAtTrait;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User\User")
     * @ORM\JoinColumn(onDelete="CASCADE", nullable=false)
     * @JMS\Type("AppBundle\Entity\User\User")
     * @JMS\Expose
     * @JMS\ReadOnly
     */
    public $user;
    /**
     * @ORM\Column(type="string", unique=true, nullable=false)
     * @JMS\Type("string")
     * @JMS\Expose
     * @JMS\Groups({"details"})
     */
    public $name;
    /**
     * @ORM\Column(type="string")
     * @JMS\Type("string")
     * @JMS\Expose
     * @JMS\Groups({"collection","details"})
     */
    public $displayName;
    /**
     * @ORM\Column(type="boolean")
     * @JMS\Type("boolean")
     * @JMS\Expose
     * @JMS\ReadOnly
     */
    public $private = false;

    /**
     * Tag constructor.
     */
    public function __construct()
    {
        $this->createdAt = new \DateTime();

        self::slugifyTag($this);
    }

    /**
     * @param Tag $tag
     */
    public static function slugifyTag(Tag $tag)
    {
        $slugify = Slugify::create();

        if ($tag->getName()) {
            return;
        }
        $name = $tag->getDisplayName();
        $slug = $slugify->slugify($name);
        $tag->setName($slug);
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param mixed $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @return mixed
     */
    public function getDisplayName()
    {
        return $this->displayName;
    }

    /**
     * @param mixed $displayName
     */
    public function setDisplayName($displayName)
    {
        $slugify = Slugify::create();

        $this->displayName = $displayName;
        $this->setName($slugify->slugify($displayName));
    }

    /**
     * @return bool
     */
    public function getPrivate()
    {
        return $this->private;
    }

    /**
     * @param mixed $private
     */
    public function setPrivate($private)
    {
        $this->private = $private;
    }

    /**
     * @JMS\PostDeserialize()
     */
    public function postDeserialize()
    {
        if (!$this->id) {
            $this->createdAt = new \DateTime();
        }
    }
}
