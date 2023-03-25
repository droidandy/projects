<?php

namespace Test\AppBundle\Import\Job;

use AppBundle\Entity\Import\ImportJob;
use AppBundle\Entity\User\User;
use AppBundle\Import\Job\CompanyProcess;
use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\ImportJobTrait;
use VCR\VCR;

class CompanyProcessTest extends AbstractWebTestCase
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
        VCR::insertCassette('company.yml');

        $job = $this->newImportJobPersistent(ImportJob::DATA_SYNC_ACTIVE);
        $app = $this->getContainer();
        $args = [
            'ref' => '025844DE-189F-4B95-A01A-D25E1BB5E0D8',
            'updated_at' => '2019-05-14T15:30:25.200',
            'jobID' => $job->getId(),
        ];
        $userProcess = new CompanyProcess($app);
        $userProcess->run($args, $app);

        $user = $this
            ->em
            ->getRepository(User::class)
            ->findOneBy([
                'sourceRef' => $args['ref']
            ]);

        $this->assertEquals($user->getEmail(), '025844DE-189F-4B95-A01A-D25E1BB5E0D8@luxuryaffairs.co.uk');
        $this->assertEquals($user->sourceRef, $args['ref']);
        $this->assertEquals($user->isEmailGenerated, true);
    }
}
