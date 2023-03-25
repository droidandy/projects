<?php

namespace AppBundle\Geo\GeocodingProvider;

use JMS\DiExtraBundle\Annotation\Service;
use JMS\DiExtraBundle\Annotation\Tag;
use Geocoder\HttpAdapter\HttpAdapterInterface;
use Geocoder\Provider\GoogleMapsProvider;
use Geocoder\Exception\NoResultException;
use Geocoder\Exception\QuotaExceededException;
use Geocoder\Exception\InvalidCredentialsException;

/**
 * @Service("bazinga_geocoder.provider.google_maps_country", parent="bazinga_geocoder.provider.google_maps")
 * @Tag("bazinga_geocoder.provider")
 */
class GoogleMapsCountryProvider extends GoogleMapsProvider
{
    /**
     * @var string
     */
    private $country = null;

    /**
     * @var string
     */
    private $apiKey;

    /**
     * {@inheritdoc}
     */
    public function __construct(
        HttpAdapterInterface $adapter,
        $locale = null,
        $region = null,
        $useSsl = false,
        $apiKey = null
    ) {
        parent::__construct($adapter, $locale, $region, $useSsl);

        $this->apiKey = $apiKey;
    }

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return 'google_maps_country';
    }

    /**
     * Returns the country that results are restricted to.
     *
     * @return string two character ISO country code
     */
    public function getCountry()
    {
        return $this->country;
    }

    /**
     * Restrict geocoding results to a certain country.
     *
     * @param string $country two character ISO country code
     */
    public function setCountry($country = null)
    {
        $this->country = $country;
    }

    /**
     * {@inheritdoc}
     */
    protected function buildQuery($query)
    {
        if (null !== $this->getLocale()) {
            $query = sprintf('%s&language=%s', $query, $this->getLocale());
        }

        if (null !== $this->getRegion()) {
            $query = sprintf('%s&region=%s', $query, $this->getRegion());
        }

        if (null !== $this->getCountry()) {
            $query = sprintf('%s&components=country:%s', $query, $this->getCountry());
        }

        if (null !== $this->apiKey) {
            $query = sprintf('%s&key=%s', $query, $this->apiKey);
        }

        return $query;
    }

    /**
     * {@inheritdoc}
     *
     * We've added a check within the results loop to ensure that if a country
     * restriction is specified then a NoResultException is thrown in the
     * correct situation.
     */
    protected function executeQuery($query)
    {
        $query = $this->buildQuery($query);

        $content = $this->getAdapter()->getContent($query);

        // Throw exception if invalid clientID and/or privateKey used with GoogleMapsBusinessProvider
        if (false !== strpos($content, "Provided 'signature' is not valid for the provided client ID")) {
            throw new InvalidCredentialsException(sprintf('Invalid client ID / API Key %s', $query));
        }

        if (null === $content) {
            throw new NoResultException(sprintf('Could not execute query %s', $query));
        }

        $json = json_decode($content);

        // API error
        if (!isset($json)) {
            throw new NoResultException(sprintf('Could not execute query %s', $query));
        }

        if ('REQUEST_DENIED' === $json->status && 'The provided API key is invalid.' === $json->error_message) {
            throw new InvalidCredentialsException(sprintf('API key is invalid %s', $query));
        }

        // you are over your quota
        if ('OVER_QUERY_LIMIT' === $json->status) {
            throw new QuotaExceededException(sprintf('Daily quota exceeded %s', $query));
        }

        // no result
        if (!isset($json->results) || !count($json->results) || 'OK' !== $json->status) {
            throw new NoResultException(sprintf('Could not execute query %s', $query));
        }

        $results = [];

        foreach ($json->results as $result) {
            $resultset = $this->getDefaults();

            // update address components
            foreach ($result->address_components as $component) {
                foreach ($component->types as $type) {
                    $this->updateAddressComponent($resultset, $type, $component);
                }
            }

            // If country restriction is in place and we've only got one address
            // component then this is actually not a valid or accurate result.
            if ($this->isCountryNoResult($result)) {
                throw new NoResultException(sprintf('Address `%s` was not found within country %s', $query, $this->getCountry()));
            }

            // update coordinates
            $coordinates = $result->geometry->location;
            $resultset['latitude'] = $coordinates->lat;
            $resultset['longitude'] = $coordinates->lng;

            $resultset['bounds'] = null;
            if (isset($result->geometry->bounds)) {
                $resultset['bounds'] = [
                    'south' => $result->geometry->bounds->southwest->lat,
                    'west' => $result->geometry->bounds->southwest->lng,
                    'north' => $result->geometry->bounds->northeast->lat,
                    'east' => $result->geometry->bounds->northeast->lng,
                ];
            } elseif ('ROOFTOP' === $result->geometry->location_type) {
                // Fake bounds
                $resultset['bounds'] = [
                    'south' => $coordinates->lat,
                    'west' => $coordinates->lng,
                    'north' => $coordinates->lat,
                    'east' => $coordinates->lng,
                ];
            }

            $results[] = array_merge($this->getDefaults(), $resultset);
        }

        return $results;
    }

    /**
     * Checks if no resulrts have been returned when using a country restriction.
     *
     * Due to the way Google's geocoder works, if you have a country restriction
     * in place and no match can be found for your query then the country is
     * always returned. This can be confusing so this method checks a result
     * to ensure that if only the country is returned and it's a partial match
     * then this doesnt happen.
     *
     * @param \stdClass $result
     *
     * @return bool
     */
    protected function isCountryNoResult($result)
    {
        $partialMatch = isset($result->partial_match) && $result->partial_match;

        return $this->getCountry() && $partialMatch && count($result->address_components);
    }
}
