<?php

namespace Test\Utils\Traits;

use AppBundle\Entity\Embeddable\Address;
use AppBundle\Entity\Embeddable\Bounds;
use AppBundle\Entity\Embeddable\Coords;
use AppBundle\Entity\Location\GoogleLocation;
use AppBundle\Entity\Location\Location;
use Doctrine\ORM\EntityManager;

trait LocationTrait
{
    /**
     * @var bool
     */
    private $flush = true;
    /**
     * @var Location[]
     */
    private $locationEntities = [];
    /**
     * @var bool
     */
    private $createGoogleLocations = true;
    /**
     * @var array
     */
    private $googleLocationEntities = [];

    /**
     * @param array $locationData
     *
     * @return Location
     */
    public function newLocation(array $locationData = [])
    {
        $locationData = $locationData ?: $this->locations[array_rand($this->locations)];

        if ($locationData['coords']) {
            $locationData['coords'] = new Coords($locationData['coords']['lat'], $locationData['coords']['lng']);
        }
        if ($locationData['bounds']) {
            $locationData['bounds'] = new Bounds(
                new Coords($locationData['bounds']['northeast']['lat'], $locationData['bounds']['northeast']['lng']),
                new Coords($locationData['bounds']['southwest']['lat'], $locationData['bounds']['southwest']['lng'])
            );
        }
        if ($locationData['viewport']) {
            $locationData['viewport'] = new Bounds(
                new Coords($locationData['viewport']['northeast']['lat'], $locationData['viewport']['northeast']['lng']),
                new Coords($locationData['viewport']['southwest']['lat'], $locationData['viewport']['southwest']['lng'])
            );
        }

        if (!$locationData['distance']) {
            // calculate the distance needed based on the bounding box.
            if ($locationData['bounds'] || $locationData['viewport']) {
                $locationData['distance'] = $this->calculateDistance($locationData['bounds'] ?: $locationData['viewport']);
            } else {
                $locationData['distance'] = 1000; // default to 1km if it's just a single point and there's no bounds
            }
        }

        return new Location(
            $locationData['key'],
            $locationData['coords'],
            $locationData['distance'],
            $locationData['country'],
            $locationData['types'],
            $locationData['bounds'],
            $locationData['viewport'],
            $locationData['query'],
            $locationData['name'],
            $locationData['slug'],
            $locationData['locale'],
            $locationData['hierarchy'],
            $locationData['place_id']
        );
    }

    /**
     * @param string $locationName
     *
     * @return Location
     */
    public function getLocation($locationName)
    {
        return $this->locationEntities[$locationName];
    }

    /**
     * @param array ...$locationNames
     *
     * @return Location[]
     */
    public function createLocations(...$locationNames)
    {
        $locations = [];
        foreach ($locationNames as $locationName) {
            $this->locationEntities[$locationName] = $locations[] = $this->newLocation($this->locations[$locationName]);
        }

        return $locations;
    }

    /**
     * @param array ...$locationNames
     *
     * @return GoogleLocation[]
     */
    public function createCorrespondingGoogleLocations(...$locationNames)
    {
        $googleLocations = [];
        foreach ($locationNames as $locationName) {
            $this->googleLocationEntities[$locationName] = [];
            foreach ($this->locations[$locationName]['place_ids'] as $placeId) {
                $this->googleLocationEntities[$locationName][] = $googleLocations[] = $this->newGoogleLocation([
                    'place_id' => $placeId,
                ]);
            }
        }

        return $googleLocations;
    }

    /**
     * @param array ...$locationNames
     *
     * @return Location[]
     */
    public function createLocationsPersistent(...$locationNames)
    {
        $em = $this->getEntityManager();
        $locations = $this->createLocations(...$locationNames);
        foreach ($locations as $location) {
            $em->persist($location);
        }
        if ($this->createGoogleLocations) {
            $googleLocations = $this->createCorrespondingGoogleLocations(...$locationNames);
            foreach ($googleLocations as $googleLocation) {
                $em->persist($googleLocation);
            }
        }
        if ($this->flush) {
            $em->flush($locations);
        }

        return $locations;
    }

