<?php

namespace AppBundle\Service\Article\Publisher\Channel;

use Facebook\Facebook;
use Exception;
use AppBundle\Service\Article\Publisher\Publisher;
use AppBundle\Entity\Social\Article;

class FacebookChannel extends AbstractChannelTemplate implements ChannelInterface
{
    /**
     * @param Article $article
     *
     * @throws Exception
     *
     * @return ChannelPostingResult
     */
    public function post(Article $article)
    {
        $fb = new Facebook([
            'app_id' => $this->appId,
            'app_secret' => $this->secret,
        ]);
        $fb->setDefaultAccessToken($article->getAuthor()->getFacebookAccessToken());

        try {
            $request = $fb->post(
                '/me/feed',
                $this->getBody($article)
            );
            $response = $request->getGraphNode()->asArray();
        } catch (Exception $e) {
            $response = $this->getExceptionResponse($e);
        }

        $isPositive = isset($response['id']);

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
        return [
            'link' => $this->getUrl($article),
            'message' => $article->getTitle(),
        ];
    }

    /**
     * @return string
     */
    public function getName()
    {
        return Publisher::CHANNEL_FACEBOOK;
    }
}
