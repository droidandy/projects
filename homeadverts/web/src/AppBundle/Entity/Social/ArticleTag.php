<?php

namespace AppBundle\Entity\Social;

use AppBundle\Entity\Traits\CreatedAtTrait;
use DateTime;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use FOS\UserBundle\Model\User;

/**
 * @ORM\Entity
 * @ORM\Table(name="ha_article_tag")
 * @JMS\ExclusionPolicy("all")
 */
class ArticleTag
{
    use CreatedAtTrait;

    /**
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="Article", inversedBy="tags")
     * @ORM\JoinColumn(onDelete="CASCADE", nullable=false)
     * @JMS\Type("AppBundle\Entity\Social\Article")
     * @JMS\Expose
     */
    protected $article;
    /**
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Social\Tag")
     * @ORM\JoinColumn(onDelete="CASCADE", nullable=false)
     * @JMS\Type("AppBundle\Entity\Social\Tag")
     * @JMS\Expose
     */
    protected $tag;
    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User\User")
     * @ORM\JoinColumn(onDelete="CASCADE", nullable=false)
     * @JMS\Type("AppBundle\Entity\User\User")
     * @JMS\Expose
     * @JMS\ReadOnly
     */
    protected $user;

    /**
     * Tag constructor.
     */
    public function __construct()
    {
        $this->setCreatedAtNow();
    }

    /**
     * @return mixed
     */
    public function getArticle()
    {
        return $this->article;
    }

    /**
     * @param Article $article
     */
    public function setArticle($article)
    {
        $this->article = $article;
    }

    /**
     * @return Tag
     */
    public function getTag()
    {
        return $this->tag;
    }

    /**
     * @param Tag $tag
     */
    public function setTag($tag)
    {
        $this->tag = $tag;
    }

    /**
     * @return mixed
     */
    public function getUser()
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
