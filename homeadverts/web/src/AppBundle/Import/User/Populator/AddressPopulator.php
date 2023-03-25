<?php

namespace AppBundle\Import\User\Populator;

use AppBundle\Geo\AddressGeocoder;
use AppBundle\Import\Normalizer\Office\NormalisedOfficeInterface;
use AppBundle\Import\Normalizer\User\NormalisedUserInterface;
use AppBundle\Entity\User\User;
use AppBundle\Geo\Geocode\ReverseGeocodeLocationUnfolder;

class AddressPopulator implements PopulatorInterface
{
    /**
     * @var AddressGeocoder
     */
    private $addressGeocoder;
    /**
     * @var ReverseGeocodeLocationUnfolder
     */
    private $locationUnfolder;

    /**
     * @param AddressGeocoder                $addressGeocoder
     * @param ReverseGeocodeLocationUnfolder $locationUnfolder
     */
    public function __construct(AddressGeocoder $addressGeocoder, ReverseGeocodeLocationUnfolder $locationUnfolder)
    {
        $this->addressGeocoder = $addressGeocoder;
        $this->locationUnfolder = $locationUnfolder;
    }

    /**
     * @param User                                              $user
     * @param NormalisedUserInterface|NormalisedOfficeInterface $normalisedUser
     */
    public function populate(User $user, $normalisedUser)
    {
        $newAddress = $normalisedUser->getAddress();
        $addressUpdated = false;
        if (!$user->address->equalTo($normalisedUser->getAddress())) {
            $addressUpdated = true;
            $user
                ->address
                ->setStreet($newAddress->getStreet())
                ->setAptBldg($newAddress->getAptBldg())
                ->setNeighbourhood($newAddress->getNeighbourhood())
                ->setCountry($newAddress->getCountry())
                ->setStateCounty($newAddress->getStateCounty())
                ->setTownCity($newAddress->getTownCity())
                ->setZip($newAddress->getZip())
                ->setHidden($newAddress->isHidden())
//                ->resetCoords()
            ;
        }

        if ($normalisedUser instanceof NormalisedOfficeInterface) {
            if (
                null === $normalisedUser->getLat()
                || null === $normalisedUser->getLng()
            ) {
                if (
                    !$user->address->hasCoords()
                    || $addressUpdated
                ) {
                    $coords = $this->addressGeocoder->geocode($normalisedUser);
                    if ($coords) {
                        $user->address->setCoords($coords);
                    }
                }
            } elseif (
                $normalisedUser->getLat() != $user->address->getLatitude()
                || $normalisedUser->getLng() != $user->address->getLongitude()
            ) {
                $user->address->setCoords($normalisedUser->getCoords());
            }
        } elseif ($normalisedUser instanceof NormalisedUserInterface) {
            if (
                null === $normalisedUser->getFallbackLatitude()
                || null === $normalisedUser->getFallbackLongitude()
            ) {
                if (
                    !$user->address->hasCoords()
                    || $addressUpdated
                ) {
                    $coords = $this->addressGeocoder->geocode($normalisedUser);
                    if ($coords) {
                        $user->address->setCoords($coords);
                    }
                }
            } elseif (
                $normalisedUser->getFallbackLatitude() != $user->address->getLatitude()
                || $normalisedUser->getFallbackLongitude() != $user->address->getLongitude()
            ) {
                $user->address->setCoords($normalisedUser->getFallbackCoords());
            }
        }

        $this->locationUnfolder->unfold($user)->wait();
    }
}
