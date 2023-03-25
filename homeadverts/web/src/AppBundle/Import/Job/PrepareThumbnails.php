<?php

namespace AppBundle\Import\Job;

use Symfony\Component\DependencyInjection\ContainerInterface;

class PrepareThumbnails extends ResqueJob
{
    public function run($args, $app)
    {
        /** @var ContainerInterface $app */
        $cacheManager = $app->get('liip_imagine.cache.manager');
        $cacheResolver = $app->get('liip_imagine.cache.resolver.default');
        $awsResolver = $app->get('liip_imagine.cache.resolver.default.cached');
        $dataManager = $app->get('liip_imagine.data.manager');
        $filterManager = $app->get('liip_imagine.filter.manager');
        $filters = ['property_small', 'property_medium', 'property_large',];
        $images = $args['images'];
        $this->log(sprintf('Started processing: %s', json_encode($args)));
        foreach ($images as $image) {
            $path = ltrim($image['path'], '/');
            $force = $image['force'];
            $this->log(sprintf('Processing: %s', $path));
            foreach ($filters as $filter) {
                if (isset($image['filters']) && !in_array($filter, $image['filters'])) {
                    continue;
                }
                if ($force || (!$cacheResolver->isInCache($path, $filter) && !$awsResolver->isStored($path, $filter))) {
                    $this->log(sprintf('Applying filter: %s', $filter));
                    $binary = $dataManager->find($filter, $path);

                    $cacheManager->store(
                        $filterManager->applyFilter($binary, $filter),
                        $path,
                        $filter
                    );

                    unset($binary);
                }

                $cacheManager->resolve($path, $filter);
            }
        }
        $this->log('Started processing');
    }
}
