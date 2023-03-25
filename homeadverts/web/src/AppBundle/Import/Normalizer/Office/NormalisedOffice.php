<?php

namespace AppBundle\Import\Normalizer\Office;

use AppBundle\Entity\Embeddable\Address;
use AppBundle\Entity\Embeddable\Coords;

class NormalisedOffice implements NormalisedOfficeInterface
{
    public $name;
    public $sourceRef;
    public $sourceRefType;
    public $sourceRefs;
    public $companySourceRef;
    public $companySourceRefType;
    public $companyName;
    public $type;
    public $email;
    public $leadEmail;
    public $phone;
    public $phones;
    public $homePageUrl;
    public $avatarUrl;
    public $modified;

    public $descriptions;
    public $langs;
    public $media;
    public $sites;

    public $street;
    public $aptBldg;
    public $townCity;
    public $stateCounty;
    public $country;
    public $zip;
    public $lat;
    public $lng;

    public function getValueToHash()
    {
        $propertyList = [
            'name',
            'sourceRef',
            'sourceRefType',
            'sourceRefs',
            'companySourceRef',
            'companySourceRefType',
            'companyName',
            'type',
            'email',
            'leadEmail',
            'phone',
            'phones',
            'homePageUrl',
            'avatarUrl',
            'modified',

            'descriptions',
            'langs',
            'media',
            'sites',

            'street',
            'aptBldg',
            'townCity',
            'stateCounty',
            'country',
            'zip',
            'lat',
            'lng',
        ];

        $extraFieldList = array_diff(
            array_keys(get_object_vars($this)),
            array_merge($propertyList, [])
        );
        if (!empty($extraFieldList)) {
            throw new \LogicException(
                'Not expected fields detected in the object NormalisedOffice: '.implode(', ', $extraFieldList)
            );
        }

        $arrayToSerialize = [];
        foreach ($propertyList as $property) {
            $arrayToSerialize[$property] = $this->{$property};
        }

        return serialize($arrayToSerialize);
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @return mixed
     */
    public function getSourceRef()
    {
        return $this->sourceRef;
    }

    /**
     * @return mixed
     */
    public function getSourceRefType()
    {
        return $this->sourceRefType;
    }

    /**
     * @return mixed
     */
    public function getSourceRefs()
    {
        return $this->sourceRefs;
    }

    /**
     * @return mixed
     */
    public function getCompanySourceRef()
    {
        return $this->companySourceRef;
    }

    /**
     * @return mixed
     */
    public function getCompanySourceRefType()
    {
        return $this->companySourceRefType;
    }

    /**
     * @return mixed
     */
    public function getCompanyName()
    {
        return $this->companyName;
    }

    /**
     * @return mixed
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @return mixed
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * @return mixed
     */
    public function getLeadEmail()
    {
        return $this->leadEmail;
    }

    /**
     * @return mixed
     */
    public function getPhone()
    {
        return $this->phone;
    }

    /**
     * @return mixed
     */
    public function getPhones()
    {
        return $this->phones;
    }

    /**
     * @return mixed
     */
    public function getHomePageUrl()
    {
        return $this->homePageUrl;
    }

    /**
     * @return mixed
     */
    public function getAvatarUrl()
    {
        return $this->avatarUrl;
    }

    /**
     * @return mixed
     */
    public function getModified()
    {
        return $this->modified;
    }

    /**
     * @return mixed
     */
    public function getDescriptions()
    {
        return $this->descriptions;
    }

    /**
     * @return mixed
     */
    public function getLangs()
    {
        return $this->langs;
    }

    /**
     * @return mixed
     */
    public function getMedia()
    {
        return $this->media;
    }

    /**
     * @return mixed
     */
    public function getSites()
    {
        return $this->sites;
    }

    /**
     * @return mixed
     */
    public function getStreet()
    {
        return $this->street;
    }

    /**
     * @return mixed
     */
    public function getAptBldg()
    {
        return $this->aptBldg;
    }

    /**
     * @return mixed
     */
    public function getTownCity()
    {
        return $this->townCity;
    }

    /**
     * @return mixed
     */
    public function getStateCounty()
    {
        return $this->stateCounty;
    }

    /**
     * @return mixed
     */
    public function getCountry()
    {
        return $this->country;
    }

    /**
     * @return mixed
     */
    public function getZip()
    {
        return $this->zip;
    }

    /**
     * @return mixed
     */
    public function getLat()
    {
        return $this->lat;
    }

    /**
     * @return mixed
     */
    public function getLng()
    {
        return $this->lng;
    }

    /**
     * @return Address
     */
    public function getAddress()
    {
        return new Address(
            $this->street,
            $this->aptBldg,
            $this->townCity,
            $this->stateCounty,
            $this->country,
            $this->zip
        );
    }

    /**
     * @return Coords
     */
    public function getCoords()
    {
        return new Coords($this->lat, $this->lng);
    }
}
