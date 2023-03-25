<?php

namespace AppBundle\Import\Processor;

use AppBundle\Entity\Import\ImportProperty;
use AppBundle\Import\Normalizer\Property\NormalisedPropertyInterface;

/**
 * Geolocates a property, and cleans its address.
 */
class Geocode extends Processor
{
    public function process(NormalisedPropertyInterface $normalised, $propertyObj)
    {
        $newAddress = $normalised->getAddress();

        if ($newAddress->hasCoords()) {
            $this->job->log('Using normalised address latitude / longitude.');
            $propertyObj->address->setCoords($newAddress->getCoords());
        } elseif ($this->shouldGeocode($normalised, $propertyObj)) {
            $this->job->log('Geocoding address');
            $geocoded = $this->app->get('address_geocoder')->geocode($normalised);
            if (false === $geocoded) {
                if ($this->app->get('geocoder')->getLastError()) {
                    $errorMsg = $this->app->get('geocoder')->getLastError()->getMessage();
                } else {
                    $errorMsg = '-';
                }

                $this->job->log('Geocoding error: '.$errorMsg);
                if ($fallbackCoords = $normalised->getFallbackCoords()) {
                    $this->job->log('Using fallback latitude / longitude.');
                    $propertyObj->address->setCoords($fallbackCoords);
                } else {
                    $this->job->log('Could not geocode address');
                    $this->addError(
                        ImportProperty::ERROR_ADDRESS,
                        'Address could not be geocoded.'
                    );
                }
            } else {
                $propertyObj->address->setCoords($geocoded);
            }
        }

        // address parts
        $propertyObj->address
            ->setStreet($newAddress->getStreet())
            ->setAptBldg($newAddress->getAptBldg())
            ->setNeighbourhood($newAddress->getNeighbourhood())
            ->setCountry($newAddress->getCountry())
            ->setStateCounty($newAddress->getStateCounty())
            ->setTownCity($newAddress->getTownCity())
            ->setZip($newAddress->getZip())
            ->setHidden($newAddress->isHidden())
        ;

        $this->app->get('ha.geo.location_unfolder')->unfold($propertyObj)->wait();
    }

    protected function shouldGeocode(NormalisedPropertyInterface $normalised, $propertyObj)
    {
        $em = $this->app->get('em');

        // New property and no complete lng/lat?
        if (!$em->contains($propertyObj) && !$normalised->getAddress()->hasCoords()) {
            return true;
        }

        // See if address has changed
        return !$propertyObj->address->equalTo($normalised->getAddress());
    }
}
