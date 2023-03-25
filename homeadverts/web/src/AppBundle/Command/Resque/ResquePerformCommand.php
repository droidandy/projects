<?php

namespace AppBundle\Command\Resque;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Resque;

class ResquePerformCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('resque:perform')
            ->setDescription('Run a resque job manually')
            ->addArgument('class', InputArgument::REQUIRED, 'The Job class to run')
            ->addArgument('args', InputArgument::REQUIRED, 'The arguments to pass in (as JSON)')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $app = $this->getContainer();
        $className = $input->getArgument('class');
        $obj = new $className($app);
        $obj->args = json_decode($input->getArgument('args'), true);

        $obj->perform();
    }
}
