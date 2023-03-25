<?php

namespace AppBundle\Command\Geo;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use AppBundle\Entity\Embeddable\Coords;

class GeocodeReverseCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('geocode:reverse')
            ->setDescription('Reverse geocode a latitude / longitude')
            ->addArgument('latitude', InputArgument::REQUIRED, 'The latitude to reverse geocode')
            ->addArgument('longitude', InputArgument::REQUIRED, 'The longitude to reverse geocode')
            ->addArgument('country', InputArgument::OPTIONAL, 'ISO country code')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $app = $this->getContainer();
        $latitude = $input->getArgument('latitude');
        $longitude = $input->getArgument('longitude');
        $country = $input->getArgument('country');

        $reverse = $app->get('reverse_geocoder');

        if (!$places = $reverse->lookup(new Coords($latitude, $longitude), $country)) {
            return;
        }

        foreach ($places as $id => $geoname) {
            $output->writeln('<info>'.str_pad($id, 8).' => '.$geoname['name'].'</info>');
        }
    }
}
