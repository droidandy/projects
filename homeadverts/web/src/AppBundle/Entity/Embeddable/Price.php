<?php

namespace AppBundle\Entity\Embeddable;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Embeddable
 */
class Price
{
    const QUALIFIER_ENQUIRE = -100;
    const QUALIFIER_NONE = 0;
    const QUALIFIER_GUIDE_PRICE = 100;
    const QUALIFIER_OFFERS_IN_REGION = 200;

    const PERIOD_DAY = 'day';
    const PERIOD_WEEK = 'week';
    const PERIOD_MONTH = 'month';
    const PERIOD_YEAR = 'year';
    const PERIOD_SEASONAL = 'seasonal';

    /**
     * @ORM\Column(type="int")
     */
    protected $amount = 0;

    /**
     * @ORM\Column(type="int", nullable=true)
     */
    protected $baseAmount = null;

    /**
     * @ORM\Column(type="string", length=3)
     */
    protected $currency;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    protected $period;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    protected $qualifier = self::QUALIFIER_NONE;

    /**
     * @var int|null
     */
    private $priceInUSD;

    /**
     * Constructor.
     *
     * @param float       $amount
     * @param string      $currency
     * @param string|null $period
     * @param int|null    $qualifier
     * @param int|null    $priceInUSD
     */
    public function __construct($amount, $currency = 'USD', $period = null, $qualifier = null, $priceInUSD = null)
    {
        $this->amount = $amount ? (float) $amount : null;
        $this->currency = (string) $currency;
        $this->period = $period;
        $this->qualifier = $qualifier;
        $this->priceInUSD = $priceInUSD;
    }

    /**
     * @return float|null
     */
    public function getAmount()
    {
        return $this->amount;
    }

    /**
     * @return float|null
     */
    public function getBaseAmount()
    {
        return $this->baseAmount;
    }

    /**
     * @param float $amount
     *
     * @return self
     */
    public function setBaseAmount($amount)
    {
        $this->baseAmount = $amount;

        return $this;
    }

    /**
     * @return string
     */
    public function getCurrency()
    {
        return $this->currency;
    }

    /**
     * @return string|null
     */
    public function getPeriod()
    {
        return $this->period;
    }

    /**
     * @return int|null
     */
    public function getQualifier()
    {
        return $this->qualifier;
    }

    /**
     * Should the price be displayed to the public?
     *
     * @return bool
     */
    public function isPublic()
    {
        return self::QUALIFIER_ENQUIRE !== $this->qualifier;
    }

    // If this is a rental property we calculate the price for a month in a property, this makes ordering in search
    // work consistently when comparing properties charged by different period across different currencies.
    public function getBaseMonthlyPrice()
    {
        if (!$this->period) {
            return null;
        }

        switch ($this->period) {
            case self::PERIOD_SEASONAL: $multiplier = 2; break;
            case self::PERIOD_DAY: $multiplier = 365; break;
            case self::PERIOD_WEEK: $multiplier = 52; break;
            case self::PERIOD_YEAR: $multiplier = 1; break;
            default: $multiplier = 12; break; // Assume monthly
        }

        return ($this->amount * $multiplier) / 12; // divide by 12 to get monthly cost
    }

    /**
     * @return int|null
     */
    public function getPriceInUSD()
    {
        return $this->priceInUSD;
    }

    public function __toString()
    {
        return $this->amount;
    }
}
