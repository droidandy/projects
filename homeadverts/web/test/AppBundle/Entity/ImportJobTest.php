<?php

namespace Test\HA\ListingsBundle\Entity;

use Doctrine\Common\PropertyChangedListener;
use AppBundle\Entity\Import\ImportJob;

class ImportJobTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var ImportJob
     */
    private $importJob;
    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    private $propertyChangedListener;

    private $fields;

    protected function setUp()
    {
        $this->propertyChangedListener = $this->getPropertyChangedListener();
        $this->importJob = $this->getImportJob();
        $this->importJob->addPropertyChangedListener($this->propertyChangedListener);
        $this->fields = [
            'id' => [
                'getter' => 'getId',
                'value' => null,
                'currentValue' => null,
                'initValue' => function () {
                    return $this->importJob->getId();
                },
            ],
            'dateAdded' => [
                'getter' => 'getDateAdded',
                'setter' => 'setDateAdded',
                'value' => new \DateTime(),
                'initValue' => function () {
                    return $this->importJob->getDateAdded();
                },
            ],
            'forceRenewal' => [
                'getter' => 'getForceRenewal',
                'setter' => 'setForceRenewal',
                'value' => false,
                'initValue' => function () {
                    return $this->importJob->getForceRenewal();
                },
            ],
            'total' => [
                'getter' => 'getTotal',
                'setter' => 'setTotal',
                'value' => 100,
                'initValue' => function () {
                    return $this->importJob->getTotal();
                },
            ],
            'processed' => [
                'getter' => 'getProcessed',
                'setter' => 'setProcessed',
                'value' => 100,
                'initValue' => function () {
                    return $this->importJob->getProcessed();
                },
            ],
            'skipped' => [
                'getter' => 'getSkipped',
                'setter' => 'setSkipped',
                'value' => 10,
                'initValue' => function () {
                    return $this->importJob->getSkipped();
                },
            ],
            'updated' => [
                'getter' => 'getUpdated',
                'setter' => 'setUpdated',
                'value' => 90,
                'initValue' => function () {
                    return $this->importJob->getUpdated();
                },
            ],
            'errors' => [
                'getter' => 'getErrors',
                'setter' => 'setErrors',
                'value' => 15,
                'initValue' => function () {
                    return $this->importJob->getErrors();
                },
            ],
            'errorsBedroom' => [
                'getter' => 'getErrorsBedroom',
                'setter' => 'setErrorsBedroom',
                'value' => 1,
                'initValue' => function () {
                    return $this->importJob->getErrorsBedroom();
                },
            ],
            'errorsMetadata' => [
                'getter' => 'getErrorsMetadata',
                'setter' => 'setErrorsMetadata',
                'value' => 2,
                'initValue' => function () {
                    return $this->importJob->getErrorsMetadata();
                },
            ],
            'errorsAddress' => [
                'getter' => 'getErrorsAddress',
                'setter' => 'setErrorsAddress',
                'value' => 3,
                'initValue' => function () {
                    return $this->importJob->getErrorsAddress();
                },
            ],
            'errorsPrice' => [
                'getter' => 'getErrorsPrice',
                'setter' => 'setErrorsPrice',
                'value' => 4,
                'initValue' => function () {
                    return $this->importJob->getErrorsPrice();
                },
            ],
            'errorsPhotos' => [
                'getter' => 'getErrorsPhotos',
                'setter' => 'setErrorsPhotos',
                'value' => 5,
                'initValue' => function () {
                    return $this->importJob->getErrorsPhotos();
                },
            ],
            'errorsOther' => [
                'getter' => 'getErrorsOther',
                'setter' => 'setErrorsOther',
                'value' => 6,
                'initValue' => function () {
                    return $this->importJob->getErrorsOther();
                },
            ],
            'removed' => [
                'getter' => 'getRemoved',
                'setter' => 'setRemoved',
                'value' => 25,
                'initValue' => function () {
                    return $this->importJob->getRemoved();
                },
            ],
            'userTotal' => [
                'getter' => 'getUserTotal',
                'setter' => 'setUserTotal',
                'value' => 50,
                'initValue' => function () {
                    return $this->importJob->getUserTotal();
                },
            ],
            'userProcessed' => [
                'getter' => 'getUserProcessed',
                'setter' => 'setUserProcessed',
                'increment' => 'incrementUserProcessed',
                'decrement' => 'decrementUserProcessed',
                'value' => 50,
                'initValue' => function () {
                    return $this->importJob->getUserProcessed();
                },
            ],
            'userSkipped' => [
                'getter' => 'getUserSkipped',
                'setter' => 'setUserSkipped',
                'increment' => 'incrementUserSkipped',
                'decrement' => 'decrementUserSkipped',
                'value' => 10,
                'initValue' => function () {
                    return $this->importJob->getUserSkipped();
                },
            ],
            'userUpdated' => [
                'getter' => 'getUserUpdated',
                'setter' => 'setUserUpdated',
                'increment' => 'incrementUserUpdated',
                'decrement' => 'decrementUserUpdated',
                'value' => 40,
                'initValue' => function () {
                    return $this->importJob->getUserUpdated();
                },
            ],
            'userErrors' => [
                'getter' => 'getUserErrors',
                'setter' => 'setUserErrors',
                'increment' => 'incrementUserErrors',
                'decrement' => 'decrementUserErrors',
                'value' => 15,
                'initValue' => function () {
                    return $this->importJob->getUserErrors();
                },
            ],
            'userRemoved' => [
                'getter' => 'getUserRemoved',
                'setter' => 'setUserRemoved',
                'value' => 25,
                'initValue' => function () {
                    return $this->importJob->getUserRemoved();
                },
            ],
        ];
    }

    public function testWithoutNotify()
    {
        $this
            ->propertyChangedListener
            ->expects($this->never())
            ->method('propertyChanged')
        ;
        foreach ($this->fields as $key => $field) {
            if (isset($field['setter'])) {
                $this->importJob->{$field['setter']}($field['value']);
            }
            $this->assertEquals(
                $field['value'],
                $this->importJob->{$field['getter']}(),
                sprintf('Failed for "%s":"%s"', $key, json_encode($field))
            );
            if (isset($field['increment'])) {
                $this->importJob->{$field['increment']}();
                $this->assertEquals(
                    $field['value'] + 1,
                    $this->importJob->{$field['getter']}(),
                    sprintf('Failed for "%s":"%s"', $key, json_encode($field))
                );
            }
            if (isset($field['decrement'])) {
                $this->importJob->{$field['decrement']}();
                $this->assertEquals(
                    $field['value'],
                    $this->importJob->{$field['getter']}(),
                    sprintf('Failed for "%s":"%s"', $key, json_encode($field))
                );
            }
        }
    }

    public function testNotify()
    {
        $this
            ->propertyChangedListener
            ->expects($this->exactly(28))
            ->method('propertyChanged')
            ->with(
                $this->callback(function ($obj) {
                    return $obj === $this->importJob;
                }),
                $this->callback(function ($propName) use (&$fieldName) {
                    $fieldName = $propName;

                    return true;
                }),
                $this->callback(function ($oldValue) use (&$fieldName) {
                    return $this->fields[$fieldName]['initValue']() === $oldValue;
                }),
                $this->callback(function ($newValue) use (&$fieldName) {
                    return $this->fields[$fieldName]['value'] === $newValue;
                })
            )
        ;
        foreach ($this->fields as $key => $field) {
            if (isset($field['setter'])) {
                $this->importJob->{$field['setter'].'Notify'}($field['value']);
            }
            $this->assertEquals(
                $field['value'],
                $this->importJob->{$field['getter']}(),
                sprintf('Failed for "%s":"%s"', $key, json_encode($field))
            );
            if (isset($field['increment'])) {
                $this->fields[$key]['value'] = ++$field['value'];
                $this->importJob->{$field['increment'].'Notify'}();
                $this->assertEquals(
                    $field['value'],
                    $this->importJob->{$field['getter']}(),
                    sprintf('Failed for "%s":"%s"', $key, json_encode($field))
                );
            }
            if (isset($field['decrement'])) {
                $this->fields[$key]['value'] = --$field['value'];
                $this->importJob->{$field['decrement'].'Notify'}();
                $this->assertEquals(
                    $field['value'],
                    $this->importJob->{$field['getter']}(),
                    sprintf('Failed for "%s":"%s"', $key, json_encode($field))
                );
            }
        }
    }

    /**
     * @expectedException \BadMethodCallException
     * @expectedExceptionMessage  Method "someRandomMethod" doesn't exist in the class "AppBundle\Entity\Import\ImportJob"
     */
    public function testNotifyNonexistentMethodWithoutNotifyException()
    {
        $this->importJob->someRandomMethod();
    }

    /**
     * @expectedException \BadMethodCallException
     * @expectedExceptionMessage  Only set, increment and decrement are supported
     */
    public function testNotifyNotAllowedPrefixException()
    {
        $this->importJob->getIdNotify();
    }

    /**
     * @expectedException \BadMethodCallException
     * @expectedExceptionMessage  Method "setRandomMethod" doesn't exist in the class "AppBundle\Entity\Import\ImportJob"
     */
    public function testNotifyNonexistentMethodWithNotifyException()
    {
        $this->importJob->setRandomMethodNotify();
    }

    private function getImportJob()
    {
        return new ImportJob();
    }


    private function getPropertyChangedListener()
    {
        return $this->getMockForAbstractClass(PropertyChangedListener::class);
    }
}
