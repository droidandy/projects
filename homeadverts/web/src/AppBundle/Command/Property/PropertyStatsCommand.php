<?php

namespace AppBundle\Command\Property;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class PropertyStatsCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('property:stats')
            ->setDescription('Get stats about the properties stored in elasticsearch')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $ret = $this->getContainer()->get('es_client')->indices()->getSettings(['index' => 'properties']);

        var_dump($ret);
    }
}
