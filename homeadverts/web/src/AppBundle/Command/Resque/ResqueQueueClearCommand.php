<?php

namespace AppBundle\Command\Resque;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class ResqueQueueClearCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('resque:queue:clear')
            ->setDescription('Clear a resque queue')
            ->addArgument('queue', InputArgument::REQUIRED, 'The queue to clear')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $queue = $input->getArgument('queue');
        $redis = $this->getContainer()->get('redis_client');

        $redis->dequeue($queue);
    }
}
