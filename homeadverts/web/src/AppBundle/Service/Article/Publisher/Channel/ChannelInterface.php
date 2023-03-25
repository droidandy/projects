<?php

namespace AppBundle\Service\Article\Publisher\Channel;

use AppBundle\Entity\Social\Article;

interface ChannelInterface
{
    /**
     * @param Article $article
     *
     * @return ChannelPostingResult
     */
    public function post(Article $article);

    /**
     * @return string
     */
    public function getName();
}
