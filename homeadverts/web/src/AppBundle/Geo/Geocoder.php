<?php

namespace AppBundle\Geo;

use JMS\DiExtraBundle\Annotation\Service;
use JMS\DiExtraBundle\Annotation\Inject;
use JMS\DiExtraBundle\Annotation\InjectParams;
use Geocoder\GeocoderInterface;
use AppBundle\Geo\GeocodingProvider\GoogleMapsCountryProvider;
use AppBundle\Entity\Embeddable\Address;
use AppBundle\Entity\Embeddable\Coords;

/**
 * Turns an address into a longitude / latitude.
 *
 * @Service("geocoder")
 */
class Geocoder
{
    protected $geocoder;
    protected $provider;
    protected $lastError;

    /**
     * Constructor.
     *
     * @InjectParams({
     *     "geocoder" = @Inject("bazinga_geocoder.geocoder"),
     *     "provider" = @Inject("bazinga_geocoder.provider.google_maps_country"),
     * })
     */
    public function __construct(GeocoderInterface $geocoder, GoogleMapsCountryProvider $provider)
    {
        $this->geocoder = $geocoder->using('cache');
        $this->provider = $provider;
    }

    public function geocode($address, $country = null)
    {
        try {
            $this->provider->setCountry($country);
            $address = $this->geocoder->geocode($address);
            $this->provider->setCountry(null);
        } catch (\Exception $e) {
            $this->lastError = $e;

            return false;
        }

        return new Coords($address->getLatitude(), $address->getLongitude());
    }

    public function getLastError()
    {
        return $this->lastError;
    }
}
