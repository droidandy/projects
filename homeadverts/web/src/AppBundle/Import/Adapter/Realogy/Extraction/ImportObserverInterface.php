<?php

namespace AppBundle\Import\Adapter\Realogy\Extraction;

interface ImportObserverInterface
{
    public function onCompanyProcessingStarted();

    public function onCompanyProcessingCompleted();

    public function onCompanyRemovalCompleted();

    public function onOfficeProcessingStarted();

    public function onOfficeProcessingCompleted();

    public function onOfficeRemovalCompleted();

    public function onUserProcessingStarted();

    public function onUserProcessingCompleted();

    public function onUserRemovalCompleted();

    public function onPropertyProcessingCompleted();

    public function onPropertyRemovalCompleted();
}
