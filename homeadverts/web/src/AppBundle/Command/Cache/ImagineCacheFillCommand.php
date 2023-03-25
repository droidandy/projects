<?php

namespace AppBundle\Command\Cache;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use AppBundle\Import\Job\CheckThumb;
use AppBundle\Imagine\QueueCacheResolver;

class ImagineCacheFillCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('imagine:cache:fill')
            ->setDescription('Preprocess facade thumbs')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $app = $this->getContainer();
        $redis = $this->getContainer()->get('redis_client');

        /** @var QueueCacheResolver $cacheResolver */
        $cacheResolver = $app->get('liip_imagine.cache.resolver.default');
        $db = $app->get('database_connection');

        $currentId = 0;
        $images = [];
        $sql = <<<SQL
                SELECT pp.property_id AS id, pp.url AS url FROM property_photo pp JOIN property p ON pp.property_id = p.id WHERE p.status = 100 ORDER BY pp.property_id, pp.sort
SQL;
        $stmt = $db->query($sql);

        while ($row = $stmt->fetch()) {
            $id = $row['id'];
            $path = parse_url($row['url'])['path'];
            if ($currentId !== $id && !empty($images)) {
                $redis->enqueue('cache_process', CheckThumb::class, $images);
                $images = [];
            }
            if (!$cacheResolver->isInCache($path, 'property_small')) {
                $images[] = [
                    'path' => $path,
                    'filter' => 'property_small',
                ];
            }
            if (!$cacheResolver->isInCache($path, 'property_medium')) {
                $images[] = [
                    'path' => $path,
                    'filter' => 'property_medium',
                ];
            }
            if (!$cacheResolver->isInCache($path, 'property_large')) {
                $images[] = [
                    'path' => $path,
                    'filter' => 'property_large',
                ];
            }
        }

        if (!empty($images)) {
            $redis->enqueue('cache_process', CheckThumb::class, $images);
        }
    }
}
