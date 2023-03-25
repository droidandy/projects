<?php

namespace AppBundle\Command\Import;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class StopCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('import:stop')
            ->setDescription('Stops and clears all running imports')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $redis = $this->getContainer()->get('redis_client');

        $redis->dequeue('import_process');
    }
}
