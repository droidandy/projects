<?php

namespace AppBundle\Command\Cache;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use AppBundle\Imagine\QueueCacheResolver;
use Symfony\Component\Console\Input\InputOption;

class ImagineRemoveCacheCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('imagine:cache:remove')
            ->setDescription('Cache remover')
            ->addArgument('paths', InputArgument::OPTIONAL | InputArgument::IS_ARRAY, 'Image paths')
            ->addOption(
                'filters',
                'f',
                InputOption::VALUE_OPTIONAL | InputOption::VALUE_IS_ARRAY,
                'Filters list'
            )
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $app = $this->getContainer();
        /** @var QueueCacheResolver $cacheResolver */
        $cacheResolver = $app->get('liip_imagine.cache.resolver.default');
        $filterConfig = $app->get('liip_imagine.filter.configuration');
        $redis = $app->get('snc_redis.default');

        $paths = $input->getArgument('paths');
        $filters = $input->getOption('filters');

        if (empty($filters)) {
            $filters = array_keys($filterConfig->all());
        }
        if (!is_array($filters)) {
            $filters = array($filters);
        }
        if (!is_array($paths)) {
            $paths = array($paths);
        }

        foreach ($filters as $filter) {
            if (!empty($paths)) {
                foreach ($paths as $path) {
                    $key = $cacheResolver->generateKeyPattern($path, $filter);
                    $keys = $redis->keys($key);
                    foreach ($keys as $key) {
                        $redis->del($key);
                    }
                }
            } else {
                $key = $cacheResolver->generateKeyPattern(null, $filter);
                echo 'Pattern: '.$key."\n";
                $keys = $redis->keys($key);
                echo 'Keys count: '.count($keys)."\n";
                foreach ($keys as $key) {
                    $redis->del($key);
                }
            }
        }
    }
}
