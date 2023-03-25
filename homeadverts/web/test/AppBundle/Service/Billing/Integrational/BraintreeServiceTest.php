<?php

namespace Test\AppBundle\Service\Billing\Integrational;

use Test\AppBundle\AbstractWebTestCase;
use Test\Utils\Traits\UserTrait;

class BraintreeServiceTest extends AbstractWebTestCase
{
    use UserTrait;

    protected $rollbackTransactions = true;

    public function testAddCustomer()
    {
        $user = $this->newUser();

        $customerId = $this
            ->getContainer()
            ->get('ha_braintree_service')
            ->addCustomer($user);

        $this->assertNotNull($customerId);
    }

    public function testAddCustomerAndUpdateCard()
    {
        $user = $this->newUser();
        $cc = $this->generateCreditCard();

        $customerId = $this
            ->getContainer()
            ->get('ha_braintree_service')
            ->addCustomer($user);

        $response = $this
            ->getContainer()
            ->get('ha_braintree_service')
            ->updateCard($customerId, $cc);

        // Verify one card
        $cc = $response->customer->creditCards[0];
        $this->assertEquals(true, $response->success);
        $this->assertEquals(1, count($response->customer->creditCards));
        $this->assertEquals(1, count($response->customer->addresses));
        $this->assertEquals(411111, $cc->bin);
        $this->assertEquals(11, $cc->expirationMonth);
        $this->assertEquals(2022, $cc->expirationYear);
        $this->assertNotNull($cc->customerId);
        $this->assertNotNull($cc->customerId);
        $this->assertNotNull($cc->token);
        $this->assertNotNull($cc->uniqueNumberIdentifier);
    }

    public function testAddCustomerWithCardAndCancelAllSubscriptions()
    {
        $user = $this->newUser();
        $cc = $this->generateCreditCard();

        $customerId = $this
            ->getContainer()
            ->get('ha_braintree_service')
            ->addCustomer($user);

        $response = $this
            ->getContainer()
            ->get('ha_braintree_service')
            ->updateCard($customerId, $cc);

        // Verify one card
        $this->assertEquals(true, $response->success);
        $this->assertEquals(1, count($response->customer->creditCards));
        $this->assertEquals(1, count($response->customer->addresses));

        // Remove cards and addresses
        $this
            ->getContainer()
            ->get('ha_braintree_service')
            ->cancelServiceForCustomer($customerId);

        // Find customer
        $response = $this
            ->getContainer()
            ->get('ha_braintree_service')
            ->findCustomer($customerId);

        $this->assertEquals($customerId, $response->id);
        $this->assertEquals(1, count($response->creditCards));
        $this->assertEquals(1, count($response->addresses));
        $this->assertEquals(0, count($response->creditCards[0]->subscriptions));
    }
}
