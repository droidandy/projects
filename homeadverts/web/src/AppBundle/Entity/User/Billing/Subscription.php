<?php

namespace AppBundle\Entity\User\Billing;

use AppBundle\Entity\Traits\CreatedAtTrait;
use AppBundle\Entity\Traits\IdTrait;
use AppBundle\Entity\Traits\UpdatedAtTrait;
use AppBundle\Entity\User\User;
use Doctrine\ORM\Mapping as ORM;
use CalculateTaxOut;

/**
 * @ORM\HasLifecycleCallbacks()
 * @ORM\Entity
 * @ORM\Table(name="user_subscription")
 */
class Subscription
{
    use IdTrait;
    use CreatedAtTrait;
    use UpdatedAtTrait;

    /**
     * @ORM\Column(type="string")
     */
    protected $subscriptionId;
    /**
     * @ORM\OneToOne(targetEntity="AppBundle\Entity\User\User", inversedBy="subscription")
     */
    protected $user;
    /**
     * @ORM\Column(type="float")
     */
    protected $amount;
    /**
     * @ORM\Column(type="string")
     */
    protected $currency;
    /**
     * @ORM\Column(type="float")
     */
    protected $vat;

    /**
     * @return mixed
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @param mixed $user
     */
    public function setUser($user)
    {
        $this->user = $user;
    }

    /**
     * @return mixed
     */
    public function getSubscriptionId()
    {
        return $this->subscriptionId;
    }

    /**
     * @param mixed $subscriptionId
     */
    public function setSubscriptionId($subscriptionId)
    {
        $this->subscriptionId = $subscriptionId;
    }

    /**
     * @param User  $user
     * @param mixed $response
     * @param float $response
     *
     * @return Payment
     */
    public function setFromBraintree(CreditCard $card, $response, CalculateTaxOut $vat)
    {
        $transaction = $response->subscription->transactions[0];

        $this->user = $card->getUser();
        $this->subscriptionId = $response->subscription->id;
        $this->amount = $transaction->amount;
        $this->currency = $transaction->currencyIsoCode;
        $this->vat = $vat->transaction->tax_amount;
    }
}
