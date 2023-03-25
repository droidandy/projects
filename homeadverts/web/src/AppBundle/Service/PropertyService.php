<?php

namespace AppBundle\Service;

use AppBundle\Entity\Import\ImportLedger;
use Liip\ImagineBundle\Imagine\Cache\CacheManager;
use AppBundle\Entity\Property\Property;
use AppBundle\Service\File\ImageHelper;
use Doctrine\ORM\EntityManager;
use Doctrine\Common\Cache\CacheProvider;
use Symfony\Component\Stopwatch\Stopwatch;

class PropertyService
{
    const CACHE_NAMESPACE = 'property';
    const CACHE_TTL = 3600;
    const CACHE_TTL_LONG = 7 * 24 * 3600;

    const MISSING_IMAGE = '/assets/images/placeholder/coming-soon.jpg';

    /**
     * @var CacheProvider
     */
    protected $cache;
    /**
     * @var ImageHelper
     */
    protected $imageHelper;
    /**
     * @var CacheManager
     */
    protected $cacheManager;
    /**
     * @var EntityManager
     */
    private $em;
    /**
     * @var Stopwatch
     */
    private $stopwatch;

    /**
     * @param CacheProvider $cache
     * @param ImageHelper $imageHelper
     * @param CacheManager $cacheManager
     * @param EntityManager $entityManager
     */
    public function __construct(
        CacheProvider $cache,
        ImageHelper $imageHelper,
        CacheManager $cacheManager,
        EntityManager $entityManager,
        Stopwatch $stopwatch = null
    )
    {
        $this->cache = $cache;
        $this->imageHelper = $imageHelper;
        $this->cacheManager = $cacheManager;
        $this->em = $entityManager;
        $this->stopwatch = $stopwatch;
    }

    /**
     * @param Property $property
     * @param int $offset
     * @param int $length
     *
     * @return string
     */
    public function buildGallery(Property $property, int $offset = 1, int $length = 4)
    {
        $images = array_slice($property->getPhotosOrdered(), $offset, $length);

        $gallery = PHP_EOL . PHP_EOL;
        $rows = array_chunk($images, 3);
        $firstThreeRows = array_slice($rows, 0, 3);

        foreach ($firstThreeRows as $row) {
            $gallery .= '<div class="medium-insert-images medium-insert-images-grid">';

            foreach ($row as $image) {
                $imagePath = $this->imageHelper->getImagePath($image->url);
                $url = $this->cacheManager->getBrowserPath(
                    $imagePath,
                    Property::FILTER_THUMBNAIL_LARGE
                );

                $gallery .=
                    '<figure>
                        <img src="' . $url . '">
                    </figure>
                ';
            }

            $gallery .= '</div>' . PHP_EOL . PHP_EOL;
        }

        return $gallery;
    }

    /**
     * @param Property $property
     * @param string $thumbnail
     *
     * @return string
     */
    public function getPropertyThumbnail(
        Property $property,
        string $thumbnail = Property::FILTER_THUMBNAIL_LARGE
    ) : string
    {
        $primaryPhoto = $property->getPrimaryPhoto();

        if ($primaryPhoto) {
            $image = $this->imageHelper->getImagePath($primaryPhoto->getUrl());

            return $this->cacheManager->getBrowserPath($image, $thumbnail);
        }

        return self::MISSING_IMAGE;
    }

    /**
     * @param Property $property
     *
     * @return array
     */
    public function buildCarousel(Property $property)
    {
        $cacheKey = self::CACHE_NAMESPACE . '__carousel__' . $property->getId();
        if ($property->getDateUpdated() instanceof \DateTime) {
            $cacheKey .= $property->getDateUpdated()->format('U');
        }

        $carousel = $this->cache->fetch($cacheKey);
        if (!$carousel) {
            $cacheable = true;
            if ($this->stopwatch) {
                $this->stopwatch->start(
                    'carousel_build',
                    'image'
                );
            }

            $photos = $property->getPhotosOrdered();

            $carousel = [];
            $preloadedKeys = [0, 1, 2, count($photos) - 1, count($photos) - 2];

            foreach ($photos as $k => $photo) {
                $imagePath = $this->imageHelper->getImagePath($photo->getUrl());
                $image = $this->cacheManager->getBrowserPath(
                    $imagePath,
                    Property::FILTER_THUMBNAIL_LARGE
                );

                if (
                    $cacheable
                    && !$this->cacheManager->isStored(
                        $imagePath,
                        Property::FILTER_THUMBNAIL_LARGE
                    )
                ) {
                    $cacheable = false;
                }

                $cell = [
                    'id' => $photo->id,
                    'lazyload' => $image,
                    'hash' => $photo->getHash(),
                ];

                if (in_array($k, $preloadedKeys)) {
                    $cell['url'] = $image;
                } else {
                    $cell['url'] = '#';
                }

                $carousel[] = $cell;
            }

            if ($this->stopwatch) {
                $this->stopwatch->stop('carousel_build');
            }

            if ($cacheable) {
                $this->cache->save($cacheKey, $carousel, self::CACHE_TTL_LONG);
            }
        }

        return $carousel;
    }

    /**
     * @return int
     */
    public function getTotalPublishedPropertiesUsingCache()
    {
        $cacheKey = 'properties_total_published';
//        $this->cache->setNamespace(self::CACHE_NAMESPACE);
        $total = $this->cache->fetch($cacheKey);

        if (!$total) {
            $total = $this
                ->em
                ->getRepository(Property::class)
                ->getTotalPublished();

            $this->cache->save($cacheKey, $total, self::CACHE_TTL);
        }

        return $total;
    }

    public function softDeleteOutdatedProperties()
    {
        $date = (new \DateTime())->format('Y-m-d H:i:s');
        $properties = $this->em->getRepository(ImportLedger::class)->getOutdatedProperties();
        $sql = '';

        foreach ($properties as $p) {
            $sql .= sprintf(
                'UPDATE property SET status = %s, deletedAt = "%s" WHERE id = %s;',
                Property::STATUS_DELETED,
                $date,
                $p['id']
            );
        }

        $this->em->getConnection()->exec($sql);
    }
}
