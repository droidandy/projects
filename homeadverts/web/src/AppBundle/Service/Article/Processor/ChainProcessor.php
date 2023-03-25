<?php

namespace AppBundle\Service\Article\Processor;

use AppBundle\Entity\Social\Article;

class ChainProcessor implements ProcessorInterface
{
    /**
     * @var ProcessorInterface[]
     */
    private $processors = [];

    /**
     * ChainProcessor constructor.
     *
     * @param ProcessorInterface[] $processors
     */
    public function __construct(array $processors)
    {
        $this->processors = $processors;
    }

    /**
     * @param Article $article
     */
    public function process(Article $article)
    {
        foreach ($this->processors as $processor) {
            $processor->process($article);
        }
    }
}
