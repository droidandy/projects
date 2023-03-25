<?php

namespace AppBundle\Geo\Geocode;

use AppBundle\Entity\Location\GoogleLocation;
use AppBundle\Entity\Embeddable\Address;
use Doctrine\Common\Collections\ArrayCollection;

interface UnfoldableInterface
{
    /**
     * @return Address
     */
    public function getAddress();

    /**
     * @return ArrayCollection<GoogleLocation>
     */
    public function getGoogleLocations();

    /**
     * @param GoogleLocation[]|ArrayCollection<GoogleLocation> $googleLocations
     */
    public function setGoogleLocations($googleLocations);

    /**
     * @param GoogleLocation $googleLocation
     */
    public function addGoogleLocation(GoogleLocation $googleLocation);

    /**
     * @return string
     */
    public function getGoogleLocationsStatus();

    /**
     * @param string $googleLocationsStatus
     */
    public function setGoogleLocationsStatus($googleLocationsStatus);

    /**
     * @param mixed $googleLocationsFullAddressStatus
     */
    public function setGoogleLocationsFullAddressStatus($googleLocationsFullAddressStatus): void;

    /**
     * @param mixed $googleLocationsFullAddressStatusCreatedAt
     */
    public function setGoogleLocationsFullAddressStatusCreatedAt($googleLocationsFullAddressStatusCreatedAt): void;

    /**
     * @param mixed $googleLocationsFullAddressStatusReport
     */
    public function setGoogleLocationsFullAddressStatusReport($googleLocationsFullAddressStatusReport): void;

    /**
     * @return string
     */
    public function getEntityType();
}
