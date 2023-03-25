<?php

namespace AppBundle\Event;

use AppBundle\Import\Queue\ImportContext;
use Symfony\Component\EventDispatcher\Event;

class ImportEvent extends Event
{
    const DEPLOY_STARTED = 'deploy_started';
    const DEPLOY_COMPLETED = 'deploy_completed';
    const IMPORT_STARTED = 'import_started';
    const IMPORT_COMPLETED = 'import_completed';

    const EXTRACTING_STARTED = 'extracting_started';
    const EXTRACTING_COMPLETED = 'extracting_completed';
    const COMPANY_EXTRACTING_STARTED = 'company_extracting_started';
    const COMPANY_EXTRACTING_COMPLETED = 'company_extracting_completed';
    const OFFICE_EXTRACTING_STARTED = 'office_extracting_started';
    const OFFICE_EXTRACTING_COMPLETED = 'office_extracting_completed';

    const PROCESSING_STARTED = 'processing_started';
    const PROCESSING_COMPLETED = 'processing_completed';
    const COMPANY_PROCESSING_STARTED = 'company_processing_started';
    const COMPANY_PROCESSING_COMPLETED = 'company_processing_completed';
    const OFFICE_PROCESSING_STARTED = 'office_processing_started';
    const OFFICE_PROCESSING_COMPLETED = 'office_processing_completed';
    const USER_PROCESSING_STARTED = 'user_processing_started';
    const USER_PROCESSING_COMPLETED = 'user_processing_completed';
    const PROPERTY_PROCESSING_STARTED = 'property_processing_started';
    const PROPERTY_PROCESSING_COMPLETED = 'property_processing_completed';

    const COMPANY_REMOVAL_STARTED = 'company_removal_started';
    const COMPANY_REMOVAL_COMPLETED = 'company_removal_completed';
    const OFFICE_REMOVAL_STARTED = 'office_removal_started';
    const OFFICE_REMOVAL_COMPLETED = 'office_removal_completed';
    const USER_REMOVAL_STARTED = 'user_removal_started';
    const USER_REMOVAL_COMPLETED = 'user_removal_completed';
    const PROPERTY_REMOVAL_STARTED = 'property_removal_started';
    const PROPERTY_REMOVAL_COMPLETED = 'property_removal_completed';

    /**
     * @var ImportContext
     */
    private $importContext;

    /**
     * ImportEvent constructor.
     *
     * @param ImportContext $importContext
     */
    public function __construct(ImportContext $importContext)
    {
        $this->importContext = $importContext;
    }

    /**
     * @return ImportContext
     */
    public function getImportContext()
    {
        return $this->importContext;
    }
}
