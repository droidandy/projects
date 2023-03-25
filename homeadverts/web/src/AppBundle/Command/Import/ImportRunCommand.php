<?php

namespace AppBundle\Command\Import;

use AppBundle\Service\Import\Importer;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class ImportRunCommand extends Command
{
    protected function configure()
    {
        // datasync:active
        // datasync:delta
        $this->setName('import:run');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->getContainer()->get('ha.importer')->import('datasync:active');
    }
}
