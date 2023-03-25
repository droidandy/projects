<?php

namespace AppBundle\Service\Oauth;

use Doctrine\Common\Cache\CacheProvider;
use Sainsburys\Guzzle\Oauth2\AccessToken;
use Sainsburys\Guzzle\Oauth2\GrantType\GrantTypeInterface;

class CachedGrantType implements GrantTypeInterface
{
    const KEY_NAME = '_oauth_access_token';
    const INVALIDATION_DELTA = 30;
    const DEFAULT_TTL = 3600;
    /**
     * @var CacheProvider
     */
    private $cache;
    /**
     * @var GrantTypeInterface
     */
    private $grantType;
    /**
     * @var string
     */
    private $prefix;

    /**
     * @param CacheProvider      $cache
     * @param GrantTypeInterface $grantType
     */
    public function __construct(CacheProvider $cache, GrantTypeInterface $grantType, $prefix = '')
    {
        $this->cache = $cache;
        $this->grantType = $grantType;
        $this->prefix = $prefix;
    }

    /**
     * @return AccessToken
     */
    public function getToken()
    {
        $accessToken = $this->getCachedAccessToken();

        if (!$accessToken) {
            $accessToken = $this->grantType->getToken();
            $this->cacheAccessToken($accessToken);
        }

        return $accessToken;
    }

    /**
     * @param string $name
     *
     * @return mixed|null
     */
    public function getConfigByName($name)
    {
        return $this->grantType->getConfigByName($name);
    }

    /**
     * @return array
     */
    public function getConfig()
    {
        return $this->grantType->getConfig();
    }

    /**
     * @return null|AccessToken
     */
    private function getCachedAccessToken()
    {
        /** @var AccessToken $accessToken */
        $accessToken = $this->cache->fetch($this->getKey());

        if (false !== $accessToken && !$accessToken->isExpired()) {
            return $accessToken;
        }

        return null;
    }

    /**
     * @param AccessToken $accessToken
     */
    private function cacheAccessToken(AccessToken $accessToken)
    {
        if ($accessToken->getExpires()) {
            $now = $this->getCurrentDateTime();
            $ttl = $accessToken->getExpires()->getTimestamp() - $now->getTimestamp() - self::INVALIDATION_DELTA;
            if ($ttl <= 0) {
                throw new \RuntimeException(
                    sprintf(
                        'AccessToken has expiration date "%s" at "%s"',
                        $accessToken->getExpires()->format('r'),
                        $now->format('r')
                    )
                );
            }
        } else {
            $ttl = self::DEFAULT_TTL;
        }

        $this->cache->save($this->getKey(), $accessToken, $ttl);
    }

    /**
     * @return string
     */
    private function getKey()
    {
        return $this->prefix.self::KEY_NAME;
    }

    /**
     * @return \DateTime
     */
    protected function getCurrentDateTime()
    {
        return new \DateTime();
    }
}
