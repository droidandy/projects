<?php

namespace AppBundle\Service\Article\Processor;

use AppBundle\Entity\Social\Article;

class StateAwareChainProcessor implements ProcessorInterface
{
    /**
     * @var ProcessorInterface[]
     */
    private $stateProcessorMap = [
        Article::STATE_DRAFT => null,
        Article::STATE_PUBLISHED => null,
    ];

    /**
     * StateAwareChainProcessor constructor.
     *
     * @param ProcessorInterface[] $stateProcessorMap
     *
     * @throws \InvalidArgumentException
     */
    public function __construct(array $stateProcessorMap)
    {
        foreach ($stateProcessorMap as $state => $value) {
            if (!array_key_exists($state, $this->stateProcessorMap)) {
                throw new \InvalidArgumentException(sprintf('Unknown state "%s" used', $state));
            } elseif (!$value instanceof ProcessorInterface) {
                throw new \InvalidArgumentException('Processor should be instance of \\AppBundle\\Article\\Processor\\ProcessorInterface');
            } else {
                $this->stateProcessorMap[$state] = $value;
            }
        }
    }

    /**
     * @param Article $article
     *
     * @throws \InvalidArgumentException
     */
    public function process(Article $article)
    {
        $state = $article->getPublishingState();

        if (!isset($this->stateProcessorMap[$state])) {
            return;
        }
        $this->stateProcessorMap[$state]->process($article);
    }
}
