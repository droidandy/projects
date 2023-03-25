<?php

namespace AppBundle\Event\Listener;

use AppBundle\Import\Job\ExecutionTimeTracker;
use AppBundle\Event\ImportEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class ExecutionTimeListener implements EventSubscriberInterface
{
    /**
     * @var ExecutionTimeTracker
     */
    private $executionTimeTracker;

    /**
     * RedisExecutionTimeListener constructor.
     *
     * @param ExecutionTimeTracker $executionTimeTracker
     */
    public function __construct(ExecutionTimeTracker $executionTimeTracker)
    {
        $this->executionTimeTracker = $executionTimeTracker;
    }

    public static function getSubscribedEvents()
    {
        return [
            'import_started' => 'onImportStarted',
            'deploy_started' => 'onDeployStarted',
            'deploy_completed' => 'onDeployCompleted',
            'extracting_started' => 'onExtractingStarted',
            'extracting_completed' => 'onExtractingCompleted',
            'company_extracting_started' => 'onCompanyExtractingStarted',
            'company_extracting_completed' => 'onCompanyExtractingCompleted',
            'office_extracting_started' => 'onOfficeExtractingStarted',
            'office_extracting_completed' => 'onOfficeExtractingCompleted',
            'processing_started' => 'onProcessingStarted',
            'processing_completed' => 'onProcessingCompleted',
            'company_processing_started' => 'onCompanyProcessingStarted',
            'company_processing_completed' => 'onCompanyProcessingCompleted',
            'office_processing_started' => 'onOfficeProcessingStarted',
            'office_processing_completed' => 'onOfficeProcessingCompleted',
            'user_processing_started' => 'onUserProcessingStarted',
            'user_processing_completed' => 'onUserProcessingCompleted',
            'property_processing_started' => 'onPropertyProcessingStarted',
            'property_processing_completed' => 'onPropertyProcessingCompleted',
            'company_removal_started' => 'onCompanyRemovalStarted',
            'company_removal_completed' => 'onCompanyRemovalCompleted',
            'office_removal_started' => 'onOfficeRemovalStarted',
            'office_removal_completed' => 'onOfficeRemovalCompleted',
            'user_removal_started' => 'onUserRemovalStarted',
            'user_removal_completed' => 'onUserRemovalCompleted',
            'property_removal_started' => 'onPropertyRemovalStarted',
            'property_removal_completed' => 'onPropertyRemovalCompleted',
            'import_completed' => 'onImportCompleted',
        ];
    }

    public function onImportStarted(ImportEvent $event)
    {
        $this->executionTimeTracker->setImportStarted($event->getImportContext()->getImportJob());
    }

    public function onDeployStarted(ImportEvent $event)
    {
        $this->executionTimeTracker->setDeployStarted($event->getImportContext()->getImportJob());
    }

    public function onDeployCompleted(ImportEvent $event)
    {
        $this->executionTimeTracker->setDeployCompleted($event->getImportContext()->getImportJob());
    }

    public function onExtractingStarted(ImportEvent $event)
    {
        $this->executionTimeTracker->setExtractingStarted($event->getImportContext()->getImportJob());
    }

    public function onExtractingCompleted(ImportEvent $event)
    {
        $this->executionTimeTracker->setExtractingCompleted($event->getImportContext()->getImportJob());
    }

    public function onCompanyExtractingStarted(ImportEvent $event)
    {
        $this->executionTimeTracker->setCompanyExtractingStarted($event->getImportContext()->getImportJob());
    }

    public function onCompanyExtractingCompleted(ImportEvent $event)
    {
        $this->executionTimeTracker->setCompanyExtractingCompleted($event->getImportContext()->getImportJob());
    }

    public function onOfficeExtractingStarted(ImportEvent $event)
    {
        $this->executionTimeTracker->setOfficeExtractingStarted($event->getImportContext()->getImportJob());
    }

    public function onOfficeExtractingCompleted(ImportEvent $event)
    {
        $this->executionTimeTracker->setOfficeExtractingCompleted($event->getImportContext()->getImportJob());
    }

    public function onProcessingStarted(ImportEvent $event)
    {
        $this->executionTimeTracker->setProcessingStarted($event->getImportContext()->getImportJob());
    }

    public function onProcessingCompleted(ImportEvent $event)
    {
        $this->executionTimeTracker->setProcessingCompleted($event->getImportContext()->getImportJob());
    }

    public function onCompanyProcessingStarted(ImportEvent $event)
    {
        $this->executionTimeTracker->setCompanyProcessingStarted($event->getImportContext()->getImportJob());
    }

    public function onCompanyProcessingCompleted(ImportEvent $event)
    {
        $this->executionTimeTracker->setCompanyProcessingCompleted($event->getImportContext()->getImportJob());
    }

    public function onOfficeProcessingStarted(ImportEvent $event)
    {
        $this->executionTimeTracker->setOfficeProcessingStarted($event->getImportContext()->getImportJob());
    }

    public function onOfficeProcessingCompleted(ImportEvent $event)
    {
        $this->executionTimeTracker->setOfficeProcessingCompleted($event->getImportContext()->getImportJob());
    }

    public function onUserProcessingStarted(ImportEvent $event)
    {
        $this->executionTimeTracker->setUserProcessingStarted($event->getImportContext()->getImportJob());
    }

    public function onUserProcessingCompleted(ImportEvent $event)
    {
        $this->executionTimeTracker->setUserProcessingCompleted($event->getImportContext()->getImportJob());
    }

    public function onPropertyProcessingStarted(ImportEvent $event)
    {
        $this->executionTimeTracker->setPropertyProcessingStarted($event->getImportContext()->getImportJob());
    }

    public function onPropertyProcessingCompleted(ImportEvent $event)
    {
        $this->executionTimeTracker->setPropertyProcessingCompleted($event->getImportContext()->getImportJob());
    }

    public function onCompanyRemovalStarted(ImportEvent $event)
    {
        $this->executionTimeTracker->setCompanyRemovalStarted($event->getImportContext()->getImportJob());
    }

    public function onCompanyRemovalCompleted(ImportEvent $event)
    {
        $this->executionTimeTracker->setCompanyRemovalCompleted($event->getImportContext()->getImportJob());
    }

    public function onOfficeRemovalStarted(ImportEvent $event)
    {
        $this->executionTimeTracker->setOfficeRemovalStarted($event->getImportContext()->getImportJob());
    }

    public function onOfficeRemovalCompleted(ImportEvent $event)
    {
        $this->executionTimeTracker->setOfficeRemovalCompleted($event->getImportContext()->getImportJob());
    }

    public function onUserRemovalStarted(ImportEvent $event)
    {
        $this->executionTimeTracker->setUserRemovalStarted($event->getImportContext()->getImportJob());
    }

    public function onUserRemovalCompleted(ImportEvent $event)
    {
        $this->executionTimeTracker->setUserRemovalCompleted($event->getImportContext()->getImportJob());
    }

    public function onPropertyRemovalStarted(ImportEvent $event)
    {
        $this->executionTimeTracker->setPropertyRemovalStarted($event->getImportContext()->getImportJob());
    }

    public function onPropertyRemovalCompleted(ImportEvent $event)
    {
        $this->executionTimeTracker->setPropertyRemovalCompleted($event->getImportContext()->getImportJob());
    }

    public function onImportCompleted(ImportEvent $event)
    {
        $this->executionTimeTracker->setImportCompleted($event->getImportContext()->getImportJob());
    }
}
