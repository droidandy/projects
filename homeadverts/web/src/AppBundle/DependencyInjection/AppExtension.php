<?php

namespace AppBundle\DependencyInjection;

use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;
use Symfony\Component\Config\FileLocator;

class AppExtension extends Extension
{
    /**
     * {@inheritdoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $path = __DIR__.'/../Resources/config/services';
        $locator = new FileLocator($path);
        $loader = new YamlFileLoader($container, $locator);

        foreach (glob($path.'/*.yml') as $file) {
            $loader->load(basename($file));
        }
    }
}
