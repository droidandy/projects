<?php

namespace AppBundle\Service\Article\Image;

use AppBundle\Entity\Social\ArticleImage;

/**
 * Interface ThumbStrategyInterface.
 */
interface ThumbStrategyInterface
{
    /**
     * @param ArticleImage $articleImage
     *
     * @return array|false
     */
    public function getFilters(ArticleImage $articleImage);

    /**
     * Return filter should be default at article body.
     *
     * @param ArticleImage $articleImage
     *
     * @return string|null
     */
    public function getFrontFilter(ArticleImage $articleImage);
}
