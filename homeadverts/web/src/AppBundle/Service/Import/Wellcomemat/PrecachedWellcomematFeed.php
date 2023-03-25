<?php

namespace AppBundle\Service\Import\Wellcomemat;

use AppBundle\Import\Queue\ImportContext;
use Doctrine\Common\Cache\CacheProvider;

class PrecachedWellcomematFeed implements WellcomematFeedInterface
{
    const CACHE_KEY_TMPL = 'wellcomemat_videos_%s';
    const CACHE_TTL = 24 * 60 * 60;
    /**
     * @var ImportContext
     */
    private $importContext;
    /**
     * @var CacheProvider
     */
    private $cache;
    /**
     * @var WellcomematFeedInterface
     */
    private $wellcomematFeed;

    private $enabled = true;

    /**
     * PrecachedWellcomematFeed constructor.
     *
     * @param ImportContext            $importContext
     * @param CacheProvider            $cache
     * @param WellcomematFeedInterface $wellcomematFeed
     */
    public function __construct(
        ImportContext $importContext,
        CacheProvider $cache,
        WellcomematFeedInterface $wellcomematFeed
    ) {
        $this->importContext = $importContext;
        $this->cache = $cache;
        $this->wellcomematFeed = $wellcomematFeed;
    }

    /**
     * @return array|bool|mixed
     */
    public function getVideos()
    {
        if (!$this->wellcomematFeed->isEnabled()) {
            return [];
        }

        $key = $this->getKey();
        if ($this->cache->contains($key)) {
            return $this->cache->fetch($key);
        }

        $videos = $this->wellcomematFeed->getVideos();
        $this->cache->save($key, $videos, self::CACHE_TTL);

        return $videos;
    }

    public function precacheVideos()
    {
        if (!$this->wellcomematFeed->isEnabled()) {
            return;
        }

        $videos = $this->wellcomematFeed->getVideos();
        $this->cache->save($this->getKey(), $videos, self::CACHE_TTL);
    }

    /**
     * @return bool
     */
    public function isEnabled()
    {
        return $this->wellcomematFeed->isEnabled();
    }

    public function enable()
    {
        $this->wellcomematFeed->enable();
    }

    public function disable()
    {
        $this->wellcomematFeed->disable();
    }

    private function getKey()
    {
        return sprintf(self::CACHE_KEY_TMPL, $this->importContext->getImportJob()->getId());
    }
}
