<?php

namespace AppBundle\Import\Normalizer\User;

use AppBundle\Entity\Embeddable\Address;
use AppBundle\Entity\Embeddable\Coords;

class NormalisedUser implements NormalisedUserInterface
{
    public $sourceRef;
    public $sourceRefType;
    public $sourceRefs;
    public $virtualSourceRefs;
    public $officeSourceRef;
    public $officeSourceRefType;
    public $name;
    public $phone;
    public $email;
    public $leadEmail;
    public $allEmails;
    public $homePageUrl;
    public $avatarUrl;
    public $descriptions;
    public $companyName;
    public $companyPhone;
    public $street;
    public $aptBldg;
    public $townCity;
    public $stateCounty;
    public $country;
    public $zip;
    public $fallbackLatitude;
    public $fallbackLongitude;

    /**
     * Needed to ensure the order and properties of serialized string is determined.
     */
    public function getValueToHash()
    {
        $propertyList = [
            'sourceRef',
            'sourceRefType',
            'sourceRefs',
            'officeSourceRef',
            'officeSourceRefType',
            'name',
            'phone',
            'email',
            'leadEmail',
            'allEmails',
            'homePageUrl',
            'avatarUrl',
            'descriptions',
            'companyName',
            'companyPhone',
            'street',
            'aptBldg',
            'townCity',
            'stateCounty',
            'country',
            'zip',
            'fallbackLatitude',
            'fallbackLongitude',
        ];

        $extraFieldList = array_diff(
            array_keys(get_object_vars($this)),
            array_merge($propertyList, ['virtualSourceRefs'])
        );
        if (!empty($extraFieldList)) {
            throw new \LogicException(
                'Not expected fields detected in the object NormalisedUser: '.implode(', ', $extraFieldList)
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
    public function getVirtualSourceRefs()
    {
        return $this->virtualSourceRefs;
    }

    /**
     * @return mixed
     */
    public function getOfficeSourceRef()
    {
        return $this->officeSourceRef;
    }

    /**
     * @return mixed
     */
    public function getOfficeSourceRefType()
    {
        return $this->officeSourceRefType;
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
    public function getPhone()
    {
        return $this->phone;
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

    public function getAllEmails()
    {
        return $this->allEmails;
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
    public function getDescriptions()
    {
        return $this->descriptions;
    }

    /**
     * @return mixed
     */
    public function getFallbackLatitude()
    {
        return $this->fallbackLatitude;
    }

    /**
     * @return mixed
     */
    public function getFallbackLongitude()
    {
        return $this->fallbackLongitude;
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
    public function getCompanyPhone()
    {
        return $this->companyPhone;
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
     * @return Coords
     */
    public function getFallbackCoords()
    {
        return new Coords($this->fallbackLatitude, $this->fallbackLongitude);
    }
}
