<?php

namespace AppBundle\Command\Import;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class ImportCleanupHistoryCommand extends Command
{
    protected function configure()
    {
        $this->setName('import:cleanup-history');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();
        $db = $container->get('db');

        $db->executeQuery('
            DELETE FROM import_property;
            DELETE FROM import_user;
            DELETE FROM import_office;
            DELETE FROM import_company;
        ');
    }
}