    /**
     * @return Location
     */
    protected function newLocationPersistent()
    {
        $location = $this->newLocation();

        $em = $this->getEntityManager();
        $em->persist($location);
        $em->flush($location);

        return $location;
    }

    /**
     * @param string $locationName
     *
     * @return Address
     */
    public function createAddressInLocation($locationName)
    {
        $location = $this->locations[$locationName];

        return $this->newAddress([
            'town_city' => $location['town_city'],
            'state_county' => $location['state_county'],
            'country' => $location['country'],
            'coords' => [
                'lat' => $location['coords']['lat'], // + (mt_rand(-10, 10) / 10000) * $location['coords']['lat'],
                'lng' => $location['coords']['lng'], // + (mt_rand(-10, 10) / 10000) * $location['coords']['lng'],
            ],
        ]);
    }

    /**
     * @param string $locationName
     *
     * @return GoogleLocation[]
     */
    public function getGoogleLocationsForLocation($locationName)
    {
        return $this->googleLocationEntities[$locationName];
    }

    protected function calculateDistance(Bounds $bounds)
    {
        $ne = $bounds->getNortheast();
        $sw = $bounds->getSouthwest();

        $width = $this->vincentyGreatCircleDistance(
            $ne->getLatitude(),
            $sw->getLongitude(),
            $ne->getLatitude(),
            $ne->getLongitude()
        );

        $height = $this->vincentyGreatCircleDistance(
            $ne->getLatitude(),
            $sw->getLongitude(),
            $sw->getLatitude(),
            $sw->getLongitude()
        );

        return hypot($width / 2, $height / 2);
    }

    /**
     * Calculates the great-circle distance between two points, with
     * the Vincenty formula.
     *
     * @param float $latitudeFrom  Latitude of start point in [deg decimal]
     * @param float $longitudeFrom Longitude of start point in [deg decimal]
     * @param float $latitudeTo    Latitude of target point in [deg decimal]
     * @param float $longitudeTo   Longitude of target point in [deg decimal]
     * @param float $earthRadius   Mean earth radius in [m]
     *
     * @return float Distance between points in [m]
     */
    protected function vincentyGreatCircleDistance($latitudeFrom, $longitudeFrom, $latitudeTo, $longitudeTo, $earthRadius = 6371000)
    {
        // convert from degrees to radians
        $latFrom = deg2rad($latitudeFrom);
        $lonFrom = deg2rad($longitudeFrom);
        $latTo = deg2rad($latitudeTo);
        $lonTo = deg2rad($longitudeTo);

        $lonDelta = $lonTo - $lonFrom;
        $a = pow(cos($latTo) * sin($lonDelta), 2) + pow(cos($latFrom) * sin($latTo) - sin($latFrom) * cos($latTo) * cos($lonDelta), 2);
        $b = sin($latFrom) * sin($latTo) + cos($latFrom) * cos($latTo) * cos($lonDelta);

        $angle = atan2(sqrt($a), $b);

        return $angle * $earthRadius;
    }

    /**
     * @return EntityManager
     */
    abstract public function getEntityManager();

    /**
     * @param array $googleLocationData
     *
     * @return GoogleLocation
     */
    abstract public function newGoogleLocation(array $googleLocationData = []);

