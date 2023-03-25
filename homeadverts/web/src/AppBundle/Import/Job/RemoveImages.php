<?php

namespace AppBundle\Import\Job;

use AppBundle\Imagine\QueueCacheResolver;
use Aws\S3\S3Client;
use Predis\Client;

class RemoveImages extends ResqueJob
{
    const FAILED_KEYS_SET = 'imagine_failed_keys';
    /**
     * @var array
     */
    private $defaultFilters = ['property_small', 'property_medium', 'property_large', 'property_extra_large'];
    /**
     * @var QueueCacheResolver
     */
    private $cacheResolver;
    /**
     * @var Client
     */
    private $redis;

    public function run($args, $app)
    {
        /** @var S3Client $s3Client */
        $s3Client = $this->get('ha.s3_client');
        $this->cacheResolver = $this->get('liip_imagine.cache.resolver.default');
        $this->redis = $this->get('snc_redis.default');
        $images = $args['images'];
        foreach ($images as $image) {
            $path = ltrim($image['path'], '/');
            $keysForAws = [
                [
                    'Key' => $path,
                ],
            ];
            $filtersToClear = empty($image['filters']) ? $this->defaultFilters : $image['filters'];

            $this->log('Removing key {key} with filters {filters}', [
                'key' => $image,
                'filters' => json_encode($filtersToClear),
            ]);
            foreach ($filtersToClear as $filterToClear) {
                $keysForAws[] = [
                    'Key' => ltrim($filterToClear.'/'.$path, '/'),
                ];
            }
            $attempts = 0;
            $successKeys = $errorKeys = [];
            while (!empty($keysForAws) && $attempts < 3) {
                // todo: hardcoded AWS bucket!
                $response = $s3Client->deleteObjects([
                    'Bucket' => 'properties-homeadverts-com',
                    'Delete' => [
                        'Objects' => $keysForAws,
                    ],
                ]);
                ++$attempts;
                if (!empty($response['Deleted'])) {
                    foreach ($response['Deleted'] as $item) {
                        $successKeys[] = [
                            'key' => $item['Key'],
                            'filter' => strstr($item['Key'], '/', true),
                            'path' => $path,
                        ];
                    }
                }
                if (empty($response['Errors'])) {
                    break;
                }
                $keysForAws = [];
                foreach ($response['Errors'] as $error) {
                    $keysForAws[] = [
                        'Key' => $error['Key'],
                    ];
                    $errorKeys[] = [
                        'key' => $error['Key'],
                        'code' => isset($error['Code']) ? $error['Code'] : null,
                        'message' => isset($error['Message']) ? $error['Message'] : null,
                    ];
                }
            }
            if (!empty($errorKeys)) {
                $this->log('Key {key} failed with errors "{errors}"', [
                    'key' => $image,
                    'errors' => json_encode($errorKeys),
                ]);
                $this->redis->sadd(self::FAILED_KEYS_SET, [json_encode($errorKeys)]);
            }
            // clear cache after images removed from storage
            $this->clearCache($successKeys);
        }
    }

    private function clearCache($successKeys)
    {
        if (empty($successKeys)) {
            return;
        }
        $cacheKeys = [];
        foreach ($successKeys as $successKey) {
            $cacheKey = $this->cacheResolver->generateKeyPattern($successKey['path'], $successKey['filter']);
            $cacheKeys[] = '['.$cacheKey.'][1]';
        }
        $this->redis->del($cacheKeys);
    }
}
