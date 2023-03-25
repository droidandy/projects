<?php

namespace AppBundle\Entity\Embeddable;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Embeddable
 */
class Hierarchy
{
    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $continentId;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $continentName;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $countryId;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $countryName;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $regionId;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $regionName;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $localityId;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $localityName;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $townId;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $townName;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $neighbourhoodId;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $neighbourhoodName;

    /**
     * @return string
     */
    public function getContinentId()
    {
        return $this->continentId;
    }

    /**
     * @param int $continentId
     *
     * @return self
     */
    protected function setContinentId($continentId)
    {
        $this->continentId = $continentId;

        return $this;
    }

    /**
     * Gets the value of continentName.
     *
     * @return mixed
     */
    public function getContinentName()
    {
        return $this->continentName;
    }

    /**
     * Sets the value of continentName.
     *
     * @param mixed $continentName the continent name
     *
     * @return self
     */
    protected function setContinentName($continentName)
    {
        $this->continentName = $continentName;

        return $this;
    }

    /**
     * Gets the value of countryId.
     *
     * @return mixed
     */
    public function getCountryId()
    {
        return $this->countryId;
    }

    /**
     * Sets the value of countryId.
     *
     * @param mixed $countryId the country id
     *
     * @return self
     */
    protected function setCountryId($countryId)
    {
        $this->countryId = $countryId;

        return $this;
    }

    /**
     * Gets the value of countryName.
     *
     * @return mixed
     */
    public function getCountryName()
    {
        return $this->countryName;
    }

    /**
     * Sets the value of countryName.
     *
     * @param mixed $countryName the country name
     *
     * @return self
     */
    protected function setCountryName($countryName)
    {
        $this->countryName = $countryName;

        return $this;
    }

    /**
     * Gets the value of regionId.
     *
     * @return mixed
     */
    public function getRegionId()
    {
        return $this->regionId;
    }

    /**
     * Sets the value of regionId.
     *
     * @param mixed $regionId the region id
     *
     * @return self
     */
    protected function setRegionId($regionId)
    {
        $this->regionId = $regionId;

        return $this;
    }

    /**
     * Gets the value of regionName.
     *
     * @return mixed
     */
    public function getRegionName()
    {
        return $this->regionName;
    }

    /**
     * Sets the value of regionName.
     *
     * @param mixed $regionName the region name
     *
     * @return self
     */
    protected function setRegionName($regionName)
    {
        $this->regionName = $regionName;

        return $this;
    }

    /**
     * Gets the value of localityId.
     *
     * @return mixed
     */
    public function getLocalityId()
    {
        return $this->localityId;
    }

    /**
     * Sets the value of localityId.
     *
     * @param mixed $localityId the locality id
     *
     * @return self
     */
    protected function setLocalityId($localityId)
    {
        $this->localityId = $localityId;

        return $this;
    }

    /**
     * Gets the value of localityName.
     *
     * @return mixed
     */
    public function getLocalityName()
    {
        return $this->localityName;
    }

    /**
     * Sets the value of localityName.
     *
     * @param mixed $localityName the locality name
     *
     * @return self
     */
    protected function setLocalityName($localityName)
    {
        $this->localityName = $localityName;

        return $this;
    }

    /**
     * Gets the value of townId.
     *
     * @return mixed
     */
    public function getTownId()
    {
        return $this->townId;
    }

    /**
     * Sets the value of townId.
     *
     * @param mixed $townId the town id
     *
     * @return self
     */
    protected function setTownId($townId)
    {
        $this->townId = $townId;

        return $this;
    }

    /**
     * Gets the value of townName.
     *
     * @return mixed
     */
    public function getTownName()
    {
        return $this->townName;
    }

    /**
     * Sets the value of townName.
     *
     * @param mixed $townName the town name
     *
     * @return self
     */
    protected function setTownName($townName)
    {
        $this->townName = $townName;

        return $this;
    }

    /**
     * Gets the value of neighbourhoodId.
     *
     * @return mixed
     */
    public function getNeighbourhoodId()
    {
        return $this->neighbourhoodId;
    }

    /**
     * Sets the value of neighbourhoodId.
     *
     * @param mixed $neighbourhoodId the neighbourhood id
     *
     * @return self
     */
    protected function setNeighbourhoodId($neighbourhoodId)
    {
        $this->neighbourhoodId = $neighbourhoodId;

        return $this;
    }

    /**
     * Gets the value of neighbourhoodName.
     *
     * @return mixed
     */
    public function getNeighbourhoodName()
    {
        return $this->neighbourhoodName;
    }

    /**
     * Sets the value of neighbourhoodName.
     *
     * @param mixed $neighbourhoodName the neighbourhood name
     *
     * @return self
     */
    protected function setNeighbourhoodName($neighbourhoodName)
    {
        $this->neighbourhoodName = $neighbourhoodName;

        return $this;
    }
}
