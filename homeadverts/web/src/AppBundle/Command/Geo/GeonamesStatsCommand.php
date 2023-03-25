<?php

namespace AppBundle\Command\Geo;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class GeonamesStatsCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('geonames:stats')
            ->setDescription('Get stats about the geonames stored in elasticsearch')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $ret = $this->getContainer()->get('es_client')->indices()->getSettings(['index' => 'geonames']);

        var_dump($ret);
    }
}
