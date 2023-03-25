<?php

namespace AppBundle\Import\Processor;

use AppBundle\Entity\Import\ImportJob;
use AppBundle\Entity\Import\ImportProperty;
use AppBundle\Entity\Property\Property;
use AppBundle\Import\Job\Process;
use AppBundle\Import\Normalizer\Property\NormalisedPropertyInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class ChainProcessor
{
    /**
     * @var ContainerInterface
     */
    private $app;
    /**
     * @var ImportJob
     */
    private $importJob;
    /**
     * @var Process
     */
    private $job;

    private $defaultProcessorDefs = [
        'general' => 'AppBundle\\Import\\Processor\\General',
        'user_ref' => 'AppBundle\\Import\\Processor\\UserRef',
        'company_ref' => 'AppBundle\\Import\\Processor\\CompanyRef',
        'geocode' => 'AppBundle\\Import\\Processor\\Geocode',
        'translate' => 'AppBundle\\Import\\Processor\\Translate',
        'photo' => 'AppBundle\\Import\\Processor\\Photo',
        'fake_photo' => 'AppBundle\\Import\\Processor\\FakePhoto',
        'video' => 'AppBundle\\Import\\Processor\\Video',
        'video3d' => 'AppBundle\\Import\\Processor\\Video3d',
        'validator' => 'AppBundle\\Import\\Processor\\Validator',
    ];

    private $processors;

    /**
     * @param ContainerInterface $app
     * @param ImportJob          $importJob
     * @param Process            $job
     */
    public function __construct(
        ContainerInterface $app,
        ImportJob $importJob,
        Process $job,
        array $processorDefs = []
    ) {
        $this->app = $app;
        $this->importJob = $importJob;
        $this->job = $job;

        if (!$processorDefs) {
            $processorDefs = $this->defaultProcessorDefs;
        }

        foreach ($processorDefs as $key => $processorDef) {
            $this->processors[$key] = new $processorDef($app, $importJob, $job);
        }
    }

    public function process(NormalisedPropertyInterface $normalisedProperty, Property $property, ImportProperty $importProperty)
    {
        $this->job->log('Processing');
        $errors = [];
        $processorResults = [];

        foreach ($this->processors as $index => $processor) {
            $this->job->log('Running '.str_replace('AppBundle\\Import\\', '', get_class($processor)));

            /* @var Processor $processor */
            $processor->process($normalisedProperty, $property);

            if ($processor->hasErrors()) {
                $errs = $processor->getErrors();

                foreach ($errs as $code => $error) {
                    $original = isset($errors[$code]) ? $errors[$code] : [];
                    $errors[$code] = array_merge($original, $error);
                }
            }

            $processorResults[$index] = $processor->getStatus();
        }

        if (in_array(Processor::STATUS_FAILED, $processorResults)) {
            $property->status = Property::STATUS_INVALID;
        } elseif (in_array(Processor::STATUS_DELAYED, $processorResults)) {
            $property->status = Property::STATUS_INCOMPLETE;
        } else {
            $property->status = Property::STATUS_ACTIVE;
        }

        $this->job->setErrors($errors);

        $importProperty->errors = json_encode($errors);
        $importProperty->processorResults = $processorResults;

        return $property;
    }
}
