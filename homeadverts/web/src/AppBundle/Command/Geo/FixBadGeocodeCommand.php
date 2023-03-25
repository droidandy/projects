<?php

namespace AppBundle\Command\Geo;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand as Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Intl\Intl;
use Symfony\Component\Console\Helper\ProgressBar;

class FixBadGeocodeCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('fix:bad_geocode')
            ->setDescription('Fixes properties that couldnt be geocoded correctly')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $app = $this->getContainer();
        $this->db = $app->get('database_connection');
        $geo = $app->get('doctrine.dbal.geonames_connection');
        $this->geocoder = $app->get('geocoder');

        $properties = $this->db->fetchAll("
            SELECT id, address_street, address_aptBldg, address_townCity, address_stateCounty, address_country, address_neighbourhood, address_zip FROM property
            WHERE address_country <> 'US'
        ");

        $timestamps = [];

        $addressGeocoder = $app->get('address_geocoder');

        if (!$properties) {
            return;
        }

        $total = count($properties);
        $progress = new ProgressBar($output, $total);
        $progress->setFormat(" %current%/%max% [%bar%] %percent:3s%% %elapsed:6s%/%estimated:-6s% %memory:6s%\n%message%");
        $progress->setMessage('Starting geocoding...');
        $progress->start();

        foreach ($properties as $property) {
            $addresses = $this->getAddresses($property);

            $found = false;
            for ($i = 0; $i < 3; ++$i) {
                $timestamps[] = microtime(true);
                $progress->setMessage($addresses[$i]);
                if ($this->geocodeAndSave($addresses[$i], $property['id'])) {
                    $found = true;
                    break;
                }
            }

            if (!$found) {
                var_dump('No address found for property ID ('.$property['id'].') : '.$addresses[0]);
            }

            // Check to see how long the last 10 requests took and if we need to sleep.
            $qps = 10;
            if (count($timestamps) >= $qps) {
                $last = array_slice($timestamps, -1);
                $prev = array_slice($timestamps, -$qps, 1);
                $diff = $last[0] - $prev[0];

                if ($diff < 1) {
                    dump('Sleeping for '.$diff);
                    usleep($diff * 1000000);
                }
            }

            $progress->advance();
        }

        $progress->finish();
    }

    public function getAddresses($property)
    {
        $countryName = $property['address_country'];

        $addressFull = implode(', ', array_unique(array_filter([
            $property['address_aptBldg'],
            $property['address_street'],
            $property['address_townCity'],
            $property['address_stateCounty'],
            $property['address_zip'],
            $countryName,
        ])));

        $addressNoStreet = implode(', ', array_unique(array_filter([
            $property['address_townCity'],
            $property['address_stateCounty'],
            $property['address_zip'],
            $countryName,
        ])));

        $addressNoState = implode(', ', array_unique(array_filter([
            $property['address_townCity'],
            $countryName,
        ])));

        return [$addressFull, $addressNoStreet, $addressNoState];
    }

    protected function signQuery($query)
    {
        $url = parse_url($query);

        $urlPartToSign = $url['path'].'?'.$url['query'];

        // Decode the private key into its binary format
        $decodedKey = base64_decode(str_replace(['-', '_'], ['+', '/'], '5pNTcAjmpG25oGfpwk2sTgzreYM='));

        // Create a signature using the private key and the URL-encoded
        // string using HMAC SHA1. This signature will be binary.
        $signature = hash_hmac('sha1', $urlPartToSign, $decodedKey, true);

        $encodedSignature = str_replace(['+', '/'], ['-', '_'], base64_encode($signature));

        return sprintf('%s&signature=%s', $query, $encodedSignature);
    }

    protected function geocodeAndSave($address, $propertyId)
    {
        if (!$result = $this->geocoder->geocode($address)) {
            return false;
        }

        $this->db->executeUpdate('UPDATE property SET address_latitude = ?, address_longitude = ? WHERE id = ? LIMIT 1', [
            $result->getLatitude(),
            $result->getLongitude(),
            $propertyId,
        ]);

        return true;
    }
}
