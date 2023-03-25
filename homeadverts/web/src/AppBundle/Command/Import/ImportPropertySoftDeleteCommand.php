<?php

namespace AppBundle\Command\Import;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class ImportPropertySoftDeleteCommand extends Command
{
    protected function configure()
    {
        $this->setName('import:property:soft-delete-outdated');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this
            ->getContainer()
            ->get('ha.property.service')
            ->softDeleteOutdatedProperties();
    }
}
