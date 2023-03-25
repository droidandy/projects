<?php

namespace AppBundle\Geo;

use AppBundle\Entity\Embeddable\Coords;
use AppBundle\Import\Normalizer\User\NormalisedUser;
use AppBundle\Entity\User\User;
use AppBundle\Entity\Property\Property;
use AppBundle\Import\Normalizer\Property\NormalisedPropertyInterface;
use AppBundle\Entity\Embeddable\Address;

/**
 * Geocodes parts of an address.
 */
class AddressGeocoder
{
    protected $geocoder;

    /**
     * Constructor.
     */
    public function __construct(Geocoder $geocoder)
    {
        $this->geocoder = $geocoder;
    }

    /**
     * Geocodes an address.
     *
     * @return Coords|false
     */
    public function geocode($entity)
    {
        if ($entity instanceof Address) {
            return $this->extractFromAddress($entity);
        }

        if ($entity instanceof Property) {
            return $this->extractFromAddress($entity->getAddress());
        }

        if ($entity instanceof NormalisedPropertyInterface) {
            return $this->extractFromAddress($entity->getAddress());
        }

        if ($entity instanceof User) {
            return $this->extractFromAddress($entity->getAddress());
        }

        if ($entity instanceof NormalisedUser) {
            return $this->extractFromAddress($entity->getAddress());
        }

        return false;
    }

    protected function extractFromAddress(Address $address)
    {
        // Numeric state names cause problems with Google's geocoder so we
        // set them to blank before geocoding.
        $state = is_numeric($address->getStateCounty()) ? null : $address->getStateCounty();

        $addressFull = [
            $address->getAptBldg(),
            $address->getStreet(),
            $address->getTownCity(),
            $state,
            $address->getZip(),
        ];

        $addressNoStreet = [
            $address->getTownCity(),
            $state,
            $address->getZip(),
        ];

        $addressNoState = [
            $address->getTownCity(),
        ];

        if (!$addressFull) {
            return false;
        }

        $addresses = [
            $addressFull,
            $addressNoStreet,
            $addressNoState,
        ];

        $result = $this->geocodeMulti($addresses, $address->getCountry());

        if ($result) {
            return $result;
        }

        // Try and geocode with the country name in the string rather than
        // forcing it as a param. Often this works for properties. Its an
        // oddity of Google's geocoding API.
        array_walk($addresses, function (&$val) use ($address) {
            $val[] = $address->getCountryName();
        });

        return $this->geocodeMulti($addresses);
    }

    protected function geocodeMulti(array $addresses, $countryCode = null)
    {
        foreach ($addresses as $i => $address) {
            $address = implode(', ', array_unique(array_filter($address)));

            if (!$address) {
                continue;
            }

            if ($coords = $this->geocoder->geocode($address, $countryCode)) {
                return $coords;
            }

            if ($i < (count($addresses) - 1)) {
                // Don't hammer google's servers
                usleep(100000);
            }
        }

        return false;
    }
}
