<?php

namespace AppBundle\Command\Cache;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use AppBundle\Imagine\QueueCacheResolver;

class ImagineCacheIndexCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('imagine:cache:list_index_items')
            ->setDescription('Cache index')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $app = $this->getContainer();
        /** @var QueueCacheResolver $cacheResolver */
        $cacheResolver = $app->get('liip_imagine.cache.resolver.default');

        $items = $cacheResolver->getIndexItems();
        foreach ($items as $item) {
            echo $item."\n";
        }
    }
}
