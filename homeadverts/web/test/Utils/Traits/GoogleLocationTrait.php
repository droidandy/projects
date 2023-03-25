<?php

namespace Test\Utils\Traits;

use AppBundle\Entity\Location\GoogleLocation;

trait GoogleLocationTrait
{
    private $googleLocationsByPlaceId = [];

    public function newGoogleLocation(array $googleLocationData = [])
    {
        if (isset($this->googleLocationsByPlaceId[$googleLocationData['place_id']])) {
            return $this->googleLocationsByPlaceId[$googleLocationData['place_id']];
        }

        $googleLocationData = array_replace_recursive([
            'id' => 1,
            'place_id' => 'ChIJb-IaoQug2EcRi-m4hONz8S8',
            'address_components' => [
                [
                    'long_name' => 'Greater London',
                    'short_name' => 'Greater London',
                    'types' => ['administrative_area_level_2', 'political'],
                ],
                [
                    'long_name' => 'England',
                    'short_name' => 'England',
                    'types' => ['administrative_area_level_1', 'political'],
                ],
                [
                    'long_name' => 'United Kingdom',
                    'short_name' => 'GB',
                    'types' => ['country', 'political'],
                ],
            ],
            'formatted_address' => 'Greater London, UK',
            'geometry' => [
                'bounds' => [
                    'northeast' => [
                        'lat' => 51.6918726,
                        'lng' => 0.3339957,
                    ],
                    'southwest' => [
                        'lat' => 51.28676,
                        'lng' => -0.5103751,
                    ],
                ],
                'location' => [
                    'lat' => 51.4309209,
                    'lng' => -0.0936496,
                ],
                'location_type' => 'APPROXIMATE',
                'viewport' => [
                    'northeast' => [
                        'lat' => 51.6918726,
                        'lng' => 0.3339957,
                    ],
                    'southwest' => [
                        'lat' => 51.28676,
                        'lng' => -0.5103751,
                    ],
                ],
            ],
            'types' => ['administrative_area_level_2', 'political'],
        ], $googleLocationData);

        $googleLocationData = json_decode(json_encode($googleLocationData));

        $this->googleLocationsByPlaceId[$googleLocationData->place_id] = $googleLocation = new GoogleLocation($googleLocationData);
        $googleLocation->setId($googleLocationData->id);

        return $googleLocation;
    }
}
