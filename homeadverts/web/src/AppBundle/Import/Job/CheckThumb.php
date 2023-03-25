<?php

namespace AppBundle\Import\Job;

use Symfony\Component\DependencyInjection\ContainerInterface;

class CheckThumb extends ResqueJob
{
    public function run($args, $app)
    {
        /** @var ContainerInterface $app */
        $cacheResolver = $app->get('liip_imagine.cache.resolver.default');
        $awsResolver = $app->get('liip_imagine.cache.resolver.default.cached');

        $queued = $args;

        foreach ($queued as $item) {
            $path = ltrim($item['path'], '/');
            $filter = $item['filter'];
            if (!$cacheResolver->isInCache($path, $filter)) {
                if ($awsResolver->isStored($path, $filter)) {
                    $resolved = $awsResolver->resolve($path, $filter);
                    $cacheResolver->addToCache($resolved, $path, $filter);
                    $this->log(sprintf('Added to cache: %s', $path));
                }
            }
        }
    }
}
