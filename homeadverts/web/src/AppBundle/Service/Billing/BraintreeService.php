<?php

namespace AppBundle\Service\Billing;

use AppBundle\Entity\User\User;
use Braintree_Result_Successful;
use Braintree_Customer;
use Braintree_Gateway;
use Exception;

class BraintreeService
{
    /**
     * @var string
     */
    private $planId;
    /**
     * @var string
     */
    private $merchantAccountId;
    /**
     * @var Braintree_Gateway
     */
    private $gateway;

    /**
     * @param array $billingParams
     */
    public function __construct(array $billingParams)
    {
        $this->gateway = new Braintree_Gateway([
            'environment' => $billingParams['environment'],
            'merchantId' => $billingParams['merchant_id'],
            'publicKey' => $billingParams['public_key'],
            'privateKey' => $billingParams['private_key'],
        ]);

        $this->planId = $billingParams['plan_id'];
        $this->merchantAccountId = $billingParams['braintree_merchant_id'];
    }

    /**
     * @param User $user
     *
     * @return int
     */
    public function addCustomer(User $user)
    {
        $data = [
            'firstName' => $user->getName(),
            'email' => $user->getEmail(),
        ];

        $response = $this
            ->gateway
            ->customer()
            ->create($data);

        return $response->customer->id;
    }

    /**
     * @param string $customerId
     * @param array  $cc
     *
     * @return Braintree_Result_Successful|object
     */
    public function updateCard($customerId, array $cc)
    {
        $response = $this
            ->gateway
            ->customer()
            ->update($customerId, [
                'creditCard' => $cc,
            ]);

        $this->processErrors($response);

        return $response;
    }

    /**
     * @param User $user
     *
     * @return Braintree_Customer|bool|object
     */
    public function findCustomer($customerId)
    {
        try {
            return $this
                ->gateway
                ->customer()
                ->find($customerId);
        } catch (\Braintree_Exception_NotFound $e) {
            return false;
        }
    }

    /**
     * @param string $token
     * @param float  $amount
     * @param bool   $success
     *
     * @return Braintree_Result_Successful
     */
    public function createSubscription($token, $price = null)
    {
        $data = [
            'paymentMethodToken' => $token,
            'merchantAccountId' => $this->merchantAccountId,
            'planId' => $this->planId,
        ];

        if ($price) {
            $data['price'] = $price;
        }

        $response = $this
            ->gateway
            ->subscription()
            ->create($data);

        $this->processErrors($response);

        return $response;
    }

    /**
     * @param string $subscriptionId
     * @param string $token
     * @param float  $amount
     *
     * @return Braintree_Result_Successful
     */
    public function updateSubscription($subscriptionId, $token, $price = null)
    {
        $data = [
            'paymentMethodToken' => $token,
            'merchantAccountId' => $this->merchantAccountId,
            'planId' => $this->planId,
        ];

        if ($price) {
            $data['price'] = $price;
        }

        $response = $this
            ->gateway
            ->subscription()
            ->update($subscriptionId, $data);

        $this->processErrors($response);

        return $response;
    }

    /**
     * @param string $customerId
     */
    public function cancelServiceForCustomer($customerId)
    {
        $customer = $this->findCustomer($customerId);

        foreach ($customer->creditCards as $card) {
            foreach ($card->subscriptions as $sub) {
                $this->gateway->subscription()->cancel($sub->id);
            }
        }
    }

    /**
     * @param object $response
     */
    private function processErrors($response)
    {
        if (false === $response->success) {
            $errors = $response->errors->deepAll();

            foreach ($errors as $error) {
                throw new Exception($error->message);
            }
        }
    }
}
