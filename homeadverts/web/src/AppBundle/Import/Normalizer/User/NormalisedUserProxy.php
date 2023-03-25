<?php

namespace AppBundle\Import\Normalizer\User;

use AppBundle\Import\Adapter\Realogy\DataSyncClient;

class NormalisedUserProxy implements NormalisedUserInterface
{
    private $sourceRef;
    /**
     * @var NormalisedUser
     */
    private $normalisedUser;
    /**
     * @var DataSyncClient
     */
    private $dataSyncClient;
    /**
     * @var UserNormalizer
     */
    private $dataSyncUserNormalizer;

    private $initialized = false;

    /**
     * @param $sourceRef
     * @param DataSyncClient $dataSyncClient
     * @param UserNormalizer $dataSyncUserNormalizer
     */
    public function __construct(
        $sourceRef,
        DataSyncClient $dataSyncClient,
        UserNormalizer $dataSyncUserNormalizer
    ) {
        $this->sourceRef = $sourceRef;
        $this->dataSyncClient = $dataSyncClient;
        $this->dataSyncUserNormalizer = $dataSyncUserNormalizer;
    }

    public function __call($name, $arguments)
    {
        $this->initialize();

        return $this->normalisedUser->$name(...$arguments);
    }

    public function getValueToHash()
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

    public function getVirtualSourceRefs()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getOfficeSourceRef()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getOfficeSourceRefType()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getName()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getPhone()
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

    public function getAllEmails()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getHomePageUrl()
    {
        return $this->__call(__FUNCTION__, []);
    }

    /**
     * @return mixed
     */
    public function getAvatarUrl()
    {
        return $this->__call(__FUNCTION__, []);
    }

    /**
     * @return mixed
     */
    public function getDescriptions()
    {
        return $this->__call(__FUNCTION__, []);
    }

    /**
     * @return mixed
     */
    public function getFallbackLatitude()
    {
        return $this->__call(__FUNCTION__, []);
    }

    /**
     * @return mixed
     */
    public function getFallbackLongitude()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getCompanyName()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getCompanyPhone()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getAddress()
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

    public function getFallbackCoords()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function initialize()
    {
        if (!$this->initialized) {
            $this->normalisedUser = $this
                ->dataSyncUserNormalizer
                ->normalize(
                    $this
                        ->dataSyncClient
                        ->getAgentById($this->sourceRef)
                        ->wait(true)
                )
            ;

            $this->initialized = true;
        }
    }
}
