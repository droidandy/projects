<?php

namespace AppBundle\Search;

use AppBundle\Geo\Geo;
use AppBundle\Elastic\Location\LocationRepo;
use Doctrine\ORM\EntityRepository;
use Guzzle\Http\Client;
use Cocur\Slugify\Slugify;
use Exception;
use AppBundle\Entity\Embeddable\Coords;
use AppBundle\Entity\Embeddable\Bounds;
use AppBundle\Entity\Location\Location;
use AppBundle\Service\Geo\LocaleFactory;
use Doctrine\ORM\EntityManager;
use Symfony\Component\Stopwatch\Stopwatch;

class LocationFactory
{
    // Todo: To be rewritten..

    const CACHE_KEY_PLACES = 'location_place_ref_v2_%s_%s';
    const CACHE_KEY_QUERY = 'location_query_ref_v2_%s_%s';

    /**
     * @var LocaleFactory
     */
    protected $localeFactory;
    /**
     * @var LocationRepo
     */
    protected $locationRepo;
    /**
     * @var EntityManager
     */
    protected $em;
    /**
     * @var Client
     */
    protected $httpClient;
    /**
     * @var googleMapsProvider
     */
    protected $googleMapsProvider;
    /**
     * @var Stopwatch
     */
    protected $stopwatch;

    /**
     * @param GoogleMapsProvider $googleMapsProvider
     * @param EntityRepository   $locationRepo
     * @param EntityManager      $em
     * @param LocaleFactory      $localeFactory
     */
    public function __construct(
        GoogleMapsProvider $googleMapsProvider,
        EntityRepository $locationRepo,
        EntityManager $em,
        LocaleFactory $localeFactory,
        Stopwatch $stopwatch = null
    ) {
        $this->locationRepo = $locationRepo;
        $this->em = $em;
        $this->localeFactory = $localeFactory;
        $this->googleMapsProvider = $googleMapsProvider;
        $this->stopwatch = $stopwatch;
    }

    /**
     * Find the location from the google places reference ID.
     *
     * @param $placeId
     * @param string $queryString
     *
     * @return Location
     *
     * @throws Exception
     */
    public function fromPlacesReference($placeId, $queryString = '')
    {
        if (null !== $this->stopwatch) {
            $this->stopwatch->start('location_places_from_references', 'location');
        }
        // check if the places ID is in redis first
        $locale = $this->localeFactory->getCurrentLocale();
        $key = sha1(sprintf(self::CACHE_KEY_PLACES, $locale, $placeId.'-'.$queryString));
        $location = $this->locationRepo->findOneBy(['hash' => $key]);

        if (!$location) {
            $result = $this->googleMapsProvider->requestPlaceById($placeId);

            if (null === $result) {
                if ($queryString) {
                    return $this->fromQuery($queryString);
                }

                throw new Exception(sprintf('Could not retrieve place ID `%s`', $placeId));
            }

            $location = $this->parseAndStore($key, $result, $queryString ?: false);
        }

        if (null !== $this->stopwatch) {
            $this->stopwatch->stop('location_places_from_references');
        }

        return $location;
    }

    /**
     * Find the location from the query string.
     *
     * @param $queryString
     * @param bool|false $isCountry
     *
     * @return Location|null|object
     *
     * @throws \Exception
     */
    public function fromQuery($queryString, $isCountry = false)
    {
        // The rest of the class is a spaghetti code ...

        // Search by country
        if ($isCountry) {
            $location = $this->locationRepo->findOneBy(
                ['country' => $queryString],
                ['distance' => 'DESC']
            )
            ;

            if ($location) {
                return $location;
            }
        }

        // Search by hash
        $locale = $this->localeFactory->getCurrentLocale();
        $key = sha1(sprintf(self::CACHE_KEY_QUERY, $locale, $queryString));
        $location = $this->locationRepo->findOneBy([
            'hash' => $key,
        ]);

        // Search in maps
        if (!$location) {
            $result = $this->googleMapsProvider->requestPlacesByQuery($queryString, $isCountry);
            $location = $this->parseAndStore($key, $result[0], $queryString);
        }

        return $location;
    }

