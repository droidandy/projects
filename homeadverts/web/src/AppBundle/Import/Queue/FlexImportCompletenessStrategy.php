<?php

namespace AppBundle\Import\Queue;

use AppBundle\Entity\Import\ImportJob;

class FlexImportCompletenessStrategy implements ImportJobCompletenessStrategyInterface
{
    /**
     * @var ImportJobCompletenessStrategyInterface[]
     */
    private $typeStrategyMap;

    /**
     * FlexImportCompletenessStrategy constructor.
     *
     * @param ImportJobCompletenessStrategyInterface[] $typeStrategyMap
     */
    public function __construct(array $typeStrategyMap)
    {
        $this->typeStrategyMap = $typeStrategyMap;
    }

    public function isCompanyImportComplete(ImportJob $importJob)
    {
        return $this->typeStrategyMap['company']->isCompanyImportComplete($importJob);
    }

    public function isOfficeImportComplete(ImportJob $importJob)
    {
        return $this->typeStrategyMap['office']->isOfficeImportComplete($importJob);
    }

    public function isUserImportComplete(ImportJob $importJob)
    {
        return $this->typeStrategyMap['user']->isUserImportComplete($importJob);
    }

    public function isPropertyImportComplete(ImportJob $importJob)
    {
        return $this->typeStrategyMap['property']->isPropertyImportComplete($importJob);
    }
}
