<?php

namespace AppBundle\Search;

use Doctrine\Common\Cache\Cache;
use Guzzle\Http\Client;
use AppBundle\Entity\Embeddable\Coords;
use AppBundle\Entity\Embeddable\Bounds;
use AppBundle\Service\Geo\LocaleFactory;
use Guzzle\Http\QueryAggregator\DuplicateAggregator;
use Guzzle\Http\Url;
use Symfony\Component\Stopwatch\Stopwatch;

class GoogleMapsProvider
{
    const GOOGLE_API_MAPS_GEOCODE = 'https://maps.googleapis.com/maps/api/geocode/json';
    const GOOGLE_API_MAPS_PLACE_DETAILS = 'https://maps.googleapis.com/maps/api/place/details/json';
    const GOOGLE_API_MAPS_PLACE_AUTOCOMPLETE = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
    const CACHE_TTL = 86400;

    /**
     * @var string
     */
    protected $locale;

    /**
     * @var string
     */
    protected $googleApiKey;

    /**
     * @var Client
     */
    protected $httpClient;

    /**
     * @var Cache
     */
    protected $cache;

    /**
     * @var Stopwatch
     */
    protected $stopwatch;

    /**
     * @param LocaleFactory $localeFactory
     * @param $googleApiKey
     * @param Client $httpClient
     */
    public function __construct(
        LocaleFactory $localeFactory,
        $googleApiKey,
        Client $httpClient,
        Cache $cache,
        Stopwatch $stopwatch = null
    ) {
        $this->locale = $localeFactory->getCurrentLocale();
        $this->googleApiKey = $googleApiKey;
        $this->httpClient = $httpClient;
        $this->cache = $cache;
        $this->stopwatch = $stopwatch;
    }

    /**
     * @param $placeId
     *
     * @return mixed
     */
    public function requestPlaceById($placeId)
    {
        $result = null;

        if (null !== $this->stopwatch) {
            $this->stopwatch->start('place_by_id', 'google_maps');
        }

        $response = $this->processRequest(self::GOOGLE_API_MAPS_PLACE_DETAILS, [
            'placeid' => $placeId,
            'language' => $this->locale,
        ]);

        if (null !== $this->stopwatch) {
            $this->stopwatch->stop('place_by_id');
        }

        if (isset($response['result'])) {
            $result = $response['result'];
        }

        return $result;
    }

    /**
     * @param $query
     * @param bool|false $isCountry
     *
     * @return mixed
     *
     * @throws \Exception
     */
    public function requestPlacesByQuery($query, $isCountry = false)
    {
        $response = $this->processRequest(self::GOOGLE_API_MAPS_GEOCODE, [
            'address' => !$isCountry ? $query : null,
            'language' => $this->locale,
            'components' => $isCountry ? 'country:'.strtoupper(substr($query, 0, 2)) : null,
        ]);

        if (!isset($response['results'][0])) {
            throw new \Exception(sprintf('Could not find location by query `%s`', $query));
        }

        return $response['results'];
    }

    /**
     * @param $query
     *
     * @return array
     */
    public function requestPlacesAutocompleteByQuery($query)
    {
        if (null !== $this->stopwatch) {
            $this->stopwatch->start('autocomplete_by_query', 'google_maps');
        }

        $key = 'ha_maps_provider_'.sha1($this->locale.$query);
        $response = $this->cache->fetch($key);

        if (false !== $response) {
            if (null !== $this->stopwatch) {
                $this->stopwatch->stop('autocomplete_by_query');
            }

            return unserialize($response);
        }

        $response = $this->processRequest(self::GOOGLE_API_MAPS_PLACE_AUTOCOMPLETE, [
            'input' => $query,
            'language' => $this->locale,
            'types' => 'geocode',
//            'types' => ['(regions)', '(cities)'],
        ]);

        $this->cache->save($key, serialize($response), self::CACHE_TTL);

        if (null !== $this->stopwatch) {
            $this->stopwatch->stop('autocomplete_by_query');
        }

        return $response;
    }

    /**
     * @param $url
     * @param $params
     *
     * @return array|bool|float|int|string
     */
    public function processRequest($url, $params, $headers = null)
    {
        $url = Url::factory($url);
        $url->getQuery()->setAggregator(new DuplicateAggregator());

        $mandatoryParams = [
            'key' => $this->googleApiKey,
            'sensor' => 'false',
        ];
        $query = array_merge($params, $mandatoryParams);
        $response = $this
            ->httpClient
            ->get(
                $url,
                $headers,
                ['query' => $query]
            )
            ->send()
            ->json()
        ;

        return $response;
    }

    /**
     * @param $json
     *
     * @return Bounds
     */
    public function getBounds($json)
    {
        return new Bounds(
            new Coords($json['northeast']['lat'], $json['northeast']['lng']),
            new Coords($json['southwest']['lat'], $json['southwest']['lng'])
        );
    }
}
