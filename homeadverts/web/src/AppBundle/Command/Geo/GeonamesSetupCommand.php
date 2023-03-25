<?php

namespace AppBundle\Command\Geo;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class GeonamesSetupCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('geonames:setup')
            ->setDescription('Updates elasticsearch with geonames mappings')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $app = $this->getContainer();

        $mappings = [
            'properties' => [
                'location' => [
                    'type' => 'geo_point',
                    'lat_lon' => true,
                    'geohash_prefix' => true,
                ],
                'address' => [
                    'type' => 'string',
                    'index' => 'not_analyzed',
                ],
                'country' => [
                    'type' => 'string',
                    'index' => 'not_analyzed',
                ],
                'photo' => [
                    'type' => 'string',
                    'index' => 'not_analyzed',
                ],
                'bedrooms' => [
                    'type' => 'byte',
                ],
                'bathrooms' => [
                    'type' => 'byte',
                ],
                'price' => [
                    'type' => 'integer',
                ],
                'type' => [
                    'type' => 'integer',
                ],
                'rental' => [
                    'type' => 'boolean',
                ],
                'date_added' => [
                    'type' => 'date',
                ],
                'date_updated' => [
                    'type' => 'date',
                ],
            ],
        ];

        $index = [
            'index' => 'geonames',
            'body' => [
                'mappings' => [
                    'geoname' => $mappings,
                ],
            ],
        ];

        if ($app->get('es_client')->indices()->exists(['index' => $index['index']])) {
            // First delete any existing index
            $app->get('es_client')->indices()->delete(['index' => $index['index']]);
        }

        var_dump($app->get('es_client')->indices()->create($index));
    }
}
