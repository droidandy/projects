<?php

namespace AppBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class CurrencyUpdateCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('currency:update')
            ->setDescription('Updates the exchange rates stored in the database.')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $db = $this->getContainer()->get('database_connection');
        $appID = $this->getContainer()->getParameter('open_exchange_rates_app_id');
        $url = 'http://openexchangerates.org/api/latest.json?app_id='.$appID;

        $raw = @file_get_contents($url);
        $json = json_decode($raw);

        if (false === $raw || null === $json) {
            $output->writeln('<error>No JSON recieved.</error>');

            return;
        }

        if (isset($json->error) && $json->error) {
            $output->writeln('<error>'.$json->description.'</error>');

            return;
        }

        foreach ($json->rates as $code => $rate) {
            if (is_numeric($rate)) {
                $db->executeUpdate('UPDATE currency SET rate = ? WHERE id = ?', array((float) $rate, $code));
            }
        }
    }
}
