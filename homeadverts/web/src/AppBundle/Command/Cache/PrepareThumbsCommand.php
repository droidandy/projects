<?php

namespace AppBundle\Command\Cache;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use AppBundle\Import\Job\PrepareThumbnails;
use Symfony\Component\Console\Input\InputOption;

class PrepareThumbsCommand extends Command
{
    protected $dryRun = false;
    protected $filters = [];

    protected function configure()
    {
        $this
            ->setName('thumbs:prepare')
            ->setDescription('Preprocess facade thumbs')
            ->addOption('dry-run', null, InputOption::VALUE_NONE, 'Doesnt add to queue')
            ->addOption('filters', null, InputOption::VALUE_REQUIRED | InputOption::VALUE_IS_ARRAY, 'Thumb filters')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->dryRun = (bool) $input->getOption('dry-run');
        if ($this->dryRun) {
            echo "Running in dry-run mode\n";
        }
        $this->filters = $input->getOption('filters');
        if ($this->filters) {
            if (!empty(array_diff($this->filters, ['property_small', 'property_large', 'property_medium']))) {
                throw new \Exception('Unexpected filter type');
            }
            echo 'Running for filters '.implode(' ', $this->filters)."\n";
        } else {
            return;
        }
        $app = $this->getContainer();
        $db = $app->get('database_connection');

        /** @var QueueCacheResolver $cacheResolver */
        $cacheResolver = $app->get('liip_imagine.cache.resolver.default');
        $count = 0;

        $currentId = 0;
        $images = [];
        $sql = <<<SQL
                SELECT pp.property_id AS id, pp.url AS url FROM property_photo pp JOIN property p ON pp.property_id = p.id WHERE p.status = 100 ORDER BY pp.property_id, pp.sort
SQL;
        $stmt = $db->query($sql);

        while ($row = $stmt->fetch()) {
            $id = $row['id'];
            $url = $row['url'];
            if ($currentId !== $id && !empty($images)) {
                $this->addToQueue($images);
                $images = [];
            }
            $filters = [];
            foreach ($this->filters as $filter) {
                $path = ltrim(parse_url($url)['path'], '/');
                if (!$cacheResolver->isInCache($path, $filter)) {
                    $filters[] = $filter;
                }
            }
            if (!empty($filters)) {
                ++$count;
                $images[] = [
                    'path' => parse_url($url)['path'],
                    'force' => false,
                    'filters' => $filters,
                ];
            }
        }

        if (!empty($images)) {
            $this->addToQueue($images);
        }

        echo 'Added images = '.$count."\n";
    }

    protected function addToQueue($images)
    {
        $redis = $this->getContainer()->get('redis_client');

        if (!$this->dryRun) {
            $redis->enqueue('thumb_process', PrepareThumbnails::class, ['images' => $images]);
        }
    }
}
