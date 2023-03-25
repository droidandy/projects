<?php

namespace AppBundle\Import\Queue;

use AppBundle\Entity\Import\ImportJob;

interface ImportJobCompletenessStrategyInterface
{
    /**
     * @param ImportJob $importJob
     *
     * @return bool
     */
    public function isCompanyImportComplete(ImportJob $importJob);

    /**
     * @param ImportJob $importJob
     *
     * @return bool
     */
    public function isOfficeImportComplete(ImportJob $importJob);

    /**
     * @param ImportJob $importJob
     *
     * @return bool
     */
    public function isUserImportComplete(ImportJob $importJob);

    /**
     * @param ImportJob $importJob
     *
     * @return bool
     */
    public function isPropertyImportComplete(ImportJob $importJob);
}
