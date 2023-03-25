<?php

namespace AppBundle\Geo\Geocode;

use AppBundle\Entity\Embeddable\Address;
use Doctrine\Common\Cache\CacheProvider;
use GuzzleHttp\Promise as P;

class CachedHttpClient implements HttpClientInterface
{
    const CACHE_TTL = 30 * 24 * 60 * 60;

    const CACHE_ZERO_RESULT_OR_FAILURE_TTL = 24 * 60 * 60;
    /**
     * @var CacheProvider
     */
    private $cache;
    /**
     * @var HttpClientInterface
     */
    private $httpClient;

    /**
     * @param CacheProvider       $cache
     * @param HttpClientInterface $httpClient
     */
    public function __construct(CacheProvider $cache, HttpClientInterface $httpClient)
    {
        $this->cache = $cache;
        $this->httpClient = $httpClient;
    }

    /**
     * @param string $path
     * @param string $country
     *
     * @return P\PromiseInterface
     */
    public function geocodeAsync($path, $country)
    {
        return P\promise_for($this->tryToFetchFromCache(
            [$path, $country],
            function () use ($path, $country) {
                return $this
                    ->httpClient
                    ->geocodeAsync($path, $country)
                    ->then(
                        function ($result) use ($path, $country) {
                            $this->tryToCache($result, [$path, $country]);

                            return $result;
                        }
                    )
                ;
            }
        ));
    }

    /**
     * @param string $path
     * @param string $country
     *
     * @return bool|mixed
     */
    public function geocode($path, $country)
    {
        return $this->tryToFetchFromCache(
            [$path, $country],
            function () use ($path, $country) {
                $data = $this
                    ->httpClient
                    ->geocode($path, $country)
                ;
                $this->tryToCache($data, [$path, $country]);

                return $data;
            }
        );
    }

    /**
     * @param Address $address
     *
     * @return P\PromiseInterface
     */
    public function reverseGeocodeAsync(Address $address)
    {
        return P\promise_for($this->tryToFetchFromCache(
            $address,
            function () use ($address) {
                return $this
                    ->httpClient
                    ->reverseGeocodeAsync($address)
                    ->then(
                        function ($result) use ($address) {
                            $this->tryToCache($result, $address);

                            return $result;
                        }
                    )
                ;
            }
        ));
    }

    /**
     * @param Address $address
     *
     * @return bool|mixed
     */
    public function reverseGeocode(Address $address)
    {
        return $this->tryToFetchFromCache(
            $address,
            function () use ($address) {
                $data = $this
                    ->httpClient
                    ->reverseGeocode($address)
                ;
                $this->tryToCache($data, $address);

                return $data;
            }
        );
    }

    /**
     * @param $request
     * @param callable $fallbackCb
     *
     * @return bool|mixed
     */
    private function tryToFetchFromCache($request, callable $fallbackCb)
    {
        $data = $this->fetch($request);
        if (false === $data) {
            $data = $fallbackCb();
        }

        return $data;
    }

    /**
     * @param $result
     * @param $request
     */
    private function tryToCache($result, $request)
    {
        switch ($result->status) {
            case 'OK':
                $this->cache($result, self::CACHE_TTL, $request); break;
            case 'ZERO_RESULTS':
            case 'INVALID_REQUEST':
                $this->cache($result, self::CACHE_ZERO_RESULT_OR_FAILURE_TTL, $request); break;
            case 'OVER_DAILY_LIMIT':
            case 'OVER_QUERY_LIMIT':
            case 'REQUEST_DENIED':
            case 'UNKNOWN_ERROR':
            default:
        }
    }

    /**
     * @param $result
     * @param $ttl
     * @param $request
     *
     * @return bool
     */
    private function cache($result, $ttl, $request)
    {
        return $this->cache->save(
            $this->getKey($request),
            $result,
            $ttl
        );
    }

    /**
     * @param $request
     *
     * @return bool|mixed
     */
    private function fetch($request)
    {
        return $this->cache->fetch($this->getKey($request));
    }

    /**
     * @param $request
     *
     * @return string
     */
    private function getKey($request)
    {
        if (is_array($request)) {
            return implode('_', $request);
        } elseif ($request instanceof Address) {
            return (string) $request->getCoords();
        }

        throw new \InvalidArgumentException('Address or array expected');
    }
}
