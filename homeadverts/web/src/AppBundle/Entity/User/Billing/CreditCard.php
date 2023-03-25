<?php

namespace AppBundle\Entity\User\Billing;

use AppBundle\Entity\Embeddable\Address;
use AppBundle\Entity\Traits\CreatedAtTrait;
use AppBundle\Entity\Traits\IdTrait;
use AppBundle\Entity\Traits\UpdatedAtTrait;
use AppBundle\Entity\User\User;
use Doctrine\ORM\Mapping as ORM;
use Braintree_CreditCard;

/**
 * @ORM\HasLifecycleCallbacks()
 * @ORM\Entity
 * @ORM\Table(name="user_credit_card")
 */
class CreditCard
{
    use IdTrait;
    use CreatedAtTrait;
    use UpdatedAtTrait;

    /**
     * @ORM\OneToOne(targetEntity="AppBundle\Entity\User\User", inversedBy="creditCard")
     */
    protected $user;
    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $token;
    /**
     * @ORM\Column(type="string",length=100)
     */
    protected $uniqueId;
    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $type;
    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $customerId;

    /**
     * @ORM\Column(type="string",length=255)
     */
    protected $cardholderName;

    /**
     * @ORM\Column(type="string",length=2)
     */
    protected $expirationMonth;
    /**
     * @ORM\Column(type="string",length=4)
     */
    protected $expirationYear;
    /**
     * @ORM\Column(type="string",length=6)
     */
    protected $bin;
    /**
     * @ORM\Column(type="string",length=100)
     */
    protected $maskedNumber;
    /**
     * @ORM\Column(type="string",length=100)
     */
    protected $lastDigits;
    /**
     * @ORM\Column(type="datetime",nullable=true)
     */
    protected $declined;
    /**
     * @ORM\Column(type="string",length=255, nullable=true)
     */
    protected $declinedReason;
    /**
     * @ORM\Embedded(class="AppBundle\Entity\Embeddable\Address")
     */
    public $address;

    /**
     * @param Braintree_CreditCard $bt
     * @param array                $cc
     */
    public function setFromBraintree(Braintree_CreditCard $bt)
    {
        $this->token = $bt->token;
        $this->uniqueId = $bt->uniqueNumberIdentifier;
        $this->type = $bt->cardType;
        $this->customerId = $bt->customerId;
        $this->cardholderName = $bt->cardholderName;
        $this->expirationMonth = $bt->expirationMonth;
        $this->expirationYear = $bt->expirationYear;
        $this->bin = $bt->bin;
        $this->maskedNumber = $bt->maskedNumber;
        $this->lastDigits = $bt->last4;
        $this->address = new Address();

        $this->address->setCountry($bt->billingAddress->countryCodeAlpha2);
        $this->address->setZip($bt->billingAddress->postalCode);
    }

    /**
     * @param mixed $user
     */
    public function setUser($user)
    {
        $this->user = $user;
    }

    /**
     * @return User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @return mixed
     */
    public function getToken()
    {
        return $this->token;
    }

    /**
     * @return mixed
     */
    public function getUniqueId()
    {
        return $this->uniqueId;
    }

    /**
     * @return mixed
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @return mixed
     */
    public function getCustomerId()
    {
        return $this->customerId;
    }

    /**
     * @return mixed
     */
    public function getCardholderName()
    {
        return $this->cardholderName;
    }

    /**
     * @return mixed
     */
    public function getExpirationMonth()
    {
        return $this->expirationMonth;
    }

    /**
     * @return mixed
     */
    public function getExpirationYear()
    {
        return $this->expirationYear;
    }

    /**
     * @return mixed
     */
    public function getBin()
    {
        return $this->bin;
    }

    /**
     * @return mixed
     */
    public function getMaskedNumber()
    {
        return $this->maskedNumber;
    }

    /**
     * @return mixed
     */
    public function getLastDigits()
    {
        return $this->lastDigits;
    }

    /**
     * @return mixed
     */
    public function getDeclined()
    {
        return $this->declined;
    }

    /**
     * @return mixed
     */
    public function getDeclinedReason()
    {
        return $this->declinedReason;
    }

    /**
     * @return Address
     */
    public function getAddress()
    {
        return $this->address;
    }

    /**
     * @param mixed $address
     */
    public function setAddress($address)
    {
        $this->address = $address;
    }
}
