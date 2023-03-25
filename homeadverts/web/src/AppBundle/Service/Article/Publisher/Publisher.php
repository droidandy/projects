<?php

namespace AppBundle\Service\Article\Publisher;

use AppBundle\Service\Article\Publisher\Channel\ChannelInterface;
use AppBundle\Entity\Social\Article;

class Publisher
{
    const CHANNEL_FACEBOOK = 'facebook';
    const CHANNEL_TWITTER = 'twitter';
    const CHANNEL_LINKEDIN = 'linkedin';

    /**
     * @var ChannelInterface[]
     */
    private $channels;

    /**
     * @param ChannelInterface[] $channels
     */
    public function __construct(array $channels)
    {
        $this->channels = $channels;
    }

    /**
     * @param Article $article
     */
    public function publish(Article $article)
    {
        foreach ($this->channels as $channel) {
            $isPositivePosting = $article
                ->getChannelPostingResult($channel->getName())
                ->isPositive();
            $isChannelEnabled = $article->isChannelEnabled($channel->getName());

            if (!$isPositivePosting && $isChannelEnabled) {
                $article->setChannelPostingResult(
                    $channel->getName(),
                    $channel->post($article)
                );
            }
        }
    }
}
