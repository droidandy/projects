<?php

namespace AppBundle\Command\Cache;

use AppBundle\Imagine\QueueCacheResolver;
use AppBundle\Import\Job\PrepareThumbnails;
use Aws\S3\S3Client;
use Doctrine\DBAL\Connection;
use Predis\Client;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class ImagineCacheSyncCommand extends ContainerAwareCommand
{
    const THUMBS_TO_PROCESS = 'fixer_imagine_thumbs_to_process';
    /**
     * @var S3Client
     */
    private $s3Client;
    /**
     * @var QueueCacheResolver
     */
    private $cacheResolver;
    /**
     * @var Client
     */
    private $redis;
    private $filters = ['property_small', 'property_medium', 'property_large'];

    protected function configure()
    {
        $this
            ->setName('imagine:cache:sync')
            ->setDescription('Preprocess facade thumbs')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $app = $this->getContainer();
        $redis = $this->getContainer()->get('redis_client');

        /** @var Connection $db */
        $db = $app->get('db');
        $this->redis = $app->get('snc_redis.default');
        $this->s3Client = $app->get('ha.s3_client');
        $this->cacheResolver = $app->get('liip_imagine.cache.resolver.default');

        $sql = <<<SQL
                SELECT url FROM property_photo
SQL;
        $stmt = $db->query($sql);

        $thumbsToProcess = 0;
        $this->redis->set(self::THUMBS_TO_PROCESS, 0);
        while ($url = $stmt->fetchColumn()) {
            $key = ltrim(parse_url($url)['path'], '/');

            $filtersToReprocess = [];
            foreach ($this->filters as $filter) {
                $s3Key = $filter.'/'.$key;

                $doesExist = $this->doesObjectExist($s3Key);

                if (!$doesExist) {
                    $filtersToReprocess[] = $filter;
                }
            }

            if (!empty($filtersToReprocess)) {
                foreach ($filtersToReprocess as $filter) {
                    $cacheKey = $this->cacheResolver->generateKeyPattern($key, $filter);
                    $status = $this->redis->del(['['.$cacheKey.'][1]']);

                    $output->writeln(sprintf('Removing key from cache "%s" "%s"', $cacheKey, $status));
                }

                $image = [
                    'path' => $key,
                    'force' => false,
                    'filters' => $filtersToReprocess,
                ];

                $output->writeln(sprintf('Scheduling key for reprocess "%s"', json_encode($image)));
                $thumbsToProcess = $this->redis->incrby(self::THUMBS_TO_PROCESS, count($filtersToReprocess));
                $redis->enqueue('thumb_process', PrepareThumbnails::class, ['images' => [$image]]);
            }
        }

        $output->writeln(sprintf('Successfully completed. Numbers of thumbs to process "%s"', $thumbsToProcess));
    }

    private function doesObjectExist($s3Key)
    {
        // todo: hardcoded AWS bucket!
        for ($i = 0; $i < 3; ++$i) {
            try {
                return $this
                    ->s3Client
                    ->doesObjectExist('properties-homeadverts-com', $s3Key)
                ;
            } catch (\Exception $e) {
            }
        }

        return false;
    }
}
