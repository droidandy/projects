<?php

namespace AppBundle\Search;

use AppBundle\Entity\Location\Location;

/**
 * Represents 'no location' within a search.
 *
 * This is used on the sale/rent landing pages to show properties from
 * random places.
 */
class NullLocation extends Location
{
    public $id = -1;

    public function __construct()
    {
    }
}
