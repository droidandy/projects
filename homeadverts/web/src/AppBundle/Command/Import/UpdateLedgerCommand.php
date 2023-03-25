<?php

namespace AppBundle\Command\Import;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class UpdateLedgerCommand extends Command
{
    protected function configure()
    {
        $this->setName('import:ledger:update');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->getContainer()->get('app.ledger_service')->update();
    }
}
