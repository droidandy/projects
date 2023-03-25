<?php

namespace AppBundle\Entity\Traits;

use AppBundle\Entity\Location\GoogleLocation;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

trait GoogleLocationTrait
{
    /**
     * @var ArrayCollection<GoogleLocation>
     * @ORM\ManyToMany(targetEntity="AppBundle\Entity\Location\GoogleLocation")
     */
    private $googleLocations;
    /**
     * @ORM\Column(type="string")
     */
    private $googleLocationsStatus = GoogleLocation::STATUS_UNPROCESSED;
    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $googleLocationsFullAddressStatus;
    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $googleLocationsFullAddressStatusCreatedAt;
    /**
     * @ORM\Column(type="json_array", nullable=true)
     */
    private $googleLocationsFullAddressStatusReport;

    /**
     * @return ArrayCollection
     */
    public function getGoogleLocations()
    {
        return $this->googleLocations;
    }

    /**
     * @param array|ArrayCollection $googleLocations
     */
    public function setGoogleLocations($googleLocations)
    {
        if (!$googleLocations instanceof ArrayCollection) {
            $googleLocations = new ArrayCollection((array) $googleLocations);
        }

        foreach ($this->googleLocations as $idx => $originGoogleLocation) {
            if (!$googleLocations->contains($originGoogleLocation)) {
                $this->googleLocations->remove($idx);
            }
        }
        foreach ($googleLocations as $googleLocation) {
            if (!$this->googleLocations->contains($googleLocation)) {
                $this->googleLocations->add($googleLocation);
            }
        }
    }

    /**
     * @param GoogleLocation $googleLocation
     */
    public function addGoogleLocation(GoogleLocation $googleLocation)
    {
        if ($this->googleLocations->contains($googleLocation)) {
            return;
        }

        $this->googleLocations->add($googleLocation);
    }

    /**
     * @return string
     */
    public function getGoogleLocationsStatus()
    {
        return $this->googleLocationsStatus;
    }

    /**
     * @param string $googleLocationsStatus
     */
    public function setGoogleLocationsStatus($googleLocationsStatus)
    {
        $this->googleLocationsStatus = $googleLocationsStatus;
    }

    /**
     * @param mixed $googleLocationsFullAddressStatus
     */
    public function setGoogleLocationsFullAddressStatus($googleLocationsFullAddressStatus): void
    {
        $this->googleLocationsFullAddressStatus = $googleLocationsFullAddressStatus;
    }

    /**
     * @param mixed $googleLocationsFullAddressStatusCreatedAt
     */
    public function setGoogleLocationsFullAddressStatusCreatedAt($googleLocationsFullAddressStatusCreatedAt): void
    {
        $this->googleLocationsFullAddressStatusCreatedAt = $googleLocationsFullAddressStatusCreatedAt;
    }

    /**
     * @param mixed $googleLocationsFullAddressStatusReport
     */
    public function setGoogleLocationsFullAddressStatusReport($googleLocationsFullAddressStatusReport): void
    {
        $this->googleLocationsFullAddressStatusReport = $googleLocationsFullAddressStatusReport;
    }
}
