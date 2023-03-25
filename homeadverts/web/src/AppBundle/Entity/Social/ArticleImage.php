<?php

namespace AppBundle\Entity\Social;

use AppBundle\Entity\Storage\File;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;
use AppBundle\Entity\Traits\IdTrait;
use AppBundle\Entity\Traits\UpdatedAtTrait;
use AppBundle\Entity\Traits\CreatedAtTrait;

/**
 * @ORM\HasLifecycleCallbacks()
 * @ORM\Entity
 * @ORM\Table(name="ha_article_file")
 * @JMS\ExclusionPolicy("all")
 */
class ArticleImage
{
    use IdTrait;
    use CreatedAtTrait;
    use UpdatedAtTrait;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Storage\File", fetch="EAGER")
     * @ORM\JoinColumn(onDelete="CASCADE", nullable=false)
     * @JMS\Expose
     * @JMS\Type("AppBundle\Entity\Storage\File")
     * @JMS\Groups({"collection","details"})
     */
    protected $file;
    /**
     * @ORM\ManyToOne(targetEntity="Article", inversedBy="images")
     * @ORM\JoinColumn(onDelete="CASCADE", nullable=false)
     */
    protected $article;
    /**
     * @ORM\Column(name="file_order", type="integer")
     * @JMS\Expose
     */
    protected $order = 0;

    /**
     * @return File
     */
    public function getFile()
    {
        return $this->file;
    }

    /**
     * @param mixed $file
     */
    public function setFile($file)
    {
        $this->file = $file;
    }

    /**
     * @return mixed
     */
    public function getArticle()
    {
        return $this->article;
    }

    /**
     * @param mixed $article
     */
    public function setArticle($article)
    {
        $this->article = $article;
    }

    /**
     * @return mixed
     */
    public function getOrder()
    {
        return $this->order;
    }

    /**
     * @param mixed $order
     */
    public function setOrder($order)
    {
        $this->order = $order;
    }
}
