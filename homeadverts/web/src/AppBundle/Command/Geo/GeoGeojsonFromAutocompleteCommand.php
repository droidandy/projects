<?php

namespace AppBundle\Command\Geo;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class GeoGeojsonFromAutocompleteCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('geo:geojson-from-autocomplete')
            ->setDescription('Get geojson from HA Geo service for top autocomplete entry')
            ->addArgument('term', InputArgument::REQUIRED, 'term to autocomplete')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $term = $input->getArgument('term');

        $locationFactory = $this->getContainer()->get('location_factory');
        $geometryService = $this->getContainer()->get('ha.geometry_service');

        $location = $locationFactory->getLocationsFromPredictions($term)[0];

        $geometry = $geometryService->getGeometry($location);

        $output->write(json_encode($geometry));
    }
}
