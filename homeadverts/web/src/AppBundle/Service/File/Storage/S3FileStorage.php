<?php

namespace AppBundle\Service\File\Storage;

use AppBundle\Entity\Storage\File;
use Aws\S3\S3Client;
use Guzzle\Http\EntityBody;
use Aws\S3\Exception\S3Exception;

class S3FileStorage implements FileStorageInterface
{
    /**
     * @var string
     */
    const BUCKET_DIR_MEDIA = 'media';
    const BUCKET_DIR_PROPERTY = 'properties';
    /**
     * @var array
     */
    const META_WHITE_LIST = [
        'Bucket',
        'ETag',
        'Expiration',
        'Key',
        'Location',
        'RequestCharged',
        'SSEKMSKeyId',
        'ServerSideEncryption',
        'VersionId',
    ];
    /**
     * @var S3Client
     */
    private $client;
    /**
     * @var string
     */
    private $bucket;

    /**
     * @param S3Client $client
     * @param $bucket
     */
    public function __construct(S3Client $client, $bucket)
    {
        $this->client = $client;
        $this->bucket = $bucket;
    }

    /**
     * @param File $file
     */
    public function save(File $file)
    {
        $fileName = $this->getName($file);

        try {
            $responseMeta = $this->client->headObject([
                'Bucket' => $this->bucket,
                'Key' => $fileName,
            ])->toArray();
            $meta = array_intersect_key(
                $responseMeta,
                array_flip($this::META_WHITE_LIST)
            );
            $meta['ObjectURL'] = $this->getUrl($file);
        } catch (S3Exception $e) {
            if (404 !== $e->getStatusCode()) {
                throw $e;
            }
            $meta = $this->client->putObject([
                'Bucket' => $this->bucket,
                'Key' => $fileName,
                'ContentType' => $file->mimeType,
                'Body' => $this->getStream($file),
                'ACL' => 'public-read',
            ]);
        }

        $file->metadata = $meta;
    }

    /**
     * @param File $file
     *
     * @return string
     */
    public function getUrl(File $file)
    {
        return $this->client->getObjectUrl(
            $this->bucket,
            $this->getName($file)
        );
    }

    /**
     * @param File $file
     *
     * @return string
     */
    private function getName(File $file)
    {
        return rtrim(self::BUCKET_DIR_MEDIA, '/').'/'.$file->getNameOnStorage();
    }

    /**
     * @param File $file
     *
     * @return EntityBody
     */
    private function getStream(File $file)
    {
        return EntityBody::factory(fopen($file->fileInfo->getPathname(), 'r+'));
    }
}
