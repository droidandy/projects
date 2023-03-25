<?php

namespace AppBundle\Import\Media;

use AppBundle\Helper\SprintfLoggerTrait;
use Aws\S3\S3Client;
use Psr\Log\LoggerInterface;

class AWSImageRemover
{
    use SprintfLoggerTrait;

    const MAX_ATTEMPTS = 3;
    /**
     * @var S3Client
     */
    private $client;
    /**
     * @var string[]
     */
    private $thumbFilters = [];
    /**
     * @var string
     */
    private $bucket;
    /**
     * @var LoggerInterface
     */
    private $logger;
    /**
     * @var int
     */
    private $attempts = 0;

    /**
     * AWSImageRemover constructor.
     *
     * @param S3Client        $client
     * @param string[]        $thumbFilters
     * @param string          $bucket
     * @param LoggerInterface $logger
     */
    public function __construct(S3Client $client, array $thumbFilters, $bucket, LoggerInterface $logger)
    {
        $this->client = $client;
        $this->thumbFilters = $thumbFilters;
        $this->bucket = $bucket;
        $this->logger = $logger;
    }

    public function removeFromStorage($images)
    {
        $imagesToRemove = [];
        foreach ($images as $image) {
            $imagesToRemove[] = $preparedImage = $this->prepareImage($image);
            foreach ($this->thumbFilters as $thumbFilter) {
                $imagesToRemove[] = sprintf('%s/%s', $thumbFilter, $preparedImage);
            }
        }

        $this->removeImages($imagesToRemove);
    }

    private function removeImages($images)
    {
        ++$this->attempts;
        $result = $this->client->deleteObjects([
            'Bucket' => $this->bucket,
            'Delete' => [
                'Objects' => array_map(function ($object) {
                    return ['Key' => $object];
                }, $images),
            ],
        ]);
        foreach ((array) $result['Deleted'] as $deletedObject) {
            $this->log('Image %s removal succeeded', $deletedObject['Key']);
        }
        if (!empty($result['Errors'])) {
            $this->retry($result['Errors']);
        }
    }

    private function prepareImage($image)
    {
        return ltrim(parse_url($image)['path'], '/');
    }

    private function retry($errors)
    {
        if ($this->attempts <= self::MAX_ATTEMPTS) {
            ++$this->attempts;
            $images = array_map(function ($error) {
                return $error['Key'];
            }, $errors);
            $this->removeImages($images);
        } else {
            $this->attempts = 0;
            foreach ($errors as $error) {
                $this->log('Image %s removal failed. "%s : %s"', $error['Key'], $error['Code'], $error['Message']);
            }
        }
    }
}
