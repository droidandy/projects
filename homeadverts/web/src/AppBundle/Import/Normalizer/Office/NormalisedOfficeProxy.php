<?php

namespace AppBundle\Import\Normalizer\Office;

use AppBundle\Import\Adapter\Realogy\DataSyncClient;

class NormalisedOfficeProxy implements NormalisedOfficeInterface
{
    /**
     * @var string
     */
    private $sourceRef;
    /**
     * @var DataSyncClient
     */
    private $dataSyncClient;
    /**
     * @var OfficeNormalizer
     */
    private $dataSyncOfficeNormalizer;
    /**
     * @var NormalisedOfficeInterface
     */
    private $normalisedOffice;
    /**
     * @var bool
     */
    private $initialized = false;

    /**
     * @param string           $sourceRef
     * @param DataSyncClient   $dataSyncClient
     * @param OfficeNormalizer $dataSyncOfficeNormalizer
     */
    public function __construct($sourceRef, DataSyncClient $dataSyncClient, OfficeNormalizer $dataSyncOfficeNormalizer)
    {
        $this->sourceRef = $sourceRef;
        $this->dataSyncClient = $dataSyncClient;
        $this->dataSyncOfficeNormalizer = $dataSyncOfficeNormalizer;
    }

    public function getValueToHash()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getName()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getSourceRef()
    {
        return $this->sourceRef;
    }

    public function getSourceRefType()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getSourceRefs()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getCompanySourceRef()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getCompanySourceRefType()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getCompanyName()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getType()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getEmail()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getLeadEmail()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getPhone()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getPhones()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getHomePageUrl()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getAvatarUrl()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getModified()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getDescriptions()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getLangs()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getMedia()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getSites()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getStreet()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getAptBldg()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getTownCity()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getStateCounty()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getCountry()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getZip()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getLat()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getLng()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getAddress()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getCoords()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function initialize()
    {
        if (!$this->initialized) {
            $this->normalisedOffice = $this
                ->dataSyncOfficeNormalizer
                ->normalize(
                    $this
                        ->dataSyncClient
                        ->getOfficeById($this->sourceRef)
                        ->wait(true)
                )
            ;

            $this->initialized = true;
        }
    }

    public function __call($name, $args)
    {
        $this->initialize();

        return $this->normalisedOffice->$name(...$args);
    }
}
