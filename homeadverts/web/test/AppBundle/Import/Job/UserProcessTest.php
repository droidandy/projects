<?php

namespace Test\AppBundle\Import\Job;

use AppBundle\Entity\Import\ImportJob;
use AppBundle\Entity\User\User;
use AppBundle\Import\Job\UserProcess;
use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\ImportJobTrait;
use VCR\VCR;

class UserProcessTest extends AbstractWebTestCase
{
    use ImportJobTrait;

    protected $rollbackTransactions = true;

    protected function setUp()
    {
        parent::setUp();
        VCR::configure()
            ->setCassettePath('test/fixtures/vcr/realogy/')
            ->enableRequestMatchers(array('method', 'url', 'host'));

        VCR::turnOn();
    }

    protected function tearDown()
    {
        parent::tearDown();
        VCR::turnOff();
    }

    public function testDoRun()
    {
        VCR::insertCassette('user.yml');

        $job = $this->newImportJobPersistent(ImportJob::DATA_SYNC_ACTIVE);
        $app = $this->getContainer();
        $args = [
            'ref' => 'B586064B-A1CF-4D87-B4D3-8C286491A20D',
            'updated_at' => '2019-05-14T15:30:25.200',
            'jobID' => $job->getId(),
        ];
        $userProcess = new UserProcess($app);
        $userProcess->run($args, $app);

        $user = $this
            ->em
            ->getRepository(User::class)
            ->findOneBy([
                'sourceRef' => $args['ref']
            ]);

        $this->assertEquals($user->getEmail(), 'nsanchez@onesothebysrealty.com');
        $this->assertEquals($user->sourceRef, $args['ref']);
        $this->assertEquals($user->isEmailGenerated, false);
    }
}
