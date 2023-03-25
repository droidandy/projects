<?php

namespace AppBundle\Geo\Geocode;

use AppBundle\Entity\Embeddable\Address;
use GuzzleHttp\Promise\PromiseInterface;

interface HttpClientInterface
{
    /**
     * @param string $path
     * @param string $country
     *
     * @return PromiseInterface
     */
    public function geocodeAsync($path, $country);

    /**
     * @param string $path
     * @param string $country
     *
     * @return object
     */
    public function geocode($path, $country);

    /**
     * @param Address $address
     *
     * @return PromiseInterface
     */
    public function reverseGeocodeAsync(Address $address);

    /**
     * @param Address $address
     *
     * @return object
     */
    public function reverseGeocode(Address $address);
}
