<?php

namespace AppBundle\Entity\Embeddable;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Intl\Intl;
use JMS\Serializer\Annotation as JMS;

/**
 * @ORM\Embeddable
 * @JMS\ExclusionPolicy("all")
 */
class Address
{
    /**
     * @ORM\Column(type="string", length=2, nullable=true)
     */
    public $country = '';

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details"})
     * @JMS\ReadOnly
     */
    public $street = '';

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details"})
     * @JMS\ReadOnly
     */
    public $aptBldg = '';

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details"})
     * @JMS\ReadOnly
     */
    public $townCity = '';

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details"})
     * @JMS\ReadOnly
     */
    public $neighbourhood = '';

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details"})
     * @JMS\ReadOnly
     */
    public $stateCounty = '';

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     * @JMS\Expose
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details"})
     * @JMS\ReadOnly
     */
    public $zip = '';

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @JMS\Expose
     * @JMS\Type("boolean")
     * @JMS\Groups({"collection","details"})
     * @JMS\ReadOnly
     */
    public $hidden = false;

    /**
     * @ORM\Column(type="decimal", nullable=true, scale=7)
     * @JMS\Expose
     * @JMS\Type("float")
     * @JMS\Groups({"collection","details"})
     * @JMS\ReadOnly
     */
    public $latitude;

    /**
     * @ORM\Column(type="decimal", nullable=true, scale=7)
     * @JMS\Expose
     * @JMS\Type("float")
     * @JMS\Groups({"collection","details"})
     * @JMS\ReadOnly
     */
    public $longitude;

    /**
     * Constructor.
     *
     * @param string $street
     * @param string $aptBldg
     * @param string $townCity
     * @param string $stateCounty
     * @param string $country
     * @param string $zip
     */
    public function __construct($street = '', $aptBldg = '', $townCity = '', $stateCounty = '', $country = '', $zip = '')
    {
        $this->street = $street;
        $this->aptBldg = $aptBldg;
        $this->townCity = $townCity;
        $this->stateCounty = $stateCounty;
        $this->country = $country;
        $this->zip = $zip;
    }

    /**
     * @JMS\Expose
     * @JMS\VirtualProperty()
     * @JMS\Type("string")
     * @JMS\Groups({"collection","details"})
     * @JMS\SerializedName("countryName")
     *
     * @return mixed
     */
    public function getCountryName()
    {
        return $this->country;
    }

    /**
     * Gets the value of country.
     *
     * @return mixed
     */
    public function getCountry()
    {
        return $this->country;
    }

    /**
     * Sets the value of country.
     *
     * @param mixed $country the country
     *
     * @return self
     */
    public function setCountry($country)
    {
        $this->country = $country;

        return $this;
    }

    /**
     * Gets the value of street.
     *
     * @return mixed
     */
    public function getStreet()
    {
        return $this->street;
    }

    /**
     * Gets the street address including apt number (if set).
     *
     * @return string
     */
    public function getAptBldgAndStreet()
    {
        return ($this->aptBldg ? $this->aptBldg.', ' : '').$this->street;
    }

    /**
     * Sets the value of street.
     *
     * @param mixed $street the street
     *
     * @return self
     */
    public function setStreet($street)
    {
        $this->street = $street;

        return $this;
    }

    /**
     * Gets the value of aptBldg.
     *
     * @return mixed
     */
    public function getAptBldg()
    {
        return $this->aptBldg;
    }

    /**
     * Sets the value of aptBldg.
     *
     * @param mixed $aptBldg the apt bldg
     *
     * @return self
     */
    public function setAptBldg($aptBldg)
    {
        $this->aptBldg = $aptBldg;

        return $this;
    }

    /**
     * Gets the value of townCity.
     *
     * @return mixed
     */
    public function getTownCity()
    {
        return $this->townCity;
    }

    /**
     * Sets the value of townCity.
     *
     * @param mixed $townCity the town city
     *
     * @return self
     */
    public function setTownCity($townCity)
    {
        $this->townCity = $townCity;

        return $this;
    }

    /**
     * Gets the value of townCity.
     *
     * @return mixed
     */
    public function getNeighbourhood()
    {
        return $this->neighbourhood;
    }

    /**
     * Sets the value of neighbourhood.
     *
     * @param mixed $neighbourhood the town city
     *
     * @return self
     */
    public function setNeighbourhood($neighbourhood)
    {
        $this->neighbourhood = $neighbourhood;

        return $this;
    }

    /**
     * Gets the value of stateCounty.
     *
     * @return mixed
     */
    public function getStateCounty()
    {
        return $this->stateCounty;
    }

    /**
     * Sets the value of stateCounty.
     *
     * @param mixed $stateCounty the state county
     *
     * @return self
     */
    public function setStateCounty($stateCounty)
    {
        $this->stateCounty = $stateCounty;

        return $this;
    }

    /**
     * Gets the value of zip.
     *
     * @return mixed
     */
    public function getZip()
    {
        return $this->zip;
    }

    /**
     * Sets the value of zip.
     *
     * @param mixed $zip the zip
     *
     * @return self
     */
    public function setZip($zip)
    {
        $this->zip = $zip;

        return $this;
    }

    /**
     * Gets the value of hidden.
     *
     * @return mixed
     */
    public function isHidden()
    {
        return $this->hidden;
    }

    /**
     * Sets the value of hidden.
     *
     * @param mixed $hidden the hidden
     *
     * @return self
     */
    public function setHidden($hidden)
    {
        $this->hidden = $hidden;

        return $this;
    }

    /**
     * Gets the value of latitude.
     *
     * @return mixed
     */
    public function getLatitude()
    {
        return $this->latitude;
    }

