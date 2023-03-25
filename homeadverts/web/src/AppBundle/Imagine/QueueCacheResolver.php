<?php

namespace AppBundle\Imagine;

use Liip\ImagineBundle\Imagine\Cache\Resolver\CacheResolver;

class QueueCacheResolver extends CacheResolver
{
    protected $queued = [];
    /**
     * @var array
     */
    private $responses = [];

    public function isStored($path, $filter)
    {
        $cacheKey = $this->generateCacheKey($path, $filter);

        if (!isset($this->responses[$cacheKey])) {
            $this->responses[$cacheKey] = $this->cache->contains($cacheKey);
        }

        return $this->responses[$cacheKey];
    }

    public function isInCache($path, $filter)
    {
        $cacheKey = $this->generateCacheKey($path, $filter);

        return $this->cache->contains($cacheKey);
    }

    public function addToCache($resolved, $path, $filter)
    {
        $key = $this->generateCacheKey($path, $filter);
        $this->saveToCache($key, $resolved);
    }

    public function getIndexItems()
    {
        $indexKey = $this->generateIndexKey($this->generateCacheKey(null, 'property_large'));

        return $this->cache->fetch($indexKey);
    }

    public function generateKeyPattern($path, $filter)
    {
        $key = $this->generateCacheKey($path, $filter);
        if (null === $path) {
            $key = '*'.str_replace('\\', '\\\\', rtrim($key, '.')).'.*';
        }

        return $key;
    }

    protected function saveToCache($cacheKey, $content)
    {
        return $this->cache->save($cacheKey, $content);
    }
}
