<?php

namespace AppBundle\Import\Queue;

use AppBundle\Entity\Import\ImportJob;
use AppBundle\Import\Adapter\Realogy\Extraction\ImportObserverInterface;

class ImportContext
{
    /**
     * @var ImportJob
     */
    private $importJob;
    /**
     * @var callable
     */
    private $importObserverFactory;
    /**
     * @var array
     */
    private $onSuccessCbs = [];

    /**
     * @param ImportJob $importJob
     * @param callable  $importObserverFactory
     */
    public function __construct(
        ImportJob $importJob,
        callable $importObserverFactory
    ) {
        $this->importJob = $importJob;
        $this->importObserverFactory = $importObserverFactory;
    }

    /**
     * @return ImportJob
     */
    public function getImportJob()
    {
        return $this->importJob;
    }

    /**
     * @return ImportObserverInterface
     */
    public function getImportObserver()
    {
        $importObserverFactory = $this->importObserverFactory;

        return $importObserverFactory($this);
    }

    /**
     * @param callable $cb
     */
    public function addOnSuccessCb(callable $cb)
    {
        $this->onSuccessCbs[] = $cb;
    }

    public function onSuccess()
    {
        while ($onSuccessCb = array_shift($this->onSuccessCbs)) {
            $onSuccessCb();
        }
    }
}
