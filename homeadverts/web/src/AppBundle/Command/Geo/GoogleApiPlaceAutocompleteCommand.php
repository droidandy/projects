<?php

namespace AppBundle\Command\Geo;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class GoogleApiPlaceAutocompleteCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('google-api:geo')
            ->setDescription('Autocomplete objects from Google Place API')
            ->addArgument('cmd', InputArgument::REQUIRED, 'command to run')
            ->addArgument('term', InputArgument::REQUIRED, 'term to autocomplete')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $command = $input->getArgument('cmd');
        switch ($command) {
            case 'place_autocomplete':
                $term = $input->getArgument('term');
                $response = $this->getContainer()->get('ha.google_maps_provider')->requestPlacesAutocompleteByQuery($term);
                break;
            case 'geocode':
                $term = $input->getArgument('term');
                $response = $this->getContainer()->get('ha.google_maps_provider')->requestPlacesByQuery($term);
                break;
        }

        $output->writeln(json_encode($response, JSON_PRETTY_PRINT));
    }
}
