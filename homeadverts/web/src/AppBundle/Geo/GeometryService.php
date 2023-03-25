<?php

namespace AppBundle\Geo;

use AppBundle\Entity\Location\Location;
use Guzzle\Http\ClientInterface;
use Guzzle\Http\Exception\BadResponseException;
use Symfony\Component\Stopwatch\Stopwatch;

class GeometryService implements GeometryServiceInterface
{
    /**
     * @var ClientInterface
     */
    private $client;
    /**
     * @var string
     */
    private $endpoint;
    /**
     * @var Stopwatch|null
     */
    private $stopwatch;

    private $cache = [];

    /**
     * @param $client
     * @param $endpoint
     * @param Stopwatch|null $stopwatch
     */
    public function __construct($client, $endpoint, Stopwatch $stopwatch = null)
    {
        $this->client = $client;
        $this->endpoint = $endpoint;
        $this->stopwatch = $stopwatch;
    }

    /**
     * @param Location $location
     *
     * @return array|null
     */
    public function getGeometry(Location $location)
    {
        if ($this->stopwatch) {
            $this->stopwatch->start('get_geometry', 'geometry_service');
        }
        $hash = spl_object_hash($location);
        if (array_key_exists($hash, $this->cache)) {
            if ($this->stopwatch) {
                $this->stopwatch->stop('get_geometry');
            }

            return $this->cache[$hash];
        }

        $location = $this->buildLocation($location);
        if (!$location) {
            if ($this->stopwatch) {
                $this->stopwatch->stop('get_geometry');
            }

            return null;
        }

        try {
            $geometry = $this->processRequest($location);
        } catch (\RuntimeException $e) {
            if (!in_array($e->getMessage(), ['No result was found', 'Bad Response'])) {
                throw $e;
            }

            return $this->cache[$hash] = null;
        } finally {
            if ($this->stopwatch) {
                $this->stopwatch->stop('get_geometry');
            }
        }

        return $this->cache[$hash] = $geometry['geom'];
    }

    /**
     * @param Location[] $locations
     */
    public function warmupGeometries(array $locations = [])
    {
        if ($this->stopwatch) {
            $this->stopwatch->start('warmup_geometries', 'geometry_service');
        }
        $locationInput = $locationIndices = [];
        foreach ($locations as $i => $location) {
            if ($loc = $this->buildLocation($location)) {
                $locationInput[] = $loc;
                $locationIndices[] = $i;
            }
        }

        if (empty($locationInput)) {
            if ($this->stopwatch) {
                $this->stopwatch->stop('warmup_geometries');
            }

            return null;
        }

        $geometries = $this->processMultiRequest($locationInput);
        foreach ($geometries as $i => $geometry) {
            $hash = spl_object_hash($locations[$locationIndices[$i]]);
            $this->cache[$hash] = !empty($geometry) ? $geometry['geom'] : null;
        }

        if ($this->stopwatch) {
            $this->stopwatch->stop('warmup_geometries');
        }
    }

    private function processRequest($location)
    {
        try {
            $response = $this->client
                ->get(sprintf('%s/geometry', rtrim($this->endpoint, '/')), null, [
                    'query' => ['location' => $location],
                ])
                ->send();
        } catch (BadResponseException $e) {
            $response = $e->getResponse();
            if (404 === $response->getStatusCode()) {
                throw new \RuntimeException('No result was found');
            } else {
                throw new \RuntimeException('Bad Response');
            }
        }

        return $response->json();
    }

    private function processMultiRequest($locations)
    {
        try {
            $response = $this->client
                ->get(sprintf('%s/geometries', rtrim($this->endpoint, '/')), null, [
                    'query' => ['locations' => $locations],
                ])
                ->send();
        } catch (BadResponseException $e) {
            throw new \RuntimeException('Bad Response');
        }

        return $response->json();
    }

    private function buildLocation(Location $location)
    {
        $name = $location->getHierarchy()[0];
        $type = $location->getTypes()[0];
        $structure[] = [
            'name' => $location->getCountry(),
            'type' => 'country',
        ];

        if ('country' == $type || !in_array($type, ['administrative_area_level_1', 'administrative_area_level_2', 'locality', 'sublocality_level_1', 'neighborhood'])) {
            return null;
        }

        if (0 === stripos($name, 'lon')) { // Temporarily to fix london issue
            return null;
        }

        return [
            'name' => $name,
            'type' => $type,
            'hierarchy' => $structure,
            'coords' => [
                'lat' => $location->getCoords()->getLatitude(),
                'long' => $location->getCoords()->getLongitude(),
            ],
        ];
    }
}
