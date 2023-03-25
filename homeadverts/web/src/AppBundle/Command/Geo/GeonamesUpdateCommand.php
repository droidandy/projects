<?php

namespace AppBundle\Command\Geo;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class GeonamesUpdateCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('geonames:update')
            ->setDescription('Updates elasticsearch with geographic data from the geonames database')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        ini_set('memory_limit', '1000M');

        $app = $this->getContainer();
        $db = $app->get('doctrine.dbal.geonames_connection');
        $progress = $this->getHelperSet()->get('progress');

        $total = $db->fetchColumn("SELECT COUNT(*) FROM geoname WHERE (fclass = 'P' OR fclass = 'A') AND fclass <> 'H'");
        $perPage = 10000;
        $totalPages = ceil($total / $perPage);
        $progress->start($output, $total);

        for ($i = 0; $i < $totalPages; ++$i) {
            $result = $db->query("
                SELECT
                    geonameid, latitude, longitude, country, fclass, fcode
                FROM
                    geoname
                WHERE
                    (fclass = 'P' OR fclass = 'A') AND fclass <> 'H'
                LIMIT
                    ".($i * $perPage).', '.$perPage.'
            ');

            $data = '';

            while ($row = $result->fetch()) {
                $row = (object) $row;
                $data .= '{"index": {"_id": "'.$row->geonameid.'"}}'."\n";
                $data .= json_encode([
                    'location' => [
                        'lat' => (float) $row->latitude,
                        'lon' => (float) $row->longitude,
                    ],
                    'country' => $row->country,
                    'fclass' => $row->fclass,
                    'fcode' => $row->fcode,
                ])."\n";
            }

            $document = [
                'index' => 'geonames',
                'type' => 'geoname',
                'body' => trim($data),
            ];

            $ret = $app->get('es_client')->bulk($document);
            $progress->advance($perPage);
        }

        $progress->finish();
    }
}