    private $locations = [
        'Manhattan' => [
            'key' => 'e67a7fca6ab5760fc19e75b8eaa119354d10ae2e',
            'coords' => [
                'lat' => 40.7830603,
                'lng' => -73.9712488,
            ],
            'distance' => 12675.75,
            'country' => 'US',
            'state_county' => 'NY',
            'town_city' => 'New York',
            'types' => [
                'sublocality_level_1',
                'sublocality',
                'political',
            ],
            'bounds' => null,
            'viewport' => [
                'northeast' => [
                    'lat' => 40.820045,
                    'lng' => -73.90331300000001,
                ],
                'southwest' => [
                    'lat' => 40.698078,
                    'lng' => -74.03514899999999,
                ],
            ],
            'query' => 'Manhattan, New York, NY, USA',
            'name' => 'Manhattan, New York, NY, USA',
            'slug' => 'manhattan-new-york-ny-usa',
            'locale' => 'en',
            'hierarchy' => ['Manhattan', 'New York', 'New York County', 'United States'],
            'place_id' => 'ChIJYeZuBI9YwokRjMDs_IEyCwo',
            'place_ids' => [
                'ChIJYeZuBI9YwokRjMDs_IEyCwo',
                'ChIJHa5fkWJYwokR_psiHLKKLQg',
                'ChIJOwg_06VPwokRYv534QaPC8g',
                'ChIJOwE7_GTtwokRFq0uOwLSE9g',
                'ChIJqaUj8fBLzEwRZ5UY3sHGz90',
                'ChIJCzYy5IS16lQRQrfeQ5K5Oxw',
            ],
        ],
        'New York' => [
            'key' => '51fcbc49d7432a001a95650603a1994e2ee8a634',
            'coords' => [
                'lat' => 40.7127837,
                'lng' => -74.0059413,
            ],
            'distance' => 32982.43,
            'country' => 'US',
            'state_county' => 'NY',
            'town_city' => 'New York',
            'types' => [
                'locality',
                'political',
            ],
            'bounds' => null,
            'viewport' => [
                'northeast' => [
                    'lat' => 40.9152556,
                    'lng' => -73.7002721,
                ],
                'southwest' => [
                    'lat' => 40.4960439,
                    'lng' => -74.2557349,
                ],
            ],
            'query' => 'New York, NY, United States',
            'name' => 'New York, NY, USA',
            'slug' => 'new-york-ny-united-states',
            'locale' => 'en',
            'hierarchy' => ['New York', 'United States'],
            'place_id' => 'ChIJOwg_06VPwokRYv534QaPC8g',
            'place_ids' => [
                'ChIJYeZuBI9YwokRjMDs_IEyCwo', // this coordinates lie in  Manhattan
                'ChIJOwg_06VPwokRYv534QaPC8g',
                'ChIJOwE7_GTtwokRFq0uOwLSE9g',
                'ChIJqaUj8fBLzEwRZ5UY3sHGz90',
                'ChIJCzYy5IS16lQRQrfeQ5K5Oxw',
            ],
        ],
        'California' => [
            'key' => '98b6379e2d3db65368469d8285bf07f7ce11551f',
            'coords' => [
                'lat' => 36.778261,
                'lng' => -119.4179324,
            ],
            'distance' => 676595.97,
            'country' => 'US',
            'state_county' => 'CA',
            'town_city' => 'Sanger',
            'types' => [
                'administrative_area_level_1',
                'political',
            ],
            'bounds' => null,
            'viewport' => [
                'northeast' => [
                    'lat' => 42.0095169,
                    'lng' => -114.1313926,
                ],
                'southwest' => [
                    'lat' => 32.5342643,
                    'lng' => -124.415165,
                ],
            ],
            'query' => 'California',
            'name' => 'California, USA',
            'slug' => 'california',
            'locale' => 'en',
            'hierarchy' => ['California', 'United States'],
            'place_id' => 'ChIJPV4oX_65j4ARVW8IJ6IJUYs',
            'place_ids' => [
                'ChIJk4tAzslUlIAR510zS398TuI',
                'ChIJb4MUvgDhlIAR17RXLUdHFN0',
                'ChIJPV4oX_65j4ARVW8IJ6IJUYs',
                'ChIJCzYy5IS16lQRQrfeQ5K5Oxw',
            ],
        ],
        'London' => [
            'key' => '9f2e7dbd03764e9aa84363a21f10409512524be8',
            'coords' => [
                'lat' => 51.5073509,
                'lng' => -0.1277583,
            ],
            'distance' => 23499.31,
            'country' => 'GB',
            'state_county' => 'ENG',
            'town_city' => 'London',
            'types' => [
                'locality',
                'political',
            ],
            'bounds' => null,
            'viewport' => [
                'northeast' => [
                    'lat' => 51.6723432,
                    'lng' => 0.148271,
                ],
                'southwest' => [
                    'lat' => 51.3849401,
                    'lng' => -0.3514683,
                ],
            ],
            'query' => 'London, United Kingdom',
            'name' => 'London, UK',
            'slug' => 'london-united-kingdom',
            'locale' => 'en',
            'hierarchy' => ['London', 'Greater London', 'England', 'United Kingdom'],
            'place_id' => 'ChIJdd4hrwug2EcRmSrV3Vo6llI',
            'place_ids' => [
                'ChIJVbSVrt0EdkgRQH_FO4ZkHc0',
                'ChIJdd4hrwug2EcRmSrV3Vo6llI',
                'ChIJb-IaoQug2EcRi-m4hONz8S8',
                'ChIJ39UebIqp0EcRqI4tMyWV4fQ',
                'ChIJqZHHQhE7WgIReiWIMkOg-MQ',
            ],
        ],
        'Spain' => [
            'key' => '19d3acd445f78d87c828c582e3888d2cc30f745b',
            'coords' => [
                'lat' => 40.463667,
                'lng' => -3.74922,
            ],
            'distance' => 1271271.49,
            'country' => 'ES',
            'state_county' => 'Community of Madrid',
            'town_city' => 'Madrid',
            'types' => [
                'country',
                'political',
            ],
            'bounds' => null,
            'viewport' => [
                'northeast' => [
                    'lat' => 45.244,
                    'lng' => 5.098,
                ],
                'southwest' => [
                    'lat' => 35.173,
                    'lng' => -12.524,
                ],
            ],
            'query' => 'ES',
            'name' => 'Spain',
            'slug' => 'es',
            'locale' => 'en',
            'hierarchy' => ['Spain'],
            'place_id' => 'ChIJi7xhMnjjQgwR7KNoB5Qs7KY',
            'place_ids' => [
                'ChIJgTwKgJcpQg0RaSKMYcHeNsQ',
                'ChIJrVgv2uWGQQ0RMKyLM_dAAxw',
                'ChIJyWY3OH0oQg0RfZlQ7cCcRq0',
                'ChIJgXVwV1wvQg0RzPz8wabKb2k',
                'ChIJuTPgQHqBQQ0R8MpLvvNAAwM',
                'ChIJuTPgQHqBQQ0RgMhLvvNAAwE',
                'ChIJi7xhMnjjQgwR7KNoB5Qs7KY',
            ],
        ],
        'New Delhi' => [
            'key' => 'e1f1fde46bbacfb4b668ae5b8ccd8f1490d2bed3',
            'coords' => [
                'lat' => 28.6139391,
                'lng' => 77.2090212,
            ],
            'distance' => 19070.67,
            'country' => 'IN',
            'state_county' => 'DL',
            'town_city' => 'New Delhi',
            'types' => [
                'locality',
                'political',
            ],
            'bounds' => null,
            'viewport' => [
                'northeast' => [
                    'lat' => 28.6504799,
                    'lng' => 77.34496,
                ],
                'southwest' => [
                    'lat' => 28.4041,
                    'lng' => 77.07301,
                ],
            ],
            'query' => 'New Delhi, Delhi, India',
            'name' => 'New Delhi, Delhi 110001, India',
            'slug' => 'new-delhi-delhi-india',
            'locale' => 'en',
            'hierarchy' => ['New Delhi', 'Delhi', 'India', '110001'],
            'place_id' => 'ChIJLbZ-NFv9DDkRzk0gTkm3wlI',
            'place_ids' => [
                'ChIJLbZ-NFv9DDkRzk0gTkm3wlI',
                'ChIJu7zew6PiDDkRZFJw956QQ3Y',
                'ChIJV4lOJ7DiDDkRGETtqH1nMOk',
                'ChIJLbZ-NFv9DDkRQJY4FbcFcgM',
                'ChIJkbeSa_BfYzARphNChaFPjNc',
            ],
        ],
        'New South Wales' => [
            'key' => '3c34f38dd5412f51dc3cce78e01dc26808509bed',
            'coords' => [
                'lat' => -31.2532183,
                'lng' => 146.921099,
            ],
            'distance' => 808471.79,
            'country' => 'AU',
            'state_county' => 'NSW',
            'town_city' => 'Girilambone',
            'types' => [
                'administrative_area_level_1',
                'political',
            ],
            'bounds' => null,
            'viewport' => [
                'northeast' => [
                    'lat' => -28.1570199,
                    'lng' => 153.6386767,
                ],
                'southwest' => [
                    'lat' => -37.5051803,
                    'lng' => 140.9992792,
                ],
            ],
            'query' => 'New South Wales, Australia',
            'name' => 'New South Wales, Australia',
            'slug' => 'new-south-wales-australia',
            'locale' => 'en',
            'hierarchy' => ['New South Wales', 'Australia'],
            'place_id' => 'ChIJDUte93TLDWsRLZ_EIhGvgBc',
            'place_ids' => [
                'ChIJSd3KEvH9A2sRoHJDkLQJBgQ',
                'ChIJf3zLCfYBB2sR8DfTzLcJBhw',
                'ChIJDUte93TLDWsRLZ_EIhGvgBc',
                'ChIJ38WHZwf9KysRUhNblaFnglM',
            ],
        ],
        'New York IA' => [
            'key' => '9b56a8f8119b180d29a6f18f182fcdca9685322d',
            'coords' => [
                'lat' => 40.8516701,
                'lng' => -93.2599318,
            ],
            'distance' => 1641.02,
            'country' => 'US',
            'state_county' => 'IA',
            'town_city' => 'Corydon',
            'types' => [
                'locality',
                'political',
            ],
            'bounds' => null,
            'viewport' => [
                'northeast' => [
                    'lat' => 40.8601095,
                    'lng' => -93.2439244,
                ],
                'southwest' => [
                    'lat' => 40.8432296,
                    'lng' => -93.2759392,
                ],
            ],
            'query' => 'New York, IA, United States',
            'name' => 'New York, IA 50238, USA',
            'slug' => 'new-york-ia-united-states',
            'locale' => 'en',
            'hierarchy' => ['New York', 'Union', 'Wayne County', 'Iowa', 'United States', '50238'],
            'place_id' => 'ChIJD_qB3F8X6YcRDraFbXmLUD4',
            'place_ids' => [
                'ChIJD_qB3F8X6YcRDraFbXmLUD4',
                'ChIJu18w82gX6YcR-Ls-F0jYEqk',
                'ChIJNbAx8Hsh6YcRd8MI1mXF5e8',
                'ChIJ1-fIlAES6YcRUcuR1Y_M2oU',
                'ChIJGWD48W9e7ocR2VnHV0pj78Y',
                'ChIJCzYy5IS16lQRQrfeQ5K5Oxw',
            ],
        ],
        'New Orleans' => [
            'key' => '6662848b7263bc2775da2170ca31e7b57fd48713',
            'coords' => [
                'lat' => 29.9510658,
                'lng' => -90.0715323,
            ],
            'distance' => 29894.44,
            'country' => 'US',
            'state_county' => 'LA',
            'town_city' => 'New Orleans',
            'types' => [
                'locality',
                'political',
            ],
            'bounds' => null,
            'viewport' => [
                'northeast' => [
                    'lat' => 30.1748626,
                    'lng' => -89.6269312,
                ],
                'southwest' => [
                    'lat' => 29.8684247,
                    'lng' => -90.1380122,
                ],
            ],
            'query' => 'New Orleans, LA, United States',
            'name' => 'New Orleans, LA, USA',
            'slug' => 'new-orleans-la-united-states',
            'locale' => 'en',
            'hierarchy' => ['New Orleans', 'Orleans Parish', 'Louisiana', 'United States'],
            'place_id' => 'ChIJZYIRslSkIIYRtNMiXuhbBts',
            'place_ids' => [
                'ChIJZYIRslSkIIYRtNMiXuhbBts',
                'ChIJLfJRLOKlIIYRPA-y7LK8hZc',
                'ChIJkTRNv98GnogRcN0jfs1gpz8',
                'ChIJZYIRslSkIIYRA0flgTL3Vck',
                'ChIJCzYy5IS16lQRQrfeQ5K5Oxw',
            ],
        ],
        'San Francisco' => [
            'key' => 'a100faeaa01396fe751f9d8e3394a0a69ff864f9',
            'coords' => [
                'lat' => 37.7749295,
                'lng' => -122.4194155,
            ],
            'distance' => 9906.25,
            'country' => 'US',
            'state_county' => 'CA',
            'town_city' => 'San Francisco',
            'types' => [
                'locality',
                'political',
            ],
            'bounds' => null,
            'viewport' => [
                'northeast' => [
                    'lat' => 37.812,
                    'lng' => -122.3482,
                ],
                'southwest' => [
                    'lat' => 37.7034,
                    'lng' => -122.527,
                ],
            ],
            'query' => 'San Francisco, CA, United States',
            'name' => 'San Francisco, CA, USA',
            'slug' => 'san-francisco-ca-united-states',
            'locale' => 'en',
            'hierarchy' => ['San Francisco', 'San Francisco County', 'California', 'United States'],
            'place_id' => 'ChIJIQBpAG2ahYAR_6128GcTUEo',
            'place_ids' => [
                'ChIJezBipoOAhYARUPnBLQwBmf0',
                'ChIJIQBpAG2ahYAR_6128GcTUEo',
                'ChIJ09mpM52AhYARm2WOMfyfxhs',
                'ChIJIQBpAG2ahYARUksNqd0_1h8',
                'ChIJPV4oX_65j4ARVW8IJ6IJUYs',
                'ChIJCzYy5IS16lQRQrfeQ5K5Oxw',
            ],
        ],
        'Los Angeles' => [
            'key' => '791c213aad1496c2304b21aad119e66fde78e7ea',
            'coords' => [
                'lat' => 34.0522342,
                'lng' => -118.2436849,
            ],
            'distance' => 42371.86,
            'country' => 'US',
            'state_county' => 'CA',
            'town_city' => 'Los Angeles',
            'types' => [
                'locality',
                'political',
            ],
            'bounds' => null,
            'viewport' => [
                'northeast' => [
                    'lat' => 34.3373061,
                    'lng' => -118.1552891,
                ],
                'southwest' => [
                    'lat' => 33.7036917,
                    'lng' => -118.6681759,
                ],
            ],
            'query' => 'Los Angeles, CA, United States',
            'name' => 'Los Angeles, CA, USA',
            'slug' => 'los-angeles-ca-united-states',
            'locale' => 'en',
            'hierarchy' => ['Los Angeles', 'Los Angeles County', 'California', ' United States'],
            'place_id' => 'ChIJE9on3F3HwoAR9AhGJW_fL-I',
            'place_ids' => [
                'ChIJz-A_k1nHwoARloiyHDKVAm8',
                'ChIJE9on3F3HwoAR9AhGJW_fL-I',
                'ChIJod_IT1jGwoARAWmb8lcnY84',
                'ChIJMc1kAdMq3YARKjm9z9YofYM',
                'ChIJPV4oX_65j4ARVW8IJ6IJUYs',
                'ChIJCzYy5IS16lQRQrfeQ5K5Oxw',
            ],
        ],
    ];
}
