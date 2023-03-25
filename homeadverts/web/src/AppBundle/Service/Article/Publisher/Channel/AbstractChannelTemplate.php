<?php

namespace AppBundle\Service\Article\Publisher\Channel;

use Symfony\Component\Routing\Router;
use Exception;
use AppBundle\Entity\Social\Article;

abstract class AbstractChannelTemplate
{
    /**
     * @var string
     */
    protected $appId;
    /**
     * @var string
     */
    protected $secret;
    /**
     * @var Router
     */
    protected $router;

    /**
     * @param string $appId
     * @param string $secret
     * @param Router $router
     */
    public function __construct($appId, $secret, Router $router)
    {
        $this->appId = $appId;
        $this->secret = $secret;
        $this->router = $router;
    }

    /**
     * @param Article $article
     *
     * @return string
     */
    protected function getUrl(Article $article)
    {
        return $this->router->generate('ha_article_details', [
            'slug' => $article->getSlug(),
            'token' => $article->getToken(),
        ], true);
    }

    /**
     * @param Exception $e
     *
     * @return array
     */
    protected function getExceptionResponse(Exception $e)
    {
        return [$e->getMessage()];
    }
}
