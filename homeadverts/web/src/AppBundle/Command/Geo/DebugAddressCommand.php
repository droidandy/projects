<?php

namespace AppBundle\Command\Geo;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class DebugAddressCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('debug:address')
            ->setDescription('Debug a property address, with its Geocoded Long/Lats and address string')
            ->addArgument('property', InputArgument::REQUIRED, 'The property ID to check')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $app = $this->getContainer();
        $geocoder = $app->get('address_geocoder');
        $property = $app
            ->get('doctrine.orm.entity_manager')
            ->getRepository('AppBundle:Property\Property')
            ->find((int) $input->getArgument('property'))
        ;

        $output->writeln('<info>Property Found</info>');
        $output->writeln('<info>Address: '.$property->getAddress().'</info>');
        $output->writeln('<info>Coordinates: '.$geocoder->geocode($property).'</info>');
    }
}
