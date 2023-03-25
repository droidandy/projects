<?php

namespace AppBundle\Search;

class UserType
{
    const ALL = 'all';
    const AGENT = 'agent';
    const BROKERAGE = 'brokerage';

    /**
     * @var string
     */
    protected $value;

    /**
     * @param string $value
     */
    public function __construct($value)
    {
        if (!in_array($value, [self::AGENT, self::BROKERAGE, self::ALL])) {
            $value = self::BROKERAGE;
        }

        $this->value = $value;
    }

    /**
     * @return bool
     */
    public function isAgent()
    {
        return self::AGENT === $this->value;
    }

    /**
     * @return bool
     */
    public function isBrokerage()
    {
        return self::BROKERAGE === $this->value;
    }

    /**
     * @return bool
     */
    public function isAll()
    {
        return self::ALL === $this->value;
    }

    /**
     * @return string
     */
    public function getType()
    {
        return $this->value;
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
