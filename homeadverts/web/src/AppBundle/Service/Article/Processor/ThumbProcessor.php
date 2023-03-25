<?php

namespace AppBundle\Service\Article\Processor;

use AppBundle\Service\Article\Image\ThumbStrategy;
use AppBundle\Service\Article\Image\ThumbStrategyInterface;
use AppBundle\Entity\Social\Article;
use AppBundle\Entity\Social\ArticleImage;
use AppBundle\Entity\Storage\File;
use AppBundle\Service\File\Storage\S3FileStorage;
use AppBundle\Import\Job\PrepareThumbnails;
use AppBundle\Helper\RedisClient;

class ThumbProcessor implements ProcessorInterface
{
    /**
     * @var ThumbStrategy
     */
    private $thumbStrategy;
    /**
     * @var array
     */
    private $thumbs = [];
    /**
     * @var RedisClient
     */
    private $redisClient;

    /**
     * @param ThumbStrategyInterface $thumbStrategy
     * @param RedisClient            $redisClient
     */
    public function __construct(
        ThumbStrategyInterface $thumbStrategy,
        RedisClient $redisClient
    ) {
        $this->thumbStrategy = $thumbStrategy;
        $this->redisClient = $redisClient;
    }

    /**
     * {@inheritdoc}
     */
    public function process(Article $article)
    {
        foreach ($article->getImages() as $articleImage) {
            if ($this->shouldBeProcessed($articleImage)) {
                $filters = $this->thumbStrategy->getFilters($articleImage);
                $this->enqueueThumbPreprocessing($articleImage, $filters);
            }
        }

        $this->scheduleThumbPreprocessing();
    }

    /**
     * @param ArticleImage $articleImage
     *
     * @return bool
     */
    private function shouldBeProcessed(ArticleImage $articleImage)
    {
        return $articleImage->getId();
    }

    /**
     * @param ArticleImage $articleImage
     * @param $filters
     */
    private function enqueueThumbPreprocessing(ArticleImage $articleImage, $filters)
    {
        $name = $this->getOriginalName($articleImage->getFile());
        $this->thumbs[] = [
            'path' => $name,
            'force' => false,
            'fitlers' => $filters,
        ];
    }

    private function scheduleThumbPreprocessing()
    {
        foreach ($this->thumbs as $thumb) {
            $this->redisClient->enqueue('thumb_process', PrepareThumbnails::class, ['images' => [$thumb]]);
        }
    }

    /**
     * @param File $file
     *
     * @return string
     */
    private function getOriginalName(File $file)
    {
        return '/'.S3FileStorage::BUCKET_DIR_MEDIA.'/'.$file->getNameOnStorage();
    }
}
