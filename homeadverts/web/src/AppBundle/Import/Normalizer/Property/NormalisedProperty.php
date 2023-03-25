<?php

namespace AppBundle\Import\Normalizer\Property;

use AppBundle\Entity\Embeddable\Address;
use AppBundle\Entity\Embeddable\Price;
use AppBundle\Entity\Embeddable\Coords;
use AppBundle\Import\Normalizer\User\NormalisedUser;
use AppBundle\Search\Market;

class NormalisedProperty implements NormalisedPropertyInterface
{
    protected $name;
    protected $market;
    protected $status;
    protected $bedrooms;
    protected $bathrooms;
    protected $halfBathrooms;
    protected $threeQuarterBathrooms;
    protected $street;
    protected $aptBldg;
    protected $neighbourhood;
    protected $townCity;
    protected $country;
    protected $stateCounty;
    protected $zip;
    protected $addressHidden;
    protected $type;
    protected $price;
    protected $currency;
    protected $priceQualifier;
    protected $primaryPhoto;
    protected $photos;
    protected $videos;
    protected $videos3d;
    protected $descriptions;
    protected $yearBuilt;
    protected $expirationDate;
    protected $interiorArea;
    protected $exteriorArea;
    protected $sourceUrl;
    protected $sourceRef;
    protected $mlsRef;
    protected $sourceGuid;
    protected $sourceName;
    protected $sourceType;
    protected $leadEmail;
    protected $user;
    protected $userId;
    protected $userRef;
    protected $userRefType;
    protected $companyRef;
    protected $companyRefType;
    protected $dateUpdated;
    protected $latitude;
    protected $longitude;
    protected $latitudeFallback;
    protected $longitudeFallback;
    protected $index;
    protected $misc;

    public function __construct(array $data)
    {
        $data = (array) $data;
        foreach ($data as $key => $value) {
            if (in_array($key, ['photos', 'videos']) && is_array($value)) {
                foreach ($value as $key2 => $value2) {
                    $value[$key2] = (object) $value2; // PHP-Resque munges our objects.
                }
            } elseif (in_array($key, ['price']) && is_array($value)) {
                $value = (object) $value;
            }

            $this->{$key} = $value;
        }
    }

    public function getName()
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Address
     */
    public function getAddress()
    {
        return (new Address())
            ->setStreet($this->street)
            ->setAptBldg($this->aptBldg)
            ->setNeighbourhood($this->neighbourhood)
            ->setCountry($this->country)
            ->setStateCounty($this->stateCounty)
            ->setTownCity($this->townCity)
            ->setZip($this->zip)
            ->setHidden($this->addressHidden)
            ->setCoords(new Coords($this->latitude, $this->longitude))
        ;
    }

    /**
     * @return string
     */
    public function getMarket()
    {
        return new Market($this->market);
    }

    /**
     * @return int|null
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * @return int|null
     */
    public function getBedrooms()
    {
        return $this->bedrooms;
    }

    /**
     * @return mixed
     */
    public function getBathrooms()
    {
        return $this->bathrooms;
    }

    /**
     * @return mixed
     */
    public function getHalfBathrooms()
    {
        return $this->halfBathrooms;
    }

    /**
     * @return mixed
     */
    public function getThreeQuarterBathrooms()
    {
        return $this->threeQuarterBathrooms;
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
    public function getPrice()
    {
        return new Price(
            $this->price->amount,
            $this->price->currency,
            $this->price->period,
            $this->price->qualifier,
            $this->price->priceInUSD
        );
    }

    /**
     * @return string
     */
    public function getPrimaryPhoto()
    {
        return $this->primaryPhoto;
    }

    /**
     * @return array
     */
    public function getPhotos()
    {
        return $this->photos;
    }

    /**
     * @return array
     */
    public function getVideos()
    {
        return $this->videos;
    }

    /**
     * @return array
     */
    public function getVideos3d()
    {
        return $this->videos3d;
    }

    /**
     * @return array
     */
    public function getDescriptions()
    {
        return $this->descriptions;
    }

    /**
     * @return int|null
     */
    public function getYearBuilt()
    {
        return $this->yearBuilt;
    }

    /**
     * Get interior property size (always in m2).
     *
     * @return float
     */
    public function getInteriorArea()
    {
        return $this->interiorArea;
    }

    /**
     * Get exterior property size (always in m2).
     *
     * @return mixed
     */
    public function getExteriorArea()
    {
        return $this->exteriorArea;
    }

    /**
     * @return string
     */
    public function getSourceUrl()
    {
        return $this->sourceUrl;
    }

    /**
     * @return string
     */
    public function getSourceRef()
    {
        return $this->sourceRef;
    }

    /**
     * @return string|null
     */
    public function getMlsRef()
    {
        return $this->mlsRef;
    }

    /**
     * @return string|null
     */
    public function getSourceGuid()
    {
        return $this->sourceGuid;
    }

    /**
     * @return string
     */
    public function getSourceName()
    {
        return $this->sourceName;
    }

    /**
     * @param string
     */
    public function setSourceName($sourceName)
    {
        $this->sourceName = $sourceName;
    }

    /**
     * @return string
     */
    public function getSourceType()
    {
        return $this->sourceType;
    }

    /**
     * {@inheritdoc}
     */
    public function getLeadEmail()
    {
        return $this->leadEmail;
    }

    /**
     * @return NormalisedUser
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @return int|null
     */
    public function getUserId()
    {
        return $this->userId;
    }

    /**
     * {@inheritdoc}
     */
    public function setUserId($id)
    {
        $this->userId = $id;

        return $this;
    }

    /**
     * @return int|null
     */
    public function getUserRef()
    {
        return $this->userRef;
    }

    /**
     * {@inheritdoc}
     */
    public function setUserRef($userRef)
    {
        $this->userRef = $userRef;

        return $this;
    }

    /**
     * @return int|null
     */
    public function getUserRefType()
    {
        return $this->userRefType;
    }

    /**
     * {@inheritdoc}
     */
    public function setUserRefType($userRefType)
    {
        $this->userRefType = $userRefType;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getCompanyRef()
    {
        return $this->companyRef;
    }

    /**
     * @param mixed $companyRef
     */
    public function setCompanyRef($companyRef)
    {
        $this->companyRef = $companyRef;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getCompanyRefType()
    {
        return $this->companyRefType;
    }

    /**
     * @param mixed $companyRefType
     */
    public function setCompanyRefType($companyRefType)
    {
        $this->companyRefType = $companyRefType;

        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getDateUpdated()
    {
        return $this->dateUpdated
            ? new \DateTime($this->dateUpdated)
            : null
        ;
    }

    /**
     * @return \DateTime
     */
    public function getExpirationDate()
    {
        return $this->expirationDate
            ? new \DateTime($this->expirationDate)
            : null
        ;
    }

    /**
     * @return mixed
     */
    public function getFallbackCoords()
    {
        return new Coords($this->latitudeFallback, $this->longitudeFallback);
    }

    /**
     * @return array
     */
    public function getMisc()
    {
        return $this->misc;
    }

    public function setIndex($i)
    {
        $this->index = $i;
    }

    public function getHash()
    {
        $cloneToHash = clone $this;
        $cloneToHash->setIndex(null);
        $cloneToHash->setUserId(null);

        return sha1(serialize($this));
    }
}
