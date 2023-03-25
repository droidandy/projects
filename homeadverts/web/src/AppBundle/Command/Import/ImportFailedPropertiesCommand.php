<?php

namespace AppBundle\Command\Import;

use AppBundle\Service\Import\Importer;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class ImportFailedPropertiesCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('import:property-failed')
            ->setDescription('Import failed properties');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->getContainer()->get('ha.importer_failed_property')->import();
    }
}
