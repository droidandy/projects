<?php

namespace AppBundle\Import\Normalizer\Property;

use AppBundle\Import\Adapter\Realogy\DataSyncClient;

class NormalisedPropertyProxy implements NormalisedPropertyInterface
{
    private $sourceRef;
    /**
     * @var NormalisedProperty
     */
    private $normalisedProperty;
    private $dataSyncClient;
    private $propertyNormalizer;
    private $initialized = false;

    public function __construct(
        $sourceRef,
        DataSyncClient $dataSyncClient,
        PropertyNormalizer $propertyNormalizer
    ) {
        $this->sourceRef = $sourceRef;
        $this->dataSyncClient = $dataSyncClient;
        $this->propertyNormalizer = $propertyNormalizer;
    }

    public function __call($name, $arguments)
    {
        $this->initialize();

        return $this->normalisedProperty->$name(...$arguments);
    }

    public function getName()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function setName($name)
    {
        return $this->__call(__FUNCTION__, [$name]);
    }

    public function getAddress()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getMarket()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getStatus()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getBedrooms()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getBathrooms()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getHalfBathrooms()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getThreeQuarterBathrooms()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getType()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getPrice()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getPrimaryPhoto()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getPhotos()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getVideos()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getVideos3d()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getDescriptions()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getYearBuilt()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getInteriorArea()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getExteriorArea()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getSourceUrl()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getSourceRef()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getMlsRef()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getSourceGuid()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getSourceName()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getSourceType()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getLeadEmail()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getUser()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getUserId()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function setUserId($id)
    {
        return $this->__call(__FUNCTION__, [$id]);
    }

    public function getUserRef()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function setUserRef($userRef)
    {
        return $this->__call(__FUNCTION__, [$userRef]);
    }

    public function getUserRefType()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function setUserRefType($userRefType)
    {
        return $this->__call(__FUNCTION__, [$userRefType]);
    }

    public function getCompanyRef()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function setCompanyRef($companyRef)
    {
        return $this->__call(__FUNCTION__, [$companyRef]);
    }

    public function getCompanyRefType()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function setCompanyRefType($companyRefType)
    {
        return $this->__call(__FUNCTION__, [$companyRefType]);
    }

    public function getDateUpdated()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getExpirationDate()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getFallbackCoords()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getMisc()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function setIndex($index)
    {
        return $this->__call(__FUNCTION__, [$index]);
    }

    public function getHash()
    {
        $this->initialize();

        return sha1(serialize($this->normalisedProperty));
    }

    public function initialize()
    {
        if (!$this->initialized) {
            $this->normalisedProperty = $this
                ->propertyNormalizer
                ->normalize(
                    $this
                        ->dataSyncClient
                        ->getListingById($this->sourceRef)
                        ->wait(true)
                )
            ;

            $this->initialized = true;
        }
    }
}
