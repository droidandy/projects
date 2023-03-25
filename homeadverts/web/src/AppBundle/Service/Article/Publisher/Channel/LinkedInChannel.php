<?php

namespace AppBundle\Service\Article\Publisher\Channel;

use Happyr\LinkedIn\LinkedIn;
use Exception;
use AppBundle\Service\Article\Publisher\Publisher;
use AppBundle\Entity\Social\Article;

class LinkedInChannel extends AbstractChannelTemplate implements ChannelInterface
{
    /**
     * @param Article $article
     *
     * @return ChannelPostingResult
     */
    public function post(Article $article)
    {
        $linkedIn = new LinkedIn(
            $this->appId,
            $this->secret
        );
        $linkedIn->setAccessToken($article->getAuthor()->getLinkedinAccessToken());

        $options = ['json' => [
            'comment' => $this->getBody($article),
            'visibility' => [
                'code' => 'anyone',
            ],
        ]];

        try {
            $response = $linkedIn->post('v1/people/~/shares', $options);
        } catch (Exception $e) {
            $response = $this->getExceptionResponse($e);
        }

        $isPositive = isset($response['updateKey']);

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
            "%s\n%s\n%s",
            $article->getTitle(),
            $article->getSubtitle(),
            $this->getUrl($article)
        );
    }

    /**
     * @return string
     */
    public function getName()
    {
        return Publisher::CHANNEL_LINKEDIN;
    }
}