    /**
     * @param string $query
     *
     * @return Location[]
     *
     * @throws \Exception
     */
    public function getLocationsFromPredictions($query)
    {
        if (null !== $this->stopwatch) {
            $this->stopwatch->start('location_factory', 'section');
        }

        $places = [];
        $locations = [];
        $response = $this->googleMapsProvider->requestPlacesAutocompleteByQuery($query);

        if ('OK' === $response['status']) {
            foreach ($response['predictions'] as $place) {
                $places[$place['place_id']] = $place['description'];
            }
        }

        foreach ($places as $reference => $name) {
            try {
                $locations[] = $this->fromPlacesReference($reference, $name);
            } catch (\Exception $e) {
            }
        }

        if (null !== $this->stopwatch) {
            $this->stopwatch->stop('location_factory');
        }

        return $locations;
    }

    /**
     * Get by the location ID.
     *
     * @param int $id
     *
     * @return location
     */
    public function getById($id)
    {
        return $this->locationRepo->findOneById($id);
    }

    public function createNullLocation()
    {
        $ref = new \ReflectionClass(NullLocation::class);

        return $ref->newInstanceWithoutConstructor();
    }

    /**
     * parse the result and return a properly formated location object.
     *
     * @param JSON $result      The result of an API query
     * @param bool $queryString
     *
     * @return Location
     */
    protected function parseResult($key, $result, $queryString = false)
    {
        $bounds = null;
        $viewport = null;

        $name = !empty($result['name']) && false === strpos($result['formatted_address'], $result['name'])
            ? $result['name'].', '.$result['formatted_address']
            : $result['formatted_address']
        ;
        $query = false !== $queryString ? $queryString : $name;

        if (isset($result['geometry']['bounds']) && !empty($result['geometry']['bounds'])) {
            $bounds = $this->googleMapsProvider->getBounds($result['geometry']['bounds']);
        }

        if (isset($result['geometry']['viewport']) && !empty($result['geometry']['viewport'])) {
            $viewport = $this->googleMapsProvider->getBounds($result['geometry']['viewport']);
        }

        // calculate the distance needed based on the bounding box.
        if ($bounds || $viewport) {
            $distance = $this->calculateDistance($bounds ?: $viewport);
        } else {
            $distance = 1000; // default to 1km if it's just a single point and there's no bounds
        }

        // Store Google's hierarchy
        $hierarchy = [];

        // get the country code
        $country = null;
        foreach ($result['address_components'] as $component) {
            if (in_array('country', $component['types'])) {
                $country = $component['short_name'];
            }

            $hierarchy[] = $component['long_name'];
        }

        $slugify = new Slugify(Slugify::MODEARRAY);
        $slug = $slugify->slugify($query);

        // get the lat / lng for the place we searched for.
        return new Location(
            $key,
            new Coords($result['geometry']['location']['lat'], $result['geometry']['location']['lng']),
            $distance,
            $country,
            isset($result['types']) ? $result['types'] : [],
            $bounds,
            $viewport,
            $query,
            $name,
            $slug,
            $this->localeFactory->getCurrentLocale(),
            array_unique($hierarchy),
            isset($result['place_id']) ? $result['place_id'] : null
        );
    }

    /**
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
        return Geo::vincentyGreatCircleDistance($latitudeFrom, $longitudeFrom, $latitudeTo, $longitudeTo, $earthRadius);
    }

    /**
     * Parses the result of a place or maps API call and saves it to the
     * database as a Location.
     *
     * @param string      $key
     * @param string      $result
     * @param bool|string $queryString
     *
     * @return Location
     */
    protected function parseAndStore($key, $result, $queryString = false)
    {
        $location = $this->parseResult($key, $result, $queryString);

        $this->em->persist($location);
        $this->em->flush();

        return $location;
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
}
