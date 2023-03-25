<?php

namespace Test\AppBundle\Import_\Processor;

use AppBundle\Entity\ImportJob;
use AppBundle\Entity\ImportProperty;
use AppBundle\Entity\Property\Property;
use AppBundle\Import\Job\Process;
use AppBundle\Import\NormalisedProperty;
use AppBundle\Import\NormalisedPropertyInterface;
use AppBundle\Import\Processor\ChainProcessor;
use AppBundle\Import\Processor\Processor;
use Symfony\Component\DependencyInjection\ContainerInterface;

class ChainProcessorTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var ContainerInterface
     */
    private $container;
    /**
     * @var ImportJob
     */
    private $importJob;
    /**
     * @var Process
     */
    private $job;
    /**
     * @var ChainProcessor
     */
    private $chainProcessor;

    protected function setUp()
    {
        $this->container = $this->getContainer();
        $this->importJob = $this->getImportJob();
        $this->job = $this->getJob();
    }

    public function testProcessSuccess()
    {
        $chainProcessor = new ChainProcessor(
            $this->container,
            $this->importJob,
            $this->job,
            [
                'success_1' => Success1Processor::class,
                'success_2' => Success2Processor::class,
            ]
        );

        /** @var \PHPUnit_Framework_MockObject_MockObject $job */
        $job = $this->job;
        $job
            ->method('log')
            ->withConsecutive(
                ['Processing'],
                ['Running Test\\Processor\\Success1Processor'],
                ['Running Test\\Processor\\Success2Processor']
            )
        ;

        $normalisedProperty = $this->getNormalisedProperty();
        $property = $this->getProperty();
        $importProperty = $this->getImportProperty();

        $property = $chainProcessor->process($normalisedProperty, $property, $importProperty);

        $this->assertEquals(Property::STATUS_ACTIVE, $property->getStatus());
        $this->assertEquals(0, $this->job->countErrors());
        $this->assertEquals(
            [
                'success_1' => Processor::STATUS_SUCCESS,
                'success_2' => Processor::STATUS_SUCCESS,
            ],
            $importProperty->processorResults
        );
        $this->assertEquals('[]', $importProperty->errors);
    }

    public function testProcessDelayed()
    {
        $chainProcessor = new ChainProcessor(
            $this->container,
            $this->importJob,
            $this->job,
            [
                'success_1' => Success1Processor::class,
                'delayed' => DelayedProcessor::class,
                'success_2' => Success2Processor::class,
            ]
        );

        /** @var \PHPUnit_Framework_MockObject_MockObject $job */
        $job = $this->job;
        $job
            ->method('log')
            ->withConsecutive(
                ['Processing'],
                ['Running Test\\Processor\\Success1Processor'],
                ['Running Test\\Processor\\DelayedProcessor'],
                ['Running Test\\Processor\\Success2Processor']
            )
        ;

        $normalisedProperty = $this->getNormalisedProperty();
        $property = $this->getProperty();
        $importProperty = $this->getImportProperty();

        $property = $chainProcessor->process($normalisedProperty, $property, $importProperty);

        $this->assertEquals(Property::STATUS_INCOMPLETE, $property->getStatus());
        $this->assertEquals(0, $this->job->countErrors());
        $this->assertEquals(
            [
                'success_1' => Processor::STATUS_SUCCESS,
                'delayed' => Processor::STATUS_DELAYED,
                'success_2' => Processor::STATUS_SUCCESS,
            ],
            $importProperty->processorResults
        );
        $this->assertEquals('[]', $importProperty->errors);
    }

    public function testProcessError()
    {
        $chainProcessor = new ChainProcessor(
            $this->container,
            $this->importJob,
            $this->job,
            [
                'success_1' => Success1Processor::class,
                'delayed' => DelayedProcessor::class,
                'success_2' => Success2Processor::class,
                'error' => ErrorProcessor::class,
            ]
        );

        /** @var \PHPUnit_Framework_MockObject_MockObject $job */
        $job = $this->job;
        $job
            ->method('log')
            ->withConsecutive(
                ['Processing'],
                ['Running Test\\Processor\\Success1Processor'],
                ['Running Test\\Processor\\DelayedProcessor'],
                ['Running Test\\Processor\\Success2Processor'],
                ['Running Test\\Processor\\ErrorProcessor']
            )
        ;

        $normalisedProperty = $this->getNormalisedProperty();
        $property = $this->getProperty();
        $importProperty = $this->getImportProperty();

        $property = $chainProcessor->process($normalisedProperty, $property, $importProperty);

        $this->assertEquals(Property::STATUS_INVALID, $property->getStatus());
        $this->assertEquals(3, $this->job->countErrors());
        $this->assertEquals(
            [
                'success_1' => Processor::STATUS_SUCCESS,
                'delayed' => Processor::STATUS_DELAYED,
                'success_2' => Processor::STATUS_SUCCESS,
                'error' => Processor::STATUS_FAILED,
            ],
            $importProperty->processorResults
        );
        $this->assertEquals(
            json_encode([
                'code1' => ['error1'],
                'code2' => ['error21', 'error22'],
            ]),
            $importProperty->errors
        );
    }

    private function getContainer()
    {
        return $this
            ->getMockBuilder(ContainerInterface::class)
            ->getMock()
        ;
    }

    private function getImportJob()
    {
        return $this
            ->getMockBuilder(ImportJob::class)
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getJob()
    {
        return $this
            ->getMockBuilder(Process::class)
            ->setMethods(['log'])
            ->disableOriginalConstructor()
            ->getMock()
        ;
    }

    private function getNormalisedProperty()
    {
        return new NormalisedProperty([]);
    }

    private function getProperty()
    {
        return new Property();
    }

    private function getImportProperty()
    {
        return new ImportProperty();
    }
}

class Success1Processor extends Processor
{
    public function process(NormalisedPropertyInterface $normalised, $propertyObj)
    {
    }
}

class Success2Processor extends Processor
{
    public function process(NormalisedPropertyInterface $normalised, $propertyObj)
    {
    }
}

class DelayedProcessor extends Processor
{
    public function process(NormalisedPropertyInterface $normalised, $propertyObj)
    {
        $this->setDelayed(true);
    }
}

class ErrorProcessor extends Processor
{
    public function process(NormalisedPropertyInterface $normalised, $propertyObj)
    {
        foreach ([
                    'code1' => 'error1',
                    'code2' => ['error21', 'error22'],
                 ] as $code => $error) {
            foreach ((array) $error as $msg) {
                $this->addError($code, $msg);
            }
        }
    }
}
