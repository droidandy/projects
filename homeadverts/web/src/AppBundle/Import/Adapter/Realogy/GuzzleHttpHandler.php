<?php

namespace AppBundle\Import\Adapter\Realogy;

use AppBundle\Service\Oauth\CachedGrantType;
use GuzzleHttp\Client;
use GuzzleHttp\HandlerStack as GuzzleHandlerStack;
use GuzzleHttp\MessageFormatter;
use GuzzleHttp\Middleware as GuzzleMiddleware;
use Psr\Http\Message\RequestInterface;
use Sainsburys\Guzzle\Oauth2\Middleware\OAuthMiddleware;
use Sainsburys\Guzzle\Oauth2\GrantType\ClientCredentials;

class GuzzleHttpHandler
{
    const LOG_FORMAT = '[{ts}] {host} "{method} {target} HTTP/{version}" {code}';

    protected $client;

    public function __construct($configs, callable $httpHandler = null)
    {
        $handler = GuzzleHandlerStack::create($httpHandler);

        $oauthMiddleware = $this->buildOauthMiddleware($configs['oauth'], $httpHandler);
        $handler->push($oauthMiddleware->onBefore(), 'oauth_onbefore');
        $handler->push($oauthMiddleware->onFailure(5), 'oauth_onfailure');

        $handler->push(GuzzleMiddleware::retry(function ($retries, $request, $response, $reason) {
            if (
                (
                    null === $reason
                    && $response
                    && 429 != $response->getStatusCode()
                )
                || $retries > 5
            ) {
                return false;
            }

            return true;
        }), 'retry');

        if (!empty($configs['logger'])) {
            $handler->push(GuzzleMiddleware::log($configs['logger'], new MessageFormatter(self::LOG_FORMAT)), 'log');
        }

        $this->client = new Client([
            'handler' => $handler,
            'auth' => 'oauth2',
        ]);
    }

    public function __invoke(RequestInterface $request)
    {
        return $this->client->sendAsync($request);
    }

    protected function buildOauthMiddleware($oauthConfigs, callable $httpHandler = null)
    {
        $oauthClient = new Client([
            'handler' => $httpHandler,
        ]);
        $cache = $oauthConfigs['cache'];
        $cachePrefix = $oauthConfigs['cache_prefix'];
        unset($oauthConfigs['cache'], $oauthConfigs['cache_prefix']);

        $grantType = new CachedGrantType(
            $cache,
            new ClientCredentials($oauthClient, $oauthConfigs),
            $cachePrefix
        );

        return new OAuthMiddleware($oauthClient, $grantType);
    }
}
