<?php

namespace AppBundle\Import\Normalizer\Company;

use AppBundle\Import\Adapter\Realogy\DataSyncClient;

class NormalisedCompanyProxy implements NormalisedCompanyInterface
{
    /**
     * @var DataSyncClient
     */
    private $dataSyncClient;
    /**
     * @var CompanyNormalizer
     */
    private $dataSyncCompanyNormalizer;
    /**
     * @var string
     */
    private $sourceRef;
    /**
     * @var NormalisedCompanyInterface
     */
    private $normalisedCompany;
    /**
     * @var bool
     */
    private $initialized = false;

    /**
     * @param string            $sourceRef
     * @param DataSyncClient    $dataSyncClient
     * @param CompanyNormalizer $dataSyncCompanyNormalizer
     */
    public function __construct($sourceRef, DataSyncClient $dataSyncClient, CompanyNormalizer $dataSyncCompanyNormalizer)
    {
        $this->sourceRef = $sourceRef;
        $this->dataSyncClient = $dataSyncClient;
        $this->dataSyncCompanyNormalizer = $dataSyncCompanyNormalizer;
    }

    public function getValueToHash()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getName()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getCommercialName()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getHomepageUrl()
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

    public function getMedia()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getNames()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getSites()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function getModified()
    {
        return $this->__call(__FUNCTION__, []);
    }

    public function initialize()
    {
        if (!$this->initialized) {
            $this->normalisedCompany = $this
                ->dataSyncCompanyNormalizer
                ->normalize(
                    $this
                        ->dataSyncClient
                        ->getCompanyById($this->sourceRef)
                        ->wait(true)
                )
            ;

            $this->initialized = true;
        }
    }

    public function __call($name, $args)
    {
        $this->initialize();

        return $this->normalisedCompany->$name(...$args);
    }
}
