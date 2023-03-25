<?php

namespace AppBundle\Import\Normalizer;

use AppBundle\Import\Adapter\Realogy\DataSyncClient;
use AppBundle\Import\Normalizer\Company\CompanyNormalizer;
use AppBundle\Import\Normalizer\Company\NormalisedCompanyInterface;
use AppBundle\Import\Normalizer\Company\NormalisedCompanyProxy;
use AppBundle\Import\Normalizer\Office\NormalisedOfficeInterface;
use AppBundle\Import\Normalizer\Office\NormalisedOfficeProxy;
use AppBundle\Import\Normalizer\Office\OfficeNormalizer;
use AppBundle\Import\Normalizer\Property\NormalisedPropertyInterface;
use AppBundle\Import\Normalizer\Property\NormalisedPropertyProxy;
use AppBundle\Import\Normalizer\Property\PropertyNormalizer;
use AppBundle\Import\Normalizer\User\NormalisedUserInterface;
use AppBundle\Import\Normalizer\User\NormalisedUserProxy;
use AppBundle\Import\Normalizer\User\UserNormalizer;

class NormalisedEntityFactory
{
    /**
     * @var DataSyncClient
     */
    private $dataSyncClient;
    /**
     * @var CompanyNormalizer
     */
    private $companyNormalizer;
    /**
     * @var OfficeNormalizer
     */
    private $officeNormalizer;
    /**
     * @var UserNormalizer
     */
    private $userNormalizer;
    /**
     * @var PropertyNormalizer
     */
    private $propertyNormalizer;

    /**
     * @param DataSyncClient     $dataSyncClient
     * @param CompanyNormalizer  $companyNormalizer
     * @param OfficeNormalizer   $officeNormalizer
     * @param UserNormalizer     $userNormalizer
     * @param PropertyNormalizer $propertyNormalizer
     */
    public function __construct(
        DataSyncClient $dataSyncClient,
        CompanyNormalizer $companyNormalizer,
        OfficeNormalizer $officeNormalizer,
        UserNormalizer $userNormalizer,
        PropertyNormalizer $propertyNormalizer
    ) {
        $this->dataSyncClient = $dataSyncClient;
        $this->companyNormalizer = $companyNormalizer;
        $this->officeNormalizer = $officeNormalizer;
        $this->userNormalizer = $userNormalizer;
        $this->propertyNormalizer = $propertyNormalizer;
    }

    /**
     * @param array $payload
     *
     * @return NormalisedCompanyInterface
     */
    public function createCompany(array $payload)
    {
        if (isset($payload['payload'])) {
            return unserialize($payload['payload']);
        } elseif (isset($payload['ref'])) {
            return new NormalisedCompanyProxy(
                $payload['ref'],
                $this->dataSyncClient,
                $this->companyNormalizer
            );
        }

        throw new \InvalidArgumentException('Couldnt parse payload');
    }

    /**
     * @param array $payload
     *
     * @return NormalisedOfficeInterface
     */
    public function createOffice(array $payload)
    {
        if (isset($payload['payload'])) {
            return unserialize($payload['payload']);
        } elseif (isset($payload['ref'])) {
            return new NormalisedOfficeProxy(
                $payload['ref'],
                $this->dataSyncClient,
                $this->officeNormalizer
            );
        }

        throw new \InvalidArgumentException('Couldnt parse payload');
    }

    /**
     * @param array $payload
     *
     * @return NormalisedUserInterface
     */
    public function createUser(array $payload)
    {
        if (isset($payload['payload'])) {
            return unserialize($payload['payload']);
        } elseif (isset($payload['ref'])) {
            return new NormalisedUserProxy(
                $payload['ref'],
                $this->dataSyncClient,
                $this->userNormalizer
            );
        }

        throw new \InvalidArgumentException('Couldnt parse payload');
    }

    /**
     * @param array $payload
     *
     * @return NormalisedPropertyInterface
     */
    public function createProperty(array $payload)
    {
        if (isset($payload['payload'])) {
            return unserialize($payload['payload']);
        } elseif (isset($payload['ref'])) {
            return new NormalisedPropertyProxy(
                $payload['ref'],
                $this->dataSyncClient,
                $this->propertyNormalizer
            );
        }

        throw new \InvalidArgumentException('Couldnt parse payload');
    }
}
