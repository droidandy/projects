<?php

namespace AppBundle\Service\Article\Processor;

use AppBundle\Entity\Social\Article;

class PreviewProcessor implements ProcessorInterface
{
    /**
     * @var SubtitleExtractorInterface
     */
    private $subtitleExtractor;

    /**
     * DescriptionProcessor constructor.
     *
     * @param SubtitleExtractorInterface $subtitleExtractor
     */
    public function __construct(SubtitleExtractorInterface $subtitleExtractor)
    {
        $this->subtitleExtractor = $subtitleExtractor;
    }

    public function process(Article $article)
    {
        if (!$article->getSubtitle()) {
            $subtitle = $this->subtitleExtractor->extractSubtitle($article->getBody());
            $article->setSubtitle($subtitle);
        }

        if (!$article->getDescription()) {
            $desc = $this->subtitleExtractor->extractSubtitle($article->getBody(), 160);
            $article->setDescription($desc);
        }
    }
}
