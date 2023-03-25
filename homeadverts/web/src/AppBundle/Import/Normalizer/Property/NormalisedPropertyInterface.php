<?php

namespace AppBundle\Import\Normalizer\Property;

use AppBundle\Entity\Embeddable\Address;
use AppBundle\Entity\Embeddable\Coords;
use AppBundle\Import\Normalizer\User\NormalisedUser;
use AppBundle\Search\Market;

interface NormalisedPropertyInterface
{
    /**
     * @return string|null
     */
    public function getName();

    /**
     * @param $name
     *
     * @return self
     */
    public function setName($name);

    /**
     * @return Address
     */
    public function getAddress();

    /**
     * @return Market
     */
    public function getMarket();

    /**
     * @return int
     */
    public function getStatus();

    /**
     * @return int|null
     */
    public function getBedrooms();

    /**
     * @return mixed
     */
    public function getBathrooms();

    /**
     * @return mixed
     */
    public function getHalfBathrooms();

    /**
     * @return mixed
     */
    public function getThreeQuarterBathrooms();

    /**
     * @return mixed
     */
    public function getType();

    /**
     * @return mixed
     */
    public function getPrice();

    /**
     * @return string
     */
    public function getPrimaryPhoto();

    /**
     * @return array
     */
    public function getPhotos();

    /**
     * @return array
     */
    public function getVideos();

    /**
     * @return array
     */
    public function getVideos3d();

    /**
     * @return array
     */
    public function getDescriptions();

    /**
     * @return int|null
     */
    public function getYearBuilt();

    /**
     * Get interior property size (always in m2).
     *
     * @return float
     */
    public function getInteriorArea();

    /**
     * Get exterior property size (always in m2).
     *
     * @return mixed
     */
    public function getExteriorArea();

    /**
     * @return string
     */
    public function getSourceUrl();

    /**
     * @return string
     */
    public function getSourceRef();

    /**
     * @return string|null
     */
    public function getMlsRef();

    /**
     * @return string|null
     */
    public function getSourceGuid();

    /**
     * @return string
     */
    public function getSourceName();

    /**
     * @return string
     */
    public function getSourceType();

    /**
     * @return string
     */
    public function getLeadEmail();

    /**
     * @return NormalisedUser
     */
    public function getUser();

    /**
     * @return int|null
     */
    public function getUserId();

    /**
     * @return self
     */
    public function setUserId($id);

    /**
     * @return string|null
     */
    public function getUserRef();

    /**
     * @return self
     */
    public function setUserRef($userRef);

    /**
     * @return string|null
     */
    public function getUserRefType();

    /**
     * @return self
     */
    public function setUserRefType($userRefType);

    /**
     * @return mixed
     */
    public function getCompanyRef();

    /**
     * @param mixed $companyRef
     */
    public function setCompanyRef($companyRef);

    /**
     * @return mixed
     */
    public function getCompanyRefType();

    /**
     * @param mixed $companyRefType
     */
    public function setCompanyRefType($companyRefType);

    /**
     * @return \DateTime
     */
    public function getDateUpdated();

    /**
     * @return \DateTime
     */
    public function getExpirationDate();

    /**
     * @return Coords|null
     */
    public function getFallbackCoords();

    /**
     * @return array
     */
    public function getMisc();

    /**
     * @return self
     */
    public function setIndex($index);

    /**
     * @return string
     */
    public function getHash();
}
