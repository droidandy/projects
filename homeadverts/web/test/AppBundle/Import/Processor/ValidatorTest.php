<?php

namespace Test\AppBundle\Import\Processor;

use AppBundle\Entity\Import\ImportJob;
use AppBundle\Import\Normalizer\Property\NormalisedProperty;
use AppBundle\Import\Processor\Validator;
use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\AddressTrait;
use Test\Utils\Traits\GoogleLocationTrait;
use Test\Utils\Traits\ImportJobTrait;
use Test\Utils\Traits\PropertyTrait;
use Test\Utils\Traits\UserTrait;

class ValidatorTest extends AbstractWebTestCase
{
    use UserTrait;
    use ImportJobTrait;
    use PropertyTrait;
    use AddressTrait;
    use GoogleLocationTrait;

    protected $rollbackTransactions = true;

    public function testProcess()
    {
        $job = $this->newImportJobPersistent(ImportJob::DATA_SYNC_ACTIVE);
        $app = $this->getContainer();
        $user = $this->newUserPersistent();
        $property = $this->newPropertyPersistent([
            'user' => $user,
        ]);

        $normalizedProperty = new NormalisedProperty([]);
        $validator = new Validator($app, $job, $job);
        $validator->process($normalizedProperty, $property);

        $this->assertEquals([
            600 =>[
                'At least one photo must be provided.'
            ],
        ], $validator->getErrors());
        $this->assertEquals('failed', $validator->getStatus());
        $this->assertEquals(false, $validator->getDelayed());
    }
}
