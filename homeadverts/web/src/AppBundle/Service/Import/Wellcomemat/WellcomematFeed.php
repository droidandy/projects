<?php

namespace AppBundle\Service\Import\Wellcomemat;

use AppBundle\Helper\SprintfLoggerTrait;
use GuzzleHttp\Exception\TransferException;
use Psr\Log\LoggerInterface;

class WellcomematFeed implements WellcomematFeedInterface
{
    use SprintfLoggerTrait;

    const WELLCOMEMAT_DOMAIN = 'www.wellcomemat.com';

    /**
     * @var WellcomematGuzzleAdapter
     */
    private $adapter;
    /**
     * @var LoggerInterface
     */
    private $logger;
    /**
     * @var bool
     */
    private $enabled = true;

    public static function buildEmbedUrl($hash)
    {
        return sprintf('//%s/embed/%s', self::WELLCOMEMAT_DOMAIN, $hash);
    }

    public function __construct(WellcomematGuzzleAdapter $adapter, LoggerInterface $logger, $enabled = true)
    {
        $this->adapter = $adapter;
        $this->logger = $logger;
        $this->enabled = $enabled;
    }

    public function getVideos()
    {
        if (!$this->enabled) {
            return [];
        }

        try {
            $this->debug('[WELLCOMEMAT] requesting queryAll endpoint');
            $medias = $this->adapter->queryAll([
                'status' => WellcomematGuzzleAdapter::ACTIVE,
                'video_type' => WellcomematGuzzleAdapter::RESIDENTIAL_REAL_ESTATE_VIDEO,
            ]);
            if (!isset($medias['success']) || 1 != $medias['success']) {
                $this->error('Wellcomemat error %s', json_encode($medias));
                $medias = [];
            } else {
                $medias = $medias['medias'];
            }
        } catch (TransferException $e) {
            $this->error('Wellcomemat transfer error [%s] "%s"', $e->getCode(), $e->getMessage());
            $medias = [];
        }

        $aggregatedByCustomIdVideos = [];
        foreach ($medias as $media) {
            $customId = $media['customid'];
            if ($this->isValidCustomId($customId)) {
                $aggregatedByCustomIdVideos[$customId][] = $media;
            }
        }

        return $aggregatedByCustomIdVideos;
    }

    public function isEnabled()
    {
        return $this->enabled;
    }

    public function enable()
    {
        $this->enabled = true;
    }

    public function disable()
    {
        $this->enabled = false;
    }

    private function isValidCustomId($customId)
    {
        return !empty($customId) && preg_match('/^[0-9A-Z]{6,6}$/', $customId);
    }
}
