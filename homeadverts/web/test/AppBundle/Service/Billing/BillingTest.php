<?php

namespace Test\AppBundle\Service\Billing;

use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\UserTrait;

class BillingTest extends AbstractWebTestCase
{
    use UserTrait;

    public function setUp()
    {
        parent::setUp();

        $this->em->beginTransaction();
    }

    protected function tearDown()
    {
        $this->em->rollback();

        parent::tearDown();
    }

    public function testProcessCard()
    {
        // todo
    }
}
