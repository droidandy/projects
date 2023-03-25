<?php

namespace AppBundle\Command\Import;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class DataSyncApiRequestCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('datasync:api:request')
            ->setDescription('Populate all existing properties with guid by listing-id')
            ->addArgument('cmd', InputArgument::REQUIRED)
            ->addArgument('args', InputArgument::IS_ARRAY)
            ->addOption('pretty-print', InputOption::VALUE_NONE)
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $dataSyncClient = $this->getContainer()->get('ha.import.datasync_client');

        $cmd = $input->getArgument('cmd');
        $args = $input->getArgument('args');
        switch (true) {
            case false !== strpos($cmd, 'ById'):
                $result = $dataSyncClient->$cmd($args[0])->wait(true); break;
            case false !== strpos($cmd, 'Delta'):
                $result = [];
                foreach ($dataSyncClient->$cmd(new \DateTime($args[0]), ...array_slice($args, 1)) as $page) {
                    $result[] = $page;
                }
                break;
            default:
                $result = $dataSyncClient->$cmd(...$args)->wait(true); break;
        }

        $output->write(json_encode($result, $input->getOption('pretty-print') ? JSON_PRETTY_PRINT : 0)."\n");
    }
}
