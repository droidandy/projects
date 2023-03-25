<?php

namespace AppBundle\Import\Processor;

use AppBundle\Entity\Import\ImportJob;
use AppBundle\Import\Normalizer\Property\NormalisedPropertyInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

abstract class Processor
{
    const STATUS_FAILED = 'failed';
    const STATUS_DELAYED = 'delayed';
    const STATUS_SUCCESS = 'success';

    abstract public function process(NormalisedPropertyInterface $normalised, $propertyObj);

    /**
     * @var ContainerInterface
     */
    protected $app;
    protected $importID;
    protected $importJob;
    protected $importProperty;
    /**
     * @var ImportJob
     */
    protected $job;

    protected $errors = [];
    protected $delayed = false;

    public function __construct($app, ImportJob $importJob, $job)
    {
        $this->app = $app;
        $this->importID = $importJob->getId();
        $this->importJob = $importJob;
        $this->job = $job;
    }

    public function getErrors()
    {
        return $this->errors;
    }

    public function hasErrors()
    {
        return count($this->errors) > 0;
    }

    public function addError($code, $message)
    {
        $this->errors[$code][] = $message;
    }

    public function getDelayed()
    {
        return $this->delayed;
    }

    public function getStatus()
    {
        if (!empty($this->errors)) {
            return self::STATUS_FAILED;
        } elseif ($this->delayed) {
            return self::STATUS_DELAYED;
        }

        return self::STATUS_SUCCESS;
    }

    protected function setDelayed($delayed)
    {
        $this->delayed = $delayed;
    }
}
