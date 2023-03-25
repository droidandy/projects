<?php

namespace AppBundle\Import\Adapter\Realogy\Extraction;

use AppBundle\Event\ImportEvent;
use AppBundle\Import\Queue\ImportContext;
use AppBundle\Service\Import\Importer;
use AppBundle\Import\Queue\ImportJobTracker;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

class ImportObserver implements ImportObserverInterface
{
    /**
     * @var ImportJobTracker
     */
    private $importJobTracker;
    /**
     * @var EventDispatcherInterface
     */
    private $importEventDispatcher;
    /**
     * @var Importer
     */
    private $helper;
    /**
     * @var ImportContext
     */
    private $importContext;

    /**
     * @param ImportJobTracker         $importJobTracker
     * @param EventDispatcherInterface $importEventDispatcher
     * @param Importer                 $helper
     * @param ImportContext            $importContext
     */
    public function __construct(
        ImportJobTracker $importJobTracker,
        EventDispatcherInterface $importEventDispatcher,
        Importer $helper,
        ImportContext $importContext
    ) {
        $this->importJobTracker = $importJobTracker;
        $this->importEventDispatcher = $importEventDispatcher;
        $this->helper = $helper;
        $this->importContext = $importContext;
    }

    public function onCompanyProcessingStarted()
    {
        $this->importEventDispatcher->dispatch(
            ImportEvent::PROCESSING_STARTED,
            new ImportEvent($this->importContext)
        );
    }

    public function onCompanyProcessingCompleted()
    {
    }

    public function onCompanyRemovalCompleted()
    {
        $this->importJobTracker->tryComplete();
    }

    public function onOfficeProcessingStarted()
    {
    }

    public function onOfficeProcessingCompleted()
    {
    }

    public function onOfficeRemovalCompleted()
    {
        $this->importJobTracker->tryComplete();
    }

    public function onUserProcessingStarted()
    {
    }

    public function onUserProcessingCompleted()
    {
    }

    public function onUserRemovalCompleted()
    {
        $this->importJobTracker->tryComplete();
    }

    public function onPropertyProcessingCompleted()
    {
        $this->importEventDispatcher->dispatch(
            ImportEvent::PROCESSING_COMPLETED,
            new ImportEvent($this->importContext)
        );

        $this->importJobTracker->tryComplete();
    }

    public function onPropertyRemovalCompleted()
    {
        $this->importJobTracker->tryComplete();
    }
}
