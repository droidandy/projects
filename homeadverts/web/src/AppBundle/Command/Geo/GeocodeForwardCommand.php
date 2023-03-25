<?php

namespace AppBundle\Command\Geo;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class GeocodeForwardCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('geocode:forward')
            ->setDescription('Geocode an address string and get a long/lat back')
            ->addArgument('address', InputArgument::REQUIRED, 'The address to geocode')
            ->addArgument('country', InputArgument::OPTIONAL, 'ISO country code')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $address = $input->getArgument('address');
        $country = $input->getArgument('country');
        $geocoder = $this->getContainer()->get('geocoder');
        $propertyRepo = $this->getContainer()->get('property_repo');

        if (is_numeric($address)) {
            if (!($property = $propertyRepo->find($address))) {
                $output->writeln('<error>Property not found</error>');

                return;
            }

            if (!($coords = $this->getContainer()->get('address_geocoder')->geocode($property))) {
                $output->writeln('<error>'.$geocoder->getLastError()->getMessage().'</error>');

                return;
            }

            $output->writeln('<info>'.$coords.'</info>');

            return;
        }

        if (!($coords = $geocoder->geocode($address, $country))) {
            $output->writeln('<error>'.$geocoder->getLastError()->getMessage().'</error>');

            return;
        }

        $output->writeln('<info>'.$coords.'</info>');
    }
}
