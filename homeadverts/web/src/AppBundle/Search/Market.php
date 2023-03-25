<?php

namespace AppBundle\Search;

/**
 * A value object representing a property market.
 */
class Market
{
    const RENTAL = 'to-rent';
    const SALE = 'for-sale';
    const ALL = 'all';

    /**
     * @var string
     */
    protected $value;

    /**
     * Constructor.
     *
     * @param string $value
     */
    public function __construct($value)
    {
        // Default to sale if a non-valid value is passed in.
        if (!in_array($value, [self::SALE, self::RENTAL, self::ALL])) {
            $value = self::SALE;
        }

        $this->value = $value;
    }

    /**
     * Creates a for sale market type.
     *
     * @return Market
     */
    public static function sale()
    {
        return new self(self::SALE);
    }

    /**
     * Creates a rental market type.
     *
     * @return Market
     */
    public static function rental()
    {
        return new self(self::RENTAL);
    }

    /**
     * Creates an all market type.
     *
     * @return Market
     */
    public static function all()
    {
        return new self(self::ALL);
    }

    /**
     * Returns true if this market is for sale.
     *
     * @return bool
     */
    public function isSale()
    {
        return self::SALE === $this->value;
    }

    /**
     * Returns true if this market is to rent.
     *
     * @return bool
     */
    public function isRental()
    {
        return self::RENTAL === $this->value;
    }

    /**
     * Returns true if this market is for sale and to rent.
     *
     * @return bool
     */
    public function isAll()
    {
        return self::ALL === $this->value;
    }

    /**
     * Get the market type as a URL friendly slug.
     *
     * @return string
     */
    public function getType()
    {
        return $this->value;
    }

    /**
     * Get the short (e.g sale, rent, all) version of the market.
     *
     * @return string
     */
    public function getShortName()
    {
        return substr($this->value, -4);
    }

    /**
     * Alias for Market::getType().
     *
     * @return string
     */
    public function __toString()
    {
        return $this->getType();
    }
}
