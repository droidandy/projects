<?php

namespace Test;

use AppBundle\Entity\Location\Location;
use AppBundle\Geo\GeometryServiceInterface;

class HardcodedGeometryService implements GeometryServiceInterface
{
    public function warmupGeometries(array $locations = [])
    {
        return;
    }

    public function getGeometry(Location $location)
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

        // TODO replicate geometry_service work around until fixed
        if (0 === stripos($name, 'lon')) {
            return null;
        }

        switch ($location->getName()) {
            case 'California, USA':
                $geoJson = json_decode(file_get_contents(__DIR__.'/geo/ca.geojson'), true); break;
            case 'San Francisco, CA, USA':
                $geoJson = json_decode(file_get_contents(__DIR__.'/geo/san_francisco.geojson'), true); break;
            case 'Los Angeles, CA, USA':
                $geoJson = json_decode(file_get_contents(__DIR__.'/geo/los_angeles.geojson'), true); break;
            case 'Manhattan, New York, NY, USA':
                $geoJson = json_decode(file_get_contents(__DIR__.'/geo/manhattan.geojson'), true); break;
            case 'New York, NY, USA':
                $geoJson = json_decode(file_get_contents(__DIR__.'/geo/new_york.geojson'), true); break;
            case 'New South Wales, Australia':
                $geoJson = json_decode(file_get_contents(__DIR__.'/geo/new_south_wales.geojson'), true); break;
            case 'New Delhi, Delhi, India':
                $geoJson = json_decode(file_get_contents(__DIR__.'/geo/new_delhi.geojson'), true); break;
            case 'New York, IA, USA':
                $geoJson = json_decode(file_get_contents(__DIR__.'/geo/new_york_ia.geojson'), true); break;
            case 'New Orleans, LA, USA':
                $geoJson = json_decode(file_get_contents(__DIR__.'/geo/new_orleans.geojson'), true); break;
            default:
                throw new \RuntimeException('Unexpected location');
        }

        return isset($geoJson['geom']) ? $geoJson['geom'] : null;
    }
}