    /**
     * Sets the value of latitude.
     *
     * @param mixed $latitude the latitude
     *
     * @return self
     */
    public function setLatitude($latitude)
    {
        $this->latitude = $latitude;

        return $this;
    }

    /**
     * Gets the value of longitude.
     *
     * @return mixed
     */
    public function getLongitude()
    {
        return $this->longitude;
    }

    /**
     * Sets the value of longitude.
     *
     * @param mixed $longitude the longitude
     *
     * @return self
     */
    public function setLongitude($longitude)
    {
        $this->longitude = $longitude;

        return $this;
    }

    /**
     * @return Coords|null
     */
    public function getLatLng()
    {
        return $this->getCoords();
    }

    /**
     * @return Coords|null
     */
    public function getCoords()
    {
        return new Coords($this->latitude, $this->longitude);
    }

    /**
     * @param Coords $coords
     *
     * @return $this
     */
    public function setCoords(Coords $coords)
    {
        $this->latitude = $coords->getLatitude();
        $this->longitude = $coords->getLongitude();

        return $this;
    }

    /**
     * @return $this
     */
    public function resetCoords()
    {
        $this->latitude = null;
        $this->longitude = null;

        return $this;
    }

    /**
     * Determine if lnglats are set.
     *
     * @return bool
     */
    public function hasCoords()
    {
        return $this->latitude && $this->longitude;
    }

    public function __toString()
    {
        return $this->getPublicAddress(',');
    }

    /**
     * @param string|null $separator
     *
     * @return string
     */
    public function getPublicAddress($separator = null)
    {
        if ($this->isHidden()) {
            return $this->joinParts([
                $this->getTownCity(),
                $this->getStateCounty(),
            ], $separator);
        }

        return $this->joinParts([
            $this->getAptBldgAndStreet(),
            $this->getTownCity(),
            $this->getStateCountyAndZip(),
        ], $separator);
    }

    /**
     * @param string|null $separator
     *
     * @return string
     */
    public function getFullAddress($separator = null)
    {
        return $this->joinParts([
            $this->getAptBldgAndStreet(),
            $this->getTownCity(),
            $this->getStateCountyAndZip(),
        ], $separator);
    }

    public function getFullAddressWithoutAptBldg($separator = null)
    {
        return $this->joinParts([
            $this->getStreet(),
            $this->getTownCity(),
            $this->getStateCountyAndZip(),
        ], $separator);
    }

    public function getStreetAndStreetWithAptBldgAddresses()
    {
        if (!$this->getStreet()) {
            return [];
        }

        $fullAddressWithoutAptBldg = $this->getFullAddressWithoutAptBldg();
        $fullAddresses[] = [
            'name' => $fullAddressWithoutAptBldg,
            'search_term' => $fullAddressWithoutAptBldg,
            'type' => ['street_address', 'route'],
            'address' => $this,
        ];
        $fullAddress = $this->getFullAddress();
        if ($fullAddress !== $fullAddressWithoutAptBldg) {
            array_unshift(
                $fullAddresses,
                [
                    'name' => $fullAddress,
                    'search_term' => $fullAddress,
                    'type' => 'street_address',
                    'address' => $this,
                ]
            );
        }

        return $fullAddresses;
    }

    /**
     * @param string $separator
     *
     * @return string
     */
    public function getShortAddress($separator = null)
    {
        return $this->joinParts([
            $this->getTownCity(),
            $this->getStateCountyAndZip(),
        ], $separator);
    }

    /**
     * @return array
     */
    public function getHierarchyTerms()
    {
        $terms = [];
        $terms['city'] = [
            'name' => $this->getTownCity(),
            'term' => $this->getTownCity().', '.$this->getStateCounty().', '.$this->getCountryName(),
        ];
        if ($this->getStateCounty()) {
            $terms['state'] = [
                'name' => $this->getStateCounty(),
                'term' => $this->getStateCounty().', '.$this->getCountryName(),
            ];
        }
        if ($this->getZip()) {
            $terms['zip'] = [
                'name' => $this->getZip(),
                'term' => $this->getZip().', '.$this->getCountryName(),
            ];
        }
        $terms['country'] = [
            'name' => $this->getCountryName(),
            'term' => $this->getCountryName(),
        ];

        return $terms;
    }

    /**
     * Compares two addresses for equality.
     *
     * @param Address $address
     *
     * @return bool
     */
    public function equalTo(self $address)
    {
        return $this->street === $address->getStreet()
            && $this->aptBldg === $address->getAptBldg()
            && $this->townCity === $address->getTownCity()
            && $this->stateCounty === $address->getStateCounty()
            && $this->zip === $address->getZip()
            && $this->country === $address->getCountry()
            && $this->neighbourhood === $address->getNeighbourhood();
    }

    public function getPath()
    {
        return implode(', ', array_filter([
            $this->getAptBldg(),
            $this->getStreet(),
            $this->getTownCity(),
            $this->getStateCounty(),
            $this->getZip(),
        ]));
    }

    /**
     * @param string|null $separator
     *
     * @return string|null
     */
    private function getStateCountyAndZip($separator = null)
    {
        if ($this->getZip() && $this->getStateCounty()) {
            return $this->joinParts([
                $this->getStateCounty(),
                $this->getZip(),
            ], $separator);
        } elseif ($this->getStateCounty()) {
            return $this->getStateCounty();
        } elseif ($this->getZip()) {
            return $this->getZip();
        } else {
            return null;
        }
    }

    /**
     * Join the parts of an address as well as removing any blank fields.
     *
     * @param array       $parts     The parts of the address to join
     * @param string|null $separator
     *
     * @return string|array
     */
    private function joinParts(array $parts, $separator = null)
    {
        $parts = array_unique($parts);
        $parts = array_filter($parts);

        $glue = $separator ? $separator.' ' : ' ';

        return implode($glue, $parts);
    }
}
