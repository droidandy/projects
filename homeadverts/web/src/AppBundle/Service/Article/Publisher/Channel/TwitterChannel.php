<?php

namespace AppBundle\Service\Article\Publisher\Channel;

use Abraham\TwitterOAuth\TwitterOAuth;
use Exception;
use AppBundle\Service\Article\Publisher\Publisher;
use AppBundle\Entity\Social\Article;

class TwitterChannel extends AbstractChannelTemplate implements ChannelInterface
{
    /**
     * @param Article $article
     *
     * @return ChannelPostingResult
     */
    public function post(Article $article)
    {
        $tw = new TwitterOAuth(
            $this->appId,
            $this->secret,
            $article->getAuthor()->getTwitterAccessToken(),
            $article->getAuthor()->getTwitterTokenSecret()
        );

        try {
            $response = (array) $tw->post(
                'statuses/update',
                [
                    'status' => $this->getBody($article),
                ]
            );
        } catch (Exception $e) {
            $response = $this->getExceptionResponse($e);
        }

        $isPositive = isset($response['created_at']);

        return new ChannelPostingResult(
            $isPositive,
            $response
        );
    }

    /**
     * @param Article $article
     *
     * @return array
     */
    public function getBody(Article $article)
    {
        return sprintf(
            "%s\n%s",
            $article->getTitle(),
            $this->getUrl($article)
        );
    }

    /**
     * @return string
     */
    public function getName()
    {
        return Publisher::CHANNEL_TWITTER;
    }
}
