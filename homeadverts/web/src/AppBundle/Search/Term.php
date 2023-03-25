<?php

namespace AppBundle\Search;

/**
 * A value object representing a property search term.
 */
class Term
{
    protected $query;
    protected $reference;
    protected $forceCountry;

    /**
     * Constructor.
     *
     * @param string $query        The text the user entered to search
     * @param string $reference    An optional Google Places reference if they selected an option from the autocomplete
     * @param bool   $forceCountry Force this term to only return results from the country code in $query
     */
    public function __construct($query, $reference = null, $forceCountry = false)
    {
        $this->query = urldecode($query);
        $this->reference = $reference;
        $this->forceCountry = (bool) $forceCountry;
    }

    /**
     * @return string
     */
    public function getQuery()
    {
        return $this->forceCountry ? strtoupper(substr($this->query, 0, 2)) : $this->query;
    }

    /**
     * @return string
     */
    public function getReference()
    {
        return $this->reference;
    }

    /**
     * @return bool
     */
    public function isForceCountry()
    {
        return $this->forceCountry;
    }
}
