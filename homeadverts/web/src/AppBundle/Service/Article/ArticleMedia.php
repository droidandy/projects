<?php

namespace AppBundle\Service\Article;

use AppBundle\Entity\Property\Property;
use AppBundle\Entity\Storage\File;
use AppBundle\Entity\Social\Article;
use AppBundle\Service\File\Storage\S3FileStorage;
use AppBundle\Service\File\ImageHelper;
use AppBundle\Service\PropertyService;
use Liip\ImagineBundle\Imagine\Cache\CacheManager;

class ArticleMedia
{
    /**
     * @var S3FileStorage
     */
    private $storage;
    /**
     * @var ImageHelper
     */
    protected $imageHelper;
    /**
     * @var CacheManager
     */
    protected $cacheManager;

    /**
     * @param S3FileStorage $storage
     * @param ImageHelper   $imageHelper
     * @param CacheManager  $cacheManager
     */
    public function __construct(
        S3FileStorage $storage,
        ImageHelper $imageHelper,
        CacheManager $cacheManager
    ) {
        $this->storage = $storage;
        $this->imageHelper = $imageHelper;
        $this->cacheManager = $cacheManager;
    }

    /**
     * @param Article $article
     * @param string  $filterName
     *
     * @return string
     */
    public function getArticlePrimaryImage(Article $article, string $filterName): string
    {
        if ($this->isPrimaryImagePropertyImage($article)) {
            return $this->getPropertyImage($article, $filterName);
        }

        return $this->getMediaImage($article, $filterName);
    }

    /**
     * @param Article $article
     * @param string  $filterName
     *
     * @return string
     */
    private function getPropertyImage(Article $article, $filterName = Property::FILTER_THUMBNAIL_MEDIUM)
    {
        $meta = unserialize($article->getPrimaryImage()->getFile()->metadata);

        if ($meta) {
            $url = $this->imageHelper->getImagePath($meta['ObjectURL']);

            return $this->cacheManager->getBrowserPath($url, $filterName);
        }

        return '';
    }

    /**
     * @param File   $file
     * @param string $filterName
     *
     * @return string
     */
    public function getCroppedImage(File $file, $filterName)
    {
        $imageUrl = $file->url;

        if (!$imageUrl) {
            $imageUrl = $file->metadata['ObjectURL'];
        }

        $url = parse_url($imageUrl, PHP_URL_PATH);

        return $this->cacheManager->getBrowserPath($url, $filterName);
    }

    /**
     * @param Article $article
     * @param string  $filterName
     *
     * @return string
     */
    private function getMediaImage(Article $article, $filterName)
    {
        if ($article->getPrimaryImage()) {
            $file = $article->getPrimaryImage()->getFile();

            return $this->getCroppedImage($file, $filterName);
        }

        return '';
    }

    /**
     * @param Article $article
     *
     * @return bool
     */
    private function isPrimaryImagePropertyImage(Article $article)
    {
        if ($article->isImportedFromProperty() && $article->getPrimaryImage()) {
            $meta = unserialize($article->getPrimaryImage()->getFile()->metadata);

            if ($meta) {
                return false !== strpos($meta['ObjectURL'], S3FileStorage::BUCKET_DIR_PROPERTY);
            }
        }

        return false;
    }
}
