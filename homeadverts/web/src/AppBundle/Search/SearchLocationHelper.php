<?php

namespace AppBundle\Search;

use AppBundle\Entity\Location\Location;

/**
 * Helper for getting a location from the search query data.
 *
 * @author Joe Holdcroft <joe@joeholdcroft.com>
 */
class SearchLocationHelper
{
    // Todo: To be rewritten..

    /**
     * @var LocationFactory
     */
    protected $locationFactory;

    /**
     * Constructor.
     *
     * @param LocationFactory $locationFactory
     */
    public function __construct(LocationFactory $locationFactory)
    {
        $this->locationFactory = $locationFactory;
    }

    /**
     * Get a location for a given search query.
     *
     * @param string      $query     Search query
     * @param string|null $reference Search reference (from hidden field)
     *
     * @return Location|null
     */
    public function getLocation($query, $reference = null, $isCountry = false)
    {
        $query = trim($query);

        // If we have a reference the user did a normal search for a location recognised by Google
        if ($reference) {
            return $this->locationFactory->fromPlacesReference($reference, $query);
        }

        if ('' === $query) {
            return null;
        }

        //the LocationFactory will throw if the location isnt found
        try {
            return $this->locationFactory->fromQuery($query, $isCountry);
        } catch (\Exception $e) {
            return null;
        }

        return null;
    }
}
