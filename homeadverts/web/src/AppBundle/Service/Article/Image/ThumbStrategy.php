<?php

namespace AppBundle\Service\Article\Image;

use AppBundle\Entity\Social\ArticleImage;

class ThumbStrategy implements ThumbStrategyInterface
{
    /**
     * @param ArticleImage $articleImage
     *
     * @return bool
     */
    public function getFilters(ArticleImage $articleImage)
    {
        return false;
    }

    /**
     * @param ArticleImage $articleImage
     */
    public function getFrontFilter(ArticleImage $articleImage)
    {
        return null;
    }
}
