<?php

namespace AppBundle\Service\Article\Processor;

use AppBundle\Entity\Social\Article;

interface ProcessorInterface
{
    /**
     * @param Article $article
     */
    public function process(Article $article);
}
