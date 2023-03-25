<?php

namespace AppBundle\Entity\User\Billing;

use AppBundle\Entity\Traits\CreatedAtTrait;
use AppBundle\Entity\Traits\IdTrait;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\HasLifecycleCallbacks()
 * @ORM\Entity
 * @ORM\Table(name="user_payment")
 */
class Payment
{
    use IdTrait;
    use CreatedAtTrait;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User\User")
     */
    protected $user;
    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $billedTo;
    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $type;
    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $status;
    /**
     * @ORM\Column(type="datetime")
     */
    protected $date;
    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $method;
    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $startDate;
    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $endDate;
    /**
     * @ORM\Column(type="string",length=255)
     */
    protected $postalCode;
    /**
     * @ORM\Column(type="string",length=512, nullable=true)
     */
    protected $country;

    /**
     * @ORM\Column(type="string",length=3)
     */
    protected $currency;

    /**
     * @ORM\Column(type="string",length=255, nullable=true)
     */
    protected $vatNumber;
    /**
     * @ORM\Column(type="float")
     */
    protected $vat;
    /**
     * @ORM\Column(type="float")
     */
    protected $amount;

    /**
     * @param CreditCard $card
     * @param mixed      $response
     * @param mixed      $vat
     * @param mixed      $response
     *
     * @return Payment
     */
    public function setFromBraintree(CreditCard $card, $response, $vat)
    {
        $transaction = $response->subscription->transactions[0];

        $this->user = $card->getUser();

        $this->date = new \DateTime();
        $this->billedTo = $card->getUser()->getName();
        $this->country = $transaction->billing['countryCodeAlpha2'];
        $this->postalCode = $transaction->billing['postalCode'];

        $this->type = $transaction->type;
        $this->status = $transaction->status;
        $this->currency = $transaction->currencyIsoCode;

        $this->amount = $vat->transaction->amount;
        $this->vat = $vat->transaction->tax_amount;

        $this->startDate = $response->subscription->billingPeriodStartDate;
        $this->endDate = $response->subscription->billingPeriodEndDate;
        $this->method = $card->getType().' '.$card->getLastDigits();
    }

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
    public function getBilledTo()
    {
        return $this->billedTo;
    }

    /**
     * @param mixed $billedTo
     */
    public function setBilledTo($billedTo)
    {
        $this->billedTo = $billedTo;
    }

    /**
     * @return mixed
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param mixed $type
     */
    public function setType($type)
    {
        $this->type = $type;
    }

    /**
     * @return mixed
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * @param mixed $status
     */
    public function setStatus($status)
    {
        $this->status = $status;
    }

    /**
     * @return mixed
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * @param mixed $date
     */
    public function setDate($date)
    {
        $this->date = $date;
    }

    /**
     * @return mixed
     */
    public function getMethod()
    {
        return $this->method;
    }

    /**
     * @param mixed $method
     */
    public function setMethod($method)
    {
        $this->method = $method;
    }

    /**
     * @return mixed
     */
    public function getStartDate()
    {
        return $this->startDate;
    }

    /**
     * @param mixed $startDate
     */
    public function setStartDate($startDate)
    {
        $this->startDate = $startDate;
    }

    /**
     * @return mixed
     */
    public function getEndDate()
    {
        return $this->endDate;
    }

    /**
     * @param mixed $endDate
     */
    public function setEndDate($endDate)
    {
        $this->endDate = $endDate;
    }

    /**
     * @return mixed
     */
    public function getPostalCode()
    {
        return $this->postalCode;
    }

    /**
     * @param mixed $postalCode
     */
    public function setPostalCode($postalCode)
    {
        $this->postalCode = $postalCode;
    }

    /**
     * @return mixed
     */
    public function getCountry()
    {
        return $this->country;
    }

    /**
     * @param mixed $country
     */
    public function setCountry($country)
    {
        $this->country = $country;
    }

    /**
     * @return mixed
     */
    public function getCurrency()
    {
        return $this->currency;
    }

    /**
     * @param mixed $currency
     */
    public function setCurrency($currency)
    {
        $this->currency = $currency;
    }

    /**
     * @return mixed
     */
    public function getVatNumber()
    {
        return $this->vatNumber;
    }

    /**
     * @param mixed $vatNumber
     */
    public function setVatNumber($vatNumber)
    {
        $this->vatNumber = $vatNumber;
    }

    /**
     * @return mixed
     */
    public function getVat()
    {
        return $this->vat;
    }

    /**
     * @param mixed $vat
     */
    public function setVat($vat)
    {
        $this->vat = $vat;
    }

    /**
     * @return mixed
     */
    public function getAmount()
    {
        return $this->amount;
    }

    /**
     * @param mixed $amount
     */
    public function setAmount($amount)
    {
        $this->amount = $amount;
    }
}
