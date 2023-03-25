<?php

namespace AppBundle\Service\Article\Processor;

use AppBundle\Entity\Social\Article;
use Cocur\Slugify\Slugify;

class SlugProcessor implements ProcessorInterface
{
    /**
     * @var Slugify
     */
    private $slugifier;

    /**
     * @param Slugify $slugifier
     */
    public function __construct(Slugify $slugifier)
    {
        $this->slugifier = $slugifier;
    }

    /**
     * @param Article $article
     */
    public function process(Article $article)
    {
        if (!$article->getTitle()) {
            throw new \InvalidArgumentException('Article should have title');
        }

        $article->setSlug($this->slugifier->slugify($article->getTitle()));
    }
}
